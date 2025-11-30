/**
 * VideoPlayer Component - Player de vídeo do YouTube
 */
import { youtubeService } from '../../../services/api/youtube.service';

export class VideoPlayer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.currentVideoId = null;
    this.options = {
      autoplay: options.autoplay !== false,
      showRelated: options.showRelated === true,
      ...options
    };
  }

  /**
   * Carrega e reproduz vídeo
   * @param {string} videoId - ID do vídeo do YouTube
   * @param {Object} options - Opções adicionais
   */
  load(videoId, options = {}) {
    if (!this.container) {
      console.error('Container não encontrado');
      return;
    }

    this.currentVideoId = videoId;
    const embedUrl = youtubeService.getEmbedUrl(videoId, {
      autoplay: this.options.autoplay || options.autoplay,
      showRelated: this.options.showRelated || options.showRelated,
      ...options
    });

    this.container.innerHTML = `
      <iframe 
        width="100%" 
        height="100%" 
        src="${embedUrl}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen
      ></iframe>
    `;
  }

  /**
   * Limpa o player
   */
  clear() {
    if (this.container) {
      this.container.innerHTML = '';
      this.currentVideoId = null;
    }
  }

  /**
   * Obtém ID do vídeo atual
   * @returns {string|null} ID do vídeo
   */
  getCurrentVideoId() {
    return this.currentVideoId;
  }
}

export default VideoPlayer;









