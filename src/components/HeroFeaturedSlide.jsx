import React, { useState } from 'react';
import { FALLBACK_HERO } from '../utils/imageFallback.js';

/**
 * HeroFeaturedSlide - Slide individual do Hero Carousel
 * 
 * Componente visual que representa um slide dentro do carrossel cinematográfico.
 * Reutiliza o layout e semântica do HeroFeatured, adaptado para funcionar
 * dentro do sistema de carrossel com estados (active, next, prev).
 * 
 * @component
 * @example
 * <HeroFeaturedSlide
 *   title="Stranger Things"
 *   description="Quando um garoto desaparece..."
 *   image="https://example.com/hero.jpg"
 *   isActive={true}
 *   isNext={false}
 *   isPrev={false}
 *   onPlay={() => navigate('/player/123')}
 *   actions={[
 *     { label: 'Minha Lista', onClick: handleList, variant: 'secondary' }
 *   ]}
 * />
 */
const HeroFeaturedSlide = ({
    title,
    description,
    image,
    isActive,
    isNext,
    isPrev,
    actions,
    onPlay
}) => {
    const [bgImage, setBgImage] = useState(image);

    /**
     * Handle background image error
     */
    const handleBgImageError = () => {
        if (bgImage !== FALLBACK_HERO) {
            setBgImage(FALLBACK_HERO);
        }
    };

    /**
     * Retorna classes CSS baseadas na variante do botão
     */
    const getButtonClasses = (variant) => {
        const baseClasses = 'inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-md font-semibold transition-all duration-200 text-sm md:text-base';

        switch (variant) {
            case 'primary':
                return `${baseClasses} pf-btn-primary`;

            case 'secondary':
                return `${baseClasses} bg-pf-card/80 hover:bg-pf-card text-pf-text-primary border border-pf-border hover:border-pf-text-muted backdrop-blur-sm hover:scale-105 active:scale-95`;

            case 'ghost':
                return `${baseClasses} bg-pf-surface/60 hover:bg-pf-surface/80 text-pf-text-primary border border-pf-border/50 hover:border-pf-border backdrop-blur-sm hover:scale-105 active:scale-95`;

            default:
                return `${baseClasses} bg-pf-card hover:bg-pf-border text-pf-text-primary`;
        }
    };

    /**
     * Determina classes CSS do slide baseado no estado
     */
    const getSlideClasses = () => {
        const baseClasses = 'pf-hero-slide';
        const stateClasses = [];

        if (isActive) {
            stateClasses.push('pf-hero-slide--active');
        } else if (isNext) {
            stateClasses.push('pf-hero-slide--next');
        } else if (isPrev) {
            stateClasses.push('pf-hero-slide--prev');
        }

        return `${baseClasses} ${stateClasses.join(' ')}`.trim();
    };

    /**
     * Determina scale da imagem baseado no estado (parallax)
     */
    const getImageScale = () => {
        if (isActive) {
            return 'scale-110'; // Scale maior quando ativo
        }
        return 'scale-100'; // Scale normal quando inativo
    };

    return (
        <div
            className={getSlideClasses()}
            aria-hidden={!isActive}
        >
            {/* Background Image with Parallax Effect */}
            <img
                src={bgImage}
                alt={title}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${getImageScale()}`}
                onError={handleBgImageError}
                style={{ objectFit: 'cover' }}
            />

            {/* Cinematic Overlay */}
            <div className="pf-hero-overlay" />

            {/* Content Container */}
            <div className="relative h-full flex items-center px-4 md:px-8 lg:px-12 max-w-7xl mx-auto z-10">
                <div className="max-w-2xl space-y-4 md:space-y-6">
                    {/* Title - Enhanced Typography */}
                    <h1
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-pf-text-primary tracking-tight leading-tight"
                        style={{
                            fontWeight: 900,
                            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        {title}
                    </h1>

                    {/* Description */}
                    {description && (
                        <p className="text-base md:text-lg lg:text-xl text-pf-text-secondary leading-relaxed line-clamp-3">
                            {description}
                        </p>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 flex flex-wrap items-center gap-3">
                        {/* Primary Play Button */}
                        <button
                            onClick={onPlay}
                            className="pf-btn-primary inline-flex items-center gap-3 text-lg"
                            aria-label={`Assistir ${title}`}
                            tabIndex={isActive ? 0 : -1}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <span>Assistir Agora</span>
                        </button>

                        {/* Additional Actions (optional) */}
                        {actions && actions.length > 0 && actions.map((action, index) => (
                            <button
                                key={index}
                                onClick={action.onClick}
                                className={getButtonClasses(action.variant || 'secondary')}
                                aria-label={action.label}
                                tabIndex={isActive ? 0 : -1}
                            >
                                {action.icon && (
                                    <span className="w-5 h-5 flex-shrink-0" aria-hidden="true">
                                        {action.icon}
                                    </span>
                                )}
                                <span>{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom fade for smooth transition to content below */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-pf-black to-transparent z-10" />
        </div>
    );
};

HeroFeaturedSlide.defaultProps = {
    description: '',
    isActive: false,
    isNext: false,
    isPrev: false,
    actions: null,
};

export default HeroFeaturedSlide;

