import './ThumbnailCard.css';

export function ThumbnailCard({ id, title, thumbnail, variant = 'compact' }) {
  const vid = id;
  const vClass = variant === 'featured' ? 'thumbnail-card--featured' : 'thumbnail-card--compact';
  const safeTitle = title || '';

  return `
    <div class="thumbnail-card ${vClass}" tabindex="0" role="button" data-id="${vid}" aria-label="${safeTitle}">
      <div class="thumb">
        <img src="${thumbnail}" alt="${safeTitle}" loading="lazy" />
        <div class="thumb-overlay">
          <i class="fas fa-play"></i>
        </div>
      </div>
      <div class="thumb-title">${safeTitle}</div>
    </div>
  `;
}

