/**
 * SeriesPage - Página de séries unificada
 */
import { ThumbnailCard } from '../../components/features/ThumbnailCard/ThumbnailCard.js';
import { navigateTo } from '../../router/navigator.js';
import { getByCategory } from '../../services/content.service.js';

export async function render() {
  const title = 'Séries';
  const species = document.body.classList.contains('theme-cat') ? 'cat' : 'dog';
  const items = (await getByCategory(species, 'series')).map(i => ({ title: i.title, thumbnail: i.thumbnail || i.image, videoId: i.videoId }));

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
  root?.querySelectorAll('[data-id]')?.forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-id');
      if (id) navigateTo(`/player?videoId=${id}`);
    });
  });
}

// Funções globais para uso no HTML
