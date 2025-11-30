/**
 * App Core - Inicialização da aplicação
 */
import { errorHandler } from './error-handler.js';
// Importa Firebase para garantir inicialização
import '../config/firebase.js';

class App {
  constructor() {
    this.initialized = false;
  }

  /**
   * Inicializa a aplicação
   */
  async init() {
    if (this.initialized) {
      console.warn('App já foi inicializado');
      return;
    }

    try {
      // Firebase v9 Modular é inicializado automaticamente ao importar
      // Não é necessário aguardar - a inicialização é síncrona
      
      // Configurações adicionais podem ser feitas aqui
      
      this.initialized = true;
      console.log('App inicializado com sucesso');
    } catch (error) {
      errorHandler.handleError(error);
    }
  }
}

export const app = new App();

// Auto-inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

