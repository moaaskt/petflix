/**
 * ProfileFormModal - Modal para criar/editar perfis
 */

// Lista de avatares disponíveis (todos da pasta avataresPerfis)
const DEFAULT_AVATARS = [
  'assets/avataresPerfis/caramelo.jpg',
  'assets/avataresPerfis/dog1.jpg',
  'assets/avataresPerfis/dog2.jpg',
  'assets/avataresPerfis/dog3.jpg',
  'assets/avataresPerfis/dog4.jpg',
  'assets/avataresPerfis/dog5.jpg',
  'assets/avataresPerfis/gato-siames-1.jpg',
  'assets/avataresPerfis/gato1.jpg',
  'assets/avataresPerfis/gato2.jpg',
  'assets/avataresPerfis/Image_fx (8).jpg'
];

export class ProfileFormModal {
  constructor({ profile = null, profilesCount = 0, onSave, onDelete, onClose }) {
    this.profile = profile; // Se null, é criação. Se preenchido, é edição
    this.profilesCount = profilesCount;
    this.onSave = onSave;
    this.onDelete = onDelete;
    this.onClose = onClose;
    this.formData = {
      name: profile?.name || '',
      species: profile?.species || 'dog',
      avatar: profile?.avatar || '',
      color: profile?.color || 'blue',
      icon: profile?.icon || ''
    };
    this.isDeleting = false;
  }

  /**
   * Renderiza o modal
   */
  render() {
    const isEditMode = this.profile !== null;
    const modalId = 'profileFormModal';
    const canDelete = isEditMode && this.profilesCount > 1;
    
    // Avatar padrão baseado na espécie
    const defaultAvatar = this.formData.species === 'dog' 
      ? 'assets/avataresPerfis/caramelo.jpg' 
      : 'assets/avataresPerfis/gato-siames-1.jpg';
    
    const avatarUrl = this.formData.avatar || defaultAvatar;
    
    return `
      <div id="${modalId}" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm hidden animate-fade-in">
        <div class="glass-panel backdrop-blur-3xl rounded-[2.5rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4 border border-white/10 animate-fade-in-up">
          <!-- Header -->
          <div class="flex items-center justify-between p-8 border-b border-white/5">
            <h2 class="text-3xl font-black text-white tracking-tight">
              ${isEditMode ? 'Editar <span class="text-zinc-500">Perfil</span>' : 'Novo <span class="text-zinc-500">Perfil</span>'}
            </h2>
            <button 
              id="closeModalBtn"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Fechar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Form -->
          <form id="profileForm" class="p-8 space-y-8">
            <!-- Preview do Avatar Principal -->
            <div class="flex justify-center relative group">
              <div class="absolute inset-0 bg-red-600/20 blur-3xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity"></div>
              <div class="relative w-40 h-40 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                <img 
                  src="${avatarUrl}" 
                  alt="Avatar" 
                  class="w-full h-full object-cover animate-fade-in"
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
                />
                <div class="hidden w-full h-full items-center justify-center bg-gradient-to-br from-red-500 to-red-700">
                  <span class="text-white text-5xl font-black">
                    ${this.formData.name ? this.formData.name.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nome -->
              <div class="space-y-2">
                <label for="profileName" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                  Nome do Pet
                </label>
                <input
                  type="text"
                  id="profileName"
                  name="name"
                  required
                  minlength="3"
                  maxlength="20"
                  value="${this.formData.name}"
                  class="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold placeholder-zinc-600 focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all"
                  placeholder="Ex: Totó"
                />
              </div>
              
              <!-- Espécie -->
              <div class="space-y-2">
                <label for="profileSpecies" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                  Espécie
                </label>
                <div class="relative">
                  <select
                    id="profileSpecies"
                    name="species"
                    required
                    class="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold appearance-none focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all cursor-pointer"
                  >
                    <option value="dog" ${this.formData.species === 'dog' ? 'selected' : ''}>Cachorro</option>
                    <option value="cat" ${this.formData.species === 'cat' ? 'selected' : ''}>Gato</option>
                  </select>
                  <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                      <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Seletor de Avatares -->
            <div class="space-y-4">
              <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                Escolha o Avatar do seu Pet
              </label>
              <div id="avatars-grid" class="grid grid-cols-5 gap-3">
                ${DEFAULT_AVATARS.map((avatarUrl, index) => {
                  const isSelected = this.formData.avatar === avatarUrl;
                  return `
                    <button
                      type="button"
                      class="avatar-option relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 group/avatar ${
                        isSelected 
                          ? 'border-red-600 scale-105 shadow-[0_0_15px_rgba(229,9,20,0.3)]' 
                          : 'border-white/5 hover:border-white/20 hover:scale-105'
                      }"
                      data-avatar-url="${avatarUrl}"
                    >
                      <img 
                        src="${avatarUrl}" 
                        alt="Avatar ${index + 1}"
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                      ${isSelected ? `
                        <div class="absolute inset-0 bg-red-600/20 flex items-center justify-center backdrop-blur-[1px]">
                          <div class="bg-red-600 rounded-full p-1 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-3 h-3 text-white">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                        </div>
                      ` : ''}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Mensagem de erro -->
            <div id="errorMessage" class="hidden p-4 bg-red-600/10 border border-red-600/20 rounded-xl text-red-500 text-xs font-bold animate-fade-in"></div>

