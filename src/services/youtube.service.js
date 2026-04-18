/**
 * YouTube Service
 * Combina o carregamento da IFrame API e chamadas à YouTube Data API.
 */
import { YOUTUBE_CONFIG } from '../config/constants.js';
import { getCache, setCache, TTL } from './api/cache.service.js';

// ─── IFrame API Loader ───────────────────────────────────────────────────────

let loadPromise = null;
let scriptInjected = false;

/**
 * Carrega a API do YouTube IFrame de forma segura (Singleton)
 * @returns {Promise<typeof window.YT>}
 */
export function loadYouTubeAPI() {
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    if (!scriptInjected) {
      const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');

      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        tag.defer = true;

        tag.onerror = () => {
          scriptInjected = false;
          loadPromise = null;
          reject(new Error('Falha ao carregar a API do YouTube'));
        };

        const firstScript = document.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(tag, firstScript);
        } else {
          document.head.appendChild(tag);
        }

        scriptInjected = true;
      } else {
        scriptInjected = true;
      }
    }

    let pollCount = 0;
    const maxPolls = 300;
    let pollInterval = null;

    const checkAndResolve = () => {
      if (window.YT && window.YT.Player) {
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
        loadPromise = null;
        resolve(window.YT);
        return true;
      }
      return false;
    };

    if (checkAndResolve()) return;

    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previousCallback && typeof previousCallback === 'function') {
        previousCallback();
      }
      checkAndResolve();
    };

    pollInterval = setInterval(() => {
      pollCount++;
      if (checkAndResolve()) return;

      if (pollCount >= maxPolls) {
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
        loadPromise = null;
        scriptInjected = false;
        reject(new Error('Timeout ao carregar a API do YouTube'));
      }
    }, 100);

    setTimeout(() => {
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
      if (loadPromise) {
        loadPromise = null;
        scriptInjected = false;
        reject(new Error('Timeout ao carregar a API do YouTube'));
      }
    }, 30000);
  });

  return loadPromise;
}

// ─── YouTube Data API ────────────────────────────────────────────────────────

const pendingRequests = new Map();

async function fetchWithCache(key, fetchFn, ttl) {
  const cached = getCache(key);
  if (cached) return cached;

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

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

function buildUrl(endpoint, params) {
  const url = new URL(`${YOUTUBE_CONFIG.BASE_URL}/${endpoint}`);
  url.searchParams.append('key', YOUTUBE_CONFIG.API_KEY);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return url.toString();
}

function normalizeVideo(item) {
  const id = item.id?.videoId || item.id || item.snippet?.resourceId?.videoId;
  const snippet = item.snippet;
  if (!id || !snippet) return null;

  return {
    videoId: id,
    title: snippet.title,
    thumbnail:
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.medium?.url ||
      snippet.thumbnails?.default?.url,
    channelTitle: snippet.channelTitle,
    publishedAt: snippet.publishedAt
  };
}

function normalizeVideoDetails(item) {
  const base = normalizeVideo(item);
  if (!base) return null;
  return {
    ...base,
    description: item.snippet?.description || ''
  };
}

export const youtubeService = {
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

  async getPlaylistVideos(playlistId, maxResults = YOUTUBE_CONFIG.DEFAULT_MAX_RESULTS) {
    const params = { part: 'snippet', playlistId, maxResults };
    const cacheKey = `playlist_${playlistId}_${maxResults}`;
    return fetchWithCache(cacheKey, async () => {
      const res = await fetch(buildUrl('playlistItems', params));
      if (!res.ok) throw new Error(`YouTube API Error: ${res.statusText}`);
      const data = await res.json();
      return data.items.map(normalizeVideo).filter(Boolean);
    }, TTL.PLAYLISTS);
  },

  async getVideosByIds(videoIds) {
    const idsString = Array.isArray(videoIds) ? videoIds.join(',') : videoIds;
    const params = { part: 'snippet,statistics', id: idsString };
    const cacheKey = `videos_${idsString}`;
    return fetchWithCache(cacheKey, async () => {
      const res = await fetch(buildUrl('videos', params));
      if (!res.ok) throw new Error(`YouTube API Error: ${res.statusText}`);
      const data = await res.json();
      return data.items.map(normalizeVideo).filter(Boolean);
    }, TTL.VIDEOS);
  },

  async getVideoDetails(id) {
    const params = { part: 'snippet,statistics', id };
    const cacheKey = `video_${id}`;
    return fetchWithCache(cacheKey, async () => {
      const res = await fetch(buildUrl('videos', params));
      if (!res.ok) throw new Error(`YouTube API Error: ${res.statusText}`);
      const data = await res.json();
      return normalizeVideoDetails(data.items?.[0]);
    }, TTL.VIDEOS);
  },

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
