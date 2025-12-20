import React from 'react';
// import PropTypes from 'prop-types';

/**
 * HeroFeatured - Hero principal da Home (Premium StreamIT Style)
 * 
 * Componente visual de destaque com imagem de fundo, overlay gradiente agressivo,
 * metadata badges (rating, duration, quality, stars), e call-to-action premium.
 * 
 * Suporta múltiplas ações opcionais além do botão Play padrão.
 * 
 * @component
 * @example
 * // Uso completo com metadata
 * <HeroFeatured
 *   title="Stranger Things"
 *   description="Quando um garoto desaparece..."
 *   image="https://example.com/hero.jpg"
 *   category="NOVO"
 *   rating="16+"
 *   duration="2h 15m"
 *   quality="4K"
 *   stars={4.5}
 *   onPlay={() => navigate('/player/123')}
 *   onTrailer={() => showTrailer()}
 * />
 */
const HeroFeatured = ({
    title,
    description,
    image,
    category,
    rating,
    duration,
    quality,
    stars = 0,
    onPlay,
    onTrailer,
    actions
}) => {
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
     * Renderiza estrelas baseado no rating
     */
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <svg key={`full-${i}`} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        }

        if (hasHalfStar) {
            stars.push(
                <svg key="half" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <defs>
                        <linearGradient id="half-star">
                            <stop offset="50%" stopColor="currentColor" />
                            <stop offset="50%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                    <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        }

        return stars;
    };

    return (
        <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${image})` }}
                aria-hidden="true"
            />

            {/* Enhanced Gradient Overlays - More aggressive for premium feel */}
            <div className="absolute inset-0 bg-gradient-to-r from-pf-black via-pf-black/95 to-pf-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-pf-black via-pf-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-pf-black/80" />

            {/* Content Container */}
            <div className="relative h-full flex items-center px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
                <div className="max-w-2xl space-y-4 md:space-y-6">
                    {/* Category Badge */}
                    {category && (
                        <div>
                            <span className="pf-badge-category">
                                {category}
                            </span>
                        </div>
                    )}

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

                    {/* Metadata Badges */}
                    {(rating || duration || quality || stars > 0) && (
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            {/* Age Rating */}
                            {rating && (
                                <div className="pf-badge-metadata">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span>{rating}</span>
                                </div>
                            )}

                            {/* Duration */}
                            {duration && (
                                <div className="pf-badge-metadata">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{duration}</span>
                                </div>
                            )}

                            {/* Quality Badge */}
                            {quality && (
                                <div className="pf-badge-metadata pf-badge-quality">
                                    <span>{quality}</span>
                                </div>
                            )}

                            {/* Star Rating */}
                            {stars > 0 && (
                                <div className="pf-star-rating">
                                    {renderStars(stars)}
                                </div>
                            )}
                        </div>
                    )}

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

                        {/* Trailer Button (Circular) */}
                        {onTrailer && (
                            <button
                                onClick={onTrailer}
                                className="pf-btn-trailer"
                                aria-label="Assistir Trailer"
                                title="Assistir Trailer"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </button>
                        )}

                        {/* Additional Actions (optional) */}
                        {actions && actions.length > 0 && actions.map((action, index) => (
                            <button
                                key={index}
                                onClick={action.onClick}
                                className={getButtonClasses(action.variant || 'secondary')}
                                aria-label={action.label}
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
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-pf-black to-transparent" />
        </div>
    );
};

HeroFeatured.defaultProps = {
    description: '',
    category: null,
    rating: null,
    duration: null,
    quality: null,
    stars: 0,
    onTrailer: null,
    actions: null,
};

export default HeroFeatured;
