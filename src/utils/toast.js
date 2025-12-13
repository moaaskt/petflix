/**
 * Toast Notification Service
 * Sistema de notificações profissional com glassmorphism
 * Substitui alert() e erros padrão por notificações elegantes
 */
class ToastService {
  constructor() {
    this.toastContainer = null;
    this.createContainer();
    this.injectStyles();
  }

  /**
   * Cria o container de toasts se não existir
   */
  createContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none';
      document.body.appendChild(container);
    }
    this.toastContainer = container;
  }

  /**
   * Injeta os estilos CSS necessários
   */
  injectStyles() {
    if (document.getElementById('toast-styles')) return;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'toast-styles';
    styleSheet.textContent = `
      @keyframes slide-in-right {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slide-out-right {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      
      .toast-enter {
        animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      
      .toast-exit {
        animation: slide-out-right 0.3s ease-in;
      }
    `;
    document.head.appendChild(styleSheet);
  }

  /**
   * Exibe uma notificação toast
   * @param {string} message - Mensagem a ser exibida
   * @param {string} type - Tipo: 'success' | 'error' | 'info' | 'warning'
   * @param {number} duration - Duração em ms (padrão: 4000)
   */
  show(message, type = 'info', duration = 4000) {
    if (!this.toastContainer) {
      this.createContainer();
    }

    // Configurações baseadas no tipo
    const config = {
      success: {
        borderColor: 'border-l-green-500',
        iconColor: 'text-green-400',
        icon: `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `
      },
      error: {
        borderColor: 'border-l-red-500',
        iconColor: 'text-red-400',
        icon: `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `
      },
      info: {
        borderColor: 'border-l-blue-500',
        iconColor: 'text-blue-400',
        icon: `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        `
      },
      warning: {
        borderColor: 'border-l-yellow-500',
        iconColor: 'text-yellow-400',
        icon: `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        `
      }
    };

    const style = config[type] || config.info;

    // Cria o elemento toast com glassmorphism
    const toast = document.createElement('div');
    toast.className = `
      pointer-events-auto
      bg-black/80 backdrop-blur-md
      ${style.borderColor} border-l-4
      text-white
      px-5 py-4
      rounded-lg
      shadow-2xl
      min-w-[320px] max-w-[420px]
      flex items-start gap-4
      toast-enter
      transform transition-all duration-300
    `.replace(/\s+/g, ' ').trim();
    
    toast.innerHTML = `
      <div class="${style.iconColor} flex-shrink-0 mt-0.5">
        ${style.icon}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-white leading-relaxed">${this.escapeHtml(message)}</p>
      </div>
      <button 
        class="text-gray-400 hover:text-white transition-colors flex-shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-white/20 rounded p-1" 
        aria-label="Fechar notificação"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    `;

    // Adiciona o toast ao container
    this.toastContainer.appendChild(toast);

    // Função para remover o toast
    const removeToast = () => {
      toast.classList.remove('toast-enter');
      toast.classList.add('toast-exit');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    };

    // Botão de fechar
    const closeBtn = toast.querySelector('button');
    if (closeBtn) {
      closeBtn.addEventListener('click', removeToast);
    }

    // Remove automaticamente após o tempo especificado
    if (duration > 0) {
      setTimeout(removeToast, duration);
    }

    return toast;
  }

  /**
   * Escapa HTML para prevenir XSS
   * @param {string} text - Texto a ser escapado
   * @returns {string} Texto escapado
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Método estático: Exibe toast de sucesso
   * @param {string} message - Mensagem de sucesso
   * @param {number} duration - Duração em ms (padrão: 4000)
   */
  success(message, duration = 4000) {
    return this.show(message, 'success', duration);
  }

  /**
   * Método estático: Exibe toast de erro
   * @param {string} message - Mensagem de erro
   * @param {number} duration - Duração em ms (padrão: 4000)
   */
  error(message, duration = 4000) {
    return this.show(message, 'error', duration);
  }

  /**
   * Método estático: Exibe toast de informação
   * @param {string} message - Mensagem informativa
   * @param {number} duration - Duração em ms (padrão: 4000)
   */
  info(message, duration = 4000) {
    return this.show(message, 'info', duration);
  }

  /**
   * Método estático: Exibe toast de aviso
   * @param {string} message - Mensagem de aviso
   * @param {number} duration - Duração em ms (padrão: 4000)
   */
  warning(message, duration = 4000) {
    return this.show(message, 'warning', duration);
  }
}

// Exporta uma instância singleton
export const Toast = new ToastService();
export default Toast;
