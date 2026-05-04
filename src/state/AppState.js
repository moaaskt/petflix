/**
 * AppState - Estado global da aplicação
 */
let state = {
  petType: null, // 'dog' ou 'cat'
  currentPage: null,
  loading: false,
  error: null
};

const subscribers = new Set();

/**
 * Atualiza estado
 */
function setState(updates) {
  state = { ...state, ...updates };
  notifySubscribers();
}

/**
 * Obtém estado atual
 */
function getState() {
  return { ...state };
}

/**
 * Notifica todos os subscribers
 */
function notifySubscribers() {
  subscribers.forEach(callback => {
    try {
      callback(state);
    } catch (error) {
      console.error('Erro ao notificar subscriber:', error);
    }
  });
}

/**
 * Inscreve-se em mudanças de estado
 */
function subscribe(callback) {
  subscribers.add(callback);
  // Chama imediatamente com estado atual
  callback(state);
  
  // Retorna função de unsubscribe
  return () => {
    subscribers.delete(callback);
  };
}

/**
 * Inicializa AppState
 */
export async function initAppState() {
  // Carrega petType do localStorage se existir (usando chave padronizada)
  const savedPetType = localStorage.getItem('petflix_selected_species');
  if (savedPetType) {
    setState({ petType: savedPetType });
    
    // Reaplica o tema visual automaticamente no carregamento
    try {
      const { applyTheme } = await import('./AuthState.js');
      applyTheme(savedPetType);
    } catch (e) {
      console.warn('Erro ao aplicar tema inicial:', e);
    }
  }
}

/**
 * AppState API
 */
export const AppState = {
  getState,
  setState,
  subscribe
};

export default AppState;

