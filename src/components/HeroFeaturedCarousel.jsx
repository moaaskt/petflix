import React, { useState, useMemo } from 'react';
import HeroFeaturedSlide from './HeroFeaturedSlide.jsx';

/**
 * HeroFeaturedCarousel - Container do carrossel cinematográfico
 * 
 * Gerencia múltiplos slides de destaque com transições suaves.
 * Renderiza HeroFeaturedSlide para cada item, aplicando estados
 * visuais (active, next, prev) baseados no índice atual.
 * 
 * @component
 * @example
 * <HeroFeaturedCarousel
 *   items={[
 *     {
 *       id: '1',
 *       title: 'Stranger Things',
 *       description: 'Uma série de suspense...',
 *       image: 'https://example.com/hero.jpg',
 *       onPlay: () => navigate('/player/1')
 *     }
 *   ]}
 * />
 */
const HeroFeaturedCarousel = ({ items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const normalizedItems = useMemo(() => {
    return items.map(item => ({
      id: item.id || item.videoId || '',
      title: item.title || '',
      description: item.description || item.synopsis || '',
      image: item.image || item.thumbnail || '',
      category: item.category || null,
      rating: item.rating || null,
      duration: item.duration || null,
      quality: item.quality || null,
      stars: item.stars || 0,
      onPlay: item.onPlay || (() => {}),
      onTrailer: item.onTrailer || null,
      actions: item.actions || null
    }));
  }, [items]);

  const slideStates = useMemo(() => {
    return normalizedItems.map((_, index) => ({
      isActive: index === currentIndex,
      isNext: index === currentIndex + 1,
      isPrev: index === currentIndex - 1
    }));
  }, [normalizedItems, currentIndex]);

  if (!normalizedItems || normalizedItems.length === 0) {
    return null;
  }

  return (
    <div
      className="pf-hero-carousel"
      role="region"
      aria-label="Destaques em destaque"
      aria-roledescription="carousel"
      aria-live="polite"
    >
      {normalizedItems.map((item, index) => (
        <HeroFeaturedSlide
          key={item.id || index}
          title={item.title}
          description={item.description}
          image={item.image}
          category={item.category}
          rating={item.rating}
          duration={item.duration}
          quality={item.quality}
          stars={item.stars}
          isActive={slideStates[index].isActive}
          isNext={slideStates[index].isNext}
          isPrev={slideStates[index].isPrev}
          actions={item.actions}
          onPlay={item.onPlay}
          onTrailer={item.onTrailer}
        />
      ))}
    </div>
  );
};

HeroFeaturedCarousel.defaultProps = {
  items: []
};

export default HeroFeaturedCarousel;

