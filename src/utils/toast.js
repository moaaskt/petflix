/**
 * Toast Notification Service
 * Sistema de notificações elegante para substituir alert()
 */
class ToastService {
  constructor() {
    this.toastContainer = null;
    this.createContainer();
  }

  /**
   * Cria o container de toasts se não existir
   */
  createContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'fixed top-4 right-4 z-[60] flex flex-col gap-2';
      document.body.appendChild(container);
    }
    this.toastContainer = container;
  }

  /**
   * Exibe uma notificação toast
   * @param {string} message - Mensagem a ser exibida
   * @param {string} type - Tipo: 'success' | 'error'
   * @param {number} duration - Duração em ms (padrão: 3000)
   */
  show(message, type = 'success', duration = 3000) {
    if (!this.toastContainer) {
      this.createContainer();
    }

    // Configurações baseadas no tipo
    const config = {
      success: {
        bgColor: 'bg-zinc-900',
        borderColor: 'border-green-500',
        iconColor: 'text-green-500',
        icon: `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `
      },
      error: {
        bgColor: 'bg-zinc-900',
        borderColor: 'border-red-500',
        iconColor: 'text-red-500',
        icon: `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `
      }
    };

    const style = config[type] || config.success;

    // Cria o elemento toast
    const toast = document.createElement('div');
    toast.className = `${style.bgColor} border-l-4 ${style.borderColor} text-white px-6 py-4 rounded-lg shadow-lg min-w-[300px] max-w-[400px] flex items-center gap-3 animate-slide-in-right transform transition-all duration-300 ease-out`;
    
    toast.innerHTML = `
      <div class="${style.iconColor} flex-shrink-0">
        ${style.icon}
      </div>
      <p class="flex-1 text-sm font-medium">${message}</p>
      <button class="text-zinc-400 hover:text-white transition-colors" aria-label="Fechar">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    `;

    // Adiciona animação CSS se não existir
    if (!document.getElementById('toastStyles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'toastStyles';
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
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
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
        .animate-slide-out-right {
          animation: slide-out-right 0.3s ease-out;
        }
      `;
      document.head.appendChild(styleSheet);
    }

    // Adiciona o toast ao container
    this.toastContainer.appendChild(toast);

    // Função para remover o toast
    const removeToast = () => {
      toast.classList.add('animate-slide-out-right');
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
}

// Exporta uma instância singleton
export const Toast = new ToastService();
export default Toast;
