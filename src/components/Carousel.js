/**
 * Carousel Component - Componente de carrossel
 * Retorna HTML string e fornece função de hidratação/inicialização
 */
import '../styles/components/carousel.css';
import { MovieCard } from './MovieCard.js';
import { youtubeService } from '../services/api/youtube.service.js';

function uid() {
  return 'c' + Math.random().toString(36).slice(2, 9);
}

/**
 * Gera o HTML do carrossel
 * @param {Object} props
 * @param {string} props.title - Título da seção
 * @param {Array} props.items - Itens estáticos (opcional)
 * @param {string} props.query - Termo de busca para carregar dinamicamente
 * @param {string} props.playlistId - ID da playlist para carregar dinamicamente
 * @param {string} props.id - ID manual para o elemento (opcional)
 */
export function Carousel({ title = '', items = [], query = '', playlistId = '', id = '' } = {}) {
  const carouselId = id || uid();
  const hasItems = items && items.length > 0;
  
  // Se tiver itens estáticos, renderiza. Se não, renderiza esqueleto/vazio e atributos data para hidratação
  const cards = hasItems ? items.map(i => MovieCard(i)).join('') : '';
  
  const dataAttrs = [];
  if (query) dataAttrs.push(`data-query="${query}"`);
  if (playlistId) dataAttrs.push(`data-playlist-id="${playlistId}"`);
  if (!hasItems && (query || playlistId)) dataAttrs.push('data-loading="true"');

  // Se estiver carregando (sem itens mas com query/playlist), mostra skeleton ou nada inicialmente
  // O JS vai preencher depois
  
  return `
    <section class="carousel" id="${carouselId}" ${dataAttrs.join(' ')}>
      ${title ? `<h3 class="carousel-title">${title}</h3>` : ''}
      <div class="carousel-viewport">
        <div class="carousel-track">
          ${cards}
          ${!hasItems && (query || playlistId) ? '<div class="carousel-loading">Carregando...</div>' : ''}
        </div>
        <button class="carousel-btn left" aria-label="Anterior">‹</button>
        <button class="carousel-btn right" aria-label="Próximo">›</button>
      </div>
    </section>
  `;
}

/**
 * Inicializa a lógica dos carrosséis (eventos, fetch de dados)
 * Deve ser chamado após o render da página
 */
export async function initCarousels() {
  const carousels = document.querySelectorAll('.carousel');
  
  for (const carousel of carousels) {
    await setupCarousel(carousel);
  }
}

async function setupCarousel(carousel) {
  // 1. Carregar dados se necessário
  const query = carousel.dataset.query;
  const playlistId = carousel.dataset.playlistId;
  const isLoading = carousel.dataset.loading === 'true';
  const track = carousel.querySelector('.carousel-track');

  if (isLoading && (query || playlistId)) {
    try {
      let videos = [];
      if (query) {
        videos = await youtubeService.search(query);
      } else if (playlistId) {
        videos = await youtubeService.getPlaylistVideos(playlistId);
      }

      if (videos.length > 0) {
        track.innerHTML = videos.map(v => MovieCard(v)).join('');
        carousel.removeAttribute('data-loading');
      } else {
        track.innerHTML = '<div class="carousel-error">Nenhum vídeo encontrado</div>';
      }
    } catch (error) {
      console.error('Erro ao carregar carrossel:', error);
      track.innerHTML = '<div class="carousel-error">Erro ao carregar vídeos</div>';
    }
  }

  // 2. Configurar Scroll e Drag (Lógica existente)
  const viewport = carousel.querySelector('.carousel-viewport');
  const left = carousel.querySelector('.carousel-btn.left');
  const right = carousel.querySelector('.carousel-btn.right');

  if (!viewport || !track || !left || !right) return;

  const getCardWidth = () => {
    const card = track.querySelector('.movie-card');
    return card ? card.getBoundingClientRect().width : 200; // Fallback
  };

  const scrollByCards = (n) => {
    const cardWidth = getCardWidth();
    const gap = parseFloat(getComputedStyle(track).gap || '16px'); // Pega do CSS ou default
    const amount = (cardWidth + gap) * n;
    viewport.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // Remove listeners antigos (se houver - idealmente usar AbortController ou remover explicitamente)
  // Como é recriado na navegação, ok.
  
  // Clonar e substituir botões para remover listeners antigos é uma técnica segura em SPA simples
  const newLeft = left.cloneNode(true);
  const newRight = right.cloneNode(true);
  left.parentNode.replaceChild(newLeft, left);
  right.parentNode.replaceChild(newRight, right);

  newLeft.addEventListener('click', () => scrollByCards(-3));
  newRight.addEventListener('click', () => scrollByCards(3));

  // Drag logic
  let isDown = false;
  let startX;
  let scrollLeft;

  const startDrag = (e) => {
    isDown = true;
    track.classList.add('grabbing');
    startX = e.pageX || e.touches[0].pageX;
    scrollLeft = viewport.scrollLeft;
  };

  const endDrag = () => {
    isDown = false;
    track.classList.remove('grabbing');
  };

  const moveDrag = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX;
    const walk = (x - startX) * 2; // Velocidade do scroll
    viewport.scrollLeft = scrollLeft - walk;
  };

  // Mouse events
  track.addEventListener('mousedown', startDrag);
  track.addEventListener('mouseleave', endDrag);
  track.addEventListener('mouseup', endDrag);
  track.addEventListener('mousemove', moveDrag);

  // Touch events
  track.addEventListener('touchstart', startDrag, { passive: true });
  track.addEventListener('touchend', endDrag);
  track.addEventListener('touchmove', moveDrag, { passive: false });
}

// Auto-init se estiver no browser (pode ser removido se o router chamar initCarousels explicitamente)
if (typeof window !== 'undefined') {
  // Observador para novos carrosséis (útil para SPA)
  const observer = new MutationObserver((mutations) => {
    let shouldInit = false;
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(node => {
          if (node.classList && node.classList.contains('carousel')) {
            shouldInit = true;
          } else if (node.querySelector && node.querySelector('.carousel')) {
            shouldInit = true;
          }
        });
      }
    });
    if (shouldInit) {
      initCarousels();
    }
  });

  // Inicia observer no body
  // observer.observe(document.body, { childList: true, subtree: true });
  
  // Fallback inicial
  requestAnimationFrame(() => initCarousels());
}
