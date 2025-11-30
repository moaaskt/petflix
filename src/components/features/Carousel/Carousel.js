/**
 * Carousel Component - Carrossel de conteúdo
 */
export class Carousel {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.items = [];
    this.scrollAmount = options.scrollAmount || 300;
    this.showButtons = options.showButtons !== false;
  }

  /**
   * Renderiza o carrossel
   * @param {Array} items - Array de itens
   * @param {Function} renderItem - Função para renderizar cada item
   */
  render(items, renderItem) {
    if (!this.container) {
      console.error('Container não encontrado');
      return;
    }

    this.items = items;
    this.clear();

    if (items.length === 0) {
      return;
    }

    items.forEach((item, index) => {
      const element = renderItem ? renderItem(item, index) : this.createDefaultItem(item);
      if (element) {
        this.container.appendChild(element);
      }
    });
  }

  /**
   * Cria item padrão
   * @param {Object} item - Dados do item
   * @returns {HTMLElement} Elemento do item
   */
  createDefaultItem(item) {
    const element = document.createElement('div');
    element.className = 'carousel__item';
    element.innerHTML = item.html || '';
    return element;
  }

  /**
   * Rola o carrossel
   * @param {number} direction - Direção (1 para direita, -1 para esquerda)
   */
  scroll(direction = 1) {
    if (!this.container) return;

    const amount = direction * this.scrollAmount;
    this.container.scrollBy({
      left: amount,
      behavior: 'smooth'
    });
  }

  /**
   * Limpa o carrossel
   */
  clear() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

export default Carousel;









