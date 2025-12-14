/**
 * MyListPage - Página de "Minha Lista"
 * Exibe todos os filmes salvos na lista do perfil atual
 */
import { navigateTo } from '../router/navigator.js';
import { getList, toggleItem } from '../services/list.service.js';
import { ThumbnailCard } from '../components/features/ThumbnailCard/ThumbnailCard.js';
import { LoadingSpinner } from '../components/ui/Loading/LoadingSpinner.js';
import { Toast } from '../utils/toast.js';
import { ConfirmationModal } from '../components/ui/ConfirmationModal.js';

export function render() {
  return `
    <div class="min-h-screen bg-[#141414] pt-24 pb-16">
      <div class="container mx-auto px-4 md:px-8">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-8">Minha Lista</h1>
        <div id="list-container" class="min-h-[400px]">
          <div class="flex items-center justify-center py-20">
            <div class="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function init() {
  await loadList();
}

/**
 * Carrega e renderiza a lista de filmes
 */
async function loadList() {
  const container = document.getElementById('list-container');
  if (!container) return;

  try {
    const species = document.body.classList.contains('theme-cat') ? 'cat' : 'dog';
    const spinner = new LoadingSpinner({ type: species });
    spinner.show();

    const items = await getList();

    // Remove o spinner
    setTimeout(() => {
      const overlay = document.getElementById('loadingOverlay');
      if (overlay) overlay.remove();
    }, 300);

    if (!items || items.length === 0) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-24 h-24 text-gray-600 mb-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
          <h2 class="text-2xl font-semibold text-white mb-2">Sua lista está vazia</h2>
          <p class="text-gray-400 text-lg max-w-md">
            Adicione filmes e séries para assistir depois. Clique no botão "+" em qualquer conteúdo para adicionar à sua lista.
          </p>
        </div>
      `;
      return;
    }

    // Renderiza a grid de filmes
    const grid = items.map(item => {
      const cardData = {
        id: item.videoId || item.id,
        title: item.title || 'Sem título',
        thumbnail: item.thumbnail || item.image || 'assets/background-index.jpg',
        isInList: true
      };
      return ThumbnailCard(cardData);
    }).join('');

    container.innerHTML = `
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        ${grid}
      </div>
    `;

    // Adiciona event listeners aos cards
    const cards = container.querySelectorAll('[data-id]');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        if (id) {
          navigateTo(`/player?videoId=${id}`);
        }
      });
    });

    // Event listeners para os botões de lista
    container.querySelectorAll('[data-movie-id]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation(); // Impede que o clique abra o player
        e.preventDefault();
        
        const movieId = btn.getAttribute('data-movie-id');
        const card = btn.closest('[data-id]');
        if (!card) return;
        
        // Buscar dados do filme do card
        const title = card.getAttribute('aria-label') || card.querySelector('img')?.alt || 'Filme';
        const thumbnail = card.querySelector('img')?.src || '';
        
        const movie = {
          id: movieId,
          videoId: movieId,
          title: title,
          thumbnail: thumbnail
        };
        
        // Abre modal de confirmação antes de remover
        openRemoveConfirmationModal(movie, title);
      });
    });

  } catch (error) {
    console.error('Erro ao carregar lista:', error);
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-red-500 mb-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <h2 class="text-xl font-semibold text-white mb-2">Erro ao carregar lista</h2>
        <p class="text-gray-400">Não foi possível carregar sua lista. Tente recarregar a página.</p>
      </div>
    `;
  }
}

/**
 * Abre o modal de confirmação para remover item da lista
 */
function openRemoveConfirmationModal(movie, title) {
  // Remove modal anterior se existir
  const existingModal = document.getElementById('removeConfirmationModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Cria nova instância do modal
  const confirmationModal = new ConfirmationModal({
    modalId: 'removeConfirmationModal',
    title: 'Remover da lista?',
    message: `Tem certeza que deseja remover "${title}" da sua lista?`,
    confirmText: 'Sim, remover',
    cancelText: 'Cancelar',
    confirmButtonColor: 'red',
    icon: 'delete',
    onConfirm: async () => {
      try {
        const wasAdded = await toggleItem(movie);
        
        if (!wasAdded) {
          // Item foi removido - recarregar a lista
          Toast.info(`${title} removido da sua lista`);
          await loadList();
        } else {
          // Item foi adicionado (não deveria acontecer aqui, mas por segurança)
          Toast.success(`${title} adicionado à sua lista`);
          await loadList();
        }
      } catch (error) {
        console.error('Erro ao alternar item na lista:', error);
        Toast.error('Erro ao atualizar lista. Tente novamente.');
      }
    },
    onCancel: () => {
      // Apenas fecha o modal (não faz nada)
    }
  });
  
  // Adiciona o modal ao body
  document.body.insertAdjacentHTML('beforeend', confirmationModal.render());
  
  // Inicializa e mostra o modal
  confirmationModal.init();
  confirmationModal.show();
}

export default { render, init };
