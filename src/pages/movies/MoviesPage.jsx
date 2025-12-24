import React, { useState, useEffect } from 'react';
import { getByCategory } from '../../services/content.service';
import MovieCard from '../../components/features/MovieCard/MovieCard';
import FilterSidebar from '../../components/features/FilterSidebar/FilterSidebar';
import HeroFeatured from '../../components/HeroFeatured';
import { createRoot } from 'react-dom/client';

const MoviesPageApp = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [featuredMovie, setFeaturedMovie] = useState(null);

    // Detecta tema (Gato ou Cachorro) baseado na classe do body
    const species = document.body.classList.contains('theme-cat') ? 'cat' : 'dog';

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                // Busca filmes reais do Firebase
                const data = await getByCategory(species, 'movie');
                setMovies(data);

                // Escolhe um filme aleatório para ser o Destaque (Hero)
                if (data.length > 0) {
                    const random = data[Math.floor(Math.random() * data.length)];
                    setFeaturedMovie(random);
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
            {/* 1. HERO SECTION (Topo da Página com Filme Destaque) */}
            {featuredMovie && (
                <HeroFeatured
                    movie={featuredMovie}
                    title={featuredMovie.title}
                    description={featuredMovie.description}
                    image={featuredMovie.thumbnail || featuredMovie.image}
                    // Dados visuais para manter o padrão premium
                    category={featuredMovie.category || "Destaque"}
                    rating="16+"
                    duration="2h 15m"
                    quality="4K"
                    stars={5}
                />
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
