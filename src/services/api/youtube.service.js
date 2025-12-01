import { YOUTUBE_CONFIG } from '../../config/constants.js';
import { getCache, setCache, TTL } from './cache.service.js';

/**
 * YouTube Service
 * Gerencia chamadas à API do YouTube com Cache e Deduplicação.
 */

const pendingRequests = new Map();

/**
 * Realiza uma requisição com Cache + Deduplicação
 */
async function fetchWithCache(key, fetchFn, ttl) {
  // 1. Verifica Cache
  const cached = getCache(key);
  if (cached) {
    // console.log(`[YouTube] Cache hit: ${key}`);
    return cached;
  }

  // 2. Verifica requisições em andamento (Deduplicação)
  if (pendingRequests.has(key)) {
    // console.log(`[YouTube] Dedup hit: ${key}`);
    return pendingRequests.get(key);
  }

  // 3. Executa a requisição
  // console.log(`[YouTube] Fetching: ${key}`);
  const promise = fetchFn()
    .then(data => {
      setCache(key, data, ttl);
      return data;
    })
    .catch(err => {
      console.error(`[YouTube] Error fetching ${key}:`, err);
      throw err;
    })
    .finally(() => {
      pendingRequests.delete(key);
    });

  pendingRequests.set(key, promise);
  return promise;
}

/**
 * Constrói a URL com parâmetros
 */
function buildUrl(endpoint, params) {
  const url = new URL(`${YOUTUBE_CONFIG.BASE_URL}/${endpoint}`);
  url.searchParams.append('key', YOUTUBE_CONFIG.API_KEY);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return url.toString();
}

/**
 * Normaliza os dados para o formato do app
 */
function normalizeVideo(item) {
  const id = item.id?.videoId || item.id || item.snippet?.resourceId?.videoId;
  const snippet = item.snippet;
  
  if (!id || !snippet) return null;

  return {
    videoId: id,
    title: snippet.title,
    thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url,
    channelTitle: snippet.channelTitle,
    publishedAt: snippet.publishedAt
  };
}

function normalizeVideoDetails(item) {
  const base = normalizeVideo(item);
  if (!base) return null;
  const snippet = item.snippet || {};
  return {
    ...base,
    description: snippet.description || '',
  };
}

export const youtubeService = {
  /**
   * Busca vídeos por termo
   */
  async search(query, maxResults = YOUTUBE_CONFIG.DEFAULT_MAX_RESULTS) {
    const params = {
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults,
      safeSearch: YOUTUBE_CONFIG.SAFE_SEARCH,
      videoEmbeddable: YOUTUBE_CONFIG.VIDEO_EMBEDDABLE ? 'true' : 'false',
      regionCode: YOUTUBE_CONFIG.REGION_CODE || 'BR',
      relevanceLanguage: YOUTUBE_CONFIG.RELEVANCE_LANGUAGE || 'pt'
    };

    const cacheKey = `search_${query}_${maxResults}`;

    return fetchWithCache(cacheKey, async () => {
      const res = await fetch(buildUrl('search', params));
      if (!res.ok) throw new Error(`YouTube API Error: ${res.statusText}`);
      const data = await res.json();
      return data.items.map(normalizeVideo).filter(Boolean);
    }, TTL.SEARCH);
  },

  /**
   * Busca vídeos de uma playlist
   */
  async getPlaylistVideos(playlistId, maxResults = YOUTUBE_CONFIG.DEFAULT_MAX_RESULTS) {
    const params = {
      part: 'snippet',
      playlistId: playlistId,
      maxResults
    };

    const cacheKey = `playlist_${playlistId}_${maxResults}`;

    return fetchWithCache(cacheKey, async () => {
      const res = await fetch(buildUrl('playlistItems', params));
      if (!res.ok) throw new Error(`YouTube API Error: ${res.statusText}`);
      const data = await res.json();
      return data.items.map(normalizeVideo).filter(Boolean);
    }, TTL.PLAYLISTS);
  },

  /**
   * Busca detalhes de vídeos por IDs
   */
  async getVideosByIds(videoIds) {
    const idsString = Array.isArray(videoIds) ? videoIds.join(',') : videoIds;
    const params = {
      part: 'snippet,statistics',
      id: idsString
    };

    const cacheKey = `videos_${idsString}`;

    return fetchWithCache(cacheKey, async () => {
      const res = await fetch(buildUrl('videos', params));
      if (!res.ok) throw new Error(`YouTube API Error: ${res.statusText}`);
      const data = await res.json();
      return data.items.map(normalizeVideo).filter(Boolean);
    }, TTL.VIDEOS);
  }
  ,
  async getVideoDetails(id) {
    const params = { part: 'snippet,statistics', id };
    const cacheKey = `video_${id}`;
    return fetchWithCache(cacheKey, async () => {
      const res = await fetch(buildUrl('videos', params));
      if (!res.ok) throw new Error(`YouTube API Error: ${res.statusText}`);
      const data = await res.json();
      const item = data.items?.[0];
      return normalizeVideoDetails(item);
    }, TTL.VIDEOS);
  }
  ,
  async searchRelated(id, maxResults = YOUTUBE_CONFIG.DEFAULT_MAX_RESULTS) {
    const params = {
      part: 'snippet',
      type: 'video',
      relatedToVideoId: id,
      maxResults,
      safeSearch: YOUTUBE_CONFIG.SAFE_SEARCH,
      videoEmbeddable: YOUTUBE_CONFIG.VIDEO_EMBEDDABLE ? 'true' : 'false',
      regionCode: YOUTUBE_CONFIG.REGION_CODE || 'BR',
      relevanceLanguage: YOUTUBE_CONFIG.RELEVANCE_LANGUAGE || 'pt'
    };
    const cacheKey = `related_${id}_${maxResults}`;
    return fetchWithCache(cacheKey, async () => {
      const res = await fetch(buildUrl('search', params));
      if (!res.ok) throw new Error(`YouTube API Error: ${res.statusText}`);
      const data = await res.json();
      return data.items.map(normalizeVideo).filter(Boolean);
    }, TTL.SEARCH);
  }
};
