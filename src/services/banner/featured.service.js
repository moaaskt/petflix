import { getCache, setCache } from '../api/cache.service.js';
import { youtubeService } from '../api/youtube.service.js';
import movies from '../../data/catalog/movies.json';
import series from '../../data/catalog/series.json';

function normalizeCatalogItem(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    videoId: raw.id,
    title: raw.title,
    thumbnail: raw.thumb,
    channelTitle: raw.channelTitle || 'Petflix',
  };
}

function pickFeaturedFromCatalog(petType) {
  const isDog = petType === 'dog';
  try {
    const pool = [];
    const m = movies[isDog ? 'dogs' : 'cats'];
    const s = series[isDog ? 'dogs' : 'cats'];
    ['classic', 'adventure', 'comedy'].forEach(k => Array.isArray(m?.[k]) && pool.push(...m[k]));
    ['popular', 'educational', 'puppy'].forEach(k => Array.isArray(s?.[k]) && pool.push(...s[k]));
    const first = pool.find(Boolean);
    return normalizeCatalogItem(first);
  } catch { return null; }
}

export async function getFeatured(petType) {
  const cacheKey = `featured_${petType}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  let featured = pickFeaturedFromCatalog(petType);
  if (!featured) {
    try {
      const trendingQuery = petType === 'dog' ? 'cães engraçados' : 'gatos engraçados';
      const results = await youtubeService.search(trendingQuery, 10);
      featured = results?.[0] || null;
    } catch { featured = null; }
  }

  if (featured) setCache(cacheKey, featured, 3600);
  return featured;
}

