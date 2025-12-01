/**
 * User Service - Serviço de usuário
 * Mantém apenas lógica, sem UI
 */
import { AuthState } from '../state/AuthState.js';
import { firebaseService } from './api/firebase.service.js';

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
    
    await firebaseService.set(`users/${state.user.uid}`, userData);
    
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
    
    const data = await firebaseService.get(`users/${state.user.uid}`);
    return { success: true, data: data || {} };
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
    
    await firebaseService.update(`users/${state.user.uid}`, updates);
    
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

