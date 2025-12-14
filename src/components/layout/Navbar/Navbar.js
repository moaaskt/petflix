/**
 * Navbar Component - Barra de navegação
 */
import { authService } from '../../../services/auth/auth.service.js';
import { navigateTo } from '../../../router/navigator.js';
import { ThumbnailCard } from '../../features/ThumbnailCard/ThumbnailCard.js';
import { searchContent } from '../../../services/content.service.js';
import { AuthState } from '../../../state/AuthState.js';

/**
 * Gera a inicial do nome ou email do usuário
 */
function getUserInitial(user) {
  if (user?.displayName) {
    return user.displayName.charAt(0).toUpperCase();
  }
  if (user?.email) {
    return user.email.charAt(0).toUpperCase();
  }
  return 'U';
}

/**
 * Renderiza o avatar do usuário
 */
function renderUserAvatar(user) {
  const initial = getUserInitial(user);
  const colors = ['bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600'];
  const colorIndex = (initial.charCodeAt(0) % colors.length);
  const bgColor = colors[colorIndex];
  
  if (user?.photoURL) {
    const fallbackHTML = `<div class="w-8 h-8 rounded-full ${bgColor} text-white flex items-center justify-center text-sm font-semibold overflow-hidden">${initial}</div>`;
    return `
      <img 
        src="${user.photoURL}" 
        alt="${user.displayName || 'Usuário'}" 
        class="w-8 h-8 rounded-full object-cover"
        onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';"
      />
      <div class="w-8 h-8 rounded-full ${bgColor} text-white items-center justify-center text-sm font-semibold overflow-hidden hidden">
        ${initial}
      </div>
    `;
  }
  
  return `
    <div class="w-8 h-8 rounded-full ${bgColor} text-white flex items-center justify-center text-sm font-semibold overflow-hidden">
      ${initial}
    </div>
  `;
}

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
    const user = authService.getCurrentUser();
    const avatarHTML = renderUserAvatar(user);
    
    // Verifica se o usuário é administrador
    const state = AuthState.getState();
    const userRole = state.user?.role || 'user';
    const isAdmin = userRole === 'admin';
    
    // HTML do botão Admin (apenas se for admin)
    const adminLinkHTML = isAdmin ? `
      <a href="#/admin" class="flex items-center gap-2 text-gray-200 hover:text-white transition-colors" aria-label="Painel Administrativo" title="Painel Administrativo">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </a>
    ` : '';
    
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
              <li><a href="#/my-list" class="text-gray-200 hover:text-white">Minha Lista</a></li>
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
            <a href="#/conta" class="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-white/50 transition-all" aria-label="Minha Conta" title="Minha Conta" id="userAvatarLink">
              ${avatarHTML}
            </a>
            ${adminLinkHTML}
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
          <a href="#/my-list" class="mobile-menu-link text-gray-200 hover:text-white py-2 block">Minha Lista</a>
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
    const userAvatarLink = document.getElementById('userAvatarLink');
    
    // Atualiza avatar quando o estado de autenticação mudar
    if (userAvatarLink) {
      authService.onAuthStateChanged((user) => {
        if (userAvatarLink) {
          userAvatarLink.innerHTML = renderUserAvatar(user);
        }
      });
    }
    
    // Atualiza botão Admin quando a role mudar
    AuthState.subscribe((state) => {
      const userRole = state.user?.role || 'user';
      const isAdmin = userRole === 'admin';
      const adminLinkContainer = this.container.querySelector('a[href="#/admin"]');
      const logoutBtnElement = document.getElementById('logoutBtn');
      
      if (isAdmin && !adminLinkContainer && logoutBtnElement) {
        // Cria o link Admin se não existir
        const adminLink = document.createElement('a');
        adminLink.href = '#/admin';
        adminLink.className = 'flex items-center gap-2 text-gray-200 hover:text-white transition-colors';
        adminLink.setAttribute('aria-label', 'Painel Administrativo');
        adminLink.setAttribute('title', 'Painel Administrativo');
        adminLink.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        `;
        logoutBtnElement.parentNode.insertBefore(adminLink, logoutBtnElement);
      } else if (!isAdmin && adminLinkContainer) {
        // Remove o link Admin se o usuário não for mais admin
        adminLinkContainer.remove();
      }
    });

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
      const grid = results.map(r => ThumbnailCard({ id: r.videoId || r.id, title: r.title, thumbnail: r.thumbnail || r.image })).join('');
      el.innerHTML = `
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">${grid}</div>
      `;
      document.body.appendChild(el);
      const cards = el.querySelectorAll('[data-id]');
      cards.forEach(card => {
        const id = card.getAttribute('data-id');
        card.addEventListener('click', () => {
          removeOverlay();
          navigateTo(`/player?videoId=${id}`);
        });
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







