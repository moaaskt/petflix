import { navigateTo } from '../../router/navigator.js';
import { getThemeIcon } from '../../components/ui/Icons/ThemeIcons.js';
import { escapeHTML } from '../../utils/security.js';
import { loadYouTubeAPI } from '../../services/youtube.service.js';
import { Toast } from '../../utils/toast.js';

function getVideoIdFromHash() {
  const hash = window.location.hash || '';
  const query = hash.split('?')[1] || '';
  const params = new URLSearchParams(query);
  return params.get('videoId');
}

export function render() {
  return `
    <div id="playerContainer" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 100; background-color: #000;">
      <button id="backBtn" style="position: absolute; top: 16px; left: 16px; z-index: 101; background: transparent; border: none; cursor: pointer; padding: 0;" aria-label="Voltar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 32px; height: 32px; color: white;"><path d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
      </button>
      <div id="videoContainer" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%;"></div>
      <div id="overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0; transition: opacity 0.3s; pointer-events: none;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent, rgba(0,0,0,0.6));"></div>
        <div style="position: absolute; bottom: 0; left: 0; right: 0; z-index: 101; padding: 24px; padding-bottom: 40px; pointer-events: none;">
          <div id="overlayTitle" style="font-size: 1.5rem; font-weight: 600; color: white; margin-bottom: 16px; pointer-events: auto;">Carregando...</div>
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px; pointer-events: auto;">
            <button id="playPause" style="width: 40px; height: 40px; display: grid; place-items: center; border-radius: 50%; background: rgba(255,255,255,0.1); color: white; cursor: pointer; border: none; transition: background 0.2s;"></button>
            <button id="muteToggle" style="width: 40px; height: 40px; display: grid; place-items: center; border-radius: 50%; background: rgba(255,255,255,0.1); color: white; cursor: pointer; border: none; transition: background 0.2s;"></button>
            <button id="fullscreenToggle" style="width: 40px; height: 40px; margin-left: auto; display: grid; place-items: center; border-radius: 50%; background: rgba(255,255,255,0.1); color: white; cursor: pointer; border: none; transition: background 0.2s;"></button>
          </div>
          <div style="width: 100%; height: 4px; background: #374151; border-radius: 2px; overflow: hidden; pointer-events: auto;">
            <div id="progressBar" style="height: 100%; width: 0%; background: var(--player-theme-bg, #ef4444);"></div>
          </div>
        </div>
        <button id="centerToggle" style="position: absolute; top: 0; left: 0; right: 0; bottom: 30%; z-index: 30; pointer-events: auto; background: transparent; border: none; cursor: pointer;" aria-label="Toggle"></button>
      </div>
    </div>
  `;
}

export async function init() {
  const backBtn = document.getElementById('backBtn');
  backBtn?.addEventListener('click', () => window.history.back());

  const videoId = getVideoIdFromHash();
  const container = document.getElementById('videoContainer');
  const playerContainer = document.getElementById('playerContainer');
  const overlay = document.getElementById('overlay');
  const playPause = document.getElementById('playPause');
  const muteToggle = document.getElementById('muteToggle');
  const fullscreenToggle = document.getElementById('fullscreenToggle');
  const centerToggle = document.getElementById('centerToggle');
  const progressBar = document.getElementById('progressBar');

  // Adicionar efeito hover no overlay para mostrar controles
  if (overlay) {
    overlay.addEventListener('mouseenter', () => {
      overlay.style.opacity = '1';
    });
    overlay.addEventListener('mouseleave', () => {
      overlay.style.opacity = '0';
    });
  }

  // Adicionar efeito hover nos botões
  [playPause, muteToggle, fullscreenToggle].forEach(btn => {
    if (btn) {
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(255,255,255,0.2)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(255,255,255,0.1)';
      });
    }
  });

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

  let player = null;
  let isPlaying = false;
  let isMuted = false;
  let progressTimer = null;

  // Função para detectar fullscreen em todos os navegadores
  function isFullscreen() {
    return !!(document.fullscreenElement || 
              document.webkitFullscreenElement || 
              document.mozFullScreenElement || 
              document.msFullscreenElement);
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

  function toggleFullscreen(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!playerContainer) return;
    
    const isFs = isFullscreen();
    
    if (isFs) {
      const exitFullscreen = document.exitFullscreen || 
                             document.webkitExitFullscreen || 
                             document.mozCancelFullScreen || 
                             document.msExitFullscreen;
      
      if (exitFullscreen) {
        exitFullscreen.call(document).catch(err => {
          console.error('Erro ao sair do fullscreen:', err);
        });
      }
    } else {
      const requestFullscreen = playerContainer.requestFullscreen || 
                                playerContainer.webkitRequestFullscreen || 
                                playerContainer.mozRequestFullScreen || 
                                playerContainer.msRequestFullscreen;
      
      if (requestFullscreen) {
        requestFullscreen.call(playerContainer).catch(err => {
          console.error('Erro ao entrar em fullscreen:', err);
        });
      }
    }
  }

  function updateFullscreenIcon() {
    if (!fullscreenToggle) return;
    const isFs = isFullscreen();
    fullscreenToggle.innerHTML = isFs ? getThemeIcon('exit-fullscreen') : getThemeIcon('fullscreen');
  }

  // Listener para mudanças de fullscreen
  document.addEventListener('fullscreenchange', updateFullscreenIcon);
  document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
  document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
  document.addEventListener('MSFullscreenChange', updateFullscreenIcon);

  // Atualizar ícone inicial baseado no estado atual
  updateFullscreenIcon();

  function initPlayer() {
    try {
      player = new window.YT.Player('videoContainer', {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          fs: 1
        },
        events: {
          onReady: () => {
            // Garantir que o iframe tenha permissões de fullscreen
            const iframe = container.querySelector('iframe');
            if (iframe) {
              iframe.setAttribute('allowfullscreen', 'true');
              iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen');
            }
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
    } catch (error) {
      throw new Error(`Erro ao inicializar o player: ${error.message}`);
    }
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

  // Carrega a API do YouTube e inicializa o player com tratamento de erro
  try {
    await loadYouTubeAPI();
    initPlayer();
  } catch (error) {
    console.error('Erro ao carregar o player do YouTube:', error);
    Toast.error('Erro ao carregar o vídeo. Redirecionando...', 3000);
    
    // Redireciona para o Dashboard após 3 segundos
    setTimeout(() => {
      navigateTo('/dashboard');
    }, 3000);
  }
}

