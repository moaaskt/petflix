import React from 'react';
import { createRoot } from 'react-dom/client';
import CategoryPageTemplate from '../../components/templates/CategoryPageTemplate.jsx';

const MoviesPageApp = () => {
  const genres = [
    { id: 'action', name: 'Ação e Aventura' },
    { id: 'comedy', name: 'Comédias' },
    { id: 'drama', name: 'Drama' }
  ];

  return <CategoryPageTemplate category="movie" title="Filmes" genres={genres} />;
};

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

export default { render, init };
