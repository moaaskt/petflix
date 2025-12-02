/**
 * DashboardPage - Página principal unificada (substitui indexcach e indexgato)
 */
import { useAuth } from '../../hooks/useAuth.js';
import { navigateTo } from '../../router/navigator.js';
import { CategoryRow, initCategoryRows } from '../../components/features/CategoryRow/CategoryRow.js';
import { render as renderHero, init as initHero } from '../../components/layout/HeroBanner/HeroBanner.js';
import { localStorageService } from '../../services/storage/localStorage.service.js';
import { PET_TYPES } from '../../config/constants.js';
import { LoadingSpinner } from '../../components/ui/Loading/LoadingSpinner.js';
 

export function render() {
  const petType = localStorageService.getPetType() || PET_TYPES.DOG;
  const mock = [
    { id: 'Ws-9ra38AlI', title: 'Marley & Eu', thumbnail: 'assets/benji1.jpg' },
    { id: 'ki8wHMR-yOI', title: 'Beethoven', thumbnail: 'assets/betown.jpg' },
    { id: '1jLOOCADTGs', title: 'A Dog\'s Purpose', thumbnail: 'assets/Dog-a-aventura-de-uma-vida-2.jpg' },
    { id: 'MjbKt2bVFec', title: 'Aventuras Caninas', thumbnail: 'assets/g-Dogway2.jpg' },
    { id: '6pbreU5ChmA', title: 'Gato de Botas', thumbnail: 'assets/capa-filme-gato-de-botas-2-o-ultimo-pedido-1f766-large.jpg' },
    { id: 'pqgo9bW7cmk', title: 'Gatos Engraçados', thumbnail: 'assets/gato3.jpg' }
  ];

  return `
    <div>
      <div id="hero-container">
        ${renderHero({ item: { title: 'Marley & Eu', thumbnail: 'assets/background-index.jpg', id: 'Ws-9ra38AlI' } })}
      </div>
      <div class="h-12 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent"></div>

      ${CategoryRow({ title: 'Populares', items: mock, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) })}
      ${CategoryRow({ title: 'Em Alta', items: mock, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) })}
      ${CategoryRow({ title: 'Séries Pets', items: mock, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) })}
    </div>
  `;
}

export function init() {
  new DashboardPage();
}

class DashboardPage {
  constructor() {
    this.auth = useAuth();
    this.petType = this.getPetType();
    this.featured = null;
    this.init();
  }

  /**
   * Obtém tipo de pet da URL ou localStorage
   * @returns {string} Tipo de pet
   */
  getPetType() {
    // Tenta detectar pela URL
    if (window.location.pathname.includes('indexcach')) {
      return PET_TYPES.DOG;
    }
    if (window.location.pathname.includes('indexgato')) {
      return PET_TYPES.CAT;
    }
    
    // Fallback para localStorage
    return localStorageService.getPetType() || PET_TYPES.DOG;
  }

  /**
   * Inicializa a página
   */
  init() {
    this.checkAuth();
    this.loadFeatured();
    this.setupScrollEffect();
    this.applyPageClasses();
    try { initCategoryRows(); } catch {}
  }

  /**
   * Verifica autenticação
   */
  checkAuth() {
    this.auth.onAuthStateChange((user) => {
      if (!user) {
        navigateTo('/login');
      }
    });
  }

  /**
   * Configura navbar
   */
  async loadFeatured() {
    try {
      const spinner = new LoadingSpinner({ type: this.petType === PET_TYPES.DOG ? 'dog' : 'cat' });
      spinner.show();
      const { getFeatured } = await import('../../services/banner/featured.service.js');
      this.featured = await getFeatured(this.petType === PET_TYPES.DOG ? 'dog' : 'cat');
      const hero = document.getElementById('hero-container');
      if (hero && this.featured) {
        hero.innerHTML = renderHero({ item: this.featured });
        initHero();
      }
      setTimeout(() => {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.remove();
      }, 800);
    } catch (e) {
      console.warn('Falha ao carregar destaque:', e);
    }
  }

  /**
   * Reproduz vídeo
   * @param {string} videoId - ID do vídeo
   */
  playVideo(videoId) { /* stub para futura integração do player */ }

  /**
   * Configura efeito de scroll na navbar
   */
  setupScrollEffect() {
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('bg-black/80');
        } else {
          navbar.classList.remove('bg-black/80');
        }
      }
    });
  }

  applyPageClasses() {
    const app = document.getElementById('app');
    if (app) {
      app.classList.add('bg-[#141414]');
    }
  }
}
