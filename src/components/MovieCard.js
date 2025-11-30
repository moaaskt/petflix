import '../styles/components/movie-card.css';

export function MovieCard({ title = '', thumbnail = '', videoId = '' } = {}) {
  const safeTitle = title || '';
  const safeThumb = thumbnail || '';
  return `
    <div class="movie-card" data-video-id="${videoId}">
      <img src="${safeThumb}" alt="${safeTitle}" loading="lazy" />
      <div class="mc-overlay"></div>
      <button class="mc-play-btn" aria-label="Assistir">▶</button>
      ${safeTitle ? `<span class="mc-title">${safeTitle}</span>` : ''}
    </div>
  `;
}

