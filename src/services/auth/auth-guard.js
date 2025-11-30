/**
 * Auth Guard - Proteção de rotas
 */
import { PROTECTED_PAGES, ROUTES } from '../../config/constants.js';
import { authService } from './auth.service.js';

class AuthGuard {
  constructor() {
    this.protectedPages = PROTECTED_PAGES;
    this.setupGlobalListener();
  }

  /**
   * Configura listener global para proteger páginas
   */
  setupGlobalListener() {
    authService.onAuthStateChanged((user) => {
      const currentPage = this.getCurrentPage();
      
      if (!user && this.isProtectedPage(currentPage)) {
        window.location.href = ROUTES.LOGIN;
      }
    });
  }

  /**
   * Obtém página atual
   * @returns {string} Nome da página atual
   */
  getCurrentPage() {
    return window.location.pathname.split('/').pop();
  }

  /**
   * Verifica se página é protegida
   * @param {string} page - Nome da página
   * @returns {boolean} True se protegida
   */
  isProtectedPage(page) {
    return this.protectedPages.includes(page);
  }

  /**
   * Verifica autenticação
   * @param {boolean} requireAuth - Se true, exige autenticação
   * @param {boolean} requireEmailVerified - Se true, exige email verificado
   * @returns {Promise<Object>} Usuário autenticado
   */
  async checkAuth(requireAuth = true, requireEmailVerified = true) {
    return new Promise((resolve, reject) => {
      authService.onAuthStateChanged((user) => {
        if (requireAuth && !user) {
          const currentPage = this.getCurrentPage();
          if (this.isProtectedPage(currentPage)) {
            window.location.href = ROUTES.LOGIN;
          }
          reject(new Error('Usuário não autenticado'));
          return;
        }

        if (requireEmailVerified && user && !user.emailVerified) {
          window.location.href = ROUTES.HOME;
          reject(new Error('E-mail não verificado'));
          return;
        }

        resolve(user);
      });
    });
  }
}

export const authGuard = new AuthGuard();

