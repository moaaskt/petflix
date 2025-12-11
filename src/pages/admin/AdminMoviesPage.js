/**
 * AdminMoviesPage - Página de gerenciamento de filmes
 */
import { getAll } from '../../services/content.service.js';

let moviesData = [];

export async function render() {
  return `
    <div class="p-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Gerenciar Filmes</h1>
        <button 
          id="newMovieBtn" 
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Novo Filme
        </button>
      </div>
      
      <!-- Table Container -->
      <div class="bg-zinc-900 rounded-lg border border-zinc-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-zinc-800 border-b border-zinc-700">
              <tr>
                <th class="px-6 py-4 text-zinc-300 font-semibold text-sm uppercase tracking-wider">Capa</th>
                <th class="px-6 py-4 text-zinc-300 font-semibold text-sm uppercase tracking-wider">Título</th>
                <th class="px-6 py-4 text-zinc-300 font-semibold text-sm uppercase tracking-wider">Espécie</th>
                <th class="px-6 py-4 text-zinc-300 font-semibold text-sm uppercase tracking-wider">Gênero</th>
                <th class="px-6 py-4 text-zinc-300 font-semibold text-sm uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-4 text-zinc-300 font-semibold text-sm uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody id="moviesTableBody" class="divide-y divide-zinc-700">
              <tr>
                <td colspan="6" class="px-6 py-12 text-center text-zinc-400">
                  <div class="flex flex-col items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 animate-spin">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <span>Carregando filmes...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Stats -->
      <div id="moviesStats" class="mt-4 text-sm text-zinc-400 hidden">
        Total: <span id="moviesCount" class="font-semibold text-white">0</span> filmes
      </div>
    </div>
  `;
}

export async function init() {
  try {
    // Carrega todos os filmes do Firestore
    moviesData = await getAll();
    
    // Renderiza a tabela
    renderTable();
    
    // Atualiza estatísticas
    updateStats();
    
    // Configura botão "Novo Filme" (placeholder)
    const newMovieBtn = document.getElementById('newMovieBtn');
    if (newMovieBtn) {
      newMovieBtn.addEventListener('click', () => {
        console.log('Novo Filme - Funcionalidade em desenvolvimento');
        // TODO: Implementar modal/formulário de novo filme
      });
    }
  } catch (error) {
    console.error('Erro ao carregar filmes:', error);
    const tbody = document.getElementById('moviesTableBody');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-12 text-center text-red-400">
            <div class="flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <span>Erro ao carregar filmes. Tente novamente.</span>
            </div>
          </td>
        </tr>
      `;
    }
  }
}

/**
 * Renderiza a tabela com os filmes
 */
function renderTable() {
  const tbody = document.getElementById('moviesTableBody');
  if (!tbody) return;
  
  if (moviesData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-12 text-center text-zinc-400">
          <div class="flex flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            <span>Nenhum filme encontrado</span>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = moviesData.map(movie => {
    const speciesIcon = movie.species === 'dog' 
      ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-blue-400">
           <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
         </svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-orange-400">
           <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
         </svg>`;
    
    const speciesLabel = movie.species === 'dog' ? 'Cachorro' : 'Gato';
    const genreLabels = {
      action: 'Ação',
      comedy: 'Comédia',
      drama: 'Drama',
      adventure: 'Aventura'
    };
    const typeLabels = {
      movie: 'Filme',
      series: 'Série',
      doc: 'Documentário'
    };
    
    return `
      <tr class="hover:bg-zinc-800 transition-colors">
        <td class="px-6 py-4">
          <img 
            src="${movie.image || '/assets/placeholder.jpg'}" 
            alt="${movie.title}" 
            class="w-16 h-24 object-cover rounded"
            onerror="this.src='https://via.placeholder.com/160x240?text=Sem+Imagem'"
          />
        </td>
        <td class="px-6 py-4">
          <div class="text-white font-medium">${movie.title || 'Sem título'}</div>
          <div class="text-zinc-400 text-sm mt-1 line-clamp-2">${movie.description || 'Sem descrição'}</div>
        </td>
        <td class="px-6 py-4">
          <div class="flex items-center gap-2">
            ${speciesIcon}
            <span class="text-zinc-300">${speciesLabel}</span>
          </div>
        </td>
        <td class="px-6 py-4">
          <span class="px-3 py-1 bg-zinc-700 text-zinc-200 rounded-full text-sm">
            ${genreLabels[movie.genre] || movie.genre}
          </span>
        </td>
        <td class="px-6 py-4">
          <span class="text-zinc-300">${typeLabels[movie.type] || movie.type}</span>
        </td>
        <td class="px-6 py-4">
          <div class="flex items-center justify-end gap-2">
            <button 
              data-movie-id="${movie.id}" 
              class="edit-btn p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
              title="Editar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
            <button 
              data-movie-id="${movie.id}" 
              class="delete-btn p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title="Excluir"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
  // Adiciona event listeners aos botões
  attachEventListeners();
}

/**
 * Atualiza estatísticas
 */
function updateStats() {
  const statsEl = document.getElementById('moviesStats');
  const countEl = document.getElementById('moviesCount');
  
  if (statsEl) statsEl.classList.remove('hidden');
  if (countEl) countEl.textContent = moviesData.length;
}

/**
 * Anexa event listeners aos botões de ação
 */
function attachEventListeners() {
  const editButtons = document.querySelectorAll('.edit-btn');
  const deleteButtons = document.querySelectorAll('.delete-btn');
  
  editButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const movieId = e.currentTarget.getAttribute('data-movie-id');
      console.log('Editar filme:', movieId);
      // TODO: Implementar modal de edição
    });
  });
  
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const movieId = e.currentTarget.getAttribute('data-movie-id');
      console.log('Excluir filme:', movieId);
      // TODO: Implementar confirmação e exclusão
    });
  });
}

