/**
 * Navigator - Utilitário para navegação
 */

/**
 * Navega para uma rota
 */
export function navigate(path) {
  if (path.startsWith('#')) {
    window.location.hash = path;
  } else {
    window.location.hash = `#${path}`;
  }
}

/**
 * Navega para uma rota (sem hash)
 */
export function navigateTo(path) {
  navigate(path);
}

/**
 * Volta para a página anterior
 */
export function goBack() {
  window.history.back();
}

/**
 * Vai para a próxima página
 */
export function goForward() {
  window.history.forward();
}

/**
 * Obtém rota atual
 */
export function getCurrentPath() {
  return window.location.hash.slice(1) || '/';
}

export default {
  navigate,
  navigateTo,
  goBack,
  goForward,
  getCurrentPath
};

