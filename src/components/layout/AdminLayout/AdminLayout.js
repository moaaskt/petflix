/**
 * AdminLayout - Layout para páginas administrativas
 * Sidebar fixa à esquerda + área de conteúdo à direita
 */
import { navigateTo } from '../../../router/navigator.js';

export function render(content = '') {
  return `
    <div class="flex h-screen bg-zinc-900 overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <!-- Logo -->
        <div class="p-6 border-b border-zinc-800">
          <a href="#/admin" class="flex items-center gap-2">
            <span class="text-red-600 text-2xl font-bold tracking-widest">PETFLIX</span>
            <span class="text-zinc-400 text-sm">Admin</span>
          </a>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 p-4">
          <ul class="space-y-2">
            <li>
              <a href="#/admin" id="nav-dashboard" class="nav-link flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#/admin/movies" id="nav-movies" class="nav-link flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <span>Filmes</span>
              </a>
            </li>
            <li>
              <a href="#/admin/users" id="nav-users" class="nav-link flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <span>Usuários</span>
              </a>
            </li>
          </ul>
        </nav>
        
        <!-- Footer Sidebar -->
        <div class="p-4 border-t border-zinc-800">
          <button 
            id="backToSiteBtn"
            class="w-full flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            <span>Voltar ao Site</span>
          </button>
        </div>
      </aside>
      
      <!-- Content Area -->
      <main id="adminContent" class="flex-1 bg-zinc-800 overflow-y-auto">
        ${content || ''}
      </main>
    </div>
  `;
}

export async function init() {
  // Configura o handler do botão "Voltar ao Site"
  const backButton = document.getElementById('backToSiteBtn');
  if (backButton) {
    backButton.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('/dashboard');
    });
  }
  
  // Atualiza o highlight do item ativo na sidebar
  updateActiveNavItem();
  
  // Escuta mudanças na hash para atualizar o highlight
  window.addEventListener('hashchange', updateActiveNavItem);
}

/**
 * Atualiza o highlight do item ativo na sidebar baseado na URL atual
 */
function updateActiveNavItem() {
  const currentHash = window.location.hash || '#/admin';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkHash = link.getAttribute('href');
    
    // Remove classes ativas
    link.classList.remove('bg-red-600', 'text-white');
    link.classList.add('text-zinc-300');
    
    // Verifica se o link corresponde à rota atual
    if (currentHash === linkHash || 
        (currentHash.startsWith('#/admin/movies') && linkHash === '#/admin/movies') ||
        (currentHash.startsWith('#/admin/users') && linkHash === '#/admin/users') ||
        (currentHash === '#/admin' && linkHash === '#/admin')) {
      link.classList.add('bg-red-600', 'text-white');
      link.classList.remove('text-zinc-300');
    }
  });
}

export default { render, init };

