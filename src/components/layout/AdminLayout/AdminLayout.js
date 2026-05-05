/**
 * AdminLayout - Layout para páginas administrativas
 * Sidebar fixa à esquerda + área de conteúdo à direita
 */
import { navigateTo } from '../../../router/navigator.js';

export function render(content = '') {
  return `
    <div class="flex h-screen bg-[#0a0a0c] overflow-hidden font-sans text-zinc-300">
      <!-- Sidebar -->
      <aside class="w-72 bg-zinc-900/50 backdrop-blur-2xl border-r border-white/5 flex flex-col shadow-2xl z-20">
        <!-- Logo -->
        <div class="p-8 mb-4">
          <a href="#/admin" class="flex flex-col gap-1 group">
            <span class="text-red-600 text-3xl font-black tracking-tighter transition-transform group-hover:scale-105 origin-left">PETFLIX</span>
            <div class="flex items-center gap-2">
              <span class="h-px w-8 bg-red-600/50"></span>
              <span class="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Management</span>
            </div>
          </a>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 px-4 space-y-8">
          <div>
            <p class="px-4 mb-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Principal</p>
            <ul class="space-y-2">
              <li>
                <a href="#/admin" id="nav-dashboard" class="nav-link group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 hover:bg-white/5">
                  <div class="p-2 rounded-xl bg-zinc-800 group-hover:bg-red-600/20 group-hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  </div>
                  <span class="font-semibold text-sm">Dashboard</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p class="px-4 mb-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Conteúdo</p>
            <ul class="space-y-2">
              <li>
                <a href="#/admin/movies" id="nav-movies" class="nav-link group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 hover:bg-white/5">
                  <div class="p-2 rounded-xl bg-zinc-800 group-hover:bg-red-600/20 group-hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  </div>
                  <span class="font-semibold text-sm">Gerenciar Filmes</span>
                </a>
              </li>
              <li>
                <a href="#/admin/users" id="nav-users" class="nav-link group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 hover:bg-white/5">
                  <div class="p-2 rounded-xl bg-zinc-800 group-hover:bg-red-600/20 group-hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </div>
                  <span class="font-semibold text-sm">Usuários</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
        
        <!-- Footer Sidebar -->
        <div class="p-6 border-t border-white/5">
          <button 
            id="backToSiteBtn"
            class="group w-full flex items-center gap-4 px-4 py-4 bg-zinc-800/50 hover:bg-white/5 text-zinc-400 hover:text-white rounded-2xl transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 group-hover:-translate-x-1 transition-transform">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            <span class="font-bold text-xs uppercase tracking-widest">Voltar ao Site</span>
          </button>
        </div>
      </aside>
      
      <!-- Content Area -->
      <main id="adminContent" class="flex-1 bg-[#0a0a0c] overflow-y-auto relative">
        <div class="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-red-600/5 to-transparent pointer-events-none"></div>
        <div class="relative z-10">
          ${content || ''}
        </div>
      </main>
    </div>
  `;
}

export async function init() {
  const backButton = document.getElementById('backToSiteBtn');
  if (backButton) {
    backButton.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('/dashboard');
    });
  }
  
  updateActiveNavItem();
  window.addEventListener('hashchange', updateActiveNavItem);
}

function updateActiveNavItem() {
  const currentHash = window.location.hash || '#/admin';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkHash = link.getAttribute('href');
    const iconContainer = link.querySelector('div');
    
    // Reset classes
    link.classList.remove('bg-red-600', 'text-white', 'shadow-[0_10px_20px_rgba(229,9,20,0.2)]');
    link.classList.add('hover:bg-white/5');
    if (iconContainer) {
      iconContainer.classList.remove('bg-white/20', 'text-white');
      iconContainer.classList.add('bg-zinc-800');
    }
    
    // Active state
    if (currentHash === linkHash || 
        (currentHash.startsWith('#/admin/movies') && linkHash === '#/admin/movies') ||
        (currentHash.startsWith('#/admin/users') && linkHash === '#/admin/users') ||
        (currentHash === '#/admin' && linkHash === '#/admin')) {
      link.classList.add('bg-red-600', 'text-white', 'shadow-[0_10px_20px_rgba(229,9,20,0.2)]');
      link.classList.remove('hover:bg-white/5');
      if (iconContainer) {
        iconContainer.classList.add('bg-white/20', 'text-white');
        iconContainer.classList.remove('bg-zinc-800');
      }
    }
  });
}


export default { render, init };

