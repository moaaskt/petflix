/**
 * DOM Helpers - Funções utilitárias para manipulação do DOM
 */

/**
 * Cria elemento HTML
 * @param {string} tag - Tag HTML
 * @param {Object} attributes - Atributos do elemento
 * @param {string|HTMLElement} content - Conteúdo do elemento
 * @returns {HTMLElement} Elemento criado
 */
export function createElement(tag, attributes = {}, content = '') {
  const element = document.createElement(tag);
  
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else if (key.startsWith('on')) {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else {
      element.setAttribute(key, value);
    }
  });

  if (typeof content === 'string') {
    element.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    element.appendChild(content);
  }

  return element;
}

/**
 * Remove todos os filhos de um elemento
 * @param {HTMLElement} element - Elemento pai
 */
export function clearElement(element) {
  if (element) {
    element.innerHTML = '';
  }
}

/**
 * Adiciona classe se não existir
 * @param {HTMLElement} element - Elemento
 * @param {string} className - Nome da classe
 */
export function addClass(element, className) {
  if (element && !element.classList.contains(className)) {
    element.classList.add(className);
  }
}

/**
 * Remove classe se existir
 * @param {HTMLElement} element - Elemento
 * @param {string} className - Nome da classe
 */
export function removeClass(element, className) {
  if (element && element.classList.contains(className)) {
    element.classList.remove(className);
  }
}

/**
 * Toggle classe
 * @param {HTMLElement} element - Elemento
 * @param {string} className - Nome da classe
 */
export function toggleClass(element, className) {
  if (element) {
    element.classList.toggle(className);
  }
}

/**
 * Scroll suave para elemento
 * @param {HTMLElement} element - Elemento alvo
 * @param {Object} options - Opções de scroll
 */
export function scrollToElement(element, options = {}) {
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      ...options
    });
  }
}

/**
 * Verifica se elemento está visível na viewport
 * @param {HTMLElement} element - Elemento
 * @returns {boolean} True se visível
 */
export function isElementVisible(element) {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Debounce function
 * @param {Function} func - Função a executar
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} Função com debounce
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}









