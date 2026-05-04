import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { getTrending } from '../services/content.service.js';
import ContentCard from '../components/ContentCard.jsx';
import { navigateTo } from '../router/navigator.js';
import { AppState } from '../state/AppState.js';

const TrendingPageApp = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [species, setSpecies] = useState(() => {
    const state = AppState.getState();
    return state.petType || localStorage.getItem('petflix_selected_species') || 'dog';
  });

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const data = await getTrending(species);
        setItems(data);
      } catch (error) {
        console.error('Erro ao carregar tendências:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [species]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-600 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] pt-28 pb-20 px-4 md:px-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4">Bombando</h1>
        <p className="text-gray-400 text-lg">Os títulos mais assistidos pelos {species === 'dog' ? 'cães' : 'gatos'} esta semana.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-6">
        {items.map((item, index) => (
          <div key={item.id || item.videoId} className="relative group">
            <div className="absolute -left-6 -top-4 text-8xl font-black text-white/10 group-hover:text-red-600/20 transition-colors z-0 select-none">
              {index + 1}
            </div>
            <div className="relative z-10">
              <ContentCard
                title={item.title}
                image={item.thumbnail || item.image}
                onPlay={() => navigateTo(`/player?videoId=${item.videoId || item.id}`)}
              />
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-40">
          <p className="text-gray-500 text-xl">Nenhum conteúdo em alta no momento.</p>
        </div>
      )}
    </div>
  );
};

export async function render() {
  return '<div id="trending-root"></div>';
}

export function init() {
  const rootElement = document.getElementById('trending-root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<TrendingPageApp />);
  }
}

export default { render, init };
