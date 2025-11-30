/**
 * Alert Component - Componente de alerta/mensagem
 */
export class Alert {
  constructor(options = {}) {
    this.type = options.type || 'info'; // 'success', 'error', 'warning', 'info'
    this.message = options.message || '';
    this.duration = options.duration || 5000;
    this.dismissible = options.dismissible !== false;
  }

  /**
   * Mostra o alerta
   * @param {string} message - Mensagem
   * @param {string} type - Tipo do alerta
   */
  show(message = this.message, type = this.type) {
    this.message = message;
    this.type = type;
    this.render();
    
    if (this.duration > 0) {
      setTimeout(() => this.hide(), this.duration);
    }
  }

  /**
   * Esconde o alerta
   */
  hide() {
    const alert = document.getElementById('alert-container');
    if (alert) {
      alert.classList.add('fade-out');
      setTimeout(() => alert.remove(), 500);
    }
  }

  /**
   * Renderiza o alerta
   */
  render() {
    // Remove alerta anterior se existir
    const existing = document.getElementById('alert-container');
    if (existing) {
      existing.remove();
    }

    const alert = document.createElement('div');
    alert.id = 'alert-container';
    alert.className = `alert alert-${this.type} alert-message alert-dismissible fade show`;
    alert.setAttribute('role', 'alert');
    
    alert.innerHTML = `
      <span id="alertText">${this.message}</span>
      ${this.dismissible ? '<button type="button" class="btn-close" aria-label="Close"></button>' : ''}
    `;

    if (this.dismissible) {
      const closeBtn = alert.querySelector('.btn-close');
      closeBtn.addEventListener('click', () => this.hide());
    }

    document.body.insertAdjacentElement('afterbegin', alert);
    
    // Scroll para o topo se necessário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Mostra alerta de sucesso
   * @param {string} message - Mensagem
   */
  success(message) {
    this.show(message, 'success');
  }

  /**
   * Mostra alerta de erro
   * @param {string} message - Mensagem
   */
  error(message) {
    this.show(message, 'danger');
  }

  /**
   * Mostra alerta de aviso
   * @param {string} message - Mensagem
   */
  warning(message) {
    this.show(message, 'warning');
  }

  /**
   * Mostra alerta de informação
   * @param {string} message - Mensagem
   */
  info(message) {
    this.show(message, 'info');
  }
}

export default Alert;









