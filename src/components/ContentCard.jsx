import React, { useState } from 'react';
import { FALLBACK_POSTER, handleImageError } from '../utils/imageFallback.js';
import RatingStars from './RatingStars.jsx';

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
 * />
 */
const ContentCard = ({ id, title, image, onPlay }) => {
    return (
        <div
            className="group cursor-pointer relative flex flex-col gap-3 transition-all duration-500"
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
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 group-hover:border-red-600/30 transition-all duration-500 shadow-lg group-hover:shadow-[0_10px_30px_rgba(229,9,20,0.15)]">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                    loading="lazy"
                    onError={(e) => handleImageError(e, FALLBACK_POSTER)}
                    style={{ objectFit: 'cover' }}
                />

                {/* Hover Overlay with Premium Play Button */}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500 backdrop-blur-[2px]"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                        <div className="relative bg-red-600 rounded-full p-5 transform transition-all duration-500 translate-y-4 group-hover:translate-y-0 scale-75 group-hover:scale-100 shadow-2xl">
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
                </div>
            </div>

            {/* Title & Metadata (Opcional, mas melhora UX) */}
            <div className="px-1 space-y-1">
                <h3 className="text-zinc-200 font-bold text-sm md:text-base line-clamp-1 group-hover:text-white transition-colors tracking-tight">
                    {title}
                </h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">4K Ultra HD</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Premium</span>
                    </div>
                    {id && <RatingStars contentId={id} />}
                </div>
            </div>
        </div>
    );
};


export default ContentCard;
