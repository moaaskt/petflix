/**
 * DashboardPage - Página principal unificada
 * Refatorada para React + Design System
 */
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { useAuth } from '../../hooks/useAuth.js';
import { navigateTo } from '../../router/navigator.js';
import HeroFeatured from '../../components/HeroFeatured.jsx';
import ContentRail from '../../components/ContentRail.jsx';
import ContentCard from '../../components/ContentCard.jsx';
import { LoadingSpinner } from '../../components/ui/Loading/LoadingSpinner.js';
import { getFeatured, getByCategory, getByGenre, getTrending } from '../../services/content.service.js';
import { toggleItem, isInList } from '../../services/list.service.js';
import { Toast } from '../../utils/toast.js';

// --- React Components ---

const DashboardHero = ({ item }) => {
  const [inList, setInList] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (item?.id) {
      isInList(item.id).then(result => {
        if (mounted) setInList(result);
      });
    }
    return () => { mounted = false; };
  }, [item]);

  const handleToggleList = async () => {
    if (!item) return;
    try {
      // Mapear dados para formato esperado pelo list.service
      const movieData = {
        id: item.id || item.videoId,
        videoId: item.id || item.videoId,
        title: item.title,
        thumbnail: item.thumbnail || item.image,
        image: item.thumbnail || item.image
      };

      const added = await toggleItem(movieData);
      setInList(added);

      if (added) {
        Toast.success(`${item.title} adicionado à lista`);
      } else {
        Toast.info(`${item.title} removido da lista`);
      }
    } catch (error) {
      console.error('Erro ao atualizar lista:', error);
      Toast.error('Erro ao atualizar lista');
    }
  };

  const handleMoreInfo = () => {
    // Placeholder para futuro modal
    console.log('Mais info:', item);
    Toast.info('Mais informações em breve');
  };

  const handleTrailer = () => {
    console.log('Trailer:', item);
    Toast.info('🎬 Trailer em breve!');
  };

  if (!item) return null;

  return (
    <HeroFeatured
      title={item.title}
      description={item.description || ''} // Garantir string vazia se undefined
      image={item.thumbnail || item.image}
      category="NOVO"
      rating="16+"
      duration="2h 15m"
      quality="4K"
      stars={4.5}
      onPlay={() => navigateTo(`/player?videoId=${item.id}`)}
      onTrailer={handleTrailer}
      actions={[
        {
          label: inList ? 'Remover da Lista' : 'Minha Lista',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {inList ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              )}
            </svg>
          ),
          onClick: handleToggleList,
          variant: 'secondary'
        },
        {
          label: 'Mais Info',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          onClick: handleMoreInfo,
          variant: 'ghost'
        }
      ]}
    />
  );
};

const DashboardApp = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState(null);
  const [categories, setCategories] = useState([]);
  const [species, setSpecies] = useState('dog');

  // Determinar espécie
  useEffect(() => {
    const isCat = document.body.classList.contains('theme-cat');
    setSpecies(isCat ? 'cat' : 'dog');
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

        // Carregar destaque
        const featuredData = await getFeatured(species);
        if (featuredData) {
          setFeatured(mapHero(featuredData));
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

        // Definir categorias baseadas na espécie
        if (species === 'cat') {
          setCategories([
            { title: 'Populares na Petflix', items: mapItems(trending) },
            { title: 'Gatos Planejando o Caos', items: mapItems([...action, ...adventure].slice(0, 20)) },
            { title: 'Soneca da Tarde', items: mapItems(docs) },
            { title: 'Comédias Felinas', items: mapItems(comedy) },
            { title: 'Séries para Maratonar', items: mapItems(series) }
          ]);
        } else {
          setCategories([
            { title: 'Em Alta Hoje', items: mapItems(trending) },
            { title: 'Aventuras no Parque', items: mapItems([...action, ...adventure].slice(0, 20)) },
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

  if (loading && !featured) {
    return <div className="min-h-screen bg-[#141414]"></div>;
  }

  return (
    <div className="min-h-screen bg-[#141414] pb-20">
      {featured && <DashboardHero item={featured} />}

      {/* Spacer gradient similar ao original */}
      <div className="h-12 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent relative z-10 -mt-12"></div>

      <div className="space-y-4 relative z-20">
        {categories.map((category, index) => (
          <ContentRail
            key={index}
            title={category.title}
            items={category.items}
            renderItem={(item) => (
              <ContentCard
                key={item.id}
                title={item.title}
                image={item.thumbnail}
                onPlay={() => navigateTo(`/player?videoId=${item.id}`)}
              />
            )}
          />
        ))}
      </div>
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
