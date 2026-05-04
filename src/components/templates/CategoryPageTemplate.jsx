import React, { useState, useEffect } from 'react';
import { getByCategory, getByGenre } from '../../services/content.service.js';
import HeroFeaturedCarousel from '../HeroFeaturedCarousel.jsx';
import ContentRail from '../ContentRail.jsx';
import ContentCard from '../ContentCard.jsx';
import { LoadingSpinner } from '../ui/Loading/LoadingSpinner.js';
import { navigateTo } from '../../router/navigator.js';
import { AppState } from '../../state/AppState.js';

const CategoryPageTemplate = ({ category, title, genres = [] }) => {
  const [loading, setLoading] = useState(true);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [railData, setRailData] = useState([]);
  const [species, setSpecies] = useState(() => {
    const state = AppState.getState();
    return state.petType || localStorage.getItem('petflix_selected_species') || 'dog';
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Carregar todos os itens da categoria
        const allItems = await getByCategory(species, category);
        
        // 2. Definir destaques (Hero) - Random 5
        if (allItems.length > 0) {
          const shuffled = [...allItems].sort(() => 0.5 - Math.random());
          setFeaturedItems(shuffled.slice(0, 5).map(mapHero));
        }

        // 3. Organizar rails
        const rails = [];
        
        // Sempre adiciona o trilho "Todos os [Title]"
        rails.push({
          title: `Todos os ${title}`,
          items: allItems.map(mapCard)
        });

        // Adiciona rails por gênero se fornecido
        if (genres.length > 0) {
          const genrePromises = genres.map(async (genre) => {
            const items = await getByGenre(species, genre.id);
            // Filtra para garantir que o conteúdo do gênero pertence à categoria (filme/série)
            const filteredItems = items.filter(i => i.category === category || i.type === category);
            if (filteredItems.length > 0) {
              return {
                title: genre.name,
                items: filteredItems.map(mapCard)
              };
            }
            return null;
          });

          const genreRails = await Promise.all(genrePromises);
          rails.push(...genreRails.filter(r => r !== null));
        }

        setRailData(rails);
      } catch (error) {
        console.error(`Erro ao carregar categoria ${category}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [species, category]);

  if (loading && featuredItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-600 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] pb-20">
      {featuredItems.length > 0 && <HeroFeaturedCarousel items={featuredItems} />}
      
      <div className="h-24 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent relative z-10 -mt-24"></div>

      <div className="space-y-12 relative z-20 px-4 md:px-0">
        {railData.map((rail, index) => (
          <ContentRail
            key={index}
            title={rail.title}
            items={rail.items}
            renderItem={(item) => (
              <ContentCard
                key={item.id}
                id={item.id}
                title={item.title}
                image={item.thumbnail}
                onPlay={() => navigateTo(`/player?videoId=${item.id}`)}
              />
            )}
          />
        ))}
      </div>
      
      {railData.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-40 text-center">
          <p className="text-gray-500 text-xl">Nenhum conteúdo encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  );
};

// --- Mappers ---

function mapCard(item) {
  return {
    id: item.videoId || item.id,
    title: item.title,
    thumbnail: item.thumbnail || item.image || '/assets/poster-placeholder.jpg'
  };
}

function mapHero(item) {
  return {
    id: item.videoId || item.id,
    title: item.title,
    description: item.description || item.synopsis || '',
    thumbnail: item.thumbnail || item.image || '/assets/hero-fallback.jpg',
    category: item.category?.toUpperCase() || 'DESTAQUE',
    onPlay: () => navigateTo(`/player?videoId=${item.videoId || item.id}`)
  };
}

export default CategoryPageTemplate;
