export function getThemeIcon(type) {
  const base = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"';
  const isCat = document.body.classList.contains('theme-cat');
  switch (type) {
    case 'play':
      return isCat
        ? `<svg ${base}><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Zm-1.5 6.75v6.5l6-3.25-6-3.25Z"/></svg>`
        : `<svg ${base}><path d="M8.25 7.5v9l8.25-4.5-8.25-4.5Z"/></svg>`;
    case 'pause':
      return `<svg ${base}><path d="M9 6h2.5v12H9V6Zm5.5 0H17v12h-2.5V6Z"/></svg>`;
    case 'volume':
      return `<svg ${base}><path d="M4 9v6h3l4.5 3V6L7 9H4Zm10.5 3a3 3 0 0 0-3-3v6a3 3 0 0 0 3-3Zm2.5 0a5.5 5.5 0 0 0-5.5-5.5v2A3.5 3.5 0 0 1 15 12a3.5 3.5 0 0 1-3.5 3.5v2A5.5 5.5 0 0 0 17 12Z"/></svg>`;
    case 'volume-off':
      return `<svg ${base}><path d="M7 9H4v6h3l4.5 3V6L7 9Zm9.78-.22 1.42 1.42L16.8 11.6l1.4 1.4-1.42 1.42-1.38-1.38-1.38 1.38-1.42-1.42 1.38-1.38-1.38-1.38 1.42-1.42 1.38 1.38 1.38-1.38Z"/></svg>`;
    case 'fullscreen':
      return `<svg ${base}><path d="M4 4h6v2H6v4H4V4Zm14 0v6h-2V6h-4V4h6ZM6 14h4v4h2v6H6v-2h4v-4H6v-4Zm12 0v4h-4v2h6v-6h-2Z"/></svg>`;
    case 'exit-fullscreen':
      return `<svg ${base}><path d="M8 8h4V6H6v6h2V8Zm8 8h-4v2h6v-6h-2v4ZM8 16H6v6h6v-2H8v-4Zm8-8v2h4V4h-6v2h2Z"/></svg>`;
    default:
      return '';
  }
}

export default { getThemeIcon };
