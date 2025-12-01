import './CategoryRow.css';
import { ThumbnailCard } from '../ThumbnailCard/ThumbnailCard.js';

export function CategoryRow({ title, items = [], loading = false, onCardClick } = {}) {
  const rowId = `row_${Math.random().toString(36).slice(2)}`;
  const cardsHtml = loading
    ? Array.from({ length: 6 }).map(() => '<div class="skeleton-card"></div>').join('')
    : items.map(i => ThumbnailCard({ id: i.videoId || i.id, title: i.title, thumbnail: i.thumbnail || i.thumb })).join('');

  return `
    <section class="category-row" data-row-id="${rowId}" aria-label="${title}">
      <div class="row-header container">
        <h3 class="row-title">${title}</h3>
        <div class="row-actions" hidden></div>
      </div>
      <div class="row-viewport">
        <button class="row-btn row-btn--prev" aria-label="Anterior" data-row="${rowId}"><i class="fas fa-chevron-left"></i></button>
        <div class="row-track" data-row="${rowId}" role="list">
          ${cardsHtml}
        </div>
        <button class="row-btn row-btn--next" aria-label="Próximo" data-row="${rowId}"><i class="fas fa-chevron-right"></i></button>
      </div>
    </section>
  `;
}

function initRow(root) {
  const viewport = root.querySelector('.row-viewport');
  const track = root.querySelector('.row-track');
  const prev = root.querySelector('.row-btn--prev');
  const next = root.querySelector('.row-btn--next');
  if (!viewport || !track || !prev || !next) return;

  const getCardWidth = () => {
    const card = track.querySelector('.thumbnail-card');
    return card ? card.getBoundingClientRect().width : 200;
  };

  const scrollByCards = (n) => {
    const cardWidth = getCardWidth();
    const gap = parseFloat(getComputedStyle(track).gap || '16');
    const amount = (cardWidth + gap) * n;
    viewport.scrollBy({ left: amount, behavior: 'smooth' });
  };

  let isDown = false; let startX; let scrollLeft;
  const startDrag = (e) => { isDown = true; track.classList.add('grabbing'); startX = (e.touches? e.touches[0].pageX : e.pageX); scrollLeft = viewport.scrollLeft; };
  const endDrag = () => { isDown = false; track.classList.remove('grabbing'); };
  const moveDrag = (e) => { if (!isDown) return; e.preventDefault(); const x = (e.touches? e.touches[0].pageX : e.pageX); const walk = (x - startX) * 2; viewport.scrollLeft = scrollLeft - walk; };

  prev.addEventListener('click', () => scrollByCards(-3));
  next.addEventListener('click', () => scrollByCards(3));

  track.addEventListener('mousedown', startDrag);
  track.addEventListener('mouseleave', endDrag);
  track.addEventListener('mouseup', endDrag);
  track.addEventListener('mousemove', moveDrag);
  track.addEventListener('touchstart', startDrag, { passive: true });
  track.addEventListener('touchend', endDrag, { passive: true });
  track.addEventListener('touchmove', moveDrag, { passive: false });

  track.querySelectorAll('.thumbnail-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const event = new CustomEvent('categoryrow:cardclick', { detail: { id } });
      root.dispatchEvent(event);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); card.click();
      }
    });
  });
}

function initCategoryRows() {
  document.querySelectorAll('.category-row').forEach(root => initRow(root));
}

if (typeof window !== 'undefined') {
  const observer = new MutationObserver((mutations) => {
    let shouldInit = false;
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.classList && node.classList.contains('category-row')) shouldInit = true;
        else if (node.querySelector && node.querySelector('.category-row')) shouldInit = true;
      });
    });
    if (shouldInit) initCategoryRows();
  });

  requestAnimationFrame(() => initCategoryRows());
}

