/**
 * MoviesPage - Página de filmes unificada
 */
import { ThumbnailCard } from '../../components/features/ThumbnailCard/ThumbnailCard.js';
import { navigateTo } from '../../router/navigator.js';

export function render() {
  const title = 'Filmes';
  const items = [
    { title: 'A Vida Secreta dos Bichos', thumbnail: 'assets/1.jpg', videoId: 'Ws-9ra38AlI' },
    { title: 'Beethoven', thumbnail: 'assets/betown.jpg', videoId: 'ki8wHMR-yOI' },
    { title: 'K-9', thumbnail: 'assets/filmedog7.jpg', videoId: 'UqtFvSKhKmA' },
    { title: 'Sempre ao Seu Lado', thumbnail: 'assets/caminho-de-casa.jpg', videoId: 'UFY8vW5IedY' },
    { title: 'Gato de Botas', thumbnail: 'assets/capa-filme-gato-de-botas-2-o-ultimo-pedido-1f766-large.jpg', videoId: '6pbreU5ChmA' },
    { title: 'Oliver & Companhia', thumbnail: 'assets/seriesgato2.jpg', videoId: 'JxS5E-kZc2s' }
  ];

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
  const root = document.getElementById('app');
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
