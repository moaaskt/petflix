/**
 * HomePage - Página de seleção de perfil
 * Estilo Netflix
 */
import { navigateTo } from '../../router/navigator.js';
import { applyTheme } from '../../state/AuthState.js';
import { getProfiles, initializeDefaultProfiles, createProfile, updateProfile, deleteProfile } from '../../services/profile.service.js';
import { ProfileCard } from '../../components/features/ProfileCard/ProfileCard.js';
import { ProfileFormModal } from '../../components/features/ProfileFormModal/ProfileFormModal.js';

// Estado da página
let isManaging = false;
let currentProfiles = [];

export function render() {
  return `
    <div class="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#0a0a0c]">
      <!-- Background sutil com luz ambiente -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div class="relative z-10 flex flex-col items-center animate-fade-in">
        <h1 class="text-4xl md:text-6xl font-black mb-16 text-white tracking-tighter text-center">
          Quem está assistindo <br class="md:hidden" /> <span class="text-red-600">agora?</span>
        </h1>
        
        <div id="profiles-container" class="flex gap-6 md:gap-12 flex-wrap justify-center px-4 max-w-6xl">
          <!-- Loading state aprimorado -->
          <div class="flex flex-col items-center gap-4">
            <div class="w-12 h-12 border-4 border-white/5 border-t-red-600 rounded-full animate-spin"></div>
            <p class="text-zinc-500 font-bold text-xs uppercase tracking-widest">Sincronizando perfis...</p>
          </div>
        </div>

        <div class="mt-20 flex flex-col items-center gap-6">
          <button id="manage-profiles-btn" class="group relative px-8 py-3 bg-white/5 border border-white/10 text-zinc-400 font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-white/10 hover:text-white transition-all duration-300">
            <span class="relative z-10">Gerenciar perfis</span>
          </button>
          
          <button id="add-profile-btn" class="hidden px-8 py-3 bg-red-600/10 border border-red-600/30 text-red-500 font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(229,9,20,0.1)]">
            Adicionar Perfil
          </button>
        </div>
      </div>

      <!-- Footer Branding -->
      <div class="absolute bottom-10 left-0 w-full flex justify-center opacity-30">
        <span class="text-red-600 text-3xl font-black tracking-tighter">PETFLIX</span>
      </div>
    </div>
  `;
}


export async function init() {
  await loadAndRenderProfiles();
  setupEventListeners();
}

/**
 * Configura os event listeners
 */
function setupEventListeners() {
  const manageBtn = document.getElementById('manage-profiles-btn');
  const addProfileBtn = document.getElementById('add-profile-btn');

  if (manageBtn) {
    manageBtn.addEventListener('click', toggleManageMode);
  }

  if (addProfileBtn) {
    addProfileBtn.addEventListener('click', () => {
      openProfileModal(null);
    });
  }
}

/**
 * Alterna o modo de gerenciamento
 */
function toggleManageMode() {
  isManaging = !isManaging;
  updateUI();
}

/**
 * Atualiza a UI baseado no estado de gerenciamento
 */
function updateUI() {
  const manageBtn = document.getElementById('manage-profiles-btn');
  const addProfileBtn = document.getElementById('add-profile-btn');

  if (manageBtn) {
    manageBtn.textContent = isManaging ? 'Pronto' : 'Gerenciar perfis';
  }

  if (addProfileBtn) {
    if (isManaging && currentProfiles.length < 5) {
      addProfileBtn.classList.remove('hidden');
    } else {
      addProfileBtn.classList.add('hidden');
    }
  }

  // Re-renderiza os cards com o estado de edição atualizado
  renderProfiles();
}

/**
 * Carrega e renderiza os perfis do usuário
 */
async function loadAndRenderProfiles() {
  const container = document.getElementById('profiles-container');
  if (!container) return;

  try {
    // Busca perfis do usuário
    let profiles = await getProfiles();

    // Se não houver perfis, inicializa os padrão
    if (!profiles || profiles.length === 0) {
      await initializeDefaultProfiles();
      profiles = await getProfiles();
    }

    // Atualiza o estado
    currentProfiles = profiles || [];
    
    // Renderiza os perfis
    renderProfiles();
  } catch (error) {
    console.error('Erro ao carregar perfis:', error);
    const container = document.getElementById('profiles-container');
    if (container) {
      container.innerHTML = `
        <p class="text-red-400">Erro ao carregar perfis. Tente recarregar a página.</p>
      `;
    }
  }
}

