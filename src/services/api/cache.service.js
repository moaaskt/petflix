/**
 * Cache Service
 * Gerencia cache de requisições usando Map (memória) e localStorage (persistência).
 * Estratégia: Cache-First para economizar quota da API do YouTube.
 */

const MEMORY_CACHE = new Map();
const STORAGE_PREFIX = 'yt_cache_';

// Tempos de vida do cache (em segundos)
export const TTL = {
  SEARCH: 3600, // 1 hora para buscas
  VIDEOS: 86400, // 24 horas para detalhes de vídeos
  PLAYLISTS: 21600 // 6 horas para playlists
};

/**
 * Salva um valor no cache
 * @param {string} key Chave única
 * @param {any} value Valor a ser salvo
 * @param {number} ttlSeconds Tempo de vida em segundos
 */
export function setCache(key, value, ttlSeconds = 3600) {
  const expiresAt = Date.now() + (ttlSeconds * 1000);
  const payload = { value, expiresAt };

  // Salva na memória
  MEMORY_CACHE.set(key, payload);

  // Salva no localStorage (tenta, ignora se falhar/quota excedida)
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(payload));
  } catch (e) {
    console.warn('Cache Service: Falha ao salvar no localStorage', e);
  }
}

/**
 * Recupera um valor do cache
 * @param {string} key Chave única
 * @returns {any|null} O valor ou null se não existir/expirado
 */
export function getCache(key) {
  const now = Date.now();

  // 1. Tenta memória
  if (MEMORY_CACHE.has(key)) {
    const cached = MEMORY_CACHE.get(key);
    if (cached.expiresAt > now) {
      return cached.value;
    } else {
      MEMORY_CACHE.delete(key);
    }
  }

  // 2. Tenta localStorage
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (item) {
      const cached = JSON.parse(item);
      if (cached.expiresAt > now) {
        // Re-hidrata memória
        MEMORY_CACHE.set(key, cached);
        return cached.value;
      } else {
        // Remove expirado
        localStorage.removeItem(STORAGE_PREFIX + key);
      }
    }
  } catch (e) {
    console.warn('Cache Service: Erro ao ler localStorage', e);
  }

  return null;
}

/**
 * Limpa todo o cache relacionado ao prefixo
 */
export function clearCache() {
  MEMORY_CACHE.clear();
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.warn('Cache Service: Erro ao limpar localStorage', e);
  }
}
