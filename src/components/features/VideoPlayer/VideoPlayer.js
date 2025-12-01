/**
 * VideoPlayer Component - Player de vídeo do YouTube
 */
 

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
    const autoplay = ((typeof options.autoplay !== 'undefined') ? options.autoplay : this.options.autoplay) ? '1' : '0';
    const rel = ((typeof options.showRelated !== 'undefined') ? options.showRelated : this.options.showRelated) ? '1' : '0';
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&rel=${rel}&modestbranding=1`;

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









