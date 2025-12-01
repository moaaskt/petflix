import './PlayerPage.css';
import { CategoryRow } from '../../components/features/CategoryRow/CategoryRow.js';
import { navigateTo } from '../../router/navigator.js';

function getVideoIdFromHash() {
  const hash = window.location.hash || '';
  const query = hash.split('?')[1] || '';
  const params = new URLSearchParams(query);
  return params.get('videoId');
}

export function render() {
  const vid = getVideoIdFromHash();
  return `
    <div class="page page--player">
      <div class="container">
        <button id="backBtn" class="back-btn" aria-label="Voltar">← Voltar</button>
      </div>

      <div class="player-wrap">
        <div id="playerFrame" class="player-skeleton" aria-label="Player"></div>
      </div>

      <div class="container">
        <h1 id="videoTitle" class="title-skeleton">Carregando título...</h1>
        <p id="videoMeta" class="meta"></p>
        <p id="videoDesc" class="desc-skeleton">Carregando descrição...</p>
      </div>

      <section class="section">
        <div class="container">
          <h2 class="section-title">Mais Parecidos</h2>
        </div>
        <div id="relatedContainer">
          ${CategoryRow({ title: 'Mais Parecidos', loading: true })}
        </div>
      </section>
    </div>
  `;
}

export async function init() {
  // Limpa e reconfigura listeners
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    const clone = backBtn.cloneNode(true);
    backBtn.parentNode.replaceChild(clone, backBtn);
    clone.addEventListener('click', () => navigateTo('/dashboard'));
  }

  const videoId = getVideoIdFromHash();
  if (!videoId) {
    navigateTo('/dashboard');
    return;
  }

  // Carrega detalhes do vídeo
  try {
    const { youtubeService } = await import('../../services/api/youtube.service.js');
    const details = await youtubeService.getVideoDetails(videoId);

    // Atualiza player
    const frame = document.getElementById('playerFrame');
    if (frame) {
      frame.outerHTML = `<div class="player-frame"><iframe src="https://www.youtube.com/embed/${details.videoId}?autoplay=1&mute=0" allow="autoplay; encrypted-media" allowfullscreen title="${details.title}"></iframe></div>`;
    }

    // Atualiza texto
    const titleEl = document.getElementById('videoTitle');
    const metaEl = document.getElementById('videoMeta');
    const descEl = document.getElementById('videoDesc');
    if (titleEl) titleEl.textContent = details.title || 'Sem título';
    if (metaEl) metaEl.textContent = `${details.channelTitle || ''} • ${new Date(details.publishedAt).toLocaleDateString()}`;
    if (descEl) descEl.textContent = details.description || '';

    // Carrega relacionados
    const related = await youtubeService.searchRelated(videoId);
    const relatedContainer = document.getElementById('relatedContainer');
    if (relatedContainer) {
      relatedContainer.innerHTML = CategoryRow({
        title: 'Mais Parecidos',
        items: related.map(r => ({ id: r.videoId || r.id, title: r.title, thumbnail: r.thumbnail })),
        onCardClick: (id) => navigateTo(`/player?videoId=${id}`)
      });
    }
  } catch (e) {
    console.error('Erro ao carregar PlayerPage:', e);
  }
}

