import React, { useState, useEffect } from 'react';
import { getByCategory, getByGenre, getAll } from '../../services/content.service.js';
import { toggleItem, getList } from '../../services/list.service.js';
import { Toast } from '../../utils/toast.js';
import HeroFeaturedCarousel from '../HeroFeaturedCarousel.jsx';
import ContentRail from '../ContentRail.jsx';
import ContentCard from '../ContentCard.jsx';
import { navigateTo } from '../../router/navigator.js';

const CategoryPageTemplate = ({ category, title, genres = [] }) => {
  const [loading, setLoading] = useState(true);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [railData, setRailData] = useState([]);
  const [myListIds, setMyListIds] = useState(new Set());
  
  // Melhor detecção de espécie sincronizada com o body e localStorage
  const [species] = useState(() => {
    return localStorage.getItem('petflix_selected_species') || 
           (document.body.classList.contains('theme-cat') ? 'cat' : 'dog');
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Carregar IDs da Minha Lista para o estado reativo
        const currentList = await getList();
        setMyListIds(new Set(currentList.map(i => i.id || i.videoId)));

        // 1. Carregar todos os itens da categoria
        const allItems = await getByCategory(species, category);
        
        // 2. Definir destaques (Hero)
        if (allItems.length > 0) {
          const shuffled = [...allItems].sort(() => 0.5 - Math.random());
          setFeaturedItems(shuffled.slice(0, 5).map(mapHero));
        }

        // 3. Organizar rails
        const rails = [];
        
        // Sempre adiciona o trilho principal
        if (allItems.length > 0) {
          rails.push({
            title: `Todos os ${title}`,
            items: allItems.map(mapCard)
          });
        }

        // Adiciona rails por gênero
        if (genres.length > 0) {
          for (const genre of genres) {
            const genreItems = await getByGenre(species, genre.id);
            const filtered = genreItems.filter(i => i.type === category || i.category === category);
            
            if (filtered.length > 0) {
              rails.push({
                title: genre.name,
                items: filtered.map(mapCard)
              });
            }
          }
        }

        setRailData(rails);
      } catch (error) {
        console.error(`[CategoryPage] Erro ao carregar ${category}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [species, category, title]);

  if (loading && railData.length === 0) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/5 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Sincronizando catálogo...</p>
        </div>
      </div>
    );
  }

  const hasFeatured = featuredItems.length > 0;

  const handleToggleList = async (item) => {
    const itemId = item.id || item.videoId;
    const wasAdded = myListIds.has(itemId);
    
    // Feedback instantâneo na UI
    setMyListIds(prev => {
      const next = new Set(prev);
      if (wasAdded) next.delete(itemId);
      else next.add(itemId);
      return next;
    });

    try {
      const movieData = {
        id: itemId,
        videoId: itemId,
        title: item.title,
        thumbnail: item.thumbnail || item.image
      };
      const added = await toggleItem(movieData);
      if (added) {
        Toast.success(`"${item.title}" adicionado à lista`);
      } else {
        Toast.info(`"${item.title}" removido da lista`);
      }
    } catch (error) {
      // Reverter em caso de erro
      setMyListIds(prev => {
        const next = new Set(prev);
        if (wasAdded) next.add(itemId);
        else next.delete(itemId);
        return next;
      });
      console.error('Erro ao atualizar lista:', error);
      Toast.error('Erro ao atualizar lista');
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] pb-20">
      {hasFeatured && <HeroFeaturedCarousel items={featuredItems} />}
      
      {/* Só aplica o degradê de sobreposição se houver um Hero */}
      {hasFeatured ? (
        <div className="h-24 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent relative z-10 -mt-24"></div>
      ) : (
        <div className="h-24"></div> /* Espaçador para não bater na Navbar */
      )}

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
                onAddToList={() => handleToggleList(item)}
                isAdded={myListIds.has(item.id || item.videoId)}
              />
            )}
          />
        ))}
      </div>
      
      {railData.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-40 text-center animate-fade-in">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-zinc-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Ops! Nenhum {title.toLowerCase().slice(0, -1)} encontrado.</h2>
          <p className="text-gray-500 max-w-sm mb-8">
            Parece que você ainda não cadastrou {title.toLowerCase()} para este pet no seu painel administrativo.
          </p>
          <button 
            onClick={() => navigateTo('/admin')}
            className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
          >
            Ir para Painel Administrativo
          </button>
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
