import React, { useState } from 'react';
import { FALLBACK_POSTER, handleImageError } from '../utils/imageFallback.js';
// import PropTypes from 'prop-types';

/**
 * ContentCard - Card padrão de conteúdo (filme/série)
 * 
 * Card visual para exibição de conteúdo com imagem de destaque.
 * Revela botão Play ao passar o mouse (hover).
 * 
 * Inclui fallback automático para imagens quebradas e efeito zoom no hover.
 * 
 * @component
 * @example
 * <ContentCard
 *   title="Breaking Bad"
 *   image="https://example.com/poster.jpg"
 *   onPlay={() => console.log('Play clicked')}
 * />
 */
const ContentCard = ({ title, image, onPlay }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="pf-card group cursor-pointer relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onPlay}
            role="button"
            tabIndex={0}
            aria-label={`Assistir ${title}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onPlay();
                }
            }}
        >
            {/* Image Container */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-pf-surface">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => handleImageError(e, FALLBACK_POSTER)}
                    style={{ objectFit: 'cover' }}
                />

                {/* Hover Overlay with Play Button */}
                <div
                    className={`
            absolute inset-0 bg-gradient-to-t from-pf-black via-pf-black/60 to-transparent
            flex items-center justify-center
            transition-opacity duration-200
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
                >
                    <div className="bg-pf-primary rounded-full p-4 transform transition-transform duration-200 hover:scale-110">
                        <svg
                            className="w-8 h-8 text-pf-text-primary"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className="mt-3">
                <h3 className="text-pf-text-primary font-semibold text-sm md:text-base line-clamp-2 leading-tight">
                    {title}
                </h3>
            </div>
        </div>
    );
};

export default ContentCard;
