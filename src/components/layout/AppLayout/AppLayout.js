import { Navbar } from '../../layout/Navbar/Navbar.js';
import { Footer } from '../../layout/Footer/Footer.js';
import './AppLayout.css';

export function render(content = '') {
  return `
    <div class="app-layout">
      <header id="navbar"></header>
      <main id="layoutContent" class="app-content">${content || ''}</main>
      <footer id="footer"></footer>
    </div>
  `;
}

export async function init() {
  new Navbar('navbar', {});
  const footerContainer = document.getElementById('footer');
  if (footerContainer) {
    const footer = new Footer('footer');
    footerContainer.innerHTML = footer.render();
  }
}

export default { render, init };

