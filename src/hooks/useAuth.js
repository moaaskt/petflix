/**
 * useAuth Hook - Hook para gerenciar autenticação
 */
import { authService } from '../services/auth/auth.service.js';

export function useAuth() {
  let currentUser = authService.getCurrentUser();
  let listeners = [];

  /**
   * Obtém usuário atual
   * @returns {Object|null} Usuário atual
   */
  const getUser = () => {
    return authService.getCurrentUser();
  };

  /**
   * Verifica se usuário está autenticado
   * @returns {boolean} True se autenticado
   */
  const isAuthenticated = () => {
    return getUser() !== null;
  };

  /**
   * Verifica se email está verificado
   * @returns {boolean} True se verificado
   */
  const isEmailVerified = () => {
    const user = getUser();
    return user ? user.emailVerified : false;
  };

  /**
   * Observa mudanças no estado de autenticação
   * @param {Function} callback - Callback a ser chamado
   * @returns {Function} Função para cancelar o observer
   */
  const onAuthStateChange = (callback) => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      currentUser = user;
      callback(user);
      
      // Notifica todos os listeners
      listeners.forEach(listener => listener(user));
    });

    return unsubscribe;
  };

  /**
   * Adiciona listener de mudanças de auth
   * @param {Function} listener - Listener
   * @returns {Function} Função para remover listener
   */
  const addListener = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  return {
    getUser,
    isAuthenticated,
    isEmailVerified,
    onAuthStateChange,
    addListener,
    currentUser
  };
}

