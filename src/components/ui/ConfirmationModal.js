/**
 * ConfirmationModal Component - Modal de confirmação customizado
 * Substitui window.confirm() com design dark mode
 */
export class ConfirmationModal {
  constructor(options = {}) {
    this.options = {
      title: options.title || 'Tem certeza?',
      message: options.message || 'Essa ação não pode ser desfeita.',
      confirmText: options.confirmText || 'Confirmar',
      cancelText: options.cancelText || 'Cancelar',
      confirmButtonColor: options.confirmButtonColor || 'red', // 'red' | 'blue' | 'green'
      icon: options.icon || 'warning', // 'warning' | 'delete'
      onConfirm: options.onConfirm || (() => {}),
      onCancel: options.onCancel || (() => {}),
      ...options
    };
    this.modalId = options.modalId || 'confirmationModal';
  }

  /**
   * Renderiza o HTML do modal
   */
  render() {
    const confirmColorClasses = {
      red: 'bg-red-600 hover:bg-red-700',
      blue: 'bg-blue-600 hover:bg-blue-700',
      green: 'bg-green-600 hover:bg-green-700'
    };
    
    const confirmColor = confirmColorClasses[this.options.confirmButtonColor] || confirmColorClasses.red;
    
    const iconSVG = this.options.icon === 'delete' 
      ? `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-red-500">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      `
      : `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-yellow-500">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      `;

    return `
      <div id="${this.modalId}" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center hidden">
        <div class="bg-zinc-900 border border-zinc-700 p-6 rounded-lg shadow-2xl max-w-sm w-full mx-4 transform scale-100 transition-all">
          <div class="flex flex-col items-center text-center space-y-4">
            <!-- Ícone -->
            <div class="flex-shrink-0">
              ${iconSVG}
            </div>
            
            <!-- Título -->
            <h3 class="text-xl font-bold text-white">
              ${this.options.title}
            </h3>
            
            <!-- Mensagem -->
            <p class="text-zinc-400 text-sm">
              ${this.options.message}
            </p>
            
            <!-- Botões -->
            <div class="flex items-center gap-3 w-full mt-4">
              <button 
                id="${this.modalId}-cancel" 
                class="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-lg transition-colors"
              >
                ${this.options.cancelText}
              </button>
              <button 
                id="${this.modalId}-confirm" 
                class="flex-1 px-4 py-2 ${confirmColor} text-white font-semibold rounded-lg transition-colors"
              >
                ${this.options.confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Inicializa os event listeners
   */
  init() {
    const modal = document.getElementById(this.modalId);
    if (!modal) return;

    const confirmBtn = document.getElementById(`${this.modalId}-confirm`);
    const cancelBtn = document.getElementById(`${this.modalId}-cancel`);

    // Handler de confirmação
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        if (this.options.onConfirm) {
          this.options.onConfirm();
        }
        this.hide();
      });
    }

    // Handler de cancelamento
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (this.options.onCancel) {
          this.options.onCancel();
        }
        this.hide();
      });
    }

    // Fecha ao clicar no overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (this.options.onCancel) {
          this.options.onCancel();
        }
        this.hide();
      }
    });

    // Handler do ESC será adicionado/removido no show/hide
    this.escapeHandler = null;
  }

  /**
   * Mostra o modal
   */
  show() {
    const modal = document.getElementById(this.modalId);
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      
      // Adiciona event listener do ESC
      if (!this.escapeHandler) {
        this.escapeHandler = (e) => {
          if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            if (this.options.onCancel) {
              this.options.onCancel();
            }
            this.hide();
          }
        };
        document.addEventListener('keydown', this.escapeHandler);
      }
    }
  }

  /**
   * Esconde o modal
   */
  hide() {
    const modal = document.getElementById(this.modalId);
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      
      // Remove event listener do ESC se existir
      if (this.escapeHandler) {
        document.removeEventListener('keydown', this.escapeHandler);
        this.escapeHandler = null;
      }
    }
  }
  
  /**
   * Limpa recursos (remove event listeners)
   */
  destroy() {
    this.hide();
    const modal = document.getElementById(this.modalId);
    if (modal && modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  }

  /**
   * Atualiza as opções do modal dinamicamente
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    
    const modal = document.getElementById(this.modalId);
    if (!modal) return;
    
    // Atualiza título
    const titleEl = modal.querySelector('h3');
    if (titleEl && newOptions.title !== undefined) {
      titleEl.textContent = this.options.title;
    }
    
    // Atualiza mensagem
    const messageEl = modal.querySelector('p.text-zinc-400');
    if (messageEl && newOptions.message !== undefined) {
      messageEl.textContent = this.options.message;
    }
    
    // Atualiza texto dos botões
    const confirmBtn = document.getElementById(`${this.modalId}-confirm`);
    const cancelBtn = document.getElementById(`${this.modalId}-cancel`);
    
    if (confirmBtn && newOptions.confirmText !== undefined) {
      confirmBtn.textContent = this.options.confirmText;
    }
    
    if (cancelBtn && newOptions.cancelText !== undefined) {
      cancelBtn.textContent = this.options.cancelText;
    }
    
    // Atualiza cor do botão de confirmar se necessário
    if (confirmBtn && newOptions.confirmButtonColor !== undefined) {
      const confirmColorClasses = {
        red: 'bg-red-600 hover:bg-red-700',
        blue: 'bg-blue-600 hover:bg-blue-700',
        green: 'bg-green-600 hover:bg-green-700'
      };
      const newColor = confirmColorClasses[this.options.confirmButtonColor] || confirmColorClasses.red;
      confirmBtn.className = confirmBtn.className.replace(/bg-(red|blue|green)-600 hover:bg-(red|blue|green)-700/, newColor);
    }
  }
}

export default ConfirmationModal;
