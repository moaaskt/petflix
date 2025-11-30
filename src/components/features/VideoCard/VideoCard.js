/**
 * VideoCard Component - Card de vídeo reutilizável
 */
export class VideoCard {
  constructor(video, options = {}) {
    this.video = video;
    this.onClick = options.onClick || null;
    this.showPlayIcon = options.showPlayIcon !== false;
  }

  /**
   * Renderiza o card
   * @returns {HTMLElement} Elemento do card
   */
  render() {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.setAttribute('data-video-id', this.video.id);
    
    const thumbUrl = this.video.thumb?.url || this.video.thumb || '';
    
    card.innerHTML = `
      <div class="video-card__image-wrapper">
        <img 
          src="${thumbUrl}" 
          alt="${this.video.title || ''}" 
          class="video-card__thumbnail"
          loading="lazy"
        />
        ${this.showPlayIcon ? '<div class="video-card__play-icon"><i class="fas fa-play"></i></div>' : ''}
      </div>
      <div class="video-card__meta">
        <div class="video-card__title">${this.video.title || ''}</div>
        ${this.video.channelTitle ? `<div class="video-card__channel">${this.video.channelTitle}</div>` : ''}
      </div>
    `;

    if (this.onClick) {
      card.addEventListener('click', () => this.onClick(this.video.id));
      card.style.cursor = 'pointer';
    }

    return card;
  }

  /**
   * Renderiza múltiplos cards
   * @param {Array} videos - Array de vídeos
   * @param {Function} onClick - Callback ao clicar
   * @returns {Array<HTMLElement>} Array de elementos
   */
  static renderMultiple(videos, onClick) {
    return videos.map(video => {
      const card = new VideoCard(video, { onClick });
      return card.render();
    });
  }
}

export default VideoCard;









