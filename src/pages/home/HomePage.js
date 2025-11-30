/**
 * HomePage - Página de seleção de perfil
 * Estilo Netflix
 */
import '../../styles/pages/home.css';
import { navigateTo } from '../../router/navigator.js';

export function render() {
  return `
    <div class="page page--home">
      <div class="profile-selection-container">
        <h1 class="profile-title">Quem está assistindo?</h1>
        
        <div class="profiles-wrapper">
          <!-- Perfil Cachorro -->
          <div class="profile-item" id="profile-dog" role="button" tabindex="0">
            <div class="profile-avatar" style="background-image: url('/assets/avatars/dog.png'), url('/assets/caramelo.jpg');">
              <img src="/assets/avatars/dog.png" alt="Cachorro" style="display:none;" onerror="this.parentElement.style.backgroundImage='url(/assets/caramelo.jpg)'">
            </div>
            <span class="profile-name">Cachorro</span>
          </div>

          <!-- Perfil Gato -->
          <div class="profile-item" id="profile-cat" role="button" tabindex="0">
            <div class="profile-avatar" style="background-image: url('/assets/avatars/cat.png'), url('/assets/gato3.jpg');">
              <img src="/assets/avatars/cat.png" alt="Gato" style="display:none;" onerror="this.parentElement.style.backgroundImage='url(/assets/gato3.jpg)'">
            </div>
            <span class="profile-name">Gato</span>
          </div>
        </div>

        <button class="manage-profiles-btn">Gerenciar perfis</button>
      </div>
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
    navigateTo('/filmes');
  } catch {
    window.location.hash = '#/filmes';
  }
}
