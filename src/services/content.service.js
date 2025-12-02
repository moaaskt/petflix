export const ALL_CONTENT = [
  { id: 'Ws-9ra38AlI', title: 'Marley & Eu', image: 'assets/benji1.jpg', type: 'movie', videoId: 'Ws-9ra38AlI' },
  { id: 'ki8wHMR-yOI', title: 'Beethoven', image: 'assets/betown.jpg', type: 'movie', videoId: 'ki8wHMR-yOI' },
  { id: 'UqtFvSKhKmA', title: 'K-9', image: 'assets/filmedog7.jpg', type: 'movie', videoId: 'UqtFvSKhKmA' },
  { id: 'UFY8vW5IedY', title: 'Sempre ao Seu Lado', image: 'assets/caminho-de-casa.jpg', type: 'movie', videoId: 'UFY8vW5IedY' },
  { id: '6pbreU5ChmA', title: 'Gato de Botas', image: 'assets/capa-filme-gato-de-botas-2-o-ultimo-pedido-1f766-large.jpg', type: 'movie', videoId: '6pbreU5ChmA' },
  { id: 'JxS5E-kZc2s', title: 'Oliver & Companhia', image: 'assets/seriesgato2.jpg', type: 'movie', videoId: 'JxS5E-kZc2s' },
  { id: '1jLOOCADTGs', title: 'A Dog\'s Purpose', image: 'assets/Dog-a-aventura-de-uma-vida-2.jpg', type: 'movie', videoId: '1jLOOCADTGs' },
  { id: 'MjbKt2bVFec', title: 'Aventuras Caninas', image: 'assets/g-Dogway2.jpg', type: 'movie', videoId: 'MjbKt2bVFec' },
  { id: 'pqgo9bW7cmk', title: 'Gatos Engraçados', image: 'assets/gato3.jpg', type: 'movie', videoId: 'pqgo9bW7cmk' }
];

export function searchContent(query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return [];
  return ALL_CONTENT.filter(item => (item.title || '').toLowerCase().includes(q)).slice(0, 20);
}

export default { ALL_CONTENT, searchContent };
