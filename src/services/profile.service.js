/**
 * Profile Service - Serviço de perfis de usuário
 * Gerencia CRUD de perfis salvos no Firestore (subcoleção users/{userId}/profiles)
 */
import { db } from '../config/firebase.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ServiceError } from '../utils/helpers/errors.js';
import { AuthState } from '../state/AuthState.js';

/**
 * Obtém o userId do usuário autenticado
 * @returns {string|null} UserId ou null se não autenticado
 */
function getUserId() {
  const state = AuthState.getState();
  return state.user?.uid || null;
}

/**
 * Obtém referência da subcoleção de perfis do usuário
 * @param {string} userId - ID do usuário
 * @returns {CollectionReference} Referência da coleção
 */
function getProfilesCollection(userId) {
  if (!userId) {
    throw new ServiceError('Usuário não autenticado');
  }
  return collection(db, 'users', userId, 'profiles');
}

/**
 * Obtém todos os perfis do usuário
 * @param {string} userId - ID do usuário (opcional, usa autenticado se não fornecido)
 * @returns {Promise<Array>} Array de perfis com id
 */
export async function getProfiles(userId = null) {
  try {
    const uid = userId || getUserId();
    if (!uid) {
      return [];
    }

    const profilesRef = getProfilesCollection(uid);
    const snapshot = await getDocs(profilesRef);
    
    const profiles = [];
    snapshot.forEach((docSnap) => {
      profiles.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    // Ordena por isDefault (default primeiro) e depois por createdAt
    profiles.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      const aTime = a.createdAt?.toMillis() || 0;
      const bTime = b.createdAt?.toMillis() || 0;
      return aTime - bTime;
    });

    return profiles;
  } catch (error) {
    console.error('Erro ao buscar perfis:', error);
    throw new ServiceError('Erro ao buscar perfis', error);
  }
}

/**
 * Cria um novo perfil
 * @param {Object} profileData - Dados do perfil
 * @param {string} profileData.name - Nome do perfil
 * @param {string} profileData.species - Espécie ('dog' ou 'cat')
 * @param {string} profileData.avatar - URL do avatar
 * @param {boolean} profileData.isDefault - Se é o perfil padrão
 * @param {string} userId - ID do usuário (opcional)
 * @returns {Promise<Object>} Perfil criado com id
 */
