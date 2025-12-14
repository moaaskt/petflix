/**
 * AuthState - Estado global de autenticação
 */
import { auth } from '../config/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserRole } from '../services/user.service.js';

let state = {
  user: null,
  loading: true,
  error: null,
  theme: 'dog'
};

const subscribers = new Set();

/**
 * Cria função de atualização de estado
 */
function createState(initialState) {
  let currentState = { ...initialState };
  
  return {
    getState: () => ({ ...currentState }),
    setState: (updates) => {
      currentState = { ...currentState, ...updates };
      notifySubscribers();
      return currentState;
    },
    subscribe: (callback) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    }
  };
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
 * Inicializa AuthState e observa mudanças no Firebase Auth
 */
export function initAuthState() {
  onAuthStateChanged(auth, async (user) => {
    let serialized = null;
    
    if (user) {
      // Carrega a role do usuário do Firestore
      let role = 'user';
      try {
        role = await getUserRole(user.uid);
      } catch (error) {
        console.warn('Erro ao carregar role do usuário:', error);
      }
      
      serialized = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName || '',
        role: role
      };
    }

    try {
      localStorage.setItem('currentUser', JSON.stringify(serialized));
    } catch {}

    setState({
      user: serialized,
      loading: false,
      error: null
    });
  });

  console.log('✅ AuthState inicializado');
}

/**
 * AuthState API
 */
export const AuthState = {
  getState,
  setState,
  subscribe
};

export function applyTheme(themeName) {
  const body = document.body;
  body.classList.remove('theme-dog', 'theme-cat');
  if (themeName === 'cat') body.classList.add('theme-cat');
  else body.classList.add('theme-dog');
  setState({ theme: themeName === 'cat' ? 'cat' : 'dog' });
}

export default AuthState;

