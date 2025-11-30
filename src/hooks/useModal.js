/**
 * useModal Hook - Hook para gerenciar modais
 */
export function useModal(modalId) {
  const modal = document.getElementById(modalId);

  /**
   * Abre o modal
   */
  const open = () => {
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  };

  /**
   * Fecha o modal
   */
  const close = () => {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  };

  /**
   * Toggle do modal
   */
  const toggle = () => {
    if (modal) {
      const isOpen = modal.style.display === 'flex';
      if (isOpen) {
        close();
      } else {
        open();
      }
    }
  };

  return {
    open,
    close,
    toggle,
    isOpen: modal ? modal.style.display === 'flex' : false
  };
}