            <!-- Exclusão -->
            ${isEditMode && canDelete ? `
              <div id="deleteConfirmation" class="hidden p-6 bg-red-600/5 border border-red-600/10 rounded-2xl animate-fade-in">
                <p class="text-red-500 text-sm font-black uppercase tracking-wider mb-2">Excluir Perfil?</p>
                <p class="text-zinc-500 text-xs font-medium mb-4">Esta ação é irreversível. Todos os dados do pet serão perdidos.</p>
                <div class="flex gap-3">
                  <button
                    type="button"
                    id="confirmDeleteBtn"
                    class="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition-all text-xs"
                  >
                    SIM, EXCLUIR
                  </button>
                  <button
                    type="button"
                    id="cancelDeleteBtn"
                    class="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-black rounded-xl transition-all text-xs"
                  >
                    CANCELAR
                  </button>
                </div>
              </div>
            ` : ''}
            
            <!-- Footer Actions -->
            <div class="flex items-center justify-between gap-4 pt-6 border-t border-white/5">
              <div class="flex-1">
                ${isEditMode && canDelete ? `
                  <button
                    type="button"
                    id="deleteBtn"
                    class="w-full px-6 py-4 bg-white/5 hover:bg-red-600/10 text-zinc-500 hover:text-red-500 font-black rounded-2xl transition-all text-xs tracking-widest border border-white/5 hover:border-red-600/20"
                  >
                    EXCLUIR
                  </button>
                ` : ''}
              </div>
              
              <div class="flex gap-3 flex-[2]">
                <button
                  type="button"
                  id="cancelBtn"
                  class="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all text-xs tracking-widest border border-white/5"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  id="saveBtn"
                  class="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all text-xs tracking-widest shadow-lg shadow-red-600/20 active:scale-95"
                >
                  ${isEditMode ? 'SALVAR' : 'CRIAR'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
  }


