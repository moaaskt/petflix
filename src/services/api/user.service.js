/**
 * User API Service - Serviço para operações de API relacionadas a usuários
 * Focado em operações administrativas (listar todos os usuários, etc.)
 */
import { db } from '../../config/firebase.js';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

/**
 * Obtém todos os usuários cadastrados no Firestore
 * @returns {Promise<Array>} Array de usuários com { id, email, name, role, createdAt, emailVerified }
 */
export async function getAllUsers() {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    const users = [];
    snapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Ordena por data de criação (mais recentes primeiro)
    // Trata createdAt que pode ser Timestamp ou Date
    return users.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() :
        (a.createdAt instanceof Date ? a.createdAt : new Date(0));
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() :
        (b.createdAt instanceof Date ? b.createdAt : new Date(0));
      return dateB - dateA; // Decrescente (mais recentes primeiro)
    });
  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error);
    throw error;
  }
}

/**
 * Obtém um único usuário pelo ID
 * @param {string} uid - ID do usuário
 * @returns {Promise<Object|null>} Dados do usuário ou null se não encontrado
 */
export async function getUser(uid) {
  try {
    if (!uid) {
      throw new Error('UID do usuário é obrigatório');
    }

    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return {
        id: userSnap.id,
        ...userSnap.data()
      };
    }

    return null;
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    throw error;
  }
}

/**
 * Atualiza o status de um usuário (ban/unban)
 * @param {string} uid - ID do usuário
 * @param {string} status - Status a ser definido ('active' ou 'banned')
 * @returns {Promise<void>}
 */
export async function updateUserStatus(uid, status) {
  try {
    if (!uid) {
      throw new Error('UID do usuário é obrigatório');
    }

    if (status !== 'active' && status !== 'banned') {
      throw new Error('Status deve ser "active" ou "banned"');
    }

    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      status: status,
      updatedAt: new Date()
    });

    console.log(`✅ Status do usuário ${uid} atualizado para: ${status}`);
  } catch (error) {
    console.error('❌ Erro ao atualizar status do usuário:', error);
    throw error;
  }
}

export default {
  getAllUsers,
  getUser,
  updateUserStatus
};
