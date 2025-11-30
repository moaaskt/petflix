/**
 * Constants - Constantes da aplicação Petflix
 */

// Rotas da aplicação
export const ROUTES = {
  LOGIN: '/index.html',
  REGISTER: '/register.html',
  HOME: '/home.html',
  DASHBOARD: '/dashboard.html',
  MOVIES: '/movies.html',
  SERIES: '/series.html',
  DOCUMENTARIES: '/documentaries.html',
  ABOUT: '/about.html',
  CONTACT: '/contact.html',
  TERMS: '/terms.html',
  PRIVACY: '/privacy.html'
};

// Tipos de pets
export const PET_TYPES = {
  DOG: 'dog',
  CAT: 'cat'
};

// Categorias de vídeos
export const VIDEO_CATEGORIES = {
  MOVIES: 'movies',
  SERIES: 'series',
  DOCUMENTARIES: 'documentaries'
};

// Subcategorias de filmes
export const MOVIE_SUBCATEGORIES = {
  CLASSIC: 'classic',
  ADVENTURE: 'adventure',
  COMEDY: 'comedy'
};

// Subcategorias de séries
export const SERIES_SUBCATEGORIES = {
  POPULAR: 'popular',
  EDUCATIONAL: 'educational',
  PUPPY: 'puppy'
};

// Subcategorias de documentários
export const DOCUMENTARY_SUBCATEGORIES = {
  BREEDS: 'breeds',
  BEHAVIOR: 'behavior',
  HEALTH: 'health'
};

// Páginas protegidas (requerem autenticação)
export const PROTECTED_PAGES = [
  'dashboard.html',
  'movies.html',
  'series.html',
  'documentaries.html'
];

// Configurações da API do YouTube
export const YOUTUBE_CONFIG = {
  API_KEY: 'AIzaSyAkt-6zN-P3tPGMgcQWmjWSe5fnp5JuK0U', // Substituir pela chave real
  BASE_URL: 'https://www.googleapis.com/youtube/v3',
  DEFAULT_MAX_RESULTS: 12,
  SAFE_SEARCH: 'strict',
  VIDEO_EMBEDDABLE: true,
  REGION_CODE: 'BR',
  RELEVANCE_LANGUAGE: 'pt'
};

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  AUTH_REQUIRED: 'Você precisa estar logado para acessar esta página.',
  EMAIL_NOT_VERIFIED: 'Por favor, verifique seu e-mail antes de continuar.',
  INVALID_CREDENTIALS: 'E-mail ou senha incorretos.',
  GENERIC_ERROR: 'Ocorreu um erro. Tente novamente mais tarde.'
};

// Tempos padrão (em ms)
export const TIMINGS = {
  LOADING_MIN_DURATION: 700,
  LOADING_MAX_DURATION: 10000,
  ALERT_AUTO_DISMISS: 5000,
  DEBOUNCE_DELAY: 300
};

// LocalStorage keys
export const STORAGE_KEYS = {
  REMEMBER_ME: 'petflixRememberMe',
  EMAIL: 'petflixEmail',
  THEME: 'petflixTheme',
  PET_TYPE: 'petflixPetType'
};









