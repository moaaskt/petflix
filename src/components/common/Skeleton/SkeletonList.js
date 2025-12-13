import { SkeletonCard } from './SkeletonCard.js';

/**
 * SkeletonList Component - Lista de skeleton cards para loading states
 * @param {Object} options - Opções de configuração
 * @param {number} options.count - Número de skeletons para mostrar (padrão: 6)
 * @param {string} options.variant - Variante do card: 'movie' ou 'video' (padrão: 'movie')
 * @param {string} options.layout - Layout: 'grid' ou 'flex' (padrão: 'flex')
 * @param {string} options.gridCols - Colunas da grid (padrão: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5')
 */
export function SkeletonList({ count = 6, variant = 'movie', layout = 'flex', gridCols = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' } = {}) {
  const skeletons = Array.from({ length: count })
    .map(() => SkeletonCard({ variant }))
    .join('');

  const containerClass = layout === 'grid' 
    ? `grid ${gridCols} gap-4 md:gap-6`
    : 'flex gap-2 md:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory';

  return `
    <div class="${containerClass}">
      ${skeletons}
    </div>
  `;
}

export default SkeletonList;
