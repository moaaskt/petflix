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
    <div class="min-h-screen flex flex-col items-center justify-center">
      <h1 class="text-3xl md:text-5xl font-medium mb-8 text-white">Quem está assistindo?</h1>
      <div id="profiles-container" class="flex gap-4 md:gap-8 flex-wrap justify-center">
        <div class="flex items-center justify-center">
          <div class="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
      <div class="mt-12 flex flex-col items-center gap-4">
        <button id="manage-profiles-btn" class="border border-gray-400 text-gray-400 px-6 py-2 uppercase tracking-widest hover:border-white hover:text-white transition-all">
          Gerenciar perfis
        </button>
        <button id="add-profile-btn" class="hidden border border-green-500 text-green-500 px-6 py-2 uppercase tracking-widest hover:border-green-400 hover:text-green-400 transition-all">
          Adicionar Perfil
        </button>
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
      console.log('🔄 Nenhum perfil encontrado, inicializando perfis padrão...');
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
      console.log('✅ Perfil atualizado com sucesso');
    } else {
      // Cria novo perfil
      await createProfile(profileData);
      console.log('✅ Perfil criado com sucesso');
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
    console.log('✅ Perfil deletado com sucesso');

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

  // Salva o perfil selecionado
  localStorage.setItem('selectedProfile', profile.species);
  localStorage.setItem('selectedProfileId', profile.id);
  
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
