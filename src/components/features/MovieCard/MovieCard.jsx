import React, { useState } from 'react';
import { FALLBACK_POSTER, handleImageError } from '../../../utils/imageFallback.js';

/**
 * MovieCard - Vertical poster-style card for movies
 * 
 * Premium card component with hover effects matching StreamIT design:
 * - Vertical aspect ratio (2:3 poster style)
 * - Scale up on hover (1.05x)
 * - Centered play button overlay
 * - Dark gradient overlay on hover
 * 
 * @component
 * @example
 * <MovieCard
 *   id="movie-123"
 *   title="The Last of Us"
 *   image="https://example.com/poster.jpg"
 *   onPlay={() => navigateTo('/player?videoId=movie-123')}
 * />
 */
const MovieCard = ({ id, title, image, onPlay }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="movie-card group cursor-pointer relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:z-10"
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
            {/* Poster Image Container - Aspect Ratio 2:3 */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-900">
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
                        absolute inset-0 
                        bg-gradient-to-t from-black/90 via-black/60 to-transparent
                        flex items-center justify-center
                        transition-opacity duration-300
                        ${isHovered ? 'opacity-100' : 'opacity-0'}
                    `}
                >
                    {/* Play Button */}
                    <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 transform transition-all duration-200 hover:scale-110 shadow-xl">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>

                {/* Title Overlay (Bottom) - Always visible on hover */}
                <div
                    className={`
                        absolute bottom-0 left-0 right-0
                        p-3
                        bg-gradient-to-t from-black/90 to-transparent
                        transition-opacity duration-300
                        ${isHovered ? 'opacity-100' : 'opacity-0'}
                    `}
                >
                    <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 leading-tight">
                        {title}
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
