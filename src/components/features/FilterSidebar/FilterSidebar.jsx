import React from 'react';

/**
 * FilterSidebar - Visual filter panel for movies page
 * 
 * Left sidebar with filter categories (visual only for now).
 * Hidden on mobile/tablet, visible on desktop (lg+).
 * 
 * Future enhancement: Add actual filter logic to filter movies by genre, year, etc.
 * 
 * @component
 */
const FilterSidebar = () => {
    const genres = ['Ação', 'Aventura', 'Comédia', 'Drama', 'Documentário'];
    const years = ['2024', '2023', '2022', '2021', '2020'];

    return (
        <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
                {/* Categories Section */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                    <h3 className="text-white font-semibold text-lg mb-4">Categorias</h3>
                    <div className="space-y-2">
                        {genres.map((genre) => (
                            <button
                                key={genre}
                                className="w-full text-left px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Year Filter Section */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                    <h3 className="text-white font-semibold text-lg mb-4">Ano</h3>
                    <div className="space-y-2">
                        {years.map((year) => (
                            <button
                                key={year}
                                className="w-full text-left px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info Note */}
                <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3">
                    <p className="text-xs text-blue-300">
                        💡 Filtros visuais - A lógica de filtragem será implementada em breve
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;
