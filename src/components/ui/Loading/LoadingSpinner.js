/**
 * LoadingSpinner Component - Componente de loading reutilizável
 */
export class LoadingSpinner {
  constructor(options = {}) {
    this.message = options.message || 'Carregando...';
    this.type = options.type || 'default'; // 'default', 'dog', 'cat'
    this.isActive = false;
  }

  /**
   * Mostra o loading
   * @param {string} message - Mensagem a exibir
   */
  show(message = this.message) {
    if (this.isActive) return;

    this.isActive = true;
    this.message = message;
    this.addStyles();
    this.render();
  }

  /**
   * Esconde o loading
   */
  hide() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.remove();
        this.isActive = false;
        this.removeStyles();
      }, 500);
    }
  }

  /**
   * Adiciona estilos dinâmicos
   */
  addStyles() {
    if (document.getElementById('loading-spinner-styles')) return;

    const style = document.createElement('style');
    style.id = 'loading-spinner-styles';
    
    const iconColor = this.type === 'dog' ? '#e67e22' : '#e50914';
    const iconClass = this.type === 'dog' ? 'fa-dog' : 'fa-cat';
    
    style.textContent = `
      @keyframes bounce {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-15px) rotate(-5deg); }
        50% { transform: translateY(0) rotate(0deg); }
        75% { transform: translateY(-10px) rotate(5deg); }
      }
      
      @keyframes wag {
        0% { transform: rotate(-10deg); }
        100% { transform: rotate(10deg); }
      }
      
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
      }
      
      .loading-spinner {
        text-align: center;
        color: #fff;
      }
      
      .loading-spinner i {
        font-size: 50px;
        margin-bottom: 20px;
        color: ${iconColor};
        animation: bounce 1s infinite ease-in-out;
        position: relative;
      }
      
      .loading-spinner i::after {
        content: "\\${this.type === 'dog' ? 'f6d6' : 'f6be'}";
        font-family: "Font Awesome 6 Free";
        position: absolute;
        right: -20px;
        bottom: -5px;
        font-size: 0.6em;
        animation: wag 0.3s infinite alternate;
        opacity: 0.8;
      }
      
      .loading-spinner p {
        font-size: 18px;
        font-family: 'Open Sans', sans-serif;
        color: ${iconColor};
        font-weight: 600;
        margin-top: 10px;
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
      }
      
      .fade-out {
        opacity: 0;
        pointer-events: none;
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Remove estilos
   */
  removeStyles() {
    const style = document.getElementById('loading-spinner-styles');
    if (style) {
      style.remove();
    }
  }

  /**
   * Renderiza o loading
   */
  render() {
    const iconClass = this.type === 'dog' ? 'fa-dog' : 'fa-cat';
    
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-spinner">
        <i class="fas ${iconClass}"></i>
        <p>${this.message}</p>
      </div>
    `;
    
    document.body.insertAdjacentElement('afterbegin', overlay);
  }

  /**
   * Inicializa loading automático na página
   * @param {number} minDuration - Duração mínima em ms
   */
  initPageLoading(minDuration = 700) {
    this.show();
    
    window.addEventListener('load', () => {
      setTimeout(() => this.hide(), minDuration);
    });
    
    setTimeout(() => this.hide(), 10000);
  }
}

export default LoadingSpinner;









