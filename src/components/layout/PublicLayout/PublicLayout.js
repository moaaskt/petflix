/**
 * PublicLayout - Layout simplificado para páginas públicas (Login, Home/Seleção de Perfil)
 * Renderiza apenas o conteúdo da página, sem Navbar
 */
export function render(content = '') {
  return `
    <main id="publicContent" class="w-full min-h-screen bg-[#141414] text-white">
      ${content || ''}
    </main>
  `;
}

export async function init() {
  // Nada para inicializar neste layout simplificado
  return;
}

export default { render, init };

