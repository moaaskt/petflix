/**
 * SkeletonCard Component - Card de skeleton para loading states
 * Simula o formato de um card de filme com animação de pulso elegante
 * Visual inspirado no Netflix/YouTube (Dark Mode)
 */
export function SkeletonCard({ variant = 'movie' } = {}) {
  // Variantes: 'movie' (aspect 2/3) ou 'video' (aspect 16/9)
  const aspectClass = variant === 'video' ? 'aspect-video' : 'aspect-[2/3]';
  const widthClass = variant === 'video' ? 'w-[160px] md:w-[240px] flex-none' : 'w-full';
  
  return `
    <div class="${widthClass} ${aspectClass} rounded-lg overflow-hidden bg-gray-800 animate-pulse">
      <div class="w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800"></div>
    </div>
  `;
}

export default SkeletonCard;
