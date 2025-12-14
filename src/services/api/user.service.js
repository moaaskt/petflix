/**
 * User API Service - Serviço para operações de API relacionadas a usuários
 * Focado em operações administrativas (listar todos os usuários, etc.)
 */
import { db } from '../../config/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

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

export default {
  getAllUsers
};
