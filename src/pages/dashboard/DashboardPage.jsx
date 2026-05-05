/**
 * DashboardPage - Página principal unificada
 * Refatorada para React + Design System
 */
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { useAuth } from '../../hooks/useAuth.js';
import { navigateTo } from '../../router/navigator.js';
import HeroFeatured from '../../components/HeroFeatured.jsx';
import HeroFeaturedCarousel from '../../components/HeroFeaturedCarousel.jsx';
import ContentRail from '../../components/ContentRail.jsx';
import ContentCard from '../../components/ContentCard.jsx';
import { LoadingSpinner } from '../../components/ui/Loading/LoadingSpinner.js';
import { getFeatured, getFeaturedMultiple, getByCategory, getByGenre, getTrending } from '../../services/content.service.js';
import { toggleItem, isInList, getList } from '../../services/list.service.js';
import { AppState } from '../../state/AppState.js';
import { ratingService } from '../../services/rating.service.js';
import { Toast } from '../../utils/toast.js';
import ContentDetailModal from '../../components/modals/ContentDetailModal.jsx';

// --- React Components ---

const DashboardHeroCarousel = ({ items, myListIds, onToggleList, onMoreInfo }) => {
  const normalizedItems = items.map(item => {
    const itemId = item.id || item.videoId;
    const isInList = myListIds.has(itemId);
    
    return {
      id: itemId,
      title: item.title || '',
      description: item.description || item.synopsis || '',
      image: item.thumbnail || item.image || '',
      category: item.category || 'NOVO',
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
          label: isInList ? 'Na Minha Lista' : 'Minha Lista',
          icon: isInList ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ),
          onClick: () => onToggleList(item),
          variant: isInList ? 'primary' : 'secondary'
        },
        {
          label: 'Mais Info',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          onClick: () => onMoreInfo(item),
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

const DashboardApp = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [myListIds, setMyListIds] = useState(new Set());
  
  // Estado do Modal de Detalhes
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  
  // Inicializa com o tipo de pet do estado global ou localStorage
  const [species, setSpecies] = useState(() => {
    const state = AppState.getState();
    return state.petType || localStorage.getItem('petflix_selected_species') || 'dog';
  });

  // Verificar se o perfil está selecionado, caso contrário volta para home
  useEffect(() => {
    const state = AppState.getState();
    const savedSpecies = localStorage.getItem('petflix_selected_species');
    
    if (!state.petType && !savedSpecies) {
      console.warn('Nenhum perfil selecionado. Redirecionando para seleção...');
      navigateTo('/home');
    } else {
      // Pre-carrega todas as avaliações do perfil para performance
      ratingService.preloadRatings();
    }
  }, []);

  // Determinar espécie e sincronizar com o tema do body
  useEffect(() => {
    const isCat = document.body.classList.contains('theme-cat');
    const currentSpecies = isCat ? 'cat' : 'dog';
    if (currentSpecies !== species) {
      setSpecies(currentSpecies);
    }
  }, []);

  // Verificar auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChange((user) => {
      if (!user) navigateTo('/login');
    });
    return () => unsubscribe();
  }, [auth]);

  // Carregar dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Carregar IDs da Minha Lista para o estado reativo
        const currentList = await getList();
        setMyListIds(new Set(currentList.map(i => i.id || i.videoId)));

        // Carregar destaques para o carrossel
        const featuredData = await getFeaturedMultiple(species, 5);
        if (featuredData && featuredData.length > 0) {
          const mappedItems = featuredData.map(mapHero).filter(item => item !== null);
          setFeaturedItems(mappedItems);
        }

        // Carregar categorias em paralelo
        const [
          trending,
          action,
          adventure,
          comedy,
          drama,
          series,
          docs,
          movies
        ] = await Promise.all([
          getTrending(species),
          getByGenre(species, 'action'),
          getByGenre(species, 'adventure'),
          getByGenre(species, 'comedy'),
          getByGenre(species, 'drama'),
          getByCategory(species, 'series'),
          getByCategory(species, 'doc'),
          getByCategory(species, 'movie')
        ]);

        // Mapear dados das categorias
        const mapItems = (items) => items.map(mapCard);

        // Função para remover duplicatas
        const deduplicate = (items) => {
          const seen = new Set();
          return items.filter(item => {
            const id = item.videoId || item.id;
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
          });
        };

        const uniqueActionAdventure = deduplicate([...action, ...adventure]);

        // Definir categorias baseadas na espécie
        if (species === 'cat') {
          setCategories([
            { title: 'Populares na Petflix', items: mapItems(trending) },
            { title: 'Gatos Planejando o Caos', items: mapItems(uniqueActionAdventure.slice(0, 20)) },
            { title: 'Soneca da Tarde', items: mapItems(docs) },
            { title: 'Comédias Felinas', items: mapItems(comedy) },
            { title: 'Séries para Maratonar', items: mapItems(series) }
          ]);
        } else {
          setCategories([
            { title: 'Em Alta Hoje', items: mapItems(trending) },
            { title: 'Aventuras no Parque', items: mapItems(uniqueActionAdventure.slice(0, 20)) },
            { title: 'Bons Garotos', items: mapItems(drama) },
            { title: 'Histórias de Adoção', items: mapItems(docs) },
            { title: 'Filmes para toda a família', items: mapItems(movies) }
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
        // Remove loading overlay se existir
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.remove();
      }
    };

    fetchData();
  }, [species]);

  // Handler de scroll nav
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        navbar.classList.toggle('bg-black/80', window.scrollY > 50);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading && featuredItems.length === 0) {
    return <div className="min-h-screen bg-[#141414]"></div>;
  }

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
        thumbnail: item.thumbnail || item.image,
        backdrop: item.backdrop || item.thumbnail || item.image
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
      <DashboardHeroCarousel 
        items={featuredItems} 
        myListIds={myListIds} 
        onToggleList={handleToggleList} 
        onMoreInfo={(item) => {
          setSelectedContent(item);
          setIsDetailModalOpen(true);
        }}
      />

      <div className="space-y-12 relative z-20 -mt-24">
        {categories.map((category, index) => (
          <ContentRail
            key={index}
            title={category.title}
            items={category.items}
            renderItem={(item) => (
              <ContentCard
                key={item.id}
                id={item.id}
                title={item.title}
                image={item.thumbnail}
                onPlay={() => navigateTo(`/player?videoId=${item.id}`)}
                onAddToList={() => handleToggleList(item)}
                onMoreInfo={() => {
                  setSelectedContent(item);
                  setIsDetailModalOpen(true);
                }}
                isAdded={myListIds.has(item.id || item.videoId)}
              />
            )}
          />
        ))}
      </div>

      {/* Modal de Detalhes */}
      <ContentDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        content={selectedContent}
        onPlay={(c) => navigateTo(`/player?videoId=${c.id || c.videoId}`)}
        onToggleList={handleToggleList}
        isAdded={selectedContent ? myListIds.has(selectedContent.id || selectedContent.videoId) : false}
      />
    </div>
  );
};

// --- Mappers Helper Functions ---

function mapCard(item) {
  return {
    id: item.videoId || item.id,
    title: item.title,
    thumbnail: item.thumbnail || item.image || '/assets/poster-placeholder.jpg'
  };
}

function mapHero(item) {
  if (!item) return null;
  return {
    id: item.videoId || item.id,
    title: item.title,
    description: item.description || item.synopsis || '',
    thumbnail: item.thumbnail || item.image || '/assets/hero-fallback.jpg'
  };
}

// --- Exports para o Navigator ---

export async function render() {
  return '<div id="dashboard-root"></div>';
}

export function init() {
  const rootElement = document.getElementById('dashboard-root');
  if (rootElement) {
    // Usar createRoot para React 18+
    const root = createRoot(rootElement);
    root.render(<DashboardApp />);
  }
}
