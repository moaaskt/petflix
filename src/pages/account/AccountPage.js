/**
 * AccountPage - Página de configurações da conta
 * Design inspirado na Netflix
 */
import { AuthState, applyTheme } from '../../state/AuthState.js';
import { authService } from '../../services/auth/auth.service.js';
import { navigateTo } from '../../router/navigator.js';
import { localStorageService } from '../../services/storage/localStorage.service.js';

export function render() {
  const state = AuthState.getState();
  const user = state.user || {};
  const currentTheme = state.theme || (document.body.classList.contains('theme-cat') ? 'cat' : 'dog');
  const email = user.email || 'Não disponível';
  
  // Avatar baseado no tema
  const avatarColor = currentTheme === 'cat' ? 'bg-red-600' : 'bg-blue-600';
  const avatarInitial = email.charAt(0).toUpperCase();

  return `
    <div class="min-h-screen bg-[#141414] pt-24 pb-16">
      <div class="max-w-4xl mx-auto px-4 md:px-8">
        <!-- Seção 1: Cabeçalho -->
        <div class="mb-8 pb-8 border-b border-gray-800">
          <div class="flex items-center gap-6">
            <div class="w-20 h-20 ${avatarColor} rounded-full flex items-center justify-center text-white text-3xl font-bold">
              ${avatarInitial}
            </div>
            <div>
              <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">Minha Conta</h1>
              <p class="text-gray-400 text-lg">Gerencie suas preferências e configurações</p>
            </div>
          </div>
        </div>

        <!-- Seção 2: Detalhes -->
        <div class="mb-8 pb-8 border-b border-gray-800">
          <h2 class="text-2xl font-semibold text-white mb-6">Detalhes da Conta</h2>
          <div class="space-y-4">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between py-4">
              <div>
                <label class="text-gray-400 text-sm uppercase tracking-wider">E-mail</label>
                <p class="text-white text-lg mt-1">${email}</p>
              </div>
            </div>
            <div class="flex flex-col md:flex-row md:items-center md:justify-between py-4">
              <div>
                <label class="text-gray-400 text-sm uppercase tracking-wider">Plano</label>
                <p class="text-white text-lg mt-1">Premium 4K</p>
              </div>
              <span class="mt-2 md:mt-0 inline-block px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded">
                ATIVO
              </span>
            </div>
          </div>
        </div>

        <!-- Seção 3: Preferências de Espécie -->
        <div class="mb-8 pb-8 border-b border-gray-800">
          <h2 class="text-2xl font-semibold text-white mb-6">Configurações de Espécie</h2>
          <p class="text-gray-400 mb-6">Escolha qual tipo de conteúdo você deseja ver na Petflix</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Card Cachorro -->
            <button 
              id="theme-dog-btn" 
              class="relative p-6 rounded-lg border-2 transition-all duration-300 ${
                currentTheme === 'dog' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }"
            >
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  🐕
                </div>
                <div class="text-left flex-1">
                  <h3 class="text-xl font-semibold text-white mb-1">Modo Cachorro</h3>
                  <p class="text-gray-400 text-sm">Conteúdo focado em cães</p>
                </div>
                ${currentTheme === 'dog' 
                  ? '<div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0"><svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg></div>' 
                  : '<div class="w-6 h-6 border-2 border-gray-500 rounded-full flex-shrink-0"></div>'
                }
              </div>
            </button>

            <!-- Card Gato -->
            <button 
              id="theme-cat-btn" 
              class="relative p-6 rounded-lg border-2 transition-all duration-300 ${
                currentTheme === 'cat' 
                  ? 'border-red-500 bg-red-500/10' 
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }"
            >
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  🐱
                </div>
                <div class="text-left flex-1">
                  <h3 class="text-xl font-semibold text-white mb-1">Modo Gato</h3>
                  <p class="text-gray-400 text-sm">Conteúdo focado em gatos</p>
                </div>
                ${currentTheme === 'cat' 
                  ? '<div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0"><svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg></div>' 
                  : '<div class="w-6 h-6 border-2 border-gray-500 rounded-full flex-shrink-0"></div>'
                }
              </div>
            </button>
          </div>
        </div>

        <!-- Seção 4: Ações -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-white mb-6">Ações</h2>
          <button 
            id="logout-btn" 
            class="w-full md:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H12" />
            </svg>
            Sair da Petflix
          </button>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  const themeDogBtn = document.getElementById('theme-dog-btn');
  const themeCatBtn = document.getElementById('theme-cat-btn');
  const logoutBtn = document.getElementById('logout-btn');

  // Handler para trocar para tema Dog
  if (themeDogBtn) {
    themeDogBtn.addEventListener('click', () => {
      applyTheme('dog');
      localStorageService.set('petflixPetType', 'dog');
      
      // Atualiza visualmente os cards instantaneamente
      updateThemeUI('dog');
      
      // Pequeno delay para feedback visual antes de recarregar
      setTimeout(() => {
        // Redireciona para dashboard para ver o conteúdo atualizado
        navigateTo('/dashboard');
      }, 300);
    });
  }

  // Handler para trocar para tema Cat
  if (themeCatBtn) {
    themeCatBtn.addEventListener('click', () => {
      applyTheme('cat');
      localStorageService.set('petflixPetType', 'cat');
      
      // Atualiza visualmente os cards instantaneamente
      updateThemeUI('cat');
      
      // Pequeno delay para feedback visual antes de recarregar
      setTimeout(() => {
        // Redireciona para dashboard para ver o conteúdo atualizado
        navigateTo('/dashboard');
      }, 300);
    });
  }

  // Função para atualizar a UI do tema instantaneamente
  function updateThemeUI(newTheme) {
    const dogBtn = document.getElementById('theme-dog-btn');
    const catBtn = document.getElementById('theme-cat-btn');
    const avatar = document.querySelector('.w-20.h-20.rounded-full');
    
    if (newTheme === 'dog') {
      // Atualiza card Dog
      if (dogBtn) {
        dogBtn.className = 'relative p-6 rounded-lg border-2 transition-all duration-300 border-blue-500 bg-blue-500/10';
        const checkIcon = dogBtn.querySelector('.w-6.h-6');
        if (checkIcon) {
          checkIcon.className = 'w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0';
          checkIcon.innerHTML = '<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>';
        }
      }
      // Atualiza card Cat
      if (catBtn) {
        catBtn.className = 'relative p-6 rounded-lg border-2 transition-all duration-300 border-gray-700 bg-gray-800/50 hover:border-gray-600';
        const checkIcon = catBtn.querySelector('.w-6.h-6');
        if (checkIcon) {
          checkIcon.className = 'w-6 h-6 border-2 border-gray-500 rounded-full flex-shrink-0';
          checkIcon.innerHTML = '';
        }
      }
      // Atualiza avatar
      if (avatar) {
        avatar.className = 'w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold';
      }
    } else {
      // Atualiza card Cat
      if (catBtn) {
        catBtn.className = 'relative p-6 rounded-lg border-2 transition-all duration-300 border-red-500 bg-red-500/10';
        const checkIcon = catBtn.querySelector('.w-6.h-6');
        if (checkIcon) {
          checkIcon.className = 'w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0';
          checkIcon.innerHTML = '<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>';
        }
      }
      // Atualiza card Dog
      if (dogBtn) {
        dogBtn.className = 'relative p-6 rounded-lg border-2 transition-all duration-300 border-gray-700 bg-gray-800/50 hover:border-gray-600';
        const checkIcon = dogBtn.querySelector('.w-6.h-6');
        if (checkIcon) {
          checkIcon.className = 'w-6 h-6 border-2 border-gray-500 rounded-full flex-shrink-0';
          checkIcon.innerHTML = '';
        }
      }
      // Atualiza avatar
      if (avatar) {
        avatar.className = 'w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold';
      }
    }
  }

  // Handler para logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await authService.signOut();
        navigateTo('/login');
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
        alert('Erro ao fazer logout. Tente novamente.');
      }
    });
  }
}

export default { render, init };

