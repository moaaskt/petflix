/**
 * Main Entry Point - Ponto de entrada da aplicação SPA
 */
import './style.css';
import { initRouter } from './router/index.js';
import { initAppState } from './state/AppState.js';
import { initAuthState } from './state/AuthState.js';
import { setupAuthPersistence } from './config/firebase.js';
import { seedDatabase } from './utils/seed-db.js';

/**
 * Inicializa a aplicação
 */
async function init() {
  try {
    // 1. Configura persistência de auth
    await setupAuthPersistence();
    
    // 2. Popula banco de dados (apenas se estiver vazio)
    // await seedDatabase();
    
    // 3. Inicializa estados globais
    initAuthState();
    initAppState();
    
    // 4. Inicializa router
    initRouter();
    
    console.log('✅ Petflix SPA inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar aplicação:', error);
    // Error Boundary: Exibe mensagem amigável em caso de falha crítica
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div class="flex flex-col items-center justify-center h-screen bg-black text-white space-y-6 p-8">
          <h1 class="text-4xl font-bold text-center">Ops! Algo deu errado.</h1>
          <p class="text-gray-400 text-center max-w-md">Ocorreu um erro ao carregar a aplicação. Por favor, tente novamente.</p>
          <button 
            onclick="window.location.reload()" 
            class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors duration-200 cursor-pointer"
            aria-label="Tentar Novamente"
          >
            Tentar Novamente
          </button>
        </div>
      `;
    }
    throw error; // Re-lança o erro para que seja logado
  }
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

