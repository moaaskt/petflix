import React, { useRef } from 'react';
// import PropTypes from 'prop-types';

/**
 * ContentRail - Trilho horizontal de cards
 * 
 * Container de scroll horizontal para exibição de múltiplos itens.
 * Usa render prop pattern para máxima flexibilidade.
 * 
 * @component
 * @example
 * <ContentRail
 *   title="Em Alta"
 *   items={movies}
 *   renderItem={(movie) => (
 *     <ContentCard
 *       key={movie.id}
 *       title={movie.title}
 *       image={movie.poster}
 *       onPlay={() => handlePlay(movie.id)}
 *     />
 *   )}
 * />
 */
const ContentRail = ({ title, items, renderItem }) => {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const newScrollPosition =
                scrollContainerRef.current.scrollLeft +
                (direction === 'left' ? -scrollAmount : scrollAmount);

            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth',
            });
        }
    };

    // Don't render if no items
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section className="py-8 px-4 md:px-8 lg:px-12">
            {/* Section Title */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="pf-section-title mb-0">{title}</h2>

                {/* Navigation Buttons - Hidden on mobile */}
                <div className="hidden md:flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="bg-pf-card hover:bg-pf-border text-pf-text-primary p-2 rounded-md transition-colors duration-200"
                        aria-label="Rolar para esquerda"
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
                        onClick={() => scroll('right')}
                        className="bg-pf-card hover:bg-pf-border text-pf-text-primary p-2 rounded-md transition-colors duration-200"
                        aria-label="Rolar para direita"
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
            </div>

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {items.map((item, index) => (
                    <div
                        key={item.id || index}
                        className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px]"
                    >
                        {renderItem(item)}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ContentRail;
