import './HeroBanner.css';
import { navigateTo } from '../../../router/navigator.js';
import { escapeHTML } from '../../../utils/security.js';
import { isInList, toggleItem } from '../../../services/list.service.js';
import { Toast } from '../../../utils/toast.js';

let currentHeroItem = null;

export function render({ item } = {}) {
  currentHeroItem = item;
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
          <button class="btn btn-secondary" id="heroListBtn" data-video-id="${videoId}" aria-label="Minha Lista">
            <svg id="heroListIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
              <path d="M5 12h14M12 5v14"/>
            </svg>
            <span id="heroListText">Minha Lista</span>
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

export async function init() {
  const playBtn = document.getElementById('heroPlayBtn');
  const infoBtn = document.getElementById('heroInfoBtn');
  const listBtn = document.getElementById('heroListBtn');

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

  // Verificar se o filme está na lista e atualizar o botão
  if (listBtn && currentHeroItem) {
    const videoId = currentHeroItem.videoId || currentHeroItem.id;
    if (videoId) {
      try {
        const inList = await isInList(videoId);
        updateHeroListButton(inList);
      } catch (error) {
        console.error('Erro ao verificar lista:', error);
      }
    }

    // Event listener para o botão de lista
    listBtn.addEventListener('click', async () => {
      if (!currentHeroItem) return;
      
      const videoId = currentHeroItem.videoId || currentHeroItem.id;
      const title = currentHeroItem.title || 'Filme';
      const thumbnail = currentHeroItem.thumbnail || currentHeroItem.image || '';
      
      const movie = {
        id: videoId,
        videoId: videoId,
        title: title,
        thumbnail: thumbnail
      };

      try {
        const wasAdded = await toggleItem(movie);
        updateHeroListButton(wasAdded);
        
        if (wasAdded) {
          Toast.success(`${title} adicionado à sua lista`);
        } else {
          Toast.info(`${title} removido da sua lista`);
        }
      } catch (error) {
        console.error('Erro ao alternar item na lista:', error);
        Toast.error('Erro ao atualizar lista. Tente novamente.');
      }
    });
  }
}

/**
 * Atualiza o visual do botão de lista no hero
 */
function updateHeroListButton(isInList) {
  const listBtn = document.getElementById('heroListBtn');
  const listIcon = document.getElementById('heroListIcon');
  const listText = document.getElementById('heroListText');
  
  if (!listBtn || !listIcon || !listText) return;

  if (isInList) {
    listBtn.classList.remove('btn-secondary');
    listBtn.classList.add('bg-green-600', 'hover:bg-green-700');
    listIcon.innerHTML = `<path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" />`;
    listIcon.setAttribute('fill', 'currentColor');
    listIcon.removeAttribute('stroke');
    listIcon.removeAttribute('stroke-width');
    listIcon.removeAttribute('stroke-linecap');
    listIcon.removeAttribute('stroke-linejoin');
    listText.textContent = 'Remover';
    listBtn.setAttribute('aria-label', 'Remover da lista');
  } else {
    listBtn.classList.add('btn-secondary');
    listBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
    listIcon.innerHTML = `<path d="M5 12h14M12 5v14"/>`;
    listIcon.setAttribute('stroke', 'currentColor');
    listIcon.setAttribute('stroke-width', '2.5');
    listIcon.setAttribute('stroke-linecap', 'round');
    listIcon.setAttribute('stroke-linejoin', 'round');
    listIcon.removeAttribute('fill');
    listText.textContent = 'Minha Lista';
    listBtn.setAttribute('aria-label', 'Adicionar à lista');
  }
}

