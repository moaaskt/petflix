/**
 * ProfileFormModal - Modal para criar/editar perfis
 */
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
      ? 'assets/caramelo.jpg' 
      : 'assets/gato-siames-1.jpg';
    
    const avatarUrl = this.formData.avatar || defaultAvatar;
    const defaultColor = this.formData.species === 'dog' ? 'blue' : 'red';
    const colorValue = this.formData.color || defaultColor;
    
    return `
      <div id="${modalId}" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 hidden">
        <div class="bg-zinc-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto m-4">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-zinc-700">
            <h2 class="text-2xl font-bold text-white">
              ${isEditMode ? 'Editar Perfil' : 'Novo Perfil'}
            </h2>
            <button 
              id="closeModalBtn"
              class="text-zinc-400 hover:text-white transition-colors"
              aria-label="Fechar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Form -->
          <form id="profileForm" class="p-6 space-y-4">
            <!-- Preview do Avatar -->
            <div class="flex justify-center mb-4">
              <div class="relative w-32 h-32 rounded-md overflow-hidden border-2 border-zinc-700">
                ${avatarUrl ? `
                  <img 
                    src="${avatarUrl}" 
                    alt="Avatar" 
                    class="w-full h-full object-cover"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
                  />
                ` : ''}
                <div 
                  class="${avatarUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center ${
                    colorValue === 'red' ? 'bg-red-600' : 'bg-blue-600'
                  }"
                >
                  <span class="text-white text-4xl">
                    ${this.formData.icon || (this.formData.name ? this.formData.name.charAt(0).toUpperCase() : '?')}
                  </span>
                </div>
              </div>
            </div>

            <!-- Nome -->
            <div>
              <label for="profileName" class="block text-sm font-medium text-zinc-300 mb-2">
                Nome *
              </label>
              <input
                type="text"
                id="profileName"
                name="name"
                required
                minlength="3"
                maxlength="20"
                value="${this.formData.name}"
                class="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Digite o nome do perfil"
              />
              <p class="mt-1 text-xs text-zinc-500">Mínimo 3 caracteres</p>
            </div>
            
            <!-- Espécie -->
            <div>
              <label for="profileSpecies" class="block text-sm font-medium text-zinc-300 mb-2">
                Espécie *
              </label>
              <select
                id="profileSpecies"
                name="species"
                required
                class="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="dog" ${this.formData.species === 'dog' ? 'selected' : ''}>Cachorro</option>
                <option value="cat" ${this.formData.species === 'cat' ? 'selected' : ''}>Gato</option>
              </select>
            </div>

            <!-- URL do Avatar (Opcional) -->
            <div>
              <label for="profileAvatar" class="block text-sm font-medium text-zinc-300 mb-2">
                URL do Avatar (Opcional)
              </label>
              <input
                type="url"
                id="profileAvatar"
                name="avatar"
                value="${this.formData.avatar}"
                class="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="https://exemplo.com/imagem.jpg"
              />
              <p class="mt-1 text-xs text-zinc-500">Deixe em branco para usar o avatar padrão</p>
            </div>

            <!-- Mensagem de erro (se houver) -->
            <div id="errorMessage" class="hidden text-red-400 text-sm"></div>

            <!-- Mensagem de confirmação de exclusão -->
            ${isEditMode && canDelete ? `
              <div id="deleteConfirmation" class="hidden p-4 bg-red-900/20 border border-red-700 rounded-lg">
                <p class="text-red-400 text-sm font-semibold mb-2">Tem certeza que deseja excluir este perfil?</p>
                <p class="text-zinc-400 text-xs mb-3">Esta ação não pode ser desfeita.</p>
                <div class="flex gap-2">
                  <button
                    type="button"
                    id="confirmDeleteBtn"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    Sim, excluir
                  </button>
                  <button
                    type="button"
                    id="cancelDeleteBtn"
                    class="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ` : ''}
            
            <!-- Footer Actions -->
            <div class="flex items-center justify-between gap-4 pt-4 border-t border-zinc-700">
              <div>
                ${isEditMode && canDelete ? `
                  <button
                    type="button"
                    id="deleteBtn"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    Excluir
                  </button>
                ` : ''}
                ${isEditMode && !canDelete ? `
                  <p class="text-xs text-zinc-500">Você não pode excluir o último perfil</p>
                ` : ''}
              </div>
              
              <div class="flex gap-3">
                <button
                  type="button"
                  id="cancelBtn"
                  class="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="saveBtn"
                  class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  ${isEditMode ? 'Salvar' : 'Criar'}
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

    // Atualiza preview quando nome ou espécie mudam
    const nameInput = document.getElementById('profileName');
    const speciesSelect = document.getElementById('profileSpecies');
    const avatarInput = document.getElementById('profileAvatar');

    const updatePreview = () => {
      const name = nameInput?.value || '';
      const species = speciesSelect?.value || 'dog';
      const avatar = avatarInput?.value || '';
      
      const previewImg = modal.querySelector('img');
      const previewFallback = modal.querySelector('.flex.w-full.h-full');
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
    if (avatarInput) avatarInput.addEventListener('input', updatePreview);
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

    const formData = new FormData(form);
    const profileData = {
      name: formData.get('name').trim(),
      species: formData.get('species'),
      avatar: formData.get('avatar')?.trim() || '',
      color: formData.get('species') === 'cat' ? 'red' : 'blue',
      icon: formData.get('name').trim().charAt(0).toUpperCase()
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
