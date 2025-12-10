import './HeroBanner.css';
import { navigateTo } from '../../../router/navigator.js';
import { escapeHTML } from '../../../utils/security.js';

export function render({ item } = {}) {
  const title = escapeHTML(item?.title || 'Petflix Destaque');
  const thumb = item?.thumbnail || '/assets/hero-fallback.jpg';
  const videoId = item?.videoId || item?.id || '';

  return `
    <section class="hero-banner" style="background-image: url('${thumb}')" aria-label="Destaque">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1 class="hero-title">${title}</h1>
        <div class="hero-actions">
          <button class="btn btn-primary" id="heroPlayBtn" data-video-id="${videoId}" aria-label="Reproduzir">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M8 5v14l11-7z"/></svg>
            Assistir
          </button>
          <button class="btn btn-secondary" id="heroInfoBtn" aria-label="Mais informações">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            Mais info
          </button>
        </div>
      </div>
    </section>
  `;
}

export function init() {
  const playBtn = document.getElementById('heroPlayBtn');
  const infoBtn = document.getElementById('heroInfoBtn');

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      const vid = playBtn.getAttribute('data-video-id');
      if (vid) {
        navigateTo(`/player?videoId=${encodeURIComponent(vid)}`);
      } else {
        console.log('Play acionado sem videoId');
      }
    });
  }

  if (infoBtn) {
    infoBtn.addEventListener('click', () => {
      console.log('Mais info acionado');
    });
  }
}