/**
 * Renderiza os perfis no container
 */
function renderProfiles() {
  const container = document.getElementById('profiles-container');
  if (!container) return;

  if (!currentProfiles || currentProfiles.length === 0) {
    container.innerHTML = `
      <p class="text-gray-400">Nenhum perfil encontrado</p>
    `;
    return;
  }

  // Renderiza os perfis com o estado de edição
  const profilesHtml = currentProfiles.map(profile => 
    ProfileCard({ profile, onClick: true, isEditing: isManaging })
  ).join('');
  
  container.innerHTML = profilesHtml;

  // Adiciona event listeners aos cards
  currentProfiles.forEach(profile => {
    const card = document.querySelector(`[data-profile-id="${profile.id}"]`);
    if (card) {
      card.addEventListener('click', () => {
        handleProfileClick(profile);
      });
    }
  });
}

/**
 * Lida com o clique em um card de perfil
 * @param {Object} profile - Objeto do perfil
 */
function handleProfileClick(profile) {
  if (!profile || !profile.id) {
    console.error('Perfil inválido:', profile);
    return;
  }

  if (isManaging) {
    // Modo de gerenciamento: abre modal de edição
    openProfileModal(profile);
  } else {
    // Modo normal: seleciona o perfil
    selectProfile(profile);
  }
}

/**
 * Abre o modal de criação/edição de perfil
 * @param {Object|null} profile - Perfil para editar (null para criar novo)
 */
function openProfileModal(profile) {
  // Remove modal existente se houver
  const existingModal = document.getElementById('profileFormModal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = new ProfileFormModal({
    profile: profile,
    profilesCount: currentProfiles.length,
    onSave: handleSaveProfile,
    onDelete: handleDeleteProfile,
    onClose: () => {
      modal.destroy();
    }
  });

  // Renderiza o modal no body
  document.body.insertAdjacentHTML('beforeend', modal.render());
  modal.init();
  modal.show();
}

/**
 * Salva um perfil (cria ou atualiza)
 * @param {Object} profileData - Dados do perfil
 * @param {string|null} profileId - ID do perfil (null para criar novo)
 */
async function handleSaveProfile(profileData, profileId) {
  try {
    if (profileId) {
      // Atualiza perfil existente
      await updateProfile(profileId, profileData);
    } else {
      // Cria novo perfil
      await createProfile(profileData);
    }

    // Recarrega a lista de perfis
    await loadAndRenderProfiles();
    
    // Atualiza UI
    updateUI();
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    throw error; // Re-throw para o modal tratar
  }
}

/**
 * Deleta um perfil
 * @param {string} profileId - ID do perfil a deletar
 */
async function handleDeleteProfile(profileId) {
  try {
    await deleteProfile(profileId);

    // Recarrega a lista de perfis
    await loadAndRenderProfiles();
    
    // Atualiza UI
    updateUI();
  } catch (error) {
    console.error('Erro ao deletar perfil:', error);
    throw error; // Re-throw para o modal tratar
  }
}

/**
 * Seleciona um perfil e redireciona para o dashboard
 * @param {Object} profile - Objeto do perfil
 */
function selectProfile(profile) {
  if (!profile || !profile.id) {
    console.error('Perfil inválido:', profile);
    return;
  }

  // Salva o perfil selecionado com chaves padronizadas
  localStorage.setItem('petflix_selected_species', profile.species);
  localStorage.setItem('petflix_selected_profile_id', profile.id);
  
  // Atualiza o estado global da aplicação
  const { AppState } = await import('../../state/AppState.js');
  AppState.setState({ petType: profile.species });
  
  // Aplica o tema baseado na espécie
  const species = profile.species || 'dog';
  try {
    applyTheme(species === 'cat' ? 'cat' : 'dog');
    navigateTo('/dashboard');
  } catch (error) {
    console.error('Erro ao aplicar tema:', error);
    window.location.hash = '#/dashboard';
  }
}
