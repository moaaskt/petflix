/**
 * Auth Service - Serviço de autenticação
 * Mantém apenas lógica, sem UI
 */
import { getAuth } from '../config/firebase.js';
import { AuthState } from '../state/AuthState.js';

/**
 * Faz login
 */
export async function signIn(email, password) {
  try {
    const auth = getAuth();
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Faz logout
 */
export async function signOut() {
  try {
    const auth = getAuth();
    await auth.signOut();
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
 * Cria conta
 */
export async function signUp(email, password) {
  try {
    const auth = getAuth();
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Envia email de verificação
 */
export async function sendEmailVerification() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      return {
        success: false,
        error: 'Usuário não autenticado'
      };
    }
    
    await user.sendEmailVerification();
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
 * Recupera senha
 */
export async function resetPassword(email) {
  try {
    const auth = getAuth();
    await auth.sendPasswordResetEmail(email);
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
 * Obtém usuário atual
 */
export function getCurrentUser() {
  const state = AuthState.getState();
  return state.user;
}

/**
 * Verifica se está autenticado
 */
export function isAuthenticated() {
  const state = AuthState.getState();
  return !!state.user;
}

/**
 * Verifica se email está verificado
 */
export function isEmailVerified() {
  const state = AuthState.getState();
  return state.user && state.user.emailVerified;
}

export default {
  signIn,
  signOut,
  signUp,
  sendEmailVerification,
  resetPassword,
  getCurrentUser,
  isAuthenticated,
  isEmailVerified
};

