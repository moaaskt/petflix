import { ThumbnailCard } from '../ThumbnailCard/ThumbnailCard.js';
import { escapeHTML } from '../../../utils/security.js';
import { SkeletonCard } from '../../common/Skeleton/SkeletonCard.js';
import { getList, toggleItem } from '../../../services/list.service.js';
import { Toast } from '../../../utils/toast.js';

const ROW_HANDLERS = new Map();
const LIST_CACHE = new Map(); // Cache para evitar múltiplas requisições
let listCacheTime = 0;
const CACHE_DURATION = 30000; // 30 segundos

/**
 * Obtém a lista de IDs na lista do usuário (com cache)
 */
async function getListIds() {
  const now = Date.now();
  if (LIST_CACHE.has('ids') && (now - listCacheTime) < CACHE_DURATION) {
    return LIST_CACHE.get('ids');
  }

  try {
    const list = await getList();
    const ids = new Set(list.map(item => item.videoId || item.id));
    LIST_CACHE.set('ids', ids);
    listCacheTime = now;
    return ids;
  } catch (error) {
    console.error('Erro ao buscar lista:', error);
    return new Set();
  }
}

/**
 * Invalida o cache da lista
 */
function invalidateListCache() {
  LIST_CACHE.delete('ids');
  listCacheTime = 0;
}

export async function CategoryRow({ title, items = [], loading = false, onCardClick } = {}) {
  const rowId = `row_${Math.random().toString(36).slice(2)}`;
  const safeTitle = escapeHTML(title || '');
  
  // Mostrar skeleton se loading ou se não houver items
  const showSkeleton = loading || !items || items.length === 0;
  
  // Buscar IDs da lista se houver items
  let listIds = new Set();
  if (!showSkeleton && items.length > 0) {
    listIds = await getListIds();
  }
  
  // Usar SkeletonCard diretamente (sem wrapper) pois já estamos dentro de um container flex
  const cardsHtml = showSkeleton
    ? Array.from({ length: 5 }).map(() => SkeletonCard({ variant: 'video' })).join('')
    : items.map(i => {
        const movieId = i.videoId || i.id;
        const isInList = listIds.has(movieId);
        return ThumbnailCard({ 
          id: movieId, 
          title: i.title, 
          thumbnail: i.thumbnail || i.thumb,
          isInList 
        });
      }).join('');

  if (typeof onCardClick === 'function') {
    ROW_HANDLERS.set(rowId, onCardClick);
  }

  return `
    <section aria-label="${safeTitle}" data-row-id="${rowId}">
      <h3 class="text-lg md:text-xl font-bold text-white mb-2 pl-4 md:pl-12">${safeTitle}</h3>
      <div class="relative group px-4 md:px-12 pb-8">
        <button type="button" data-prev class="absolute left-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 hidden md:flex items-center justify-center w-12 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-white"><path d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
        </button>
        <div class="flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory touch-pan-x" data-row="${rowId}" role="list">
          ${cardsHtml}
        </div>
        <button type="button" data-next class="absolute right-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 hidden md:flex items-center justify-center w-12 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-white"><path d="M8.25 4.5L15.75 12l-7.5 7.5"/></svg>
        </button>
      </div>
    </section>
  `;
}

function initRow(root) {
  const track = root.querySelector('[role="list"]');
  if (!track) return;
  const handler = ROW_HANDLERS.get(root.getAttribute('data-row-id'));
  
  // Event listeners para os cards (navegação)
  track.querySelectorAll('[data-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      // Não navegar se clicou no botão de lista
      if (e.target.closest('[data-movie-id]')) {
        return;
      }
      const id = card.getAttribute('data-id');
      if (typeof handler === 'function') handler(id);
      const event = new CustomEvent('categoryrow:cardclick', { detail: { id } });
      root.dispatchEvent(event);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); 
        if (!e.target.closest('[data-movie-id]')) {
          card.click();
        }
      }
    });
  });

  // Event listeners para os botões de lista
  track.querySelectorAll('[data-movie-id]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation(); // Impede que o clique abra o player
      e.preventDefault();
      
      const movieId = btn.getAttribute('data-movie-id');
      const card = btn.closest('[data-id]');
      if (!card) return;
      
      // Buscar dados do filme do card
      const title = card.getAttribute('aria-label') || 'Filme';
      const thumbnail = card.querySelector('img')?.src || '';
      
      const movie = {
        id: movieId,
        videoId: movieId,
        title: title,
        thumbnail: thumbnail
      };
      
      try {
        const wasAdded = await toggleItem(movie);
        invalidateListCache(); // Invalida cache para atualizar outros cards
        
        // Atualiza o botão visualmente
        const isInList = wasAdded;
        btn.setAttribute('data-in-list', isInList);
        
        if (isInList) {
          btn.className = 'absolute top-2 right-2 w-8 h-8 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center text-white transition-all duration-200 opacity-100 hover:scale-110 z-30';
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" /></svg>`;
          btn.setAttribute('aria-label', 'Remover da lista');
          btn.setAttribute('data-in-list', 'true');
          Toast.success(`${title} adicionado à sua lista`);
        } else {
          btn.className = 'absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 z-30';
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M5 12h14M12 5v14"/></svg>`;
          btn.setAttribute('aria-label', 'Adicionar à lista');
          btn.setAttribute('data-in-list', 'false');
          Toast.info(`${title} removido da sua lista`);
        }
      } catch (error) {
        console.error('Erro ao alternar item na lista:', error);
        Toast.error('Erro ao atualizar lista. Tente novamente.');
      }
    });
  });
  
  const prevBtn = root.querySelector('[data-prev]');
  const nextBtn = root.querySelector('[data-next]');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -window.innerWidth / 2, behavior: 'smooth' });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: window.innerWidth / 2, behavior: 'smooth' });
    });
  }
}

export function initCategoryRows() {
  document.querySelectorAll('section[data-row-id]').forEach(root => initRow(root));
}

if (typeof window !== 'undefined') {
  const observer = new MutationObserver((mutations) => {
    let shouldInit = false;
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.querySelector && node.querySelector('[role="list"]')) shouldInit = true;
      });
    });
    if (shouldInit) initCategoryRows();
  });
  requestAnimationFrame(() => initCategoryRows());
}
