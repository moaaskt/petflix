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
    style.textContent = `
      .fade-out { opacity: 0; pointer-events: none; }
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
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.className = 'fixed inset-0 z-[60] bg-black flex items-center justify-center transition-opacity';
    const color = this.type === 'dog' ? '#e67e22' : '#E50914';
    const rgba = color === '#e67e22' ? 'rgba(230,126,34,0.3)' : 'rgba(229,9,20,0.3)';
    overlay.innerHTML = `
      <div class="flex flex-col items-center justify-center">
        <img src="/assets/petflix-logo.png" class="h-12 mb-8 animate-pulse" onerror="this.style.display='none';var f=document.createElement('h1');f.className='text-[#E50914] text-4xl font-bold tracking-widest animate-pulse';f.textContent='PETFLIX';this.parentNode.appendChild(f);" />
        <div class="w-12 h-12 border-4 rounded-full animate-spin" style="border-color:${rgba}; border-top-color:${color};"></div>
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









