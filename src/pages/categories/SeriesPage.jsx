import React from 'react';
import { createRoot } from 'react-dom/client';
import CategoryPageTemplate from '../../components/templates/CategoryPageTemplate.jsx';

const SeriesPageApp = () => {
  const genres = [
    { id: 'action', name: 'Aventura' },
    { id: 'comedy', name: 'Diversão' },
    { id: 'drama', name: 'Emocionantes' }
  ];

  return <CategoryPageTemplate category="series" title="Séries" genres={genres} />;
};

export async function render() {
  return '<div id="series-root"></div>';
}

export function init() {
  const rootElement = document.getElementById('series-root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<SeriesPageApp />);
  }
}

export default { render, init };
