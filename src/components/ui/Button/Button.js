/**
 * Button Component - Componente de botão reutilizável
 */
export class Button {
  constructor(options = {}) {
    this.text = options.text || 'Button';
    this.type = options.type || 'button';
    this.variant = options.variant || 'primary'; // 'primary', 'secondary', 'danger'
    this.size = options.size || 'md'; // 'sm', 'md', 'lg'
    this.onClick = options.onClick || null;
    this.disabled = options.disabled || false;
    this.loading = options.loading || false;
  }

  /**
   * Renderiza o botão
   * @returns {HTMLElement} Elemento do botão
   */
  render() {
    const button = document.createElement('button');
    button.type = this.type;
    button.className = `btn btn-${this.variant} btn-${this.size}`;
    button.textContent = this.text;
    button.disabled = this.disabled || this.loading;

    if (this.loading) {
      button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ' + this.text;
    }

    if (this.onClick) {
      button.addEventListener('click', this.onClick);
    }

    return button;
  }
}

export default Button;









