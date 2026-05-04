import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { getList, toggleItem } from '../services/list.service.js';
import ContentCard from '../components/ContentCard.jsx';
import { navigateTo } from '../router/navigator.js';
import { Toast } from '../utils/toast.js';

const MyListPageApp = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadList = async () => {
    try {
      setLoading(true);
      const data = await getList();
      setItems(data || []);
    } catch (error) {
      console.error('Erro ao carregar lista:', error);
      Toast.error('Erro ao carregar sua lista');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleRemove = async (e, item) => {
    e.stopPropagation();
    try {
      const movieData = {
        id: item.videoId || item.id,
        videoId: item.videoId || item.id,
        title: item.title,
        thumbnail: item.thumbnail || item.image
      };
      
      const wasAdded = await toggleItem(movieData);
      if (!wasAdded) {
        Toast.info(`"${item.title}" removido da lista`);
        // Atualiza a lista local removendo o item para feedback instantâneo
        setItems(prev => prev.filter(i => (i.id || i.videoId) !== (item.id || item.videoId)));
      }
    } catch (error) {
      console.error('Erro ao remover item:', error);
      Toast.error('Erro ao remover item');
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-600 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] pt-28 pb-20 px-4 md:px-12">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Minha Lista</h1>
          <p className="text-gray-400">Conteúdos salvos para você assistir depois.</p>
        </div>
        {items.length > 0 && (
          <span className="text-gray-500 text-sm font-medium uppercase tracking-widest">
            {items.length} {items.length === 1 ? 'título' : 'títulos'}
          </span>
        )}
      </header>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-6">
          {items.map((item) => (
            <div key={item.id || item.videoId} className="relative group">
              <ContentCard
                id={item.id || item.videoId}
                title={item.title}
                image={item.thumbnail || item.image}
                onPlay={() => navigateTo(`/player?videoId=${item.videoId || item.id}`)}
              />
              {/* Botão de remoção rápida que aparece no hover */}
              <button 
                onClick={(e) => handleRemove(e, item)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-30"
                title="Remover da lista"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" class="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-24 h-24 mb-6 text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Sua lista está vazia</h2>
          <p className="text-gray-400 max-w-md mb-8">
            Adicione filmes e séries clicando no ícone de "+" nos cards para salvá-los aqui.
          </p>
          <button 
            onClick={() => navigateTo('/dashboard')}
            className="bg-white text-black font-bold px-8 py-3 rounded hover:bg-gray-200 transition-colors"
          >
            Explorar Conteúdo
          </button>
        </div>
      )}
    </div>
  );
};

export async function render() {
  return '<div id="mylist-root"></div>';
}

export function init() {
  const rootElement = document.getElementById('mylist-root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<MyListPageApp />);
  }
}

export default { render, init };
