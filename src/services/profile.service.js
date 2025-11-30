/**
 * Profile Service - Serviço de perfil (pet type)
 * Mantém apenas lógica, sem UI
 */
import { AppState } from '../state/AppState.js';

/**
 * Define tipo de pet
 */
export function setPetType(petType) {
  if (petType !== 'dog' && petType !== 'cat') {
    return {
      success: false,
      error: 'Tipo de pet inválido. Use "dog" ou "cat"'
    };
  }
  
  // Atualiza estado
  AppState.setState({ petType });
  
  // Salva no localStorage
  localStorage.setItem('petflixPetType', petType);
  
  return {
    success: true
  };
}

/**
 * Obtém tipo de pet
 */
export function getPetType() {
  const state = AppState.getState();
  return state.petType || localStorage.getItem('petflixPetType') || null;
}

/**
 * Limpa tipo de pet
 */
export function clearPetType() {
  AppState.setState({ petType: null });
  localStorage.removeItem('petflixPetType');
  
  return {
    success: true
  };
}

export default {
  setPetType,
  getPetType,
  clearPetType
};

