/**
 * Error Handler - Tratamento global de erros
 */
import { Alert } from '../components/ui/Alert/Alert.js';
import { getApiErrorMessage, getFirebaseAuthErrorMessage } from '../utils/helpers/errors.js';

class ErrorHandler {
  constructor() {
    this.alert = new Alert();
    this.setupGlobalErrorHandler();
  }

  /**
   * Configura handler global de erros
   */
  setupGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
      this.handleError(event.error || event.message);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason);
    });
  }

  /**
   * Trata erro
   * @param {Error} error - Erro a tratar
   * @param {Object} options - Opções
   */
  handleError(error, options = {}) {
    console.error('Error:', error);

    if (options.silent) {
      return;
    }

    let message = 'Ocorreu um erro inesperado.';

    if (error instanceof Error) {
      // Erros do Firebase Auth
      if (error.code && error.code.startsWith('auth/')) {
        message = getFirebaseAuthErrorMessage(error);
      }
      // Erros de API
      else if (error.status) {
        message = getApiErrorMessage(error);
      }
      // Outros erros
      else {
        message = error.message || message;
      }
    } else if (typeof error === 'string') {
      message = error;
    }

    this.alert.error(message);
  }

  /**
   * Trata erro silenciosamente (apenas log)
   * @param {Error} error - Erro a tratar
   */
  handleErrorSilently(error) {
    this.handleError(error, { silent: true });
  }
}

export const errorHandler = new ErrorHandler();

