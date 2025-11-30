/**
 * useDebounce Hook - Hook para debounce de funções
 */
import { debounce } from '../utils/helpers/dom.js';

export function useDebounce(func, wait = 300) {
  return debounce(func, wait);
}

