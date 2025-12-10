import { ThumbnailCard } from '../ThumbnailCard/ThumbnailCard.js';
import { escapeHTML } from '../../../utils/security.js';

const ROW_HANDLERS = new Map();

export function CategoryRow({ title, items = [], loading = false, onCardClick } = {}) {
  const rowId = `row_${Math.random().toString(36).slice(2)}`;
  const safeTitle = escapeHTML(title || '');
  const cardsHtml = loading
    ? Array.from({ length: 6 }).map(() => `<div class=\"relative flex-none w-[160px] md:w-[240px] aspect-video rounded-md bg-gray-700 animate-pulse\"></div>`).join('')
    : items.map(i => ThumbnailCard({ id: i.videoId || i.id, title: i.title, thumbnail: i.thumbnail || i.thumb })).join('');

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
  track.querySelectorAll('[data-id]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      if (typeof handler === 'function') handler(id);
      const event = new CustomEvent('categoryrow:cardclick', { detail: { id } });
      root.dispatchEvent(event);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); card.click();
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
