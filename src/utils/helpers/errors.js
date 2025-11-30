/**
 * Error Helpers - Classes de erro customizadas
 */

/**
 * Erro base para serviços
 */
export class ServiceError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'ServiceError';
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Erro de validação
 */
export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Erro de autenticação
 */
export class AuthError extends Error {
  constructor(message, code = null) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

/**
 * Erro de API
 */
export class ApiError extends Error {
  constructor(message, status = null, response = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

/**
 * Trata erros do Firebase Auth e retorna mensagem amigável
 * @param {Error} error - Erro do Firebase
 * @returns {string} Mensagem de erro amigável
 */
export function getFirebaseAuthErrorMessage(error) {
  const errorMessages = {
    'auth/user-not-found': 'E-mail não cadastrado. Por favor, verifique ou cadastre-se.',
    'auth/wrong-password': 'Senha incorreta. Por favor, tente novamente.',
    'auth/invalid-email': 'O e-mail fornecido é inválido.',
    'auth/too-many-requests': 'Muitas tentativas de login. Por favor, tente novamente mais tarde.',
    'auth/user-disabled': 'Esta conta foi desativada. Entre em contato com o suporte.',
    'auth/email-already-in-use': 'Este e-mail já está em uso. Por favor, use outro e-mail ou faça login.',
    'auth/weak-password': 'A senha é muito fraca. Por favor, escolha uma senha mais forte.',
    'auth/operation-not-allowed': 'Operação não permitida. Contate o suporte.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.'
  };

  return errorMessages[error.code] || `Ocorreu um erro: ${error.message}`;
}

/**
 * Trata erros de API e retorna mensagem amigável
 * @param {Error} error - Erro da API
 * @returns {string} Mensagem de erro amigável
 */
export function getApiErrorMessage(error) {
  if (error instanceof ApiError) {
    if (error.status === 403) {
      return 'Acesso negado. Verifique suas permissões.';
    }
    if (error.status === 404) {
      return 'Recurso não encontrado.';
    }
    if (error.status >= 500) {
      return 'Erro no servidor. Tente novamente mais tarde.';
    }
    return error.message;
  }

  if (error instanceof ServiceError) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
}









