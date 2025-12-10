import { navigateTo } from '../../router/navigator.js';
import { getThemeIcon } from '../../components/ui/Icons/ThemeIcons.js';
import { escapeHTML } from '../../utils/security.js';

function getVideoIdFromHash() {
  const hash = window.location.hash || '';
  const query = hash.split('?')[1] || '';
  const params = new URLSearchParams(query);
  return params.get('videoId');
}

export function render() {
  return `
    <div class="relative w-full h-screen bg-black overflow-hidden">
      <button id="backBtn" class="absolute top-4 left-4 z-50" aria-label="Voltar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-white"><path d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
      </button>
      <div id="videoContainer" class="absolute inset-0 w-full h-full"></div>
      <div id="overlay" class="absolute inset-0 flex flex-col justify-end opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/60"></div>
        <div class="relative z-50 p-4 md:p-8 space-y-4">
          <div id="overlayTitle" class="text-2xl md:text-4xl font-semibold text-white">Carregando...</div>
          <div class="flex items-center gap-4">
            <button id="playPause" class="w-10 h-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition text-white cursor-pointer z-50"></button>
            <button id="muteToggle" class="w-10 h-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition text-white cursor-pointer z-50"></button>
            <button id="fullscreenToggle" class="w-10 h-10 ml-auto grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition text-white cursor-pointer z-50"></button>
          </div>
          <div class="w-full h-1 bg-gray-700 rounded overflow-hidden">
            <div id="progressBar" class="player-theme-bg h-full w-0"></div>
          </div>
        </div>
        <button id="centerToggle" class="absolute inset-0 z-40" aria-label="Toggle"></button>
      </div>
    </div>
  `;
}

export async function init() {
  const backBtn = document.getElementById('backBtn');
  backBtn?.addEventListener('click', () => window.history.back());

  const videoId = getVideoIdFromHash();
  const container = document.getElementById('videoContainer');
  const playPause = document.getElementById('playPause');
  const muteToggle = document.getElementById('muteToggle');
  const fullscreenToggle = document.getElementById('fullscreenToggle');
  const centerToggle = document.getElementById('centerToggle');
  const progressBar = document.getElementById('progressBar');

  if (!videoId || !container) {
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

  playPause.innerHTML = getThemeIcon('play');
  muteToggle.innerHTML = getThemeIcon('volume');
  fullscreenToggle.innerHTML = getThemeIcon('fullscreen');

  let player = null;
  let isPlaying = false;
  let isMuted = false;
  let progressTimer = null;

  function loadYTAPI() {
    return new Promise((resolve, reject) => {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.onload = () => resolve();
      tag.onerror = () => reject(new Error('YT API'));
      document.head.appendChild(tag);
      const check = () => {
        if (window.YT && window.YT.Player) resolve();
        else setTimeout(check, 100);
      };
      check();
    });
  }

  function startProgress() {
    if (progressTimer) clearInterval(progressTimer);
    progressTimer = setInterval(() => {
      if (!player || typeof player.getDuration !== 'function') return;
      const dur = player.getDuration();
      const cur = player.getCurrentTime();
      if (dur > 0 && progressBar) {
        const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
        progressBar.style.width = pct + '%';
      }
    }, 500);
  }

  function togglePlay() {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
      isPlaying = false;
      playPause.innerHTML = getThemeIcon('play');
    } else {
      player.playVideo();
      isPlaying = true;
      playPause.innerHTML = getThemeIcon('pause');
    }
  }

  function toggleMute() {
    if (!player) return;
    if (isMuted) {
      player.unMute();
      isMuted = false;
      muteToggle.innerHTML = getThemeIcon('volume');
    } else {
      player.mute();
      isMuted = true;
      muteToggle.innerHTML = getThemeIcon('volume-off');
    }
  }

  function toggleFullscreen() {
    const root = container;
    if (!root) return;
    const isFs = document.fullscreenElement != null;
    if (isFs) {
      document.exitFullscreen?.();
      fullscreenToggle.innerHTML = getThemeIcon('fullscreen');
    } else {
      root.requestFullscreen?.();
      fullscreenToggle.innerHTML = getThemeIcon('exit-fullscreen');
    }
  }

  function initPlayer() {
    player = new window.YT.Player('videoContainer', {
      videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onReady: () => {
          isMuted = player.isMuted?.() || false;
          isPlaying = true;
          playPause.innerHTML = getThemeIcon('pause');
          muteToggle.innerHTML = isMuted ? getThemeIcon('volume-off') : getThemeIcon('volume');
          startProgress();
        },
        onStateChange: (e) => {
          if (e.data === window.YT.PlayerState.PLAYING) {
            isPlaying = true;
            playPause.innerHTML = getThemeIcon('pause');
          } else if (e.data === window.YT.PlayerState.PAUSED) {
            isPlaying = false;
            playPause.innerHTML = getThemeIcon('play');
          }
        }
      }
    });
  }

  playPause.addEventListener('click', togglePlay);
  muteToggle.addEventListener('click', toggleMute);
  fullscreenToggle.addEventListener('click', toggleFullscreen);
  centerToggle.addEventListener('click', togglePlay);

  const barWrapper = progressBar?.parentElement;
  barWrapper?.addEventListener('click', (ev) => {
    if (!player || !barWrapper) return;
    const rect = barWrapper.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const pct = Math.min(1, Math.max(0, x / rect.width));
    const dur = player.getDuration();
    player.seekTo(dur * pct, true);
  });

  try {
    const { youtubeService } = await import('../../services/api/youtube.service.js');
    const details = await youtubeService.getVideoDetails(videoId);
    const titleEl = document.getElementById('overlayTitle');
    if (titleEl) titleEl.textContent = escapeHTML(details?.title || 'Sem título');
  } catch {}

  await loadYTAPI();
  initPlayer();
}

