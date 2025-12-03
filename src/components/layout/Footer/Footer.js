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
      <footer class="bg-black py-20 px-4 md:px-12">
        <div class="max-w-5xl mx-auto">
          <div class="flex items-center gap-6 mb-8">
            <a href="#" aria-label="Instagram" class="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm11 2a1 1 0 110 2 1 1 0 010-2zM12 7a5 5 0 110 10 5 5 0 010-10z"/></svg>
            </a>
            <a href="#" aria-label="Facebook" class="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M13 3h3a1 1 0 011 1v3h-3v3h3l-1 3h-2v7h-3v-7h-2v-3h2V7a4 4 0 014-4z"/></svg>
            </a>
            <a href="#" aria-label="Twitter" class="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M22 5.9a7.3 7.3 0 01-2.1.6 3.6 3.6 0 001.6-2 7.3 7.3 0 01-2.3.9 3.6 3.6 0 00-6.2 3.3A10.2 10.2 0 013 5.1a3.6 3.6 0 001.1 4.8 3.5 3.5 0 01-1.6-.4v.1a3.6 3.6 0 002.9 3.5 3.6 3.6 0 01-1.6.1 3.6 3.6 0 003.3 2.4A7.3 7.3 0 013 17.7a10.3 10.3 0 005.6 1.7c6.7 0 10.4-5.6 10.4-10.4v-.5A7.3 7.3 0 0022 5.9z"/></svg>
            </a>
            <a href="#" aria-label="YouTube" class="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M21.8 8.6a3 3 0 00-2.1-2.1C18 6 12 6 12 6s-6 0-7.7.5A3 3 0 002.2 8.6 31 31 0 002 12a31 31 0 00.2 3.4 3 3 0 002.1 2.1C6 18 12 18 12 18s6 0 7.7-.5a3 3 0 002.1-2.1A31 31 0 0022 12a31 31 0 00-.2-3.4zM10 15V9l5 3-5 3z"/></svg>
            </a>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
            <a href="#" class="hover:text-white">Audiodescrição</a>
            <a href="#" class="hover:text-white">Central de Ajuda</a>
            <a href="#" class="hover:text-white">Cartão Pré-pago</a>
            <a href="#" class="hover:text-white">Imprensa</a>
            <a href="#" class="hover:text-white">Carreiras</a>
            <a href="#" class="hover:text-white">Termos de Uso</a>
            <a href="#" class="hover:text-white">Privacidade</a>
            <a href="#" class="hover:text-white">Avisos Legais</a>
          </div>
          <div class="mt-6">
            <button class="border border-gray-500 text-gray-400 p-2 text-xs hover:text-white hover:border-white">Código de Serviço</button>
          </div>
          <div class="mt-6 text-xs text-gray-500">© 2024 Petflix, Inc.</div>
        </div>
      </footer>
    `;
  }
}

export default Footer;









