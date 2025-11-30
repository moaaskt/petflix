/**
 * Navbar Component - Componente de navegação
 * Retorna HTML básico, sem estilização ainda
 */
import '../styles/components/navbar.css';

export function render() {
  return `
    <nav class="navbar">
      <div class="nav-content">
        <a href="#/home" class="brand">PetFlix</a>
        <div class="nav-links">
          <a href="#/filmes" class="nav-link">Filmes</a>
          <a href="#/series" class="nav-link">Séries</a>
          <a href="#/docs" class="nav-link">Documentários</a>
          <a href="#/profile" class="nav-link">Perfil</a>
        </div>
        <div class="nav-actions"></div>
      </div>
    </nav>
  `;
}

export function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return () => window.removeEventListener('scroll', onScroll);
}

if (typeof window !== 'undefined') {
  requestAnimationFrame(() => initNavbarScroll());
}

