/**
 * Security Utilities - Utilitários de segurança para proteção XSS
 */

/**
 * Escapa caracteres HTML perigosos para prevenir ataques XSS
 * Converte caracteres especiais em suas entidades HTML seguras
 * 
 * @param {any} str - String ou valor a ser escapado
 * @returns {string} String sanitizada ou string vazia se não for string válida
 * 
 * @example
 * escapeHTML('<script>alert("XSS")</script>')
 * // Retorna: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
 */
export function escapeHTML(str) {
  // Se não for string, retorna string vazia
  if (typeof str !== 'string') {
    return '';
  }

  // Mapa de caracteres perigosos para entidades HTML
  const charMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };

  // Substitui cada caractere perigoso pela sua entidade HTML
  return str.replace(/[&<>"'/]/g, (char) => charMap[char] || char);
}

