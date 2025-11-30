/**
 * Validation Helpers - Funções de validação
 */

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} True se válido
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida senha (mínimo 6 caracteres)
 * @param {string} password - Senha a validar
 * @returns {boolean} True se válido
 */
export function isValidPassword(password) {
  return password && password.length >= 6;
}

/**
 * Valida se senhas coincidem
 * @param {string} password - Senha
 * @param {string} confirmPassword - Confirmação de senha
 * @returns {boolean} True se coincidem
 */
export function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}

/**
 * Valida formulário de login
 * @param {string} email - Email
 * @param {string} password - Senha
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateLoginForm(email, password) {
  const errors = [];

  if (!email || !email.trim()) {
    errors.push('E-mail é obrigatório.');
  } else if (!isValidEmail(email)) {
    errors.push('E-mail inválido.');
  }

  if (!password || !password.trim()) {
    errors.push('Senha é obrigatória.');
  } else if (!isValidPassword(password)) {
    errors.push('Senha deve ter pelo menos 6 caracteres.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida formulário de registro
 * @param {Object} formData - Dados do formulário
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateRegisterForm(formData) {
  const { name, email, password, confirmPassword } = formData;
  const errors = [];

  if (!name || !name.trim()) {
    errors.push('Nome é obrigatório.');
  }

  if (!email || !email.trim()) {
    errors.push('E-mail é obrigatório.');
  } else if (!isValidEmail(email)) {
    errors.push('E-mail inválido.');
  }

  if (!password || !password.trim()) {
    errors.push('Senha é obrigatória.');
  } else if (!isValidPassword(password)) {
    errors.push('Senha deve ter pelo menos 6 caracteres.');
  }

  if (!confirmPassword || !confirmPassword.trim()) {
    errors.push('Confirmação de senha é obrigatória.');
  } else if (!passwordsMatch(password, confirmPassword)) {
    errors.push('As senhas não coincidem.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitiza string para busca
 * @param {string} query - Query de busca
 * @returns {string} Query sanitizada
 */
export function sanitizeSearchQuery(query) {
  if (!query) return '';
  return query.trim().replace(/[<>]/g, '');
}









