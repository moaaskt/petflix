/**
 * Footer Component - Rodapé da aplicação
 */
export class Footer {
  constructor(containerId) {
    this.container = document.getElementById(containerId) || document.querySelector('footer');
  }

  /**
   * Renderiza o footer
   * @returns {string} HTML do footer
   */
  render() {
    return `
      <footer>
        <div class="footer-content">
          <div class="footer-column">
            <h4>Petflix</h4>
            <ul>
              <li><a href="pagesFooter/sobrenos.html">Sobre nós</a></li>
              <li><a href="pagesFooter/contato.html">Contato</a></li>
              <li><a href="#">Carreiras</a></li>
            </ul>
          </div>

          <div class="footer-column">
            <h4>Ajuda</h4>
            <ul>
              <li><a href="#">Perguntas Frequentes</a></li>
              <li><a href="#">Adoção Responsável</a></li>
              <li><a href="pagesFooter/termos-uso.html">Termos de Uso</a></li>
            </ul>
          </div>

          <div class="footer-column">
            <h4>Redes Sociais</h4>
            <ul>
              <li>
                <a href="#" aria-label="Instagram">
                  <i class="fab fa-instagram"></i> Instagram
                </a>
              </li>
              <li>
                <a href="#" aria-label="Facebook">
                  <i class="fab fa-facebook-f"></i> Facebook
                </a>
              </li>
              <li>
                <a href="#" aria-label="YouTube">
                  <i class="fab fa-youtube"></i> YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          &copy; 2025 Petflix. Todos os direitos reservados.
        </div>
      </footer>
    `;
  }
}

export default Footer;









