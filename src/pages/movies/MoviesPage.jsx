import React, { useState, useEffect } from 'react';
import { getByCategory } from '../../services/content.service';
import MovieCard from '../../components/features/MovieCard/MovieCard';
import FilterSidebar from '../../components/features/FilterSidebar/FilterSidebar';
import HeroFeaturedCarousel from '../../components/HeroFeaturedCarousel.jsx';
import { navigateTo } from '../../router/navigator.js';
import { toggleItem } from '../../services/list.service.js';
import { Toast } from '../../utils/toast.js';
import { createRoot } from 'react-dom/client';

// --- React Components ---

const MoviesHeroCarousel = ({ items }) => {
  const normalizedItems = items
    .filter(item => item.type === 'movie') // Garantir apenas filmes
    .map(item => {
      const itemId = item.id || item.videoId;
      
      return {
        id: itemId,
        title: item.title || '',
        description: item.description || item.synopsis || '',
        image: item.thumbnail || item.image || '',
        category: item.category || 'FILME',
        rating: item.rating || '16+',
        duration: item.duration || '2h 15m',
        quality: item.quality || '4K',
        stars: item.stars || 4.5,
        onPlay: () => navigateTo(`/player?videoId=${itemId}`),
        onTrailer: () => {
          Toast.info('🎬 Trailer em breve!');
        },
        actions: [
          {
            label: 'Minha Lista',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            ),
            onClick: async () => {
              try {
                const movieData = {
                  id: itemId,
                  videoId: itemId,
                  title: item.title,
                  thumbnail: item.thumbnail || item.image,
                  image: item.thumbnail || item.image
                };
                const added = await toggleItem(movieData);
                if (added) {
                  Toast.success(`${item.title} adicionado à lista`);
                } else {
                  Toast.info(`${item.title} removido da lista`);
                }
              } catch (error) {
                console.error('Erro ao atualizar lista:', error);
                Toast.error('Erro ao atualizar lista');
              }
            },
            variant: 'secondary'
          },
          {
            label: 'Mais Info',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            onClick: () => {
              Toast.info('Mais informações em breve');
            },
            variant: 'ghost'
          }
        ]
      };
    });

  if (!normalizedItems || normalizedItems.length === 0) {
    return null;
  }

  return <HeroFeaturedCarousel items={normalizedItems} />;
};

const MoviesPageApp = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [featuredMovies, setFeaturedMovies] = useState([]);

    // Detecta tema (Gato ou Cachorro) baseado na classe do body
    const species = document.body.classList.contains('theme-cat') ? 'cat' : 'dog';

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                
                // Buscar apenas filmes do catálogo (garante filmes diferentes da Dashboard)
                const moviesData = await getByCategory(species, 'movie');
                setMovies(moviesData);

                // Embaralhar e pegar primeiros 5 para o carrossel
                if (moviesData.length > 0) {
                    const shuffled = [...moviesData].sort(() => Math.random() - 0.5);
                    const featuredMovies = shuffled.slice(0, Math.min(5, shuffled.length));
                    setFeaturedMovies(featuredMovies);
                }
            } catch (err) {
                console.error('Erro ao carregar filmes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [species]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#141414]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#141414] text-white">
            {/* 1. HERO SECTION (Topo da Página com Carrossel de Filmes Destaque) */}
            {featuredMovies.length > 0 && (
                <MoviesHeroCarousel items={featuredMovies} />
            )}

            {/* 2. LAYOUT PRINCIPAL (Sidebar + Grid) */}
            <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8 relative z-10">

                {/* Sidebar (Filtros) - Visível apenas em Desktop */}
                <aside className="hidden lg:block w-64 shrink-0">
                    <div className="sticky top-24">
                        <FilterSidebar />
                    </div>
                </aside>

                {/* Conteúdo Principal */}
                <main className="flex-1">
                    <header className="mb-6 flex justify-between items-end border-b border-gray-800 pb-4">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-2">Catálogo de Filmes</h2>
                            <p className="text-gray-400 text-sm">{movies.length} títulos disponíveis para assistir</p>
                        </div>
                    </header>

                    {/* GRID SYSTEM: Responsivo e com Gap correto */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {movies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                id={movie.id}
                                title={movie.title}
                                image={movie.thumbnail || movie.image}
                                // Garante que o play funcione
                                onPlay={() => window.location.hash = `/player/${movie.id}`}
                            />
                        ))}
                    </div>

                    {movies.length === 0 && !loading && (
                        <div className="text-center py-20 text-gray-500">
                            Nenhum filme encontrado nesta categoria.
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

// Funções de integração com o Router Vanilla (MANTENHA ISSO)
export async function render() {
    return '<div id="movies-root"></div>';
}

export function init() {
    const rootElement = document.getElementById('movies-root');
    if (rootElement) {
        const root = createRoot(rootElement);
        root.render(<MoviesPageApp />);
    }
}
