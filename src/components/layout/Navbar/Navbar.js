/**
 * Navbar Component - Barra de navegação
 */
import { authService } from '../../../services/auth/auth.service';
import { ROUTES } from '../../../config/constants';
import { navigateTo } from '../../../router/navigator.js';

export class Navbar {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId) || document.querySelector('nav.navbar-petflix');
    this.currentPage = options.currentPage || '';
    this.petType = options.petType || 'dog';
    this.init();
  }

  /**
   * Inicializa a navbar
   */
  init() {
    this.setupScrollEffect();
    this.setupLogout();
  }

  /**
   * Configura efeito de scroll
   */
  setupScrollEffect() {
    if (!this.container) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        this.container.classList.add('scrolled');
      } else {
        this.container.classList.remove('scrolled');
      }
    });
  }

  /**
   * Configura botão de logout
   */
  setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await authService.signOut();
          navigateTo('/login');
        } catch (error) {
          console.error('Erro ao fazer logout:', error);
        }
      });
    }
  }

  /**
   * Renderiza a navbar
   * @returns {HTMLElement} Elemento da navbar
   */
  render() {
    const dashboardUrl = '#/dashboard';
    
    return `
      <nav class="navbar navbar-expand-lg navbar-dark navbar-petflix">
        <div class="container-fluid">
          <a class="navbar-brand" href="${dashboardUrl}">
            <img src="https://i.ibb.co/yyP7070/petflix-logo-prev-ui.png" alt="Petflix">
          </a>
          
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <a class="nav-link" href="${dashboardUrl}" aria-label="Início">Início</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#/series" aria-label="Séries">Séries</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#/filmes" aria-label="Filmes">Filmes</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#/docs" aria-label="Documentários">Documentários</a>
              </li>
            </ul>
            
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" href="#" aria-label="Buscar" id="searchIcon">
                  <i class="fas fa-search"></i>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#/home" aria-label="Perfil">
                  <i class="fa-regular fa-user"></i>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="logoutBtn" aria-label="Sair">
                  <i class="fas fa-right-from-bracket"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    `;
  }
}

export default Navbar;









