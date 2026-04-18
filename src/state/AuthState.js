/**
 * AuthState - Estado global de autenticação
 */
import { auth, db } from '../config/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
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

let userStatusUnsubscribe = null; // Armazena o unsubscribe do listener de status

/**
 * Inicializa AuthState e observa mudanças no Firebase Auth
 */
export function initAuthState() {
  onAuthStateChanged(auth, async (user) => {
    // Limpa listener anterior se existir
    if (userStatusUnsubscribe) {
      userStatusUnsubscribe();
      userStatusUnsubscribe = null;
    }

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

      // 🔒 REAL-TIME BAN ENFORCEMENT
      // Monitora o documento do usuário para detectar banimento em tempo real
      const userDocRef = doc(db, 'users', user.uid);
      userStatusUnsubscribe = onSnapshot(userDocRef, async (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const status = userData.status || 'active';

          // Se o usuário foi banido, força logout imediato
          if (status === 'banned') {
            console.warn('⚠️ Usuário banido detectado. Forçando logout...');

            // Limpa listener antes de fazer logout
            if (userStatusUnsubscribe) {
              userStatusUnsubscribe();
              userStatusUnsubscribe = null;
            }

            // Força logout e recarrega a página para limpar estado
            try {
              const { authService } = await import('../services/auth/auth.service.js');
              await authService.signOut();

              alert('Sua conta foi suspensa. Entre em contato com o suporte.');

              // Redireciona para login e recarrega para garantir limpeza total
              window.location.href = '/#/login';
              window.location.reload();
            } catch (error) {
              console.error('Erro ao fazer logout de usuário banido:', error);
              // Fallback de emergência
              window.location.reload();
            }
          }
        }
      }, (error) => {
        console.error('Erro no listener de status do usuário:', error);
      });
    }

    try {
      localStorage.setItem('currentUser', JSON.stringify(serialized));
    } catch { }

    setState({
      user: serialized,
      loading: false,
      error: null
    });
  });

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

