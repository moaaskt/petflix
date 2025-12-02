/**
 * Navbar Component - Barra de navegação
 */
import { authService } from '../../../services/auth/auth.service.js';
import { navigateTo } from '../../../router/navigator.js';

export class Navbar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.mount();
    this.attach();
  }

  mount() {
    if (!this.container) return;
    const logoImg = 'assets/petflix-logo_prev_ui.png';
    const html = `
      <nav class="fixed top-0 w-full z-50 transition-all duration-300 bg-gradient-to-b from-black/80 to-transparent">
        <div class="px-4 md:px-12 py-4 flex items-center justify-between">
          <a href="#/dashboard" class="flex items-center gap-3">
            <img src="${logoImg}" alt="Petflix" class="h-8 hidden md:block" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline'" />
            <span class="text-red-600 text-2xl font-bold tracking-widest" style="display:none">PETFLIX</span>
          </a>
          <div class="flex items-center gap-6">
            <a href="#/filmes" class="hidden md:inline text-gray-200 hover:text-white">Filmes</a>
            <a href="#/series" class="hidden md:inline text-gray-200 hover:text-white">Séries</a>
            <a href="#/docs" class="hidden md:inline text-gray-200 hover:text-white">Documentários</a>
            <button id="searchIcon" class="text-gray-200 hover:text-white" aria-label="Buscar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.15 13.15z" />
              </svg>
            </button>
            <a href="#/home" class="text-gray-200 hover:text-white" aria-label="Perfil">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19a4 4 0 10-6 0m12 0a9 9 0 10-18 0" />
              </svg>
            </a>
            <button id="logoutBtn" class="text-gray-200 hover:text-white" aria-label="Sair">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H12" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    `;
    this.container.innerHTML = html;
  }

  attach() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await authService.signOut();
          navigateTo('/login');
        } catch (error) {
          console.error(error);
        }
      });
    }
  }
}

export default Navbar;









