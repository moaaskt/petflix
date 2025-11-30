/**
 * Modal Component - Componente de modal reutilizável
 */
export class Modal {
  constructor(modalId, options = {}) {
    this.modalId = modalId;
    this.modal = document.getElementById(modalId);
    this.options = {
      closeOnBackdrop: options.closeOnBackdrop !== false,
      closeOnEscape: options.closeOnEscape !== false,
      ...options
    };
    this.init();
  }

  /**
   * Inicializa o modal
   */
  init() {
    if (!this.modal) return;

    // Fecha ao clicar no backdrop
    if (this.options.closeOnBackdrop) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });
    }

    // Fecha com ESC
    if (this.options.closeOnEscape) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) {
          this.close();
        }
      });
    }
  }

  /**
   * Abre o modal
   */
  open() {
    if (this.modal) {
      this.modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Fecha o modal
   */
  close() {
    if (this.modal) {
      this.modal.style.display = 'none';
      document.body.style.overflow = 'auto';
      
      // Limpa iframe se existir
      const iframe = this.modal.querySelector('iframe');
      if (iframe) {
        iframe.src = '';
      }
    }
  }

  /**
   * Verifica se está aberto
   * @returns {boolean} True se aberto
   */
  isOpen() {
    return this.modal && this.modal.style.display === 'flex';
  }

  /**
   * Define conteúdo do modal
   * @param {string|HTMLElement} content - Conteúdo
   */
  setContent(content) {
    if (!this.modal) return;

    const container = this.modal.querySelector('.modal-video-container') || 
                     this.modal.querySelector('.modal-content');
    
    if (container) {
      if (typeof content === 'string') {
        container.innerHTML = content;
      } else {
        container.innerHTML = '';
        container.appendChild(content);
      }
    }
  }
}

export default Modal;









