/**
 * MovieFormModal - Modal para criar/editar filmes
 */
export class MovieFormModal {
  constructor({ movie = null, onSave, onClose }) {
    this.movie = movie; // Se null, é criação. Se preenchido, é edição
    this.onSave = onSave;
    this.onClose = onClose;
    this.formData = {
      title: movie?.title || '',
      description: movie?.description || '',
      image: movie?.image || '',
      videoId: movie?.videoId || '',
      species: movie?.species || 'dog',
      genre: movie?.genre || 'comedy',
      type: movie?.type || 'movie',
      featured: movie?.featured || false,
      trending: movie?.trending || false,
      original: movie?.original || false
    };
  }

  /**
   * Mapeia IDs de gênero para labels legíveis
   */
  getGenreLabel(id) {
    const labels = {
      comedy: 'Comédia',
      action: 'Ação',
      drama: 'Drama',
      adventure: 'Aventura'
    };
    return labels[id] || id;
  }

  /**
   * Mapeia IDs de tipo para labels legíveis
   */
  getTypeLabel(id) {
    const labels = {
      movie: 'Filme',
      series: 'Série',
      doc: 'Documentário'
    };
    return labels[id] || id;
  }

  /**
   * Renderiza o modal
   */
  render() {
    const isEditMode = this.movie !== null;
    const modalId = 'movieFormModal';
    
    return `
      <div id="${modalId}" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm hidden animate-fade-in">
        <div class="glass-panel backdrop-blur-3xl rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden m-4 border border-white/10 animate-fade-in-up">
          
          <div class="flex flex-col md:flex-row h-full max-h-[90vh]">
            <!-- Lado Esquerdo: Formulário -->
            <div class="flex-1 overflow-y-auto p-8 md:p-12 border-r border-white/5 custom-scrollbar">
              <div class="flex items-center justify-between mb-10">
                <div>
                  <h2 class="text-3xl font-black text-white tracking-tight">
                    ${isEditMode ? 'Editar <span class="text-zinc-500 font-medium">Conteúdo</span>' : 'Novo <span class="text-zinc-500 font-medium">Conteúdo</span>'}
                  </h2>
                  <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Painel Administrativo Petflix</p>
                </div>
                <button 
                  id="closeModalBtn"
                  class="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form id="movieForm" class="space-y-8">
                <!-- Seção: Informações Básicas -->
                <div class="space-y-6">
                  <div class="space-y-2">
                    <label for="movieTitle" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Título do Filme/Série</label>
                    <input type="text" id="movieTitle" name="title" required value="${this.formData.title}"
                      class="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold placeholder-zinc-600 focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all"
                      placeholder="Ex: O Resgate do Totó">
                  </div>

                  <div class="space-y-2">
                    <label for="movieDescription" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Sinopse</label>
                    <textarea id="movieDescription" name="description" required rows="3"
                      class="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-medium placeholder-zinc-600 focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all resize-none"
                      placeholder="Conte um pouco sobre essa aventura pet...">${this.formData.description}</textarea>
                  </div>
                </div>

                <!-- Seção: Mídia -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label for="movieImage" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">URL da Capa (Poster)</label>
                    <input type="url" id="movieImage" name="image" required value="${this.formData.image}"
                      class="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-mono text-xs placeholder-zinc-600 focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all"
                      placeholder="https://images.unsplash.com/...">
                  </div>
                  <div class="space-y-2">
                    <label for="movieVideoId" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">YouTube Video ID</label>
                    <input type="text" id="movieVideoId" name="videoId" required value="${this.formData.videoId}"
                      class="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-mono text-xs placeholder-zinc-600 focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all"
                      placeholder="ex: Ws-9ra38AlI">
                  </div>
                </div>

                <!-- Seção: Categorização (Custom Dropdowns) -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Custom Select: Espécie -->
                  <div class="space-y-2 relative custom-select-container" data-select-id="movieSpecies">
                    <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Público Pet</label>
                    <div class="select-trigger w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all">
                      <span class="selected-value">${this.formData.species === 'dog' ? 'Cachorro' : 'Gato'}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-zinc-500 transition-transform duration-300">
                        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="select-options absolute z-[60] left-0 right-0 mt-2 py-2 glass-panel backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl opacity-0 scale-95 pointer-events-none transition-all duration-300 origin-top">
                      <div class="option px-5 py-3 hover:bg-red-600/20 text-white font-bold cursor-pointer transition-colors" data-value="dog">Cachorro</div>
                      <div class="option px-5 py-3 hover:bg-red-600/20 text-white font-bold cursor-pointer transition-colors" data-value="cat">Gato</div>
                    </div>
                    <select id="movieSpecies" name="species" class="hidden">
                      <option value="dog" ${this.formData.species === 'dog' ? 'selected' : ''}>dog</option>
                      <option value="cat" ${this.formData.species === 'cat' ? 'selected' : ''}>cat</option>
                    </select>
                  </div>

                  <!-- Custom Select: Gênero -->
                  <div class="space-y-2 relative custom-select-container" data-select-id="movieGenre">
                    <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Gênero</label>
                    <div class="select-trigger w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all">
                      <span class="selected-value">${this.getGenreLabel(this.formData.genre)}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-zinc-500 transition-transform duration-300">
                        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="select-options absolute z-[60] left-0 right-0 mt-2 py-2 glass-panel backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl opacity-0 scale-95 pointer-events-none transition-all duration-300 origin-top">
                      <div class="option px-5 py-3 hover:bg-red-600/20 text-white font-bold cursor-pointer transition-colors" data-value="comedy">Comédia</div>
                      <div class="option px-5 py-3 hover:bg-red-600/20 text-white font-bold cursor-pointer transition-colors" data-value="action">Ação</div>
                      <div class="option px-5 py-3 hover:bg-red-600/20 text-white font-bold cursor-pointer transition-colors" data-value="drama">Drama</div>
                      <div class="option px-5 py-3 hover:bg-red-600/20 text-white font-bold cursor-pointer transition-colors" data-value="adventure">Aventura</div>
                    </div>
                    <select id="movieGenre" name="genre" class="hidden">
                      <option value="comedy" ${this.formData.genre === 'comedy' ? 'selected' : ''}>comedy</option>
                      <option value="action" ${this.formData.genre === 'action' ? 'selected' : ''}>action</option>
                      <option value="drama" ${this.formData.genre === 'drama' ? 'selected' : ''}>drama</option>
                      <option value="adventure" ${this.formData.genre === 'adventure' ? 'selected' : ''}>adventure</option>
                    </select>
                  </div>

                  <!-- Custom Select: Tipo -->
                  <div class="space-y-2 relative custom-select-container" data-select-id="movieType">
                    <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Tipo de Mídia</label>
                    <div class="select-trigger w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all">
                      <span class="selected-value">${this.getTypeLabel(this.formData.type)}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-zinc-500 transition-transform duration-300">
                        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="select-options absolute z-[60] left-0 right-0 mt-2 py-2 glass-panel backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl opacity-0 scale-95 pointer-events-none transition-all duration-300 origin-top">
                      <div class="option px-5 py-3 hover:bg-red-600/20 text-white font-bold cursor-pointer transition-colors" data-value="movie">Filme</div>
                      <div class="option px-5 py-3 hover:bg-red-600/20 text-white font-bold cursor-pointer transition-colors" data-value="series">Série</div>
                      <div class="option px-5 py-3 hover:bg-red-600/20 text-white font-bold cursor-pointer transition-colors" data-value="doc">Documentário</div>
                    </div>
                    <select id="movieType" name="type" class="hidden">
                      <option value="movie" ${this.formData.type === 'movie' ? 'selected' : ''}>movie</option>
                      <option value="series" ${this.formData.type === 'series' ? 'selected' : ''}>series</option>
                      <option value="doc" ${this.formData.type === 'doc' ? 'selected' : ''}>doc</option>
                    </select>
                  </div>
                </div>


                <!-- Seção: Tags / Status (Chips interativos) -->
                <div class="space-y-4">
                  <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Atributos Especiais</label>
                  <div class="flex flex-wrap gap-3">
                    <label class="relative flex items-center group cursor-pointer">
                      <input type="checkbox" name="featured" ${this.formData.featured ? 'checked' : ''} class="peer sr-only">
                      <div class="px-5 py-3 rounded-xl bg-white/5 border border-white/5 text-zinc-500 font-black text-[10px] tracking-widest uppercase transition-all peer-checked:bg-red-600 peer-checked:text-white peer-checked:border-red-600 peer-checked:shadow-[0_0_15px_rgba(229,9,20,0.3)] group-hover:bg-white/10">
                        EM DESTAQUE
                      </div>
                    </label>
                    <label class="relative flex items-center group cursor-pointer">
                      <input type="checkbox" name="trending" ${this.formData.trending ? 'checked' : ''} class="peer sr-only">
                      <div class="px-5 py-3 rounded-xl bg-white/5 border border-white/5 text-zinc-500 font-black text-[10px] tracking-widest uppercase transition-all peer-checked:bg-red-600 peer-checked:text-white peer-checked:border-red-600 peer-checked:shadow-[0_0_15px_rgba(229,9,20,0.3)] group-hover:bg-white/10">
                        BOMBANDO
                      </div>
                    </label>
                    <label class="relative flex items-center group cursor-pointer">
                      <input type="checkbox" name="original" ${this.formData.original ? 'checked' : ''} class="peer sr-only">
                      <div class="px-5 py-3 rounded-xl bg-white/5 border border-white/5 text-zinc-500 font-black text-[10px] tracking-widest uppercase transition-all peer-checked:bg-red-600 peer-checked:text-white peer-checked:border-red-600 peer-checked:shadow-[0_0_15px_rgba(229,9,20,0.3)] group-hover:bg-white/10">
                        ORIGINAL PETFLIX
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Footer -->
                <div class="flex gap-4 pt-6">
                  <button type="button" id="cancelBtn" 
                    class="flex-1 px-8 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all text-xs tracking-widest border border-white/5">
                    CANCELAR
                  </button>
                  <button type="submit" 
                    class="flex-[2] px-8 py-5 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all text-xs tracking-widest shadow-lg shadow-red-600/20 active:scale-[0.98]">
                    ${isEditMode ? 'ATUALIZAR CONTEÚDO' : 'CRIAR NOVO FILME'}
                  </button>
                </div>
              </form>
            </div>

            <!-- Lado Direito: Preview em tempo real -->
            <div class="hidden md:flex w-[400px] bg-black/40 p-12 flex-col items-center justify-center text-center space-y-8">
              <div class="space-y-2">
                <h3 class="text-white font-black text-xl uppercase tracking-tighter">Live Preview</h3>
                <p class="text-zinc-500 text-xs font-medium">Veja como o conteúdo aparecerá na plataforma</p>
              </div>

              <!-- Card Preview -->
              <div id="card-preview-container" class="w-64 transform scale-110">
                <div class="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 group">
                  <img id="preview-image" src="${this.formData.image || 'https://via.placeholder.com/400x600?text=Petflix+Capa'}" 
                    class="w-full h-full object-cover transition-transform duration-700">
                  <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                  
                  <div class="absolute bottom-6 left-6 right-6">
                    <h4 id="preview-title" class="text-white font-black text-lg leading-tight mb-2 line-clamp-2">${this.formData.title || 'Título do Filme'}</h4>
                    <div class="flex items-center gap-2">
                      <span class="text-[8px] font-black text-zinc-400 uppercase tracking-widest">4K ULTRA HD</span>
                      <span class="w-1 h-1 rounded-full bg-red-600"></span>
                      <span id="preview-genre" class="text-[8px] font-black text-red-500 uppercase tracking-widest">${this.formData.genre}</span>
                    </div>
                  </div>

                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-white ml-1">
                        <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white/5 p-6 rounded-2xl border border-white/5 w-full">
                <p class="text-zinc-500 text-[10px] leading-relaxed font-medium">
                  Certifique-se de que a imagem de capa tenha uma proporção vertical (2:3) para garantir a melhor exibição no carrossel.
                </p>
              </div>

              <button 
                id="closeModalBtnDesktop"
                class="mt-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-black text-[10px] tracking-[0.3em] rounded-xl transition-all"
              >
                FECHAR PAINEL
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }


  /**
   * Inicializa event listeners do modal
   */
  init() {
    const modal = document.getElementById('movieFormModal');
    if (!modal) return;

    // Botões de fechar (Mobile e Desktop)
    const closeBtns = [
      document.getElementById('closeModalBtn'),
      document.getElementById('closeModalBtnDesktop'),
      document.getElementById('cancelBtn')
    ];
    
    const closeModal = () => {
      if (modal) modal.classList.add('hidden');
      if (this.onClose) this.onClose();
    };

    closeBtns.forEach(btn => {
      if (btn) btn.addEventListener('click', closeModal);
    });

    // Fecha ao clicar no overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Lógica de Live Preview
    const titleInput = document.getElementById('movieTitle');
    const imageInput = document.getElementById('movieImage');
    const genreSelect = document.getElementById('movieGenre');
    
    const previewTitle = document.getElementById('preview-title');
    const previewImage = document.getElementById('preview-image');
    const previewGenre = document.getElementById('preview-genre');

    if (titleInput && previewTitle) {
      titleInput.addEventListener('input', (e) => {
        previewTitle.textContent = e.target.value || 'Título do Filme';
      });
    }

    if (imageInput && previewImage) {
      imageInput.addEventListener('input', (e) => {
        const url = e.target.value;
        if (url) {
          previewImage.src = url;
        } else {
          previewImage.src = 'https://via.placeholder.com/400x600?text=Petflix+Capa';
        }
      });
    }

    if (genreSelect && previewGenre) {
      genreSelect.addEventListener('change', (e) => {
        previewGenre.textContent = this.getGenreLabel(e.target.value);
      });
    }

    // Lógica para Custom Selects
    const customSelects = document.querySelectorAll('.custom-select-container');
    customSelects.forEach(container => {
      const trigger = container.querySelector('.select-trigger');
      const optionsContainer = container.querySelector('.select-options');
      const options = container.querySelectorAll('.option');
      const hiddenSelect = container.querySelector('select');
      const selectedValueSpan = container.querySelector('.selected-value');
      const arrow = trigger.querySelector('svg');

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        // Fecha outros selects abertos
        document.querySelectorAll('.select-options').forEach(opt => {
          if (opt !== optionsContainer) {
            opt.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
            opt.parentElement.querySelector('svg').classList.remove('rotate-180');
          }
        });

        const isOpen = !optionsContainer.classList.contains('opacity-0');
        if (isOpen) {
          optionsContainer.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
          arrow.classList.remove('rotate-180');
        } else {
          optionsContainer.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
          arrow.classList.add('rotate-180');
        }
      });

      options.forEach(option => {
        option.addEventListener('click', () => {
          const value = option.dataset.value;
          const label = option.textContent;

          // Atualiza UI
          selectedValueSpan.textContent = label;
          hiddenSelect.value = value;
          
          // Dispara evento para o Live Preview
          hiddenSelect.dispatchEvent(new Event('change'));

          // Fecha
          optionsContainer.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
          arrow.classList.remove('rotate-180');
        });
      });
    });

    // Fecha selects ao clicar fora
    document.addEventListener('click', () => {
      document.querySelectorAll('.select-options').forEach(opt => {
        opt.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
        opt.parentElement.querySelector('svg').classList.remove('rotate-180');
      });
    });

    // Submit do formulário
    const form = document.getElementById('movieForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        const data = {
          title: formData.get('title'),
          description: formData.get('description'),
          image: formData.get('image'),
          videoId: formData.get('videoId'),
          species: formData.get('species'),
          genre: formData.get('genre'),
          type: formData.get('type'),
          featured: formData.get('featured') === 'on',
          trending: formData.get('trending') === 'on',
          original: formData.get('original') === 'on'
        };

        try {
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'PROCESSANDO...';
          }

          if (this.onSave) {
            await this.onSave(data, this.movie?.id);
          }
          closeModal();
        } catch (error) {
          console.error('Erro ao salvar filme:', error);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
        }
      });
    }
  }


  /**
   * Mostra o modal
   */
  show() {
    const modal = document.getElementById('movieFormModal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  /**
   * Esconde o modal
   */
  hide() {
    const modal = document.getElementById('movieFormModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
}

export default MovieFormModal;