export async function createProfile(profileData, userId = null) {
  try {
    const uid = userId || getUserId();
    if (!uid) {
      throw new ServiceError('Usuário não autenticado');
    }

    // Validações
    if (!profileData.name || !profileData.species) {
      throw new ServiceError('Nome e espécie são obrigatórios');
    }

    if (profileData.species !== 'dog' && profileData.species !== 'cat') {
      throw new ServiceError('Espécie deve ser "dog" ou "cat"');
    }

    // Se este perfil será o padrão, remove o padrão dos outros
    if (profileData.isDefault) {
      await unsetDefaultProfiles(uid);
    }

    const profilesRef = getProfilesCollection(uid);
    const newProfile = {
      name: profileData.name,
      species: profileData.species,
      avatar: profileData.avatar || '',
      color: profileData.color || (profileData.species === 'dog' ? 'blue' : 'red'),
      icon: profileData.icon || profileData.name.charAt(0).toUpperCase(),
      isDefault: profileData.isDefault || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(profilesRef, newProfile);
    
    return {
      id: docRef.id,
      ...newProfile
    };
  } catch (error) {
    console.error('Erro ao criar perfil:', error);
    throw new ServiceError('Erro ao criar perfil', error);
  }
}

/**
 * Atualiza um perfil existente
 * @param {string} profileId - ID do perfil
 * @param {Object} updates - Dados a atualizar
 * @param {string} userId - ID do usuário (opcional)
 * @returns {Promise<void>}
 */
export async function updateProfile(profileId, updates, userId = null) {
  try {
    const uid = userId || getUserId();
    if (!uid) {
      throw new ServiceError('Usuário não autenticado');
    }

    if (!profileId) {
      throw new ServiceError('ID do perfil é obrigatório');
    }

    // Se está marcando como padrão, remove o padrão dos outros
    if (updates.isDefault === true) {
      await unsetDefaultProfiles(uid, profileId);
    }

    // Valida espécie se fornecida
    if (updates.species && updates.species !== 'dog' && updates.species !== 'cat') {
      throw new ServiceError('Espécie deve ser "dog" ou "cat"');
    }

    const profileRef = doc(db, 'users', uid, 'profiles', profileId);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    await updateDoc(profileRef, updateData);
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw new ServiceError('Erro ao atualizar perfil', error);
  }
}

/**
 * Deleta um perfil
 * @param {string} profileId - ID do perfil
 * @param {string} userId - ID do usuário (opcional)
 * @returns {Promise<void>}
 */
export async function deleteProfile(profileId, userId = null) {
  try {
    const uid = userId || getUserId();
    if (!uid) {
      throw new ServiceError('Usuário não autenticado');
    }

    if (!profileId) {
      throw new ServiceError('ID do perfil é obrigatório');
    }

    // Verifica se é o último perfil
    const profiles = await getProfiles(uid);
    if (profiles.length <= 1) {
      throw new ServiceError('Não é possível deletar o último perfil');
    }

    const profileRef = doc(db, 'users', uid, 'profiles', profileId);
    await deleteDoc(profileRef);
  } catch (error) {
    console.error('Erro ao deletar perfil:', error);
    throw new ServiceError('Erro ao deletar perfil', error);
  }
}

/**
 * Remove o flag isDefault de todos os perfis (exceto o especificado)
 * @param {string} userId - ID do usuário
 * @param {string} exceptProfileId - ID do perfil a manter como padrão (opcional)
 * @private
 */
async function unsetDefaultProfiles(userId, exceptProfileId = null) {
  const profiles = await getProfiles(userId);
  const updatePromises = profiles
    .filter(p => p.id !== exceptProfileId && p.isDefault)
    .map(p => updateProfile(p.id, { isDefault: false }, userId));
  
  await Promise.all(updatePromises);
}

/**
 * Inicializa perfis padrão para um usuário
 * Cria os perfis "Cachorro" e "Gato" se o usuário não tiver nenhum perfil
 * @param {string} userId - ID do usuário (opcional)
 * @returns {Promise<Array>} Array dos perfis criados
 */
export async function initializeDefaultProfiles(userId = null) {
  try {
    const uid = userId || getUserId();
    if (!uid) {
      throw new ServiceError('Usuário não autenticado');
    }

    // Verifica se já existem perfis
    const existingProfiles = await getProfiles(uid);
    if (existingProfiles.length > 0) {
      return existingProfiles;
    }


    // Cria perfil Cachorro (padrão)
    const dogProfile = await createProfile({
      name: 'Cachorro',
      species: 'dog',
      avatar: 'assets/avataresPerfis/caramelo.jpg',
      isDefault: true
    }, uid);

    // Cria perfil Gato
    const catProfile = await createProfile({
      name: 'Gato',
      species: 'cat',
      avatar: 'assets/avataresPerfis/gato-siames-1.jpg',
      isDefault: false
    }, uid);


    return [dogProfile, catProfile];
  } catch (error) {
    console.error('Erro ao inicializar perfis padrão:', error);
    throw new ServiceError('Erro ao inicializar perfis padrão', error);
  }
}

/**
 * Obtém um perfil específico
 * @param {string} profileId - ID do perfil
 * @param {string} userId - ID do usuário (opcional)
 * @returns {Promise<Object|null>} Perfil ou null se não encontrado
 */
export async function getProfile(profileId, userId = null) {
  try {
    const uid = userId || getUserId();
    if (!uid || !profileId) {
      return null;
    }

    const profiles = await getProfiles(uid);
    return profiles.find(p => p.id === profileId) || null;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
}

export default {
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  initializeDefaultProfiles
};
