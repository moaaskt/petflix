import { navigateTo } from '../../router/navigator.js';

function getVideoIdFromHash() {
  const hash = window.location.hash || '';
  const query = hash.split('?')[1] || '';
  const params = new URLSearchParams(query);
  return params.get('videoId');
}

export function render() {
  const vid = getVideoIdFromHash();
  const src = vid ? `https://www.youtube.com/embed/${encodeURIComponent(vid)}?autoplay=1&controls=0&modestbranding=1` : '';
  return `
    <div class="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
      <button id="backBtn" class="absolute top-4 left-4 z-50" aria-label="Voltar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-white"><path d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
      </button>
      <div id="playerContainer" class="absolute inset-0 w-full h-full">
        ${src ? `<iframe id="playerFrame" src="${src}" class="w-full h-full" allow="autoplay; encrypted-media" allowfullscreen></iframe>` : ''}
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
        <div id="overlayTitle" class="text-2xl md:text-4xl font-semibold text-white">Carregando...</div>
        <div class="mt-4 w-full h-1 bg-gray-600 rounded overflow-hidden">
          <div id="overlayProgress" class="bg-[#E50914] w-1/3 h-full"></div>
        </div>
      </div>
    </div>
  `;
}

export async function init() {
  const backBtn = document.getElementById('backBtn');
  backBtn?.addEventListener('click', () => window.history.back());

  const videoId = getVideoIdFromHash();
  if (!videoId) {
    const container = document.getElementById('playerContainer');
    if (container) {
      container.innerHTML = `
        <div class="w-full h-full flex items-center justify-center">
          <div class="text-center space-y-4">
            <div class="text-white text-xl">Conteúdo indisponível no momento</div>
            <button class="border border-gray-400 text-gray-200 px-6 py-2 uppercase tracking-widest hover:border-white hover:text-white transition-all" id="backHome">Voltar ao Início</button>
          </div>
        </div>
      `;
      const backHome = document.getElementById('backHome');
      backHome?.addEventListener('click', () => navigateTo('/dashboard'));
    }
    return;
  }

  try {
    const { youtubeService } = await import('../../services/api/youtube.service.js');
    const details = await youtubeService.getVideoDetails(videoId);
    const titleEl = document.getElementById('overlayTitle');
    if (titleEl) titleEl.textContent = details?.title || 'Sem título';
  } catch {}
}

