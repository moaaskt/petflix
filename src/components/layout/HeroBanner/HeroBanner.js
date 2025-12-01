import './HeroBanner.css';
import { navigateTo } from '../../../router/navigator.js';

export function render({ item } = {}) {
  const title = item?.title || 'Petflix Destaque';
  const thumb = item?.thumbnail || '/assets/hero-fallback.jpg';
  const videoId = item?.videoId || item?.id || '';

  return `
    <section class="hero-banner" style="background-image: url('${thumb}')" aria-label="Destaque">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1 class="hero-title">${title}</h1>
        <div class="hero-actions">
          <button class="btn btn-primary" id="heroPlayBtn" data-video-id="${videoId}" aria-label="Reproduzir">
            <i class="fas fa-play"></i> Assistir
          </button>
          <button class="btn btn-secondary" id="heroInfoBtn" aria-label="Mais informações">
            <i class="fas fa-info-circle"></i> Mais info
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

