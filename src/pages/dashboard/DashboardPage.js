/**
 * DashboardPage - Página principal unificada (substitui indexcach e indexgato)
 */
import { useAuth } from '../../hooks/useAuth.js';
import { navigateTo } from '../../router/navigator.js';
import { CategoryRow, initCategoryRows } from '../../components/features/CategoryRow/CategoryRow.js';
import { render as renderHero, init as initHero } from '../../components/layout/HeroBanner/HeroBanner.js';
import { LoadingSpinner } from '../../components/ui/Loading/LoadingSpinner.js';
import { getFeatured, getByCategory, getByGenre, getTrending } from '../../services/content.service.js';
 

export async function render() {
  const species = document.body.classList.contains('theme-cat') ? 'cat' : 'dog';
  const trending = (await getTrending(species)).map(mapCard);
  const action = (await getByGenre(species, 'action')).map(mapCard);
  const adventure = (await getByGenre(species, 'adventure')).map(mapCard);
  const comedy = (await getByGenre(species, 'comedy')).map(mapCard);
  const drama = (await getByGenre(species, 'drama')).map(mapCard);
  const series = (await getByCategory(species, 'series')).map(mapCard);
  const docs = (await getByCategory(species, 'doc')).map(mapCard);
  const movies = (await getByCategory(species, 'movie')).map(mapCard);

  const isCat = species === 'cat';
  
  // Aguardar todas as CategoryRows (agora são async)
  const rowsCat = await Promise.all([
    CategoryRow({ title: 'Populares na Petflix', items: trending, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) }),
    CategoryRow({ title: 'Gatos Planejando o Caos', items: [...action, ...adventure].slice(0, 20), onCardClick: (id) => navigateTo(`/player?videoId=${id}`) }),
    CategoryRow({ title: 'Soneca da Tarde', items: docs, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) }),
    CategoryRow({ title: 'Comédias Felinas', items: comedy, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) }),
    CategoryRow({ title: 'Séries para Maratonar', items: series, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) })
  ]);
  
  const rowsDog = await Promise.all([
    CategoryRow({ title: 'Em Alta Hoje', items: trending, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) }),
    CategoryRow({ title: 'Aventuras no Parque', items: [...action, ...adventure].slice(0, 20), onCardClick: (id) => navigateTo(`/player?videoId=${id}`) }),
    CategoryRow({ title: 'Bons Garotos', items: drama, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) }),
    CategoryRow({ title: 'Histórias de Adoção', items: docs, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) }),
    CategoryRow({ title: 'Filmes para toda a família', items: movies, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) })
  ]);

  const featured = await getFeatured(species);
  return `
    <div>
      <div id="hero-container">
        ${renderHero({ item: mapHero(featured) })}
      </div>
      <div class="h-12 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent"></div>
      ${isCat ? rowsCat.join('') : rowsDog.join('')}
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
    // Usa a classe do body para identificar espécie
    return document.body.classList.contains('theme-cat') ? 'cat' : 'dog';
  }

  /**
   * Inicializa a página
   */
  init() {
    const species = document.body.classList.contains('theme-cat') ? 'cat' : 'dog';
    console.log('Espécie atual:', species);
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
      const species = document.body.classList.contains('theme-cat') ? 'cat' : 'dog';
      console.log('Espécie atual:', species);
      const spinner = new LoadingSpinner({ type: species === 'dog' ? 'dog' : 'cat' });
      spinner.show();
      this.featured = await getFeatured(species);
      const heroData = this.featured;
      console.log('Hero Data:', heroData);
      const hero = document.getElementById('hero-container');
      if (hero && heroData) {
        if (!heroData || !heroData.id) {
          console.error('Erro crítico: Nenhum dado para o Hero Banner.');
          return;
        }
        hero.innerHTML = renderHero({ item: mapHero(heroData) });
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

function mapCard(item) {
  return { id: item.videoId, title: item.title, thumbnail: item.thumbnail || item.image };
}

function mapHero(item) {
  if (!item) return { title: 'Petflix Destaque', thumbnail: '/assets/hero-fallback.jpg', id: '' };
  return { title: item.title, thumbnail: item.thumbnail || item.image, id: item.videoId };
}
