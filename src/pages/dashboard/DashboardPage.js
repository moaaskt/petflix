/**
 * DashboardPage - Página principal unificada (substitui indexcach e indexgato)
 */
import { useAuth } from '../../hooks/useAuth.js';
import { navigateTo } from '../../router/navigator.js';
import { CategoryRow } from '../../components/features/CategoryRow/CategoryRow.js';
import { render as renderHero, init as initHero } from '../../components/layout/HeroBanner/HeroBanner.js';
import { localStorageService } from '../../services/storage/localStorage.service.js';
import { PET_TYPES } from '../../config/constants.js';
import '../../styles/pages/dashboard.css';

export function render() {
  const petType = localStorageService.getPetType() || PET_TYPES.DOG;
  const mock = Array.from({ length: 12 }).map((_, i) => ({ id: `mock-${i}`, title: `Item ${i+1}`, thumbnail: `https://picsum.photos/seed/pet${i}/640/360` }));

  return `
    <div class="page page--dashboard">
      <div id="hero-container">
        ${renderHero({ item: { title: 'Carregando...', thumbnail: '/assets/hero-fallback.jpg', id: '' } })}
      </div>

      <section class="section">
        ${CategoryRow({ title: 'Populares', items: mock })}
      </section>

      <section class="section">
        ${CategoryRow({ title: 'Recomendados', items: mock })}
      </section>

      <section class="section">
        ${CategoryRow({ title: 'Top', items: mock })}
      </section>
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
      const { getFeatured } = await import('../../services/banner/featured.service.js');
      this.featured = await getFeatured(this.petType === PET_TYPES.DOG ? 'dog' : 'cat');
      const hero = document.getElementById('hero-container');
      if (hero && this.featured) {
        hero.innerHTML = renderHero({ item: this.featured });
        initHero();
      }
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
      const navbar = document.querySelector('.navbar-petflix');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    });
  }

  applyPageClasses() {
    const app = document.getElementById('app');
    if (app) {
      app.classList.add('page', 'page--dashboard');
    }
  }
}
