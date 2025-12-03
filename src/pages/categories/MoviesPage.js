/**
 * MoviesPage - Página de filmes unificada
 */
import { ThumbnailCard } from '../../components/features/ThumbnailCard/ThumbnailCard.js';
import { navigateTo } from '../../router/navigator.js';
import { getByCategory } from '../../services/content.service.js';

export function render() {
  const title = 'Filmes';
  const species = document.body.classList.contains('theme-cat') ? 'cat' : 'dog';
  const items = getByCategory(species, 'movie').map(i => ({ title: i.title, thumbnail: i.image, videoId: i.videoId }));

  return `
    <div class="pt-20 px-4 md:px-12">
      <h2 class="text-2xl md:text-3xl font-bold mb-6">${title}</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        ${items.map(i => ThumbnailCard({ id: i.videoId, title: i.title, thumbnail: i.thumbnail })).join('')}
      </div>
    </div>
  `;
}

export function init() {
  const cards = Array.from(document.querySelectorAll('[data-id]'));
  cards.forEach(el => {
    const id = el.getAttribute('data-id');
    if (!id) return;
    el.addEventListener('click', () => navigateTo(`/player?videoId=${id}`));
  });
}

// Função global para fechar modal (usada no HTML)
window.closeModal = function() {
  const modal = document.getElementById('moviesModal');
  const iframe = document.getElementById('modalVideo');
  
  if (modal && iframe) {
    iframe.src = '';
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
};


// Função global para scroll do carrossel (usada no HTML)
window.scrollCarousel = function(containerId, scrollAmount) {
  const container = document.getElementById(containerId);
  if (container) {
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }
};
