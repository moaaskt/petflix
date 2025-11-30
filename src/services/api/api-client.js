/**
 * API Client - Cliente HTTP base para requisições
 */
import { ApiError } from '../../utils/helpers/errors';

class ApiClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
  }

  /**
   * Faz requisição GET
   * @param {string} url - URL da requisição
   * @param {Object} options - Opções adicionais
   * @returns {Promise<Object>} Resposta da API
   */
  async get(url, options = {}) {
    return this.request(url, {
      method: 'GET',
      ...options
    });
  }

  /**
   * Faz requisição POST
   * @param {string} url - URL da requisição
   * @param {Object} data - Dados a enviar
   * @param {Object} options - Opções adicionais
   * @returns {Promise<Object>} Resposta da API
   */
  async post(url, data = {}, options = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
  }

  /**
   * Faz requisição HTTP
   * @param {string} url - URL da requisição
   * @param {Object} options - Opções do fetch
   * @returns {Promise<Object>} Resposta da API
   */
  async request(url, options = {}) {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    try {
      const response = await fetch(fullURL, {
        ...options,
        headers: {
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(
          `API Error: ${response.status}`,
          response.status,
          errorText
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Network error: ${error.message}`, null, error);
    }
  }
}

export const apiClient = new ApiClient();









