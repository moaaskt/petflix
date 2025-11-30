/**
 * useVideos Hook - Hook para buscar e gerenciar vídeos
 */
import { youtubeService } from '../services/api/youtube.service.js';

export function useVideos() {
  let videos = [];
  let loading = false;
  let error = null;
  let nextPageToken = '';
  let prevPageToken = '';
  let currentQuery = '';

  /**
   * Busca vídeos
   * @param {string} query - Termo de busca
   * @param {string} pageToken - Token de paginação
   * @returns {Promise<Object>} Resultados da busca
   */
  const search = async (query = 'cachorros', pageToken = '') => {
    loading = true;
    error = null;
    currentQuery = query;

    try {
      const result = await youtubeService.searchVideos({
        q: query,
        pageToken: pageToken
      });

      videos = result.items;
      nextPageToken = result.nextPageToken;
      prevPageToken = result.prevPageToken;
      loading = false;

      return result;
    } catch (err) {
      error = err;
      loading = false;
      throw err;
    }
  };

  /**
   * Busca próxima página
   * @returns {Promise<Object>} Resultados
   */
  const loadNext = async () => {
    if (!nextPageToken) return null;
    return search(currentQuery, nextPageToken);
  };

  /**
   * Busca página anterior
   * @returns {Promise<Object>} Resultados
   */
  const loadPrev = async () => {
    if (!prevPageToken) return null;
    return search(currentQuery, prevPageToken);
  };

  /**
   * Limpa resultados
   */
  const clear = () => {
    videos = [];
    nextPageToken = '';
    prevPageToken = '';
    currentQuery = '';
    error = null;
  };

  return {
    videos,
    loading,
    error,
    search,
    loadNext,
    loadPrev,
    clear,
    hasNext: !!nextPageToken,
    hasPrev: !!prevPageToken
  };
}

