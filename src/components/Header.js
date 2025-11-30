/**
 * Header Component - Componente de cabeçalho
 * Retorna HTML básico, sem estilização ainda
 */
import '../styles/components/header.css';

export function render(config = {}) {
  const isString = typeof config === 'string';
  const title = isString ? config : (config.title || 'PetFlix');
  const description = isString ? '' : (config.description || '');
  const image = isString ? '' : (config.image || '');
  const bg = image ? ` style="background-image: url('${image}');"` : '';

  return `
    <header class="hero"${bg}>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">${title}</h1>
        ${description ? `<p class="hero-description">${description}</p>` : ''}
        <div class="hero-buttons">
          <button class="btn-play">Assistir</button>
          <button class="btn-info">Mais informações</button>
        </div>
      </div>
    </header>
  `;
}

