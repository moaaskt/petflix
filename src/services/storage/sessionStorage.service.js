/**
 * SessionStorage Service - Serviço para gerenciar sessionStorage
 */
class SessionStorageService {
  /**
   * Verifica se sessionStorage está disponível
   * @returns {boolean} True se disponível
   */
  isAvailable() {
    try {
      const test = '__sessionStorage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtém valor do sessionStorage
   * @param {string} key - Chave
   * @param {*} defaultValue - Valor padrão
   * @returns {*} Valor armazenado ou defaultValue
   */
  get(key, defaultValue = null) {
    if (!this.isAvailable()) return defaultValue;

    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch {
      return defaultValue;
    }
  }

  /**
   * Salva valor no sessionStorage
   * @param {string} key - Chave
   * @param {*} value - Valor a salvar
   * @returns {boolean} True se salvou com sucesso
   */
  set(key, value) {
    if (!this.isAvailable()) return false;

    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Remove valor do sessionStorage
   * @param {string} key - Chave
   * @returns {boolean} True se removeu com sucesso
   */
  remove(key) {
    if (!this.isAvailable()) return false;

    try {
      sessionStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Limpa todo o sessionStorage
   * @returns {boolean} True se limpou com sucesso
   */
  clear() {
    if (!this.isAvailable()) return false;

    try {
      sessionStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
}

export const sessionStorageService = new SessionStorageService();









