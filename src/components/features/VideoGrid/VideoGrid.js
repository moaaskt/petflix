/**
 * VideoGrid Component - Grid de vídeos
 */
import { VideoCard } from '../VideoCard/VideoCard.js';

export class VideoGrid {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.videos = [];
    this.onVideoClick = options.onVideoClick || null;
    this.columns = options.columns || 'auto-fill';
    this.minColumnWidth = options.minColumnWidth || 220;
  }

  /**
   * Renderiza o grid
   * @param {Array} videos - Array de vídeos
   */
  render(videos = this.videos) {
    if (!this.container) {
      console.error('Container não encontrado');
      return;
    }

    this.videos = videos;
    this.clear();

    if (videos.length === 0) {
      this.container.innerHTML = '<p class="video-grid__empty">Nenhum vídeo encontrado.</p>';
      return;
    }

    videos.forEach(video => {
      const card = new VideoCard(video, {
        onClick: this.onVideoClick
      });
      this.container.appendChild(card.render());
    });
  }

  /**
   * Limpa o grid
   */
  clear() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  /**
   * Adiciona vídeos ao grid
   * @param {Array} videos - Vídeos a adicionar
   */
  addVideos(videos) {
    videos.forEach(video => {
      const card = new VideoCard(video, {
        onClick: this.onVideoClick
      });
      if (this.container) {
        this.container.appendChild(card.render());
      }
    });
    this.videos = [...this.videos, ...videos];
  }
}

export default VideoGrid;

