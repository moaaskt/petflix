import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);

  const normalizedItems = useMemo(() => {
    const mapped = items.map(item => ({
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
    console.log('[Carousel] Normalized items:', mapped.length);
    return mapped;
  }, [items]);

  const slideStates = useMemo(() => {
    const total = normalizedItems.length;
    if (total === 0) return [];

    return normalizedItems.map((_, index) => {
      // Calcular índices com looping
      const nextIndex = (currentIndex + 1) % total;
      const prevIndex = (currentIndex - 1 + total) % total;

      return {
        isActive: index === currentIndex,
        isNext: index === nextIndex,
        isPrev: index === prevIndex
      };
    });
  }, [normalizedItems, currentIndex]);

  const handleNext = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex(prevIndex => {
      const total = normalizedItems.length;
      if (total <= 1) {
        console.log('[Carousel] Cannot navigate: only', total, 'item(s)');
        return prevIndex;
      }
      const nextIndex = (prevIndex + 1) % total;
      console.log('[Carousel] Next:', { prevIndex, total, nextIndex });
      return nextIndex;
    });
  }, [normalizedItems]);

  const handlePrev = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex(prevIndex => {
      const total = normalizedItems.length;
      if (total <= 1) {
        console.log('[Carousel] Cannot navigate: only', total, 'item(s)');
        return prevIndex;
      }
      const prevIndexValue = (prevIndex - 1 + total) % total;
      console.log('[Carousel] Prev:', { prevIndex, total, prevIndexValue });
      return prevIndexValue;
    });
  }, [normalizedItems]);

  useEffect(() => {
    if (!isPlaying || normalizedItems.length <= 1) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      handleNext();
    }, 70000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, normalizedItems, handleNext]);

  if (!normalizedItems || normalizedItems.length === 0) {
    return null;
  }

  const handleMouseEnter = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPlaying(true);
  }, []);

  return (
    <div
      className="pf-hero-carousel"
      role="region"
      aria-label="Destaques em destaque"
      aria-roledescription="carousel"
      aria-live="polite"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {normalizedItems.map((item, index) => {
        const state = slideStates[index] || { isActive: false, isNext: false, isPrev: false };
        return (
          <HeroFeaturedSlide
            key={item.id || `slide-${index}`}
            title={item.title}
            description={item.description}
            image={item.image}
            category={item.category}
            rating={item.rating}
            duration={item.duration}
            quality={item.quality}
            stars={item.stars}
            isActive={state.isActive}
            isNext={state.isNext}
            isPrev={state.isPrev}
            actions={item.actions}
            onPlay={item.onPlay}
            onTrailer={item.onTrailer}
          />
        );
      })}

      <button
        className="pf-carousel-prev"
        onClick={(e) => {
          console.log('[Carousel] Prev button clicked!');
          handlePrev(e);
        }}
        aria-label="Previous slide"
        type="button"
        style={{ pointerEvents: 'auto', zIndex: 9999 }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        className="pf-carousel-next"
        onClick={(e) => {
          console.log('[Carousel] Next button clicked!');
          handleNext(e);
        }}
        aria-label="Next slide"
        type="button"
        style={{ pointerEvents: 'auto', zIndex: 9999 }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

HeroFeaturedCarousel.defaultProps = {
  items: []
};

export default HeroFeaturedCarousel;

