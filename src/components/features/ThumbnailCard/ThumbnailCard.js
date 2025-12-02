export function ThumbnailCard({ id, title, thumbnail }) {
  const vid = id;
  const safeTitle = title || '';
  const src = thumbnail || 'assets/background-index.jpg';
  return `
    <div class="relative flex-none w-[160px] md:w-[240px] aspect-video transition-transform duration-300 hover:scale-105 hover:z-20 cursor-pointer rounded-md overflow-hidden" tabindex="0" role="button" data-id="${vid}" aria-label="${safeTitle}">
      <img src="${src}" alt="${safeTitle}" loading="lazy" class="w-full h-full object-cover" />
      <div class="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
        <div class="w-full p-2 text-xs md:text-sm text-white truncate">${safeTitle}</div>
      </div>
    </div>
  `;
}

