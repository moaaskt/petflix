/**
 * DashboardPage - Página principal unificada (substitui indexcach e indexgato)
 */
import { useAuth } from '../../hooks/useAuth.js';
import { navigateTo } from '../../router/navigator.js';
import { VideoGrid } from '../../components/features/VideoGrid/VideoGrid.js';
import { VideoPlayer } from '../../components/features/VideoPlayer/VideoPlayer.js';
import { Navbar } from '../../components/layout/Navbar/Navbar.js';
import { Footer } from '../../components/layout/Footer/Footer.js';
import { localStorageService } from '../../services/storage/localStorage.service.js';
import { PET_TYPES } from '../../config/constants.js';
import '../../styles/pages/dashboard.css';

export function render() {
  const petType = localStorageService.getPetType() || PET_TYPES.DOG;
  const isDog = petType === PET_TYPES.DOG;
  const typeStr = isDog ? 'dogs' : 'cats';
  const typeLabel = isDog ? 'Cachorros' : 'Gatos';

  return `
    <nav class="navbar navbar-expand-lg navbar-dark navbar-petflix" id="navbar">
        <!-- Navbar content will be injected by Navbar component -->
    </nav>

    <section id="yt-${typeStr}" class="yt-section">
       <div class="yt-header">
         <h2>Vídeos de ${typeLabel}</h2>
         <input id="yt-${typeStr}-q" placeholder="Buscar (ex: ${typeLabel} engraçados)" />
         <button id="yt-${typeStr}-btn">Buscar</button>
       </div>
       <div id="yt-${typeStr}-player" class="yt-player"></div>
       <div id="yt-${typeStr}-grid" class="yt-grid video-grid"></div>
       <div id="yt-${typeStr}-pager" class="yt-pager"></div>
       <p id="yt-${typeStr}-msg" class="yt-msg" style="display: none;"></p>
     </section>

    <footer id="footer"></footer>
  `;
}

export function init() {
  new DashboardPage();
}

class DashboardPage {
  constructor() {
    this.auth = useAuth();
    this.petType = this.getPetType();
    this.videoGrid = null;
    this.videoPlayer = null;
    this.navbar = null;
    this.footer = null;
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
    this.setupNavbar();
    this.setupFooter();
    this.setupVideoSection();
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
  setupNavbar() {
    this.navbar = new Navbar('navbar', {
      currentPage: 'dashboard',
      petType: this.petType
    });
  }

  /**
   * Configura footer
   */
  setupFooter() {
    const footerContainer = document.getElementById('footer');
    if (footerContainer) {
      this.footer = new Footer('footer');
      footerContainer.innerHTML = this.footer.render();
    }
  }

  /**
   * Configura seção de vídeos
   */
  setupVideoSection() {
    const searchTerm = this.petType === PET_TYPES.DOG ? 'cachorros' : 'gatos';
    const gridId = this.petType === PET_TYPES.DOG ? 'yt-dogs-grid' : 'yt-cats-grid';
    const playerId = this.petType === PET_TYPES.DOG ? 'yt-dogs-player' : 'yt-cats-player';
    const searchInputId = this.petType === PET_TYPES.DOG ? 'yt-dogs-q' : 'yt-cats-q';
    const searchBtnId = this.petType === PET_TYPES.DOG ? 'yt-dogs-btn' : 'yt-cats-btn';

    this.videoGrid = new VideoGrid(gridId, {
      onVideoClick: (videoId) => this.playVideo(videoId)
    });

    this.videoPlayer = new VideoPlayer(playerId);

    // Busca inicial
    this.loadVideos(searchTerm);

    // Configura busca
    const searchBtn = document.getElementById(searchBtnId);
    const searchInput = document.getElementById(searchInputId);

    if (searchBtn && searchInput) {
      searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim() || searchTerm;
        this.loadVideos(query);
      });

      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const query = searchInput.value.trim() || searchTerm;
          this.loadVideos(query);
        }
      });
    }
  }

  /**
   * Carrega vídeos
   * @param {string} query - Termo de busca
   */
  async loadVideos(query) {
    try {
      const { youtubeService } = await import('../../services/api/youtube.service.js');
      const found = await youtubeService.search(query);
      const items = found.map(v => ({
        id: v.videoId || v.id,
        title: v.title,
        thumb: v.thumbnail || v.thumb,
        channelTitle: v.channelTitle
      }));
      
      if (items.length > 0) {
        this.videoGrid.render(items);
        if (this.videoPlayer) {
          this.videoPlayer.load(items[0].id);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
      const msg = document.getElementById(this.petType === PET_TYPES.DOG ? 'yt-dogs-msg' : 'yt-cats-msg');
      if (msg) {
        msg.style.display = 'block';
        msg.textContent = 'Erro ao carregar vídeos. Verifique sua conexão.';
      }
    }
  }

  /**
   * Reproduz vídeo
   * @param {string} videoId - ID do vídeo
   */
  playVideo(videoId) {
    if (this.videoPlayer) {
      this.videoPlayer.load(videoId);
    }
  }

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
