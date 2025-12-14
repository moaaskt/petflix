/**
 * Main Entry Point - Ponto de entrada da aplicação SPA
 */
import { initGlobalErrorHandling } from './utils/GlobalErrorHandler.js';
import './style.css';
import { initRouter } from './router/index.js';
import { initAppState } from './state/AppState.js';
import { initAuthState } from './state/AuthState.js';
import { setupAuthPersistence } from './config/firebase.js';
import { seedDatabase } from './utils/seed-db.js';
import { populateDatabase } from './utils/seed-content.js';
import { setAdminRole } from './utils/make-admin.js';

// Inicializa o tratamento global de erros primeiro
initGlobalErrorHandling();

/**
 * Inicializa a aplicação
 */
async function init() {
  try {
    // 1. Configura persistência de auth
    await setupAuthPersistence();
    
    // 1.5. Promove usuário a administrador (descomente para usar)
    // await setAdminRole('moacirneto59@gmail.com');
    
    // 2. Popula banco de dados (apenas se estiver vazio)
    // await seedDatabase(); // Popula coleção 'content' com dados mockados
    //  await populateDatabase(true); // Popula coleção 'content' com conteúdo curado (YouTube IDs válidos)
    
    // 3. Inicializa estados globais
    initAuthState();
    initAppState();
    
    // 4. Inicializa router
    initRouter();
    
    console.log('✅ Petflix SPA inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar aplicação:', error);
    // O GlobalErrorHandler capturará este erro automaticamente
    throw error;
  }
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

