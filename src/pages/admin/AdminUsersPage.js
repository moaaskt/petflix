/**
 * AdminUsersPage - Página de gerenciamento de usuários (CRM)
 */
import { getAllUsers, updateUserStatus } from '../../services/api/user.service.js';
import { getProfiles } from '../../services/profile.service.js';
import { authService } from '../../services/auth/auth.service.js';
import { Toast } from '../../utils/toast.js';

// Estado da página
let allUsers = []; // Cópia completa de todos os usuários
let currentPage = 1;
let itemsPerPage = 10;
let searchTerm = '';

export async function render() {
  return `
    <div class="p-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Gerenciar Usuários</h1>
      </div>
      
      <!-- Search Bar -->
      <div class="mb-6">
        <div class="relative">
          <input
            type="text"
            id="searchInput"
            placeholder="Buscar por nome ou email..."
            class="w-full md:w-96 px-4 py-2 pl-10 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 transform -translate-y-1/2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.15 13.15z" />
          </svg>
        </div>
      </div>
      
      <!-- Table Container -->
      <div class="bg-zinc-900 rounded-lg border border-zinc-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-zinc-800 border-b border-zinc-700">
              <tr>
                <th class="px-6 py-4 text-zinc-300 font-semibold text-sm uppercase tracking-wider">Usuário</th>
                <th class="px-6 py-4 text-zinc-300 font-semibold text-sm uppercase tracking-wider">Role</th>
                <th class="px-6 py-4 text-zinc-300 font-semibold text-sm uppercase tracking-wider">Data Cadastro</th>
                <th class="px-6 py-4 text-zinc-300 font-semibold text-sm uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-zinc-300 font-semibold text-sm uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody id="usersTableBody" class="divide-y divide-zinc-700">
              <tr>
                <td colspan="4" class="px-6 py-12 text-center text-zinc-400">
                  <div class="flex flex-col items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 animate-spin">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <span>Carregando usuários...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination Controls -->
        <div id="paginationControls" class="flex items-center justify-between px-6 py-4 bg-zinc-800 border-t border-zinc-700">
          <div class="text-sm text-zinc-400">
            <span id="usersStats">Total: <span id="usersCount" class="font-semibold text-white">0</span> usuários</span>
          </div>
          <div class="flex items-center gap-4">
            <button 
              id="prevPageBtn"
              class="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors"
              disabled
            >
              Anterior
            </button>
            <span id="pageInfo" class="text-zinc-300 text-sm">
              Página 1 de 1
            </span>
            <button 
              id="nextPageBtn"
              class="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors"
              disabled
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
      
      <!-- Modal de Perfis -->
      <div id="profilesModal" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-zinc-900 rounded-lg border border-zinc-700 p-6 max-w-2xl w-full mx-4">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-white">Perfis do Usuário</h2>
            <button id="closeModalBtn" class="text-zinc-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div id="profilesContent" class="text-white">
            <!-- Profiles will be loaded here -->
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function init() {
  try {
    // Carrega todos os usuários do Firestore
    await loadUsers();

    // Configura busca
    setupSearch();

    // Configura paginação
    setupPagination();

    // Configura modal
    setupModal();

    // Expõe funções globalmente para os botões inline
    window.viewUserProfiles = viewUserProfiles;
    window.toggleUserBan = toggleUserBan;
    window.resetUserPassword = resetUserPassword;
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    showError();
  }
}

/**
 * Carrega os usuários e atualiza a tabela
 */
async function loadUsers() {
  try {
    allUsers = await getAllUsers();
    currentPage = 1; // Reset para primeira página ao recarregar
    renderTable();
    updatePagination();
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    showError();
    Toast.show('Erro ao carregar usuários. Verifique o console para mais detalhes.', 'error');
  }
}

/**
 * Configura o input de busca
 */
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  // Debounce para melhor performance
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchTerm = e.target.value.toLowerCase().trim();
      currentPage = 1; // Reset para primeira página ao buscar
      renderTable();
      updatePagination();
    }, 300);
  });
}

/**
 * Configura os controles de paginação
 */
function setupPagination() {
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
        updatePagination();
        // Scroll para o topo da tabela
        document.querySelector('#usersTableBody')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const filteredUsers = getFilteredUsers();
      const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderTable();
        updatePagination();
        // Scroll para o topo da tabela
        document.querySelector('#usersTableBody')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
}

/**
 * Retorna os usuários filtrados baseado no termo de busca (nome ou email)
 */
function getFilteredUsers() {
  if (!searchTerm) {
    return allUsers;
  }

  return allUsers.filter(user => {
    const name = (user.name || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    return name.includes(searchTerm) || email.includes(searchTerm);
  });
}

/**
 * Retorna os usuários da página atual
 */
function getPaginatedUsers() {
  const filtered = getFilteredUsers();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filtered.slice(startIndex, endIndex);
}

/**
 * Mostra mensagem de erro na tabela
 */
function showError() {
  const tbody = document.getElementById('usersTableBody');
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-6 py-12 text-center text-red-400">
          <div class="flex flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span>Erro ao carregar usuários. Tente novamente.</span>
          </div>
        </td>
      </tr>
    `;
  }
}

