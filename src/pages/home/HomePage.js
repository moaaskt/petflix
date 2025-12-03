/**
 * HomePage - Página de seleção de perfil
 * Estilo Netflix
 */
import { navigateTo } from '../../router/navigator.js';
import { applyTheme } from '../../state/AuthState.js';

export function render() {
  return `
    <div class="min-h-screen flex flex-col items-center justify-center">
      <h1 class="text-3xl md:text-5xl font-medium mb-8 text-white">Quem está assistindo?</h1>
      <div class="flex gap-4 md:gap-8 flex-wrap justify-center">
        <button id="profile-dog" class="group cursor-pointer flex flex-col items-center gap-2" aria-label="Cachorro">
          <div class="w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden border-2 border-transparent group-hover:border-white transition-all">
            <img src="assets/caramelo.jpg" alt="Cachorro" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'" />
            <div class="hidden w-full h-full items-center justify-center bg-blue-600">
              <span class="text-white text-3xl">C</span>
            </div>
          </div>
          <span class="text-gray-400 text-lg group-hover:text-white transition-colors">Cachorro</span>
        </button>
        <button id="profile-cat" class="group cursor-pointer flex flex-col items-center gap-2" aria-label="Gato">
          <div class="w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden border-2 border-transparent group-hover:border-white transition-all">
            <img src="assets/gato-siames-1.jpg" alt="Gato" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'" />
            <div class="hidden w-full h-full items-center justify-center bg-red-600">
              <span class="text-white text-3xl">G</span>
            </div>
          </div>
          <span class="text-gray-400 text-lg group-hover:text-white transition-colors">Gato</span>
        </button>
      </div>
      <button class="mt-12 border border-gray-400 text-gray-400 px-6 py-2 uppercase tracking-widest hover:border-white hover:text-white transition-all">Gerenciar perfis</button>
    </div>
  `;
}

export function init() {
  const profileDog = document.getElementById('profile-dog');
  const profileCat = document.getElementById('profile-cat');
  const manageBtn = document.querySelector('.manage-profiles-btn');

  if (profileDog) {
    profileDog.addEventListener('click', () => {
      selectProfile('dog');
    });
  }

  if (profileCat) {
    profileCat.addEventListener('click', () => {
      selectProfile('cat');
    });
  }

  if (manageBtn) {
    manageBtn.addEventListener('click', () => {
      // Funcionalidade futura
      console.log('Gerenciar perfis clicado');
    });
  }
}

function selectProfile(profileName) {
  // Salva o perfil selecionado
  localStorage.setItem('selectedProfile', profileName);
  
  // Redireciona para a página de filmes (dashboard)
  try {
    applyTheme(profileName === 'cat' ? 'cat' : 'dog');
    navigateTo('/dashboard');
  } catch {
    window.location.hash = '#/dashboard';
  }
}
