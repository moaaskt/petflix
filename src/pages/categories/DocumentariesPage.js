/**
 * DocumentariesPage - Página de documentários unificada
 */
import { ThumbnailCard } from '../../components/features/ThumbnailCard/ThumbnailCard.js';
import { navigateTo } from '../../router/navigator.js';

export function render() {
  const title = 'Documentários';
  const items = [
    { title: 'Vida Selvagem', thumbnail: 'assets/docdog2.jpg', videoId: 'fEPkp0iFMTI' },
    { title: 'Cães Heróis', thumbnail: 'assets/docdog5.jpg', videoId: 'UqtFvSKhKmA' },
    { title: 'Mundo dos Gatos', thumbnail: 'assets/docucat4.jpg', videoId: '6pbreU5ChmA' },
    { title: 'Selva Urbana', thumbnail: 'assets/docucat2.webp', videoId: 'QadUonunflw' },
    { title: 'Resgate Animal', thumbnail: 'assets/docdog1.jpg', videoId: 'MjbKt2bVFec' }
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
  root?.querySelectorAll('[data-id]')?.forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-id');
      if (id) navigateTo(`/player?videoId=${id}`);
    });
  });
}

// Funções globais para uso no HTML
