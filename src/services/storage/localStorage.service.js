/**
 * LocalStorage Service - Serviço para gerenciar localStorage
 */
import { STORAGE_KEYS } from '../../config/constants.js';

class LocalStorageService {
  /**
   * Verifica se localStorage está disponível
   * @returns {boolean} True se disponível
   */
  isAvailable() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtém valor do localStorage
   * @param {string} key - Chave
   * @param {*} defaultValue - Valor padrão
   * @returns {*} Valor armazenado ou defaultValue
   */
  get(key, defaultValue = null) {
    if (!this.isAvailable()) return defaultValue;

    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch {
      return defaultValue;
    }
  }

  /**
   * Salva valor no localStorage
   * @param {string} key - Chave
   * @param {*} value - Valor a salvar
   * @returns {boolean} True se salvou com sucesso
   */
  set(key, value) {
    if (!this.isAvailable()) return false;

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Remove valor do localStorage
   * @param {string} key - Chave
   * @returns {boolean} True se removeu com sucesso
   */
  remove(key) {
    if (!this.isAvailable()) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Limpa todo o localStorage
   * @returns {boolean} True se limpou com sucesso
   */
  clear() {
    if (!this.isAvailable()) return false;

    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }

  // Métodos específicos da aplicação

  /**
   * Salva preferência "Lembre-se de mim"
   * @param {boolean} remember - Se deve lembrar
   * @returns {boolean} True se salvou
   */
  setRememberMe(remember) {
    return this.set(STORAGE_KEYS.REMEMBER_ME, remember);
  }

  /**
   * Obtém preferência "Lembre-se de mim"
   * @returns {boolean} True se deve lembrar
   */
  getRememberMe() {
    return this.get(STORAGE_KEYS.REMEMBER_ME, false);
  }

  /**
   * Salva email
   * @param {string} email - Email
   * @returns {boolean} True se salvou
   */
  setEmail(email) {
    return this.set(STORAGE_KEYS.EMAIL, email);
  }

  /**
   * Obtém email salvo
   * @returns {string|null} Email ou null
   */
  getEmail() {
    return this.get(STORAGE_KEYS.EMAIL, null);
  }

  /**
   * Salva tema
   * @param {string} theme - Tema ('dark' ou 'light')
   * @returns {boolean} True se salvou
   */
  setTheme(theme) {
    return this.set(STORAGE_KEYS.THEME, theme);
  }

  /**
   * Obtém tema salvo
   * @returns {string} Tema ('dark' ou 'light')
   */
  getTheme() {
    return this.get(STORAGE_KEYS.THEME, 'dark');
  }

  /**
   * Salva tipo de pet
   * @param {string} petType - Tipo de pet
   * @returns {boolean} True se salvou
   */
  setPetType(petType) {
    return this.set(STORAGE_KEYS.PET_TYPE, petType);
  }

  /**
   * Obtém tipo de pet salvo
   * @returns {string|null} Tipo de pet ou null
   */
  getPetType() {
    return this.get(STORAGE_KEYS.PET_TYPE, null);
  }
}

export const localStorageService = new LocalStorageService();

