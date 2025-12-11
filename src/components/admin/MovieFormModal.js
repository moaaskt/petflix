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
   * Renderiza o modal
   */
  render() {
    const isEditMode = this.movie !== null;
    const modalId = 'movieFormModal';
    
    return `
      <div id="${modalId}" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 hidden">
        <div class="bg-zinc-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-zinc-700">
            <h2 class="text-2xl font-bold text-white">
              ${isEditMode ? 'Editar Filme' : 'Novo Filme'}
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
          <form id="movieForm" class="p-6 space-y-4">
            <!-- Título -->
            <div>
              <label for="movieTitle" class="block text-sm font-medium text-zinc-300 mb-2">
                Título *
              </label>
              <input
                type="text"
                id="movieTitle"
                name="title"
                required
                value="${this.formData.title}"
                class="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Digite o título do filme"
              />
            </div>
            
            <!-- Descrição -->
            <div>
              <label for="movieDescription" class="block text-sm font-medium text-zinc-300 mb-2">
                Descrição *
              </label>
              <textarea
                id="movieDescription"
                name="description"
                required
                rows="4"
                class="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                placeholder="Digite a descrição do filme"
              >${this.formData.description}</textarea>
            </div>
            
            <!-- Imagem URL -->
            <div>
              <label for="movieImage" class="block text-sm font-medium text-zinc-300 mb-2">
                URL da Imagem *
              </label>
              <input
                type="url"
                id="movieImage"
                name="image"
                required
                value="${this.formData.image}"
                class="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="https://images.unsplash.com/..."
              />
              ${this.formData.image ? `
                <div class="mt-2">
                  <img src="${this.formData.image}" alt="Preview" class="w-32 h-48 object-cover rounded" 
                       onerror="this.style.display='none'" />
                </div>
              ` : ''}
            </div>
            
            <!-- YouTube ID -->
            <div>
              <label for="movieVideoId" class="block text-sm font-medium text-zinc-300 mb-2">
                YouTube Video ID *
              </label>
              <input
                type="text"
                id="movieVideoId"
                name="videoId"
                required
                value="${this.formData.videoId}"
                class="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Ws-9ra38AlI"
              />
            </div>
            
            <!-- Grid de campos -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Espécie -->
              <div>
                <label for="movieSpecies" class="block text-sm font-medium text-zinc-300 mb-2">
                  Espécie *
                </label>
                <select
                  id="movieSpecies"
                  name="species"
                  required
                  class="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="dog" ${this.formData.species === 'dog' ? 'selected' : ''}>Cachorro</option>
                  <option value="cat" ${this.formData.species === 'cat' ? 'selected' : ''}>Gato</option>
                </select>
              </div>
              
              <!-- Gênero -->
              <div>
                <label for="movieGenre" class="block text-sm font-medium text-zinc-300 mb-2">
                  Gênero *
                </label>
                <select
                  id="movieGenre"
                  name="genre"
                  required
                  class="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="comedy" ${this.formData.genre === 'comedy' ? 'selected' : ''}>Comédia</option>
                  <option value="action" ${this.formData.genre === 'action' ? 'selected' : ''}>Ação</option>
                  <option value="drama" ${this.formData.genre === 'drama' ? 'selected' : ''}>Drama</option>
                  <option value="adventure" ${this.formData.genre === 'adventure' ? 'selected' : ''}>Aventura</option>
                </select>
              </div>
              
              <!-- Tipo -->
              <div>
                <label for="movieType" class="block text-sm font-medium text-zinc-300 mb-2">
                  Tipo *
                </label>
                <select
                  id="movieType"
                  name="type"
                  required
                  class="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="movie" ${this.formData.type === 'movie' ? 'selected' : ''}>Filme</option>
                  <option value="series" ${this.formData.type === 'series' ? 'selected' : ''}>Série</option>
                  <option value="doc" ${this.formData.type === 'doc' ? 'selected' : ''}>Documentário</option>
                </select>
              </div>
            </div>
            
            <!-- Checkboxes -->
            <div class="space-y-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="movieFeatured"
                  name="featured"
                  ${this.formData.featured ? 'checked' : ''}
                  class="w-4 h-4 text-red-600 bg-zinc-900 border-zinc-700 rounded focus:ring-red-600"
                />
                <span class="text-zinc-300">Em destaque (Featured)</span>
              </label>
              
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="movieTrending"
                  name="trending"
                  ${this.formData.trending ? 'checked' : ''}
                  class="w-4 h-4 text-red-600 bg-zinc-900 border-zinc-700 rounded focus:ring-red-600"
                />
                <span class="text-zinc-300">Em alta (Trending)</span>
              </label>
              
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="movieOriginal"
                  name="original"
                  ${this.formData.original ? 'checked' : ''}
                  class="w-4 h-4 text-red-600 bg-zinc-900 border-zinc-700 rounded focus:ring-red-600"
                />
                <span class="text-zinc-300">Original Petflix</span>
              </label>
            </div>
            
            <!-- Footer Actions -->
            <div class="flex items-center justify-end gap-4 pt-4 border-t border-zinc-700">
              <button
                type="button"
                id="cancelBtn"
                class="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                ${isEditMode ? 'Atualizar' : 'Criar'} Filme
              </button>
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
    const modal = document.getElementById('movieFormModal');
    if (!modal) return;

    // Botão fechar
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    const closeModal = () => {
      if (modal) modal.classList.add('hidden');
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

    // Submit do formulário
    const form = document.getElementById('movieForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
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
          if (this.onSave) {
            await this.onSave(data, this.movie?.id);
          }
          closeModal();
        } catch (error) {
          console.error('Erro ao salvar filme:', error);
          alert('Erro ao salvar filme. Tente novamente.');
        }
      });
    }

    // Preview da imagem ao mudar URL
    const imageInput = document.getElementById('movieImage');
    if (imageInput) {
      imageInput.addEventListener('input', (e) => {
        const url = e.target.value;
        const previewContainer = imageInput.parentElement.querySelector('div');
        if (previewContainer && url) {
          previewContainer.innerHTML = `<img src="${url}" alt="Preview" class="w-32 h-48 object-cover rounded" onerror="this.style.display='none'" />`;
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

