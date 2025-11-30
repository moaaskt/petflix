/**
 * Main Entry Point - Ponto de entrada da aplicação SPA
 */
import './styles/reset.css';
import './styles/theme.css';
import './styles/global.css';
import './styles/layout.css';
import { initRouter } from './router/index.js';
import { initAppState } from './state/AppState.js';
import { initAuthState } from './state/AuthState.js';
import { initFirebase } from './config/firebase.js';

/**
 * Inicializa a aplicação
 */
async function init() {
  try {
    // 1. Inicializa Firebase
    await initFirebase();
    
    // 2. Inicializa estados globais
    initAuthState();
    initAppState();
    
    // 3. Inicializa router
    initRouter();
    
    console.log('✅ Petflix SPA inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar aplicação:', error);
  }
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