  /**
   * Inicializa event listeners do modal
   */
  init() {
    const modal = document.getElementById('profileFormModal');
    if (!modal) return;

    // Botão fechar
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    const closeModal = () => {
      if (modal) modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
      if (this.onClose) this.onClose();
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', closeModal);
    }

    // Fecha ao clicar no overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Fecha com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    // Submit do formulário
    const form = document.getElementById('profileForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleSubmit();
      });
    }

    // Botão de excluir
    const deleteBtn = document.getElementById('deleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const deleteConfirmation = document.getElementById('deleteConfirmation');

    if (deleteBtn && deleteConfirmation) {
      deleteBtn.addEventListener('click', () => {
        deleteConfirmation.classList.remove('hidden');
        deleteBtn.style.display = 'none';
      });
    }

    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', async () => {
        await this.handleDelete();
      });
    }

    if (cancelDeleteBtn && deleteConfirmation) {
      cancelDeleteBtn.addEventListener('click', () => {
        deleteConfirmation.classList.add('hidden');
        if (deleteBtn) deleteBtn.style.display = 'block';
      });
    }

    // Event listeners para seleção de avatares
    const avatarOptions = modal.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const avatarUrl = option.getAttribute('data-avatar-url');
        if (avatarUrl) {
          this.selectAvatar(avatarUrl);
        }
      });
    });

    // Marca o avatar inicial como selecionado se existir
    if (this.formData.avatar) {
      // Verifica se o avatar atual está na lista de avatares padrão
      const isDefaultAvatar = DEFAULT_AVATARS.includes(this.formData.avatar);
      if (isDefaultAvatar) {
        this.updateAvatarGridSelection(this.formData.avatar);
      }
    }

    // Atualiza preview quando nome ou espécie mudam
    const nameInput = document.getElementById('profileName');
    const speciesSelect = document.getElementById('profileSpecies');

    const updatePreview = () => {
      const name = nameInput?.value || '';
      const species = speciesSelect?.value || 'dog';
      const avatar = this.formData.avatar || '';
      
      const previewImg = modal.querySelector('.flex.justify-center img');
      const previewFallback = modal.querySelector('.flex.justify-center .flex.w-full.h-full');
      const previewIcon = previewFallback?.querySelector('span');
      
      // Atualiza ícone
      if (previewIcon && name) {
        previewIcon.textContent = name.charAt(0).toUpperCase();
      }

      // Atualiza cor baseado na espécie
      if (previewFallback) {
        const isCat = species === 'cat';
        previewFallback.className = `flex w-full h-full items-center justify-center ${
          isCat ? 'bg-red-600' : 'bg-blue-600'
        }`;
      }

      // Atualiza avatar se houver URL
      if (avatar && previewImg) {
        previewImg.src = avatar;
        previewImg.style.display = 'block';
        if (previewFallback) previewFallback.style.display = 'none';
      } else if (previewImg && previewFallback) {
        previewImg.style.display = 'none';
        previewFallback.style.display = 'flex';
      }
    };

    if (nameInput) nameInput.addEventListener('input', updatePreview);
    if (speciesSelect) speciesSelect.addEventListener('change', updatePreview);

    // Se não houver avatar selecionado, seleciona o padrão baseado na espécie
    if (!this.formData.avatar) {
      const defaultAvatar = this.formData.species === 'dog' 
        ? 'assets/avataresPerfis/caramelo.jpg' 
        : 'assets/avataresPerfis/gato-siames-1.jpg';
      this.formData.avatar = defaultAvatar;
      this.updateAvatarGridSelection(defaultAvatar);
      updatePreview();
    }
  }

  /**
   * Seleciona um avatar da galeria
   * @param {string} avatarUrl - URL do avatar selecionado
   */
  selectAvatar(avatarUrl) {
    this.formData.avatar = avatarUrl;

    // Atualiza visual da grid
    this.updateAvatarGridSelection(avatarUrl);

    // Atualiza preview
    this.updateAvatarPreview();
  }

  /**
   * Atualiza a seleção visual na grid de avatares
   * @param {string} selectedUrl - URL do avatar selecionado
   */
  updateAvatarGridSelection(selectedUrl) {
    const modal = document.getElementById('profileFormModal');
    if (!modal) return;

    const avatarOptions = modal.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
      const optionUrl = option.getAttribute('data-avatar-url');
      const isSelected = optionUrl === selectedUrl;
      
      if (isSelected) {
        option.classList.add('border-red-600', 'scale-105', 'shadow-[0_0_15px_rgba(229,9,20,0.3)]');
        option.classList.remove('border-white/5', 'hover:border-white/20');
        
        // Adiciona ícone de check se não existir
        if (!option.querySelector('.bg-red-600')) {
          const checkIcon = document.createElement('div');
          checkIcon.className = 'absolute inset-0 bg-red-600/20 flex items-center justify-center backdrop-blur-[1px]';
          checkIcon.innerHTML = `
            <div class="bg-red-600 rounded-full p-1 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-3 h-3 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          `;
          option.appendChild(checkIcon);
        }
      } else {
        option.classList.remove('border-red-600', 'scale-105', 'shadow-[0_0_15px_rgba(229,9,20,0.3)]');
        option.classList.add('border-white/5', 'hover:border-white/20');
        
        // Remove ícone de check
        const checkIcon = option.querySelector('.bg-red-600')?.parentElement;
        if (checkIcon && checkIcon.classList.contains('absolute')) {
          checkIcon.remove();
        }
      }
    });

  }

  /**
   * Remove seleção dos avatares da grid
   */
  clearAvatarSelection() {
    const modal = document.getElementById('profileFormModal');
    if (!modal) return;

    const avatarOptions = modal.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
      option.classList.remove('ring-4', 'ring-green-500', 'border-green-500', 'scale-110');
      option.classList.add('border-zinc-600', 'hover:border-zinc-400');
      
      const checkIcon = option.querySelector('svg')?.parentElement;
      if (checkIcon && checkIcon.classList.contains('absolute')) {
        checkIcon.remove();
      }
    });
  }

  /**
   * Atualiza o preview do avatar
   */
  updateAvatarPreview() {
    const modal = document.getElementById('profileFormModal');
    if (!modal) return;

    const avatarUrl = this.formData.avatar;
    const previewImg = modal.querySelector('.flex.justify-center img');
    const previewFallback = modal.querySelector('.flex.justify-center .flex.w-full.h-full');
    
    if (avatarUrl && previewImg) {
      previewImg.src = avatarUrl;
      previewImg.style.display = 'block';
      if (previewFallback) previewFallback.style.display = 'none';
    } else if (previewImg && previewFallback) {
      previewImg.style.display = 'none';
      previewFallback.style.display = 'flex';
    }
  }

  /**
   * Valida o formulário
   */
  validateForm() {
    const nameInput = document.getElementById('profileName');
    const name = nameInput?.value.trim() || '';

    if (!name || name.length < 3) {
      this.showError('O nome deve ter pelo menos 3 caracteres');
      return false;
    }

    if (name.length > 20) {
      this.showError('O nome deve ter no máximo 20 caracteres');
      return false;
    }

    // Valida se um avatar foi selecionado
    if (!this.formData.avatar || !DEFAULT_AVATARS.includes(this.formData.avatar)) {
      this.showError('Por favor, selecione um avatar da galeria');
      return false;
    }

    this.hideError();
    return true;
  }

  /**
   * Mostra mensagem de erro
   */
  showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.remove('hidden');
    }
  }

  /**
   * Esconde mensagem de erro
   */
  hideError() {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
      errorDiv.classList.add('hidden');
    }
  }

  /**
   * Processa o submit do formulário
   */
  async handleSubmit() {
    if (!this.validateForm()) {
      return;
    }

    const form = document.getElementById('profileForm');
    if (!form) return;

    const formDataObj = new FormData(form);
    const name = formDataObj.get('name').trim();
    const species = formDataObj.get('species');
    
    // Usa o avatar selecionado do formData (não há mais input de URL)
    const profileData = {
      name: name,
      species: species,
      avatar: this.formData.avatar || '',
      color: species === 'cat' ? 'red' : 'blue',
      icon: name.charAt(0).toUpperCase()
    };

    try {
      const saveBtn = document.getElementById('saveBtn');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Salvando...';
      }

      if (this.onSave) {
        await this.onSave(profileData, this.profile?.id);
      }

      this.hide();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      this.showError(error.message || 'Erro ao salvar perfil. Tente novamente.');
      
      const saveBtn = document.getElementById('saveBtn');
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = this.profile ? 'Salvar' : 'Criar';
      }
    }
  }

  /**
   * Processa a exclusão do perfil
   */
  async handleDelete() {
    if (!this.profile?.id || this.profilesCount <= 1) {
      this.showError('Não é possível excluir o último perfil');
      return;
    }

    try {
      const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
      if (confirmDeleteBtn) {
        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.textContent = 'Excluindo...';
      }

      if (this.onDelete) {
        await this.onDelete(this.profile.id);
      }

      this.hide();
    } catch (error) {
      console.error('Erro ao excluir perfil:', error);
      this.showError(error.message || 'Erro ao excluir perfil. Tente novamente.');
      
      const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
      if (confirmDeleteBtn) {
        confirmDeleteBtn.disabled = false;
        confirmDeleteBtn.textContent = 'Sim, excluir';
      }
    }
  }

  /**
   * Mostra o modal
   */
  show() {
    const modal = document.getElementById('profileFormModal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      
      // Foca no campo de nome
      const nameInput = document.getElementById('profileName');
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 100);
      }
    }
  }

  /**
   * Esconde o modal
   */
  hide() {
    const modal = document.getElementById('profileFormModal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  }

  /**
   * Remove o modal do DOM
   */
  destroy() {
    const modal = document.getElementById('profileFormModal');
    if (modal && modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  }
}

export default ProfileFormModal;
