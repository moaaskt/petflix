import { escapeHTML } from '../../../utils/security.js';

export function ThumbnailCard({ id, title, thumbnail, isInList = false }) {
  const vid = id;
  const safeTitle = escapeHTML(title || '');
  const src = thumbnail || 'assets/background-index.jpg';
  const listButtonId = `list-btn-${vid}`;
  
  // Ícone e cor baseado no estado
  const listIcon = isInList 
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" /></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M5 12h14M12 5v14"/></svg>`;
  
  const listButtonClass = isInList
    ? 'bg-green-600 hover:bg-green-700'
    : 'bg-black/60 hover:bg-black/80';
  
  const listButtonOpacity = isInList 
    ? 'opacity-100' 
    : 'opacity-0 group-hover:opacity-100';
  
  return `
    <div class="relative flex-none w-[160px] md:w-[240px] aspect-video transition-transform duration-300 hover:scale-105 hover:z-20 cursor-pointer rounded-md overflow-hidden snap-start group" tabindex="0" role="button" data-id="${vid}" aria-label="${safeTitle}">
      <img src="${src}" alt="${safeTitle}" loading="lazy" class="w-full h-full object-cover" />
      <button 
        id="${listButtonId}"
        class="absolute top-2 right-2 w-8 h-8 ${listButtonClass} rounded-full flex items-center justify-center text-white transition-all duration-200 ${listButtonOpacity} hover:scale-110 z-30"
        data-movie-id="${vid}"
        data-in-list="${isInList}"
        aria-label="${isInList ? 'Remover da lista' : 'Adicionar à lista'}"
        type="button"
      >
        ${listIcon}
      </button>
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
        <div class="w-full p-2 text-xs md:text-sm text-white truncate">${safeTitle}</div>
      </div>
    </div>
  `;
}

