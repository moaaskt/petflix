/**
 * Format Helpers - Funções de formatação
 */

/**
 * Formata data para exibição
 * @param {Date|string|number} date - Data
 * @param {string} locale - Locale (padrão: pt-BR)
 * @returns {string} Data formatada
 */
export function formatDate(date, locale = 'pt-BR') {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  return dateObj.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formata data e hora para exibição
 * @param {Date|string|number} date - Data
 * @param {string} locale - Locale (padrão: pt-BR)
 * @returns {string} Data e hora formatadas
 */
export function formatDateTime(date, locale = 'pt-BR') {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  return dateObj.toLocaleString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Trunca texto com ellipsis
 * @param {string} text - Texto
 * @param {number} maxLength - Tamanho máximo
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength = 50) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Capitaliza primeira letra
 * @param {string} text - Texto
 * @returns {string} Texto capitalizado
 */
export function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Formata número com separadores
 * @param {number} number - Número
 * @returns {string} Número formatado
 */
export function formatNumber(number) {
  if (number === null || number === undefined) return '0';
  return number.toLocaleString('pt-BR');
}









