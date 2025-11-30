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
export function initAppState() {
  // Carrega petType do localStorage se existir
  const savedPetType = localStorage.getItem('petflixPetType');
  if (savedPetType) {
    setState({ petType: savedPetType });
  }
  
  console.log('✅ AppState inicializado');
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

