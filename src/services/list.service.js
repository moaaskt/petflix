/**
 * List Service - Serviço para gerenciar "Minha Lista" no Firestore
 * Estrutura: users/{userId}/profiles/{profileId}/mylist/{movieId}
 */
import { db } from '../config/firebase.js';
import { collection, doc, setDoc, deleteDoc, getDocs, getDoc, serverTimestamp } from 'firebase/firestore';
import { ServiceError } from '../utils/helpers/errors.js';
import { AuthState } from '../state/AuthState.js';
import { localStorageService } from './storage/localStorage.service.js';

/**
 * Obtém o userId do usuário autenticado
 * @returns {string|null} UserId ou null se não autenticado
 */
function getUserId() {
  const state = AuthState.getState();
  return state.user?.uid || null;
}

/**
 * Obtém o profileId do perfil atual
 * @returns {string|null} ProfileId ou null se não encontrado
 */
function getProfileId() {
  const profileId = localStorage.getItem('selectedProfileId');
  return profileId || null;
}

/**
 * Obtém referência da subcoleção de lista do perfil
 * @param {string} userId - ID do usuário
 * @param {string} profileId - ID do perfil
 * @returns {CollectionReference} Referência da coleção
 */
function getListCollection(userId, profileId) {
  if (!userId || !profileId) {
    throw new ServiceError('Usuário ou perfil não encontrado');
  }
  return collection(db, 'users', userId, 'profiles', profileId, 'mylist');
}

/**
 * Obtém referência do documento de um item na lista
 * @param {string} userId - ID do usuário
 * @param {string} profileId - ID do perfil
 * @param {string} movieId - ID do filme
 * @returns {DocumentReference} Referência do documento
 */
function getListItemDoc(userId, profileId, movieId) {
  if (!userId || !profileId || !movieId) {
    throw new ServiceError('Parâmetros inválidos');
  }
  return doc(db, 'users', userId, 'profiles', profileId, 'mylist', movieId);
}

/**
 * Adiciona um item à lista
 * @param {Object} movie - Objeto do filme com id, title, thumbnail, backdrop
 * @returns {Promise<void>}
 */
export async function addItem(movie) {
  try {
    const userId = getUserId();
    const profileId = getProfileId();

    if (!userId) {
      throw new ServiceError('Usuário não autenticado');
    }

    if (!profileId) {
      throw new ServiceError('Nenhum perfil selecionado. Por favor, selecione um perfil primeiro.');
    }

    if (!movie || !movie.id) {
      throw new ServiceError('Dados do filme inválidos');
    }

    const listItemDoc = getListItemDoc(userId, profileId, movie.id);
    
    // Prepara os dados do filme
    const movieData = {
      id: movie.id,
      videoId: movie.videoId || movie.id,
      title: movie.title || '',
      thumbnail: movie.thumbnail || movie.image || '',
      backdrop: movie.backdrop || movie.thumbnail || movie.image || '',
      addedAt: serverTimestamp()
    };

    await setDoc(listItemDoc, movieData);
  } catch (error) {
    console.error('Erro ao adicionar item à lista:', error);
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError('Erro ao adicionar item à lista', error);
  }
}

/**
 * Remove um item da lista
 * @param {string} movieId - ID do filme a remover
 * @returns {Promise<void>}
 */
export async function removeItem(movieId) {
  try {
    const userId = getUserId();
    const profileId = getProfileId();

    if (!userId) {
      throw new ServiceError('Usuário não autenticado');
    }

    if (!profileId) {
      throw new ServiceError('Nenhum perfil selecionado');
    }

    if (!movieId) {
      throw new ServiceError('ID do filme é obrigatório');
    }

    const listItemDoc = getListItemDoc(userId, profileId, movieId);
    await deleteDoc(listItemDoc);
  } catch (error) {
    console.error('Erro ao remover item da lista:', error);
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError('Erro ao remover item da lista', error);
  }
}

/**
 * Obtém todos os itens da lista do perfil atual
 * @returns {Promise<Array>} Array de filmes na lista
 */
export async function getList() {
  try {
    const userId = getUserId();
    const profileId = getProfileId();

    if (!userId) {
      return [];
    }

    if (!profileId) {
      return [];
    }

    const listRef = getListCollection(userId, profileId);
    const snapshot = await getDocs(listRef);

    const items = [];
    snapshot.forEach((docSnap) => {
      items.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    // Ordena por data de adição (mais recente primeiro)
    items.sort((a, b) => {
      const aTime = a.addedAt?.toMillis() || 0;
      const bTime = b.addedAt?.toMillis() || 0;
      return bTime - aTime;
    });

    return items;
  } catch (error) {
    console.error('Erro ao buscar lista:', error);
    return [];
  }
}

/**
 * Verifica se um filme está na lista
 * @param {string} movieId - ID do filme
 * @returns {Promise<boolean>} True se está na lista
 */
export async function isInList(movieId) {
  try {
    const userId = getUserId();
    const profileId = getProfileId();

    if (!userId || !profileId || !movieId) {
      return false;
    }

    const listItemDoc = getListItemDoc(userId, profileId, movieId);
    const docSnap = await getDoc(listItemDoc);
    
    return docSnap.exists();
  } catch (error) {
    console.error('Erro ao verificar se item está na lista:', error);
    return false;
  }
}

/**
 * Alterna o estado de um item na lista (adiciona se não estiver, remove se estiver)
 * @param {Object} movie - Objeto do filme
 * @returns {Promise<boolean>} True se foi adicionado, false se foi removido
 */
export async function toggleItem(movie) {
  try {
    const isIn = await isInList(movie.id || movie.videoId);
    
    if (isIn) {
      await removeItem(movie.id || movie.videoId);
      return false;
    } else {
      await addItem(movie);
      return true;
    }
  } catch (error) {
    console.error('Erro ao alternar item na lista:', error);
    throw error;
  }
}

export default {
  addItem,
  removeItem,
  getList,
  isInList,
  toggleItem
};
