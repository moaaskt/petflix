/**
 * User Service - Serviço de usuário
 * Mantém apenas lógica, sem UI
 */
import { getDatabase } from '../config/firebase.js';
import { AuthState } from '../state/AuthState.js';

/**
 * Salva dados do usuário
 */
export async function saveUserData(userData) {
  try {
    const state = AuthState.getState();
    if (!state.user) {
      return {
        success: false,
        error: 'Usuário não autenticado'
      };
    }
    
    const database = getDatabase();
    await database.ref(`users/${state.user.uid}`).set(userData);
    
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obtém dados do usuário
 */
export async function getUserData() {
  try {
    const state = AuthState.getState();
    if (!state.user) {
      return {
        success: false,
        error: 'Usuário não autenticado'
      };
    }
    
    const database = getDatabase();
    const snapshot = await database.ref(`users/${state.user.uid}`).once('value');
    const data = snapshot.val();
    
    return {
      success: true,
      data: data || {}
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Atualiza dados do usuário
 */
export async function updateUserData(updates) {
  try {
    const state = AuthState.getState();
    if (!state.user) {
      return {
        success: false,
        error: 'Usuário não autenticado'
      };
    }
    
    const database = getDatabase();
    await database.ref(`users/${state.user.uid}`).update(updates);
    
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

export default {
  saveUserData,
  getUserData,
  updateUserData
};

