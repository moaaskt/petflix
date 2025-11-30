/**
 * useLocalStorage Hook - Hook para gerenciar localStorage
 */
import { localStorageService } from '../services/storage/localStorage.service.js';

export function useLocalStorage(key, defaultValue = null) {
  /**
   * Obtém valor
   * @returns {*} Valor armazenado
   */
  const get = () => {
    return localStorageService.get(key, defaultValue);
  };

  /**
   * Salva valor
   * @param {*} value - Valor a salvar
   * @returns {boolean} True se salvou
   */
  const set = (value) => {
    return localStorageService.set(key, value);
  };

  /**
   * Remove valor
   * @returns {boolean} True se removeu
   */
  const remove = () => {
    return localStorageService.remove(key);
  };

  return {
    get,
    set,
    remove,
    value: get()
  };
}

