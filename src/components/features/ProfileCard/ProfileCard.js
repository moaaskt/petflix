/**
 * ProfileCard - Componente de card de perfil
 * Exibe um perfil com imagem, nome e suporte para modo de edição
 */

/**
 * Renderiza o card de perfil
 * @param {Object} props - Propriedades do card
 * @param {Object} props.profile - Objeto do perfil com id, name, avatar, species, etc.
 * @param {Function} props.onClick - Callback chamado ao clicar no card
 * @param {boolean} props.isEditing - Se está em modo de edição (mostra ícone de lápis)
 * @param {string} props.className - Classes CSS adicionais (opcional)
 * @returns {string} HTML do card
 */
export function ProfileCard({ profile, onClick, isEditing = false, className = '' }) {
  if (!profile) return '';

  const { name, avatar, species, color = 'blue', icon = '' } = profile;
  
  // Determina cor de fallback baseado na espécie se não fornecida
  const fallbackColor = color || (species === 'cat' ? 'red' : 'blue');
  const fallbackIcon = icon || name.charAt(0).toUpperCase();

  return `
    <button 
      class="group cursor-pointer flex flex-col items-center gap-2 ${className}"
      aria-label="${name}"
      data-profile-id="${profile.id || ''}"
      ${onClick ? 'data-clickable="true"' : ''}
    >
      <div class="relative w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden border-2 border-transparent group-hover:border-white transition-all">
        ${avatar ? `
          <img 
            src="${avatar}" 
            alt="${name}" 
            class="w-full h-full object-cover"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
          />
        ` : ''}
        <div 
          class="${avatar ? 'hidden' : 'flex'} w-full h-full items-center justify-center ${
            fallbackColor === 'red' ? 'bg-red-600' : 'bg-blue-600'
          }"
        >
          <span class="text-white text-3xl">${fallbackIcon}</span>
        </div>
        
        ${isEditing ? `
          <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-white">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>
        ` : ''}
      </div>
      <span class="text-gray-400 text-lg group-hover:text-white transition-colors">${name}</span>
    </button>
  `;
}

/**
 * Inicializa event listeners do card
 * @param {string} cardSelector - Seletor do card (ou elemento)
 * @param {Function} onClick - Callback para clique
 */
export function initProfileCard(cardSelector, onClick) {
  const card = typeof cardSelector === 'string' 
    ? document.querySelector(cardSelector) 
    : cardSelector;

  if (!card || !onClick) return;

  card.addEventListener('click', (e) => {
    e.preventDefault();
    const profileId = card.getAttribute('data-profile-id');
    if (profileId && onClick) {
      onClick(profileId);
    }
  });
}

export default ProfileCard;