/**
 * Formata data para exibição (DD/MM/YYYY)
 */
function formatDate(dateValue) {
  if (!dateValue) return 'Data não disponível';

  let date;
  if (dateValue?.toDate) {
    // É um Timestamp do Firestore
    date = dateValue.toDate();
  } else if (dateValue instanceof Date) {
    date = dateValue;
  } else {
    return 'Data inválida';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Retorna a primeira letra do nome ou email para avatar
 */
function getInitials(user) {
  const name = user.name || '';
  const email = user.email || '';

  if (name) {
    return name.charAt(0).toUpperCase();
  }
  if (email) {
    return email.charAt(0).toUpperCase();
  }
  return '?';
}

/**
 * Renderiza a tabela com os usuários (filtrados e paginados)
 */
function renderTable() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  const filteredUsers = getFilteredUsers();
  const paginatedUsers = getPaginatedUsers();

  if (allUsers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-6 py-12 text-center text-zinc-400">
          <div class="flex flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <span>Nenhum usuário encontrado</span>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  if (filteredUsers.length === 0 && searchTerm) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-6 py-12 text-center text-zinc-400">
          <div class="flex flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.15 13.15z" />
            </svg>
            <span>Nenhum usuário encontrado para "${searchTerm}"</span>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = paginatedUsers.map(user => {
    const initials = getInitials(user);
    const userName = user.name || 'Sem nome';
    const userEmail = user.email || 'Sem email';
    const role = user.role || 'user';
    const isAdmin = role === 'admin';
    const userStatus = user.status || 'active';
    const isBanned = userStatus === 'banned';

    // Badge de Role
    const roleBadge = isAdmin
      ? `<span class="px-3 py-1 bg-red-600/20 text-red-400 border border-red-600/30 rounded-full text-sm font-medium">Admin</span>`
      : `<span class="px-3 py-1 bg-zinc-700 text-zinc-200 rounded-full text-sm font-medium">Usuário</span>`;

    // Badge de Status
    const statusBadge = isBanned
      ? `<span class="px-3 py-1 bg-red-600/20 text-red-400 border border-red-600/30 rounded-full text-sm font-medium">Banido</span>`
      : `<span class="px-3 py-1 bg-green-600/20 text-green-400 border border-green-600/30 rounded-full text-sm font-medium">Ativo</span>`;

    // Data formatada
    const formattedDate = formatDate(user.createdAt);

    return `
      <tr class="hover:bg-zinc-800 transition-colors">
        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            <!-- Avatar com inicial -->
            <div class="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold text-sm">
              ${initials}
            </div>
            <div>
              <div class="text-white font-medium">${userName}</div>
              <div class="text-zinc-400 text-sm">${userEmail}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4">
          ${roleBadge}
        </td>
        <td class="px-6 py-4">
          <span class="text-zinc-300">${formattedDate}</span>
        </td>
        <td class="px-6 py-4">
          ${statusBadge}
        </td>
        <td class="px-6 py-4">
          <div class="flex items-center gap-2">
            <!-- Ver Perfis -->
            <button 
              class="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded transition-colors"
              onclick="window.viewUserProfiles('${user.id}')"
              title="Ver Perfis"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            
            <!-- Ban/Unban -->
            <button 
              class="p-2 ${isBanned ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400' : 'bg-red-600/20 hover:bg-red-600/30 text-red-400'} rounded transition-colors"
              onclick="window.toggleUserBan('${user.id}', '${userStatus}')"
              title="${isBanned ? 'Desbanir Usuário' : 'Banir Usuário'}"
            >
              ${isBanned
        ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                     <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                   </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                     <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                   </svg>`
      }
            </button>
            
            <!-- Reset Password -->
            <button 
              class="p-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded transition-colors"
              onclick="window.resetUserPassword('${userEmail}')"
              title="Resetar Senha"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Atualiza paginação após renderizar tabela
  updatePagination();
}

/**
 * Atualiza os controles de paginação
 */
function updatePagination() {
  const filteredUsers = getFilteredUsers();
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Atualiza contador
  const countEl = document.getElementById('usersCount');
  if (countEl) {
    countEl.textContent = filteredUsers.length;
  }

  // Atualiza informação da página
  const pageInfo = document.getElementById('pageInfo');
  if (pageInfo) {
    pageInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`;
  }

  // Atualiza botões
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');

  if (prevBtn) {
    prevBtn.disabled = currentPage === 1;
  }

  if (nextBtn) {
    nextBtn.disabled = currentPage >= totalPages || totalPages === 0;
  }
}

/**
 * Configura o modal de perfis
 */
function setupModal() {
  const modal = document.getElementById('profilesModal');
  const closeBtn = document.getElementById('closeModalBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Fecha modal ao clicar fora
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
}

/**
 * Abre o modal de perfis
 */
function openModal() {
  const modal = document.getElementById('profilesModal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

/**
 * Fecha o modal de perfis
 */
function closeModal() {
  const modal = document.getElementById('profilesModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

/**
 * Visualiza os perfis de um usuário
 * @param {string} userId - ID do usuário
 */
async function viewUserProfiles(userId) {
  const content = document.getElementById('profilesContent');
  if (!content) return;

  try {
    // Mostra loading
    content.innerHTML = `
      <div class="flex items-center justify-center py-8">
        <div class="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
      </div>
    `;

    openModal();

    // Busca perfis do usuário
    const profiles = await getProfiles(userId);

    if (!profiles || profiles.length === 0) {
      content.innerHTML = `
        <div class="text-center py-8 text-zinc-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto mb-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
          </svg>
          <p>Este usuário não possui perfis cadastrados.</p>
        </div>
      `;
      return;
    }

    // Renderiza perfis
    content.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${profiles.map(profile => `
          <div class="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div class="flex items-center gap-3">
              <div class="w-16 h-16 rounded-full bg-${profile.color || 'red'}-600 flex items-center justify-center text-white font-bold text-xl">
                ${profile.icon || profile.name.charAt(0).toUpperCase()}
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-white">${profile.name}</h3>
                <p class="text-sm text-zinc-400">
                  ${profile.species === 'dog' ? '🐕 Cachorro' : '🐱 Gato'}
                  ${profile.isDefault ? ' • Padrão' : ''}
                </p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Erro ao carregar perfis:', error);
    content.innerHTML = `
      <div class="text-center py-8 text-red-400">
        <p>Erro ao carregar perfis. Tente novamente.</p>
      </div>
    `;
    Toast.show('Erro ao carregar perfis do usuário', 'error');
  }
}

/**
 * Bane ou desbane um usuário
 * @param {string} userId - ID do usuário
 * @param {string} currentStatus - Status atual do usuário
 */
async function toggleUserBan(userId, currentStatus) {
  const isBanned = currentStatus === 'banned';
  const newStatus = isBanned ? 'active' : 'banned';
  const action = isBanned ? 'desbanir' : 'banir';

  const confirmed = confirm(`Tem certeza que deseja ${action} este usuário?`);
  if (!confirmed) return;

  try {
    await updateUserStatus(userId, newStatus);
    Toast.show(`Usuário ${isBanned ? 'desbanido' : 'banido'} com sucesso!`, 'success');

    // Recarrega a lista de usuários
    await loadUsers();
  } catch (error) {
    console.error(`Erro ao ${action} usuário:`, error);
    Toast.show(`Erro ao ${action} usuário. Tente novamente.`, 'error');
  }
}

/**
 * Envia email de reset de senha para um usuário
 * @param {string} email - Email do usuário
 */
async function resetUserPassword(email) {
  const confirmed = confirm(`Enviar email de redefinição de senha para ${email}?`);
  if (!confirmed) return;

  try {
    await authService.sendPasswordResetEmail(email);
    Toast.show('Email de redefinição de senha enviado com sucesso!', 'success');
  } catch (error) {
    console.error('Erro ao enviar email de reset:', error);
    Toast.show('Erro ao enviar email de redefinição. Tente novamente.', 'error');
  }
}

