/**
 * Navbar Component - Barra de navegação
 */
import { authService } from '../../../services/auth/auth.service.js';
import { navigateTo } from '../../../router/navigator.js';
import { ThumbnailCard } from '../../features/ThumbnailCard/ThumbnailCard.js';
import { searchContent } from '../../../services/content.service.js';

export class Navbar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.isMobileMenuOpen = false;
    this.mount();
    this.attach();
  }

  mount() {
    if (!this.container) return;
    const logoImg = 'assets/petflix-logo_prev_ui.png';
    const html = `
      <nav class="fixed top-0 w-full z-50 transition-colors duration-300 bg-gradient-to-b from-black/80 to-transparent relative">
        <div class="h-16 px-4 md:px-12 flex items-center justify-between">
          <a href="#/dashboard" class="flex items-center gap-3">
            <img src="${logoImg}" alt="Petflix" class="h-8 hidden md:block" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline'" />
            <span class="text-red-600 text-2xl font-bold tracking-widest" style="display:none">PETFLIX</span>
          </a>
          <div class="flex items-center gap-6">
            <ul class="hidden md:flex items-center gap-6">
              <li><a href="#/dashboard" class="text-gray-200 hover:text-white">Início</a></li>
              <li><a href="#/series" class="text-gray-200 hover:text-white">Séries</a></li>
              <li><a href="#/filmes" class="text-gray-200 hover:text-white">Filmes</a></li>
              <li><a href="#/docs" class="text-gray-200 hover:text-white">Bombando</a></li>
              <li><a href="#/conta" class="text-gray-200 hover:text-white">Minha Lista</a></li>
            </ul>
            <button id="mobileMenuBtn" class="flex md:hidden text-gray-200 hover:text-white" aria-label="Menu" aria-expanded="false">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div id="searchContainer" class="flex items-center gap-2">
              <button id="searchIcon" class="text-gray-200 hover:text-white" aria-label="Buscar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.15 13.15z" />
                </svg>
              </button>
              <input id="searchInput" type="text" placeholder="Buscar" class="w-0 opacity-0 border border-white bg-black/80 px-4 py-1 text-white rounded transition-all duration-300" />
              <button id="searchClear" class="opacity-0 pointer-events-none text-gray-300 hover:text-white" aria-label="Limpar">✕</button>
            </div>
            <a href="#/conta" class="text-gray-200 hover:text-white" aria-label="Minha Conta" title="Minha Conta">
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
        <div id="mobileMenu" class="absolute top-16 left-0 w-full bg-black border-t border-gray-800 flex flex-col p-4 gap-4 transition-transform duration-300 origin-top scale-y-0 hidden z-40">
          <a href="#/dashboard" class="mobile-menu-link text-gray-200 hover:text-white py-2 block">Início</a>
          <a href="#/series" class="mobile-menu-link text-gray-200 hover:text-white py-2 block">Séries</a>
          <a href="#/filmes" class="mobile-menu-link text-gray-200 hover:text-white py-2 block">Filmes</a>
          <a href="#/docs" class="mobile-menu-link text-gray-200 hover:text-white py-2 block">Bombando</a>
          <a href="#/conta" class="mobile-menu-link text-gray-200 hover:text-white py-2 block">Minha Lista</a>
        </div>
      </nav>
    `;
    this.container.innerHTML = html;
  }

  attach() {
    const logoutBtn = document.getElementById('logoutBtn');
    const searchIcon = document.getElementById('searchIcon');
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const nav = this.container.querySelector('nav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

    // Toggle mobile menu
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        if (this.isMobileMenuOpen) {
          mobileMenu.classList.remove('scale-y-0', 'hidden');
          mobileMenu.classList.add('scale-y-100', 'flex');
          mobileMenuBtn.setAttribute('aria-expanded', 'true');
        } else {
          mobileMenu.classList.remove('scale-y-100', 'flex');
          mobileMenu.classList.add('scale-y-0', 'hidden');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Close mobile menu when clicking on a link
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.isMobileMenuOpen = false;
        if (mobileMenu) {
          mobileMenu.classList.remove('scale-y-100', 'flex');
          mobileMenu.classList.add('scale-y-0', 'hidden');
        }
        if (mobileMenuBtn) {
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

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
    window.addEventListener('scroll', () => {
      if (!nav) return;
      if (window.scrollY > 50) {
        nav.classList.add('bg-black');
      } else {
        nav.classList.remove('bg-black');
      }
    });

    function expandInput(open) {
      if (!searchInput || !searchClear) return;
      if (open) {
        searchInput.className = 'w-64 opacity-100 border border-white bg-black/80 px-4 py-1 text-white rounded transition-all duration-300';
        searchInput.focus();
      } else {
        searchInput.className = 'w-0 opacity-0 border border-white bg-black/80 px-4 py-1 text-white rounded transition-all duration-300';
        searchInput.value = '';
        removeOverlay();
      }
      const hasText = searchInput.value.trim().length > 0;
      searchClear.className = (hasText ? '' : 'opacity-0 pointer-events-none ') + 'text-gray-300 hover:text-white';
    }

    function removeOverlay() {
      const overlay = document.getElementById('searchOverlay');
      if (overlay) overlay.remove();
    }

    function renderOverlay(results) {
      removeOverlay();
      if (!Array.isArray(results) || results.length === 0) return;
      const el = document.createElement('div');
      el.id = 'searchOverlay';
      el.className = 'fixed top-16 left-0 w-full bg-[#141414] min-h-screen z-40 p-8';
      const grid = results.map(r => ThumbnailCard({ id: r.videoId || r.id, title: r.title, thumbnail: r.image || r.thumbnail })).join('');
      el.innerHTML = `
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">${grid}</div>
      `;
      document.body.appendChild(el);
      const cards = el.querySelectorAll('[data-id]');
      cards.forEach(card => {
        const id = card.getAttribute('data-id');
        card.addEventListener('click', () => navigateTo(`/player?videoId=${id}`));
      });
    }

    function debounce(fn, wait) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
      };
    }

    const onInput = debounce(async () => {
      if (!searchInput) return;
      const q = searchInput.value.trim();
      const hasText = q.length > 0;
      searchClear.className = (hasText ? '' : 'opacity-0 pointer-events-none ') + 'text-gray-300 hover:text-white';
      if (q.length < 3) {
        removeOverlay();
        return;
      }
      const species = document.body.classList.contains('theme-cat') ? 'cat' : 'dog';
      const results = await searchContent(q, species);
      renderOverlay(results);
    }, 300);

    if (searchIcon) {
      searchIcon.addEventListener('click', () => expandInput(searchInput.classList.contains('opacity-0')));
    }
    if (searchInput) {
      searchInput.addEventListener('input', onInput);
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          expandInput(false);
        }
      });
    }
    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        expandInput(false);
      });
    }
  }
}

export default Navbar;







