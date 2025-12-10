# 📚 Documentação Técnica - Petflix

**Versão:** 1.0.0  
**Data:** 2024  
**Tecnologias:** Vanilla JS, Vite, Tailwind CSS, Firebase

---

## 📋 Índice

1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [Core Features (Lógica de Negócio)](#2-core-features-lógica-de-negócio)
3. [Mapa de Arquivos (File Tree & Responsibility)](#3-mapa-de-arquivos-file-tree--responsibility)
4. [Componentes de UI](#4-componentes-de-ui)
5. [Guia de Fluxo de Dados](#5-guia-de-fluxo-de-dados)
6. [Configuração e Deploy](#6-configuração-e-deploy)

---

## 1. Visão Geral da Arquitetura

### 1.1. SPA (Single Page Application) Manual

O Petflix implementa uma **SPA manual** sem frameworks como React ou Vue. A arquitetura é baseada em:

- **Hash-based Routing**: Utiliza `window.location.hash` para navegação
- **Component-based Architecture**: Componentes são funções que retornam HTML strings
- **State Management**: Sistema de estado global usando padrão Observer
- **Service Layer**: Separação de lógica de negócio em serviços

#### Fluxo de Inicialização

```12:35:src/main.js
async function init() {
  try {
    // 1. Configura persistência de auth
    await setupAuthPersistence();
    // 2. Inicializa estados globais
    initAuthState();
    initAppState();
    
    // 3. Inicializa router
    initRouter();
    
    console.log('✅ Petflix SPA inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar aplicação:', error);
  }
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

**Ordem de Inicialização:**
1. **Firebase Persistence**: Configura persistência de autenticação no navegador
2. **AuthState**: Inicializa estado global de autenticação e observa mudanças do Firebase
3. **AppState**: Inicializa estado da aplicação (petType, etc.)
4. **Router**: Inicializa sistema de roteamento e renderiza rota inicial

### 1.2. Sistema de Roteamento (Router)

O router é o coração da navegação SPA. Implementado em `src/router/index.js`:

#### Como Funciona

1. **Interceptação de Hash**: O router escuta eventos `hashchange` do navegador
2. **Resolução de Rotas**: Busca a rota correspondente no array `routes`
3. **Execução de Middlewares**: Executa middlewares de autenticação antes de renderizar
4. **Renderização**: Injeta HTML no container `#app` e chama hooks de inicialização

```179:199:src/router/index.js
export function initRouter() {
  // Obtém container
  appContainer = document.getElementById('app');
  
  if (!appContainer) {
    console.error('Container #app não encontrado no DOM');
    return;
  }
  
  // Listener para mudanças no hash
  window.addEventListener('hashchange', () => {
    const path = getCurrentPath();
    navigateTo(path);
  });
  
  // Renderiza rota inicial
  const initialPath = getCurrentPath() || '/';
  navigateTo(initialPath);
  
  console.log('✅ Router inicializado');
}
```

#### Middlewares

O sistema de middlewares permite proteger rotas e executar lógica antes da renderização:

```31:62:src/router/index.js
async function executeMiddlewares(route, from) {
  if (!route.meta || !route.meta.middleware) {
    return true;
  }
  
  const middlewares = route.meta.middleware;
  
  for (const middleware of middlewares) {
    let nextCalled = false;
    let nextPath = null;
    
    const next = (path) => {
      nextCalled = true;
      nextPath = path;
    };
    
    const result = await middleware(route.path, from, next);
    
    if (nextCalled) {
      if (nextPath) {
        navigateTo(nextPath);
      }
      return false;
    }
    
    if (result === false) {
      return false;
    }
  }
  
  return true;
}
```

**Middlewares Disponíveis:**
- `requireAuth`: Verifica se o usuário está autenticado
- `requireEmailVerified`: Verifica se o email foi verificado

#### Injeção de Layout

O router suporta dois modos de renderização:

1. **Com Layout** (`layout: 'app'`): Injeta o conteúdo dentro do `AppLayout`
2. **Sem Layout**: Renderiza diretamente no container `#app`

```88:118:src/router/index.js
    if (useLayout) {
      const { render: layoutRender, init: layoutInit } = await import('../components/layout/AppLayout/AppLayout.js');
      appContainer.innerHTML = layoutRender('');

      // Render page inside layout content
      const contentEl = document.getElementById('layoutContent');
      if (!contentEl) throw new Error('Elemento #layoutContent não encontrado no AppLayout');

      let pageHtml;
      if (component && typeof component.render === 'function') {
        pageHtml = await component.render();
      } else if (typeof component === 'function') {
        pageHtml = await component();
      } else {
        throw new Error('Componente inválido: ' + route.path);
      }

      contentEl.innerHTML = pageHtml;
      await layoutInit();
      if (component && typeof component.afterRender === 'function') {
        console.log('Router: Chamando afterRender para', route.path);
        await component.afterRender();
      } else if (component && typeof component.init === 'function') {
        console.log('Router: Chamando init para', route.path);
        await component.init();
      }
    }
```

---

## 2. Core Features (Lógica de Negócio)

### 2.1. Motor de Temas (Species Segregation)

O sistema de temas é a **"jóia da coroa"** do Petflix. Ele determina qual conteúdo (Cachorro ou Gato) será exibido.

#### Como Funciona

1. **Classe no Body**: O tema é aplicado como classe CSS no `<body>`:
   - `theme-dog`: Conteúdo de cachorros
   - `theme-cat`: Conteúdo de gatos

2. **Aplicação do Tema**: A função `applyTheme` em `AuthState.js` gerencia isso:

```113:119:src/state/AuthState.js
export function applyTheme(themeName) {
  const body = document.body;
  body.classList.remove('theme-dog', 'theme-cat');
  if (themeName === 'cat') body.classList.add('theme-cat');
  else body.classList.add('theme-dog');
  setState({ theme: themeName === 'cat' ? 'cat' : 'dog' });
}
```

3. **Filtragem de Conteúdo**: O `content.service.js` filtra por `species`:

```45:48:src/services/content.service.js
export function getBySpecies(species) {
  const s = (species || '').toLowerCase();
  return ALL_CONTENT.filter(i => i.species === s);
}
```

4. **Detecção em Tempo Real**: As páginas detectam o tema atual:

```13:13:src/pages/dashboard/DashboardPage.js
  const species = document.body.classList.contains('theme-cat') ? 'cat' : 'dog';
```

#### Fluxo de Seleção de Perfil

```
Usuário clica em perfil (HomePage)
    ↓
selectProfile('dog' ou 'cat')
    ↓
applyTheme() → Adiciona classe no body
    ↓
localStorage.setItem('petflixPetType', species)
    ↓
navigateTo('/dashboard')
    ↓
DashboardPage detecta classe do body
    ↓
Filtra conteúdo por species
```

### 2.2. Sistema de Autenticação

O sistema de autenticação utiliza **Firebase Auth v9 Modular** e segue um fluxo rigoroso:

#### Fluxo Completo

```
1. REGISTRO
   └─> RegisterPage
       └─> authService.signUp(email, password, name)
           ├─> Cria conta no Firebase
           ├─> Envia email de verificação
           └─> Salva dados no Firestore

2. VERIFICAÇÃO DE EMAIL
   └─> Usuário clica no link do email
       └─> Firebase marca email como verificado

3. LOGIN
   └─> LoginPage
       └─> authService.signIn(email, password)
           ├─> Verifica se email foi verificado
           ├─> Se não verificado → Logout + Erro
           └─> Se verificado → Sucesso

4. SELEÇÃO DE PERFIL
   └─> HomePage (/home)
       └─> Usuário escolhe 'dog' ou 'cat'
           └─> applyTheme() + navigateTo('/dashboard')

5. DASHBOARD
   └─> DashboardPage (/dashboard)
       └─> Exibe conteúdo filtrado por species
```

#### Verificação de Email

O sistema **exige** verificação de email antes de permitir acesso completo:

```25:41:src/services/auth/auth.service.js
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verifica se o email foi verificado
      if (!user.emailVerified) {
        await firebaseSignOut(auth);
        throw new AuthError('Por favor, verifique seu e-mail antes de fazer login. Enviamos um link de confirmação para seu e-mail.', 'email-not-verified');
      }

      return userCredential;
    } catch (error) {
      const message = getFirebaseAuthErrorMessage(error);
      throw new AuthError(message, error.code);
    }
  }
```

#### Middleware de Proteção

As rotas protegidas usam middlewares:

```17:26:src/router/routes.js
async function requireAuth(to, from, next) {
  const { AuthState } = await import('../state/AuthState.js');
  const state = AuthState.getState();
  
  if (!state.user) {
    next('/login');
    return false;
  }
  return true;
}
```

```31:58:src/router/routes.js
async function requireEmailVerified(to, from, next) {
  const { AuthState } = await import('../state/AuthState.js');
  const state = AuthState.getState();
  
  if (!state.user) {
    next('/login');
    return false;
  }
  
  if (!state.user.emailVerified) {
    // Se o email não foi verificado, mas o usuário está logado, 
    // talvez devêssemos permitir o acesso à home para ele ver um aviso?
    // Por enquanto, mantemos a lógica de redirecionar para home (onde pode haver um aviso)
    // ou permitimos o acesso.
    // Se a intenção era bloquear, o next('/home') pode criar um loop se /home exigir verificação.
    // Mas /home exige requireEmailVerified, então se falhar, ele redireciona para /home... LOOP!
    
    // CORREÇÃO: Se já estamos indo para /home, permitimos (retorna true).
    // Se estamos indo para outra página protegida e não verificado, vai para /home.
    if (to === '/home') {
      return true;
    }
    
    next('/home'); 
    return false;
  }
  return true;
}
```

### 2.3. Content Service (Banco de Dados Mockado)

O `content.service.js` é o **repositório central** de todo o conteúdo da plataforma.

#### Schema de Dados

Cada item de conteúdo segue este schema:

```typescript
interface ContentItem {
  id: string;              // ID único (ex: 'DOG-ACT-001')
  title: string;           // Título do conteúdo
  description: string;     // Descrição
  image: string;           // URL da imagem
  type: 'movie' | 'series' | 'doc';  // Tipo de conteúdo
  species: 'dog' | 'cat';  // Espécie (filtro principal)
  genre: 'action' | 'adventure' | 'comedy' | 'drama';  // Gênero
  videoId: string;         // ID do vídeo no YouTube
  featured: boolean;       // Se aparece no Hero Banner
  trending: boolean;       // Se aparece em "Em Alta"
  original: boolean;       // Se é conteúdo original Petflix
}
```

#### Funções de Busca

O service oferece múltiplas funções de filtragem:

```45:92:src/services/content.service.js
export function getBySpecies(species) {
  const s = (species || '').toLowerCase();
  return ALL_CONTENT.filter(i => i.species === s);
}

export function getFeatured(species) {
  const all = getBySpecies(species);
  const list = all.filter(i => i.featured);
  if (list.length > 0) return list[Math.floor(Math.random() * list.length)];
  if (all.length > 0) return all[0];
  return { id: 'error', title: 'Conteúdo Indisponível', description: 'Tente outro perfil.', image: '/assets/hero-fallback.jpg', type: 'movie', species: (species || 'dog'), genre: 'drama', videoId: '', featured: false, trending: false, original: false };
}

export function getByCategory(species, type) {
  const s = (species || '').toLowerCase();
  const t = (type || '').toLowerCase();
  return ALL_CONTENT.filter(i => i.species === s && i.type === t);
}

export function getByGenre(species, genre) {
  const s = (species || '').toLowerCase();
  const g = (genre || '').toLowerCase();
  return ALL_CONTENT.filter(i => i.species === s && i.genre === g);
}

export function getTrending(species, limit = 20) {
  const base = getBySpecies(species);
  const list = base.filter(i => i.trending);
  const pool = list.length > 0 ? list : base;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(limit, shuffled.length));
}

export function getOriginals(species) {
  return getBySpecies(species).filter(i => i.original === true);
}

export function searchContent(query, species) {
  const q = (query || '').toLowerCase().trim();
  const base = species ? getBySpecies(species) : ALL_CONTENT;
  if (!q) return [];
  return base.filter(item => (
    (item.title || '').toLowerCase().includes(q) ||
    (item.description || '').toLowerCase().includes(q)
  )).slice(0, 20);
}
```

**Funções Disponíveis:**
- `getBySpecies(species)`: Filtra por espécie
- `getFeatured(species)`: Retorna um item aleatório marcado como `featured`
- `getByCategory(species, type)`: Filtra por espécie e tipo (movie/series/doc)
- `getByGenre(species, genre)`: Filtra por espécie e gênero
- `getTrending(species, limit)`: Retorna itens em alta (aleatorizados)
- `getOriginals(species)`: Retorna apenas conteúdos originais
- `searchContent(query, species)`: Busca textual em título e descrição

### 2.4. Minha Lista (Favoritos)

**Status Atual:** A funcionalidade de "Minha Lista" **não está implementada** no MVP atual. A infraestrutura está preparada através do `localStorage.service.js`, mas a lógica de toggle e persistência de favoritos ainda precisa ser desenvolvida.

#### Estrutura Preparada

O `localStorage.service.js` oferece métodos genéricos que podem ser usados:

```28:38:src/services/storage/localStorage.service.js
  get(key, defaultValue = null) {
    if (!this.isAvailable()) return defaultValue;

    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch {
      return defaultValue;
    }
  }
```

**Implementação Futura Sugerida:**

```javascript
// src/services/list.service.js (NÃO EXISTE AINDA)
export function toggleItem(videoId, species) {
  const key = `petflix_list_${species}`;
  const list = localStorageService.get(key, []);
  const index = list.indexOf(videoId);
  
  if (index > -1) {
    list.splice(index, 1);
  } else {
    list.push(videoId);
  }
  
  localStorageService.set(key, list);
  return list;
}

export function isInList(videoId, species) {
  const key = `petflix_list_${species}`;
  const list = localStorageService.get(key, []);
  return list.includes(videoId);
}
```

---

## 3. Mapa de Arquivos (File Tree & Responsibility)

### 3.1. Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   ├── features/        # Componentes de features (CategoryRow, ThumbnailCard, etc.)
│   ├── layout/          # Componentes de layout (Navbar, Footer, AppLayout)
│   └── ui/              # Componentes UI básicos (Button, Modal, Loading)
├── config/              # Configurações (Firebase, constantes)
├── core/                # Core da aplicação (app.js, error-handler)
├── data/                # Dados mockados (catalog JSONs)
├── hooks/               # Hooks customizados (useAuth, useLocalStorage)
├── pages/               # Páginas da aplicação
│   ├── categories/      # Páginas de categorias (Movies, Series, Docs)
│   ├── dashboard/       # Dashboard principal
│   ├── home/            # Página de seleção de perfil
│   └── player/          # Página do player de vídeo
├── router/              # Sistema de roteamento
├── services/            # Serviços (Auth, Content, Storage, API)
│   ├── api/             # Serviços de API (YouTube, Firebase, Cache)
│   ├── auth/            # Serviço de autenticação
│   ├── banner/          # Serviço de banner em destaque
│   └── storage/         # Serviços de storage (localStorage, sessionStorage)
├── state/               # Gerenciamento de estado global
├── styles/              # Estilos CSS organizados
├── utils/               # Utilitários (helpers, constants)
└── main.js              # Ponto de entrada
```

### 3.2. Arquivos Principais

#### `src/main.js`
**Responsabilidade:** Ponto de entrada da aplicação. Inicializa Firebase, estados globais e router.

#### `src/router/index.js`
**Responsabilidade:** 
- Gerencia navegação baseada em hash
- Executa middlewares de autenticação
- Renderiza componentes e injeta layouts

#### `src/router/routes.js`
**Responsabilidade:** 
- Define todas as rotas da aplicação
- Configura middlewares por rota
- Mapeia componentes para paths

#### `src/state/AuthState.js`
**Responsabilidade:**
- Gerencia estado global de autenticação
- Observa mudanças do Firebase Auth
- Aplica temas (dog/cat) no body
- Sistema de subscribers (Observer pattern)

```81:102:src/state/AuthState.js
export function initAuthState() {
  onAuthStateChanged(auth, (user) => {
    const serialized = user ? {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName || ''
    } : null;

    try {
      localStorage.setItem('currentUser', JSON.stringify(serialized));
    } catch {}

    setState({
      user: serialized,
      loading: false,
      error: null
    });
  });

  console.log('✅ AuthState inicializado');
}
```

#### `src/state/AppState.js`
**Responsabilidade:**
- Gerencia estado da aplicação (petType, currentPage, loading)
- Carrega petType do localStorage na inicialização
- Sistema de subscribers

#### `src/services/content.service.js`
**Responsabilidade:**
- Banco de dados mockado de conteúdo
- Funções de filtragem e busca
- Schema único de dados

#### `src/services/auth/auth.service.js`
**Responsabilidade:**
- Wrapper do Firebase Auth
- Métodos: signIn, signUp, signOut, sendPasswordResetEmail
- Tratamento de erros customizado

#### `src/services/profile.service.js`
**Responsabilidade:**
- Gerencia tipo de pet selecionado
- Persiste no localStorage e AppState

#### `src/pages/dashboard/DashboardPage.js`
**Responsabilidade:**
- Página principal logada (Home)
- Monta carrosséis dinamicamente baseado na species
- Renderiza Hero Banner com conteúdo em destaque
- Integra CategoryRow para exibir categorias

```12:48:src/pages/dashboard/DashboardPage.js
export function render() {
  const species = document.body.classList.contains('theme-cat') ? 'cat' : 'dog';
  const trending = getTrending(species).map(mapCard);
  const action = getByGenre(species, 'action').map(mapCard);
  const adventure = getByGenre(species, 'adventure').map(mapCard);
  const comedy = getByGenre(species, 'comedy').map(mapCard);
  const drama = getByGenre(species, 'drama').map(mapCard);
  const series = getByCategory(species, 'series').map(mapCard);
  const docs = getByCategory(species, 'doc').map(mapCard);
  const movies = getByCategory(species, 'movie').map(mapCard);

  const isCat = species === 'cat';
  const rowsCat = `
      ${CategoryRow({ title: 'Populares na Petflix', items: trending, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) })}
      ${CategoryRow({ title: 'Gatos Planejando o Caos', items: [...action, ...adventure].slice(0, 20), onCardClick: (id) => navigateTo(`/player?videoId=${id}`) })}
      ${CategoryRow({ title: 'Soneca da Tarde', items: docs, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) })}
      ${CategoryRow({ title: 'Comédias Felinas', items: comedy, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) })}
      ${CategoryRow({ title: 'Séries para Maratonar', items: series, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) })}
  `;
  const rowsDog = `
      ${CategoryRow({ title: 'Em Alta Hoje', items: trending, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) })}
      ${CategoryRow({ title: 'Aventuras no Parque', items: [...action, ...adventure].slice(0, 20), onCardClick: (id) => navigateTo(`/player?videoId=${id}`) })}
      ${CategoryRow({ title: 'Bons Garotos', items: drama, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) })}
      ${CategoryRow({ title: 'Histórias de Adoção', items: docs, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) })}
      ${CategoryRow({ title: 'Filmes para toda a família', items: movies, onCardClick: (id) => navigateTo(`/player?videoId=${id}`) })}
  `;

  return `
    <div>
      <div id="hero-container">
        ${renderHero({ item: mapHero(getFeatured(species)) })}
      </div>
      <div class="h-12 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent"></div>
      ${isCat ? rowsCat : rowsDog}
    </div>
  `;
}
```

#### `src/pages/player/PlayerPage.js`
**Responsabilidade:**
- Player de vídeo customizado usando YouTube IFrame API
- Controles: play/pause, mute, fullscreen, progress bar
- Carrega API do YouTube dinamicamente
- Busca detalhes do vídeo via YouTube Service

```145:173:src/pages/player/PlayerPage.js
  function initPlayer() {
    player = new window.YT.Player('videoContainer', {
      videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onReady: () => {
          isMuted = player.isMuted?.() || false;
          isPlaying = true;
          playPause.innerHTML = getThemeIcon('pause');
          muteToggle.innerHTML = isMuted ? getThemeIcon('volume-off') : getThemeIcon('volume');
          startProgress();
        },
        onStateChange: (e) => {
          if (e.data === window.YT.PlayerState.PLAYING) {
            isPlaying = true;
            playPause.innerHTML = getThemeIcon('pause');
          } else if (e.data === window.YT.PlayerState.PAUSED) {
            isPlaying = false;
            playPause.innerHTML = getThemeIcon('play');
          }
        }
      }
    });
  }
```

#### `src/pages/home/HomePage.js`
**Responsabilidade:**
- Página de seleção de perfil (estilo Netflix)
- Permite escolher entre perfil "Cachorro" ou "Gato"
- Aplica tema e redireciona para dashboard

```62:73:src/pages/home/HomePage.js
function selectProfile(profileName) {
  // Salva o perfil selecionado
  localStorage.setItem('selectedProfile', profileName);
  
  // Redireciona para a página de filmes (dashboard)
  try {
    applyTheme(profileName === 'cat' ? 'cat' : 'dog');
    navigateTo('/dashboard');
  } catch {
    window.location.hash = '#/dashboard';
  }
}
```

#### `src/components/layout/Navbar/Navbar.js`
**Responsabilidade:**
- Barra de navegação fixa no topo
- Busca expandível com debounce
- Logout
- Scroll effect (transparent → solid)

#### `src/components/features/CategoryRow/CategoryRow.js`
**Responsabilidade:**
- Renderiza carrossel horizontal de cards
- Botões de navegação (prev/next) com scroll suave
- Sistema de handlers para clicks em cards
- Suporte a loading state (skeleton)

```5:31:src/components/features/CategoryRow/CategoryRow.js
export function CategoryRow({ title, items = [], loading = false, onCardClick } = {}) {
  const rowId = `row_${Math.random().toString(36).slice(2)}`;
  const cardsHtml = loading
    ? Array.from({ length: 6 }).map(() => `<div class=\"relative flex-none w-[160px] md:w-[240px] aspect-video rounded-md bg-gray-700 animate-pulse\"></div>`).join('')
    : items.map(i => ThumbnailCard({ id: i.videoId || i.id, title: i.title, thumbnail: i.thumbnail || i.thumb })).join('');

  if (typeof onCardClick === 'function') {
    ROW_HANDLERS.set(rowId, onCardClick);
  }

  return `
    <section aria-label="${title}" data-row-id="${rowId}">
      <h3 class="text-lg md:text-xl font-bold text-white mb-2 pl-4 md:pl-12">${title}</h3>
      <div class="relative group px-4 md:px-12 pb-8">
        <button type="button" data-prev class="absolute left-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 flex items-center justify-center w-12 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-white"><path d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
        </button>
        <div class="flex gap-2 overflow-x-auto no-scrollbar" data-row="${rowId}" role="list">
          ${cardsHtml}
        </div>
        <button type="button" data-next class="absolute right-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 flex items-center justify-center w-12 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-white"><path d="M8.25 4.5L15.75 12l-7.5 7.5"/></svg>
        </button>
      </div>
    </section>
  `;
}
```

#### `src/components/features/ThumbnailCard/ThumbnailCard.js`
**Responsabilidade:**
- Card de thumbnail de vídeo
- Hover effects (scale + overlay)
- Acessibilidade (aria-label, role)

```1:13:src/components/features/ThumbnailCard/ThumbnailCard.js
export function ThumbnailCard({ id, title, thumbnail }) {
  const vid = id;
  const safeTitle = title || '';
  const src = thumbnail || 'assets/background-index.jpg';
  return `
    <div class="relative flex-none w-[160px] md:w-[240px] aspect-video transition-transform duration-300 hover:scale-105 hover:z-20 cursor-pointer rounded-md overflow-hidden" tabindex="0" role="button" data-id="${vid}" aria-label="${safeTitle}">
      <img src="${src}" alt="${safeTitle}" loading="lazy" class="w-full h-full object-cover" />
      <div class="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
        <div class="w-full p-2 text-xs md:text-sm text-white truncate">${safeTitle}</div>
      </div>
    </div>
  `;
}
```

#### `src/components/layout/AppLayout/AppLayout.js`
**Responsabilidade:**
- Layout wrapper para páginas autenticadas
- Injeta Navbar e Footer
- Container para conteúdo da página

```5:13:src/components/layout/AppLayout/AppLayout.js
export function render(content = '') {
  return `
    <div class="app-layout">
      <header id="navbar"></header>
      <main id="layoutContent" class="app-content">${content || ''}</main>
      <footer id="footer"></footer>
    </div>
  `;
}
```

#### `src/config/firebase.js`
**Responsabilidade:**
- Configuração do Firebase
- Inicialização de Auth e Firestore
- Setup de persistência de autenticação

```1:26:src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAb_0r54B3fL3CmLukhuXYgtxfIpj9IgvU',
  authDomain: 'petflix-de1c3.firebaseapp.com',
  projectId: 'petflix-de1c3',
  storageBucket: 'petflix-de1c3.appspot.com',
  messagingSenderId: '863177295284',
  appId: '1:863177295284:web:SEU_APPID'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function setupAuthPersistence() {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (e) {
    console.warn('Persistência Auth (local) falhou:', e);
  }
}

export default { app, auth, db };
```

---

## 4. Componentes de UI

### 4.1. Filosofia de Design

O Petflix segue o **design system da Netflix**:
- **Cores**: Fundo preto (#141414), acentos vermelhos
- **Tipografia**: Sans-serif moderna, hierarquia clara
- **Espaçamento**: Generoso, respiração visual
- **Animações**: Transições suaves, hover effects

### 4.2. Navbar

**Comportamentos:**
1. **Scroll Effect**: Transparent no topo → Sólido ao rolar
2. **Busca Expandida**: Input expande ao clicar no ícone
3. **Debounce**: Busca com delay de 300ms
4. **Overlay de Resultados**: Grid de cards abaixo da navbar

```74:81:src/components/layout/Navbar/Navbar.js
    window.addEventListener('scroll', () => {
      if (!nav) return;
      if (window.scrollY > 50) {
        nav.classList.add('bg-black');
      } else {
        nav.classList.remove('bg-black');
      }
    });
```

```128:140:src/components/layout/Navbar/Navbar.js
    const onInput = debounce(() => {
      if (!searchInput) return;
      const q = searchInput.value.trim();
      const hasText = q.length > 0;
      searchClear.className = (hasText ? '' : 'opacity-0 pointer-events-none ') + 'text-gray-300 hover:text-white';
      if (q.length < 3) {
        removeOverlay();
        return;
      }
      const species = document.body.classList.contains('theme-cat') ? 'cat' : 'dog';
      const results = searchContent(q, species);
      renderOverlay(results);
    }, 300);
```

### 4.3. ThumbnailCard

**Estrutura:**
- Imagem de fundo (lazy loading)
- Overlay com título (aparece no hover)
- Scale effect no hover (105%)
- Z-index elevado no hover para sobreposição

**Injeção de Botão "Minha Lista":**
Atualmente não implementado. Sugestão de implementação:

```javascript
// Adicionar botão "+" no hover
<div class="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
  <button class="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center">
    <svg>...</svg> <!-- Ícone + ou ✓ -->
  </button>
</div>
```

### 4.4. LoadingSpinner

**Sistema de Feedback Visual:**
- Spinner customizado com tema (dog/cat)
- Overlay fullscreen durante carregamento
- Remoção automática após 800ms

```98:123:src/pages/dashboard/DashboardPage.js
  async loadFeatured() {
    try {
      const species = document.body.classList.contains('theme-cat') ? 'cat' : 'dog';
      console.log('Espécie atual:', species);
      const spinner = new LoadingSpinner({ type: species === 'dog' ? 'dog' : 'cat' });
      spinner.show();
      this.featured = getFeatured(species);
      const heroData = this.featured;
      console.log('Hero Data:', heroData);
      const hero = document.getElementById('hero-container');
      if (hero && heroData) {
        if (!heroData || !heroData.id) {
          console.error('Erro crítico: Nenhum dado para o Hero Banner.');
          return;
        }
        hero.innerHTML = renderHero({ item: mapHero(heroData) });
        initHero();
      }
      setTimeout(() => {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.remove();
      }, 800);
    } catch (e) {
      console.warn('Falha ao carregar destaque:', e);
    }
  }
```

### 4.5. CategoryRow

**Características:**
- Scroll horizontal suave
- Botões prev/next aparecem no hover
- Skeleton loading state
- Sistema de handlers para clicks

---

## 5. Guia de Fluxo de Dados

### 5.1. Fluxo de Navegação

```
Usuário digita URL ou clica em link
    ↓
window.location.hash muda
    ↓
Evento 'hashchange' dispara
    ↓
Router.getCurrentPath() extrai path do hash
    ↓
Router.findRoute() busca rota no array routes
    ↓
Router.executeMiddlewares() valida autenticação
    ↓
Router.renderRoute() renderiza componente
    ↓
Component.render() retorna HTML string
    ↓
HTML injetado no DOM (#app ou #layoutContent)
    ↓
Component.init() ou afterRender() executa lógica
```

### 5.2. Fluxo de Autenticação

```
1. REGISTRO
   Usuário preenche formulário
       ↓
   RegisterPage.submit()
       ↓
   authService.signUp(email, password, name)
       ↓
   Firebase.createUserWithEmailAndPassword()
       ↓
   Firebase.sendEmailVerification()
       ↓
   Firestore.setDoc() salva dados do usuário
       ↓
   Usuário recebe email de verificação

2. LOGIN
   Usuário preenche credenciais
       ↓
   LoginPage.submit()
       ↓
   authService.signIn(email, password)
       ↓
   Firebase.signInWithEmailAndPassword()
       ↓
   Verifica user.emailVerified
       ├─> Se não verificado → Logout + Erro
       └─> Se verificado → Sucesso
       ↓
   onAuthStateChanged() dispara
       ↓
   AuthState.setState({ user: serialized })
       ↓
   Todos os subscribers são notificados
       ↓
   Router redireciona para /home

3. SELEÇÃO DE PERFIL
   Usuário clica em perfil (dog/cat)
       ↓
   HomePage.selectProfile(species)
       ↓
   applyTheme(species) → Adiciona classe no body
       ↓
   localStorage.setItem('petflixPetType', species)
       ↓
   AppState.setState({ petType: species })
       ↓
   navigateTo('/dashboard')
       ↓
   DashboardPage.render() detecta classe do body
       ↓
   Filtra conteúdo por species
       ↓
   Renderiza carrosséis
```

### 5.3. Fluxo de Busca

```
Usuário digita na busca
    ↓
Input event dispara
    ↓
Debounce aguarda 300ms
    ↓
Se query.length < 3 → Remove overlay
    ↓
Se query.length >= 3:
    ↓
Navbar.onInput()
    ↓
content.service.searchContent(query, species)
    ↓
Filtra ALL_CONTENT por título/descrição
    ↓
Retorna array de resultados (máx 20)
    ↓
Navbar.renderOverlay(results)
    ↓
Cria overlay com grid de ThumbnailCards
    ↓
Adiciona event listeners nos cards
    ↓
Click em card → navigateTo('/player?videoId=...')
```

### 5.4. Fluxo de Reprodução de Vídeo

```
Usuário clica em ThumbnailCard
    ↓
CategoryRow handler captura click
    ↓
navigateTo('/player?videoId=VIDEO_ID')
    ↓
Router renderiza PlayerPage
    ↓
PlayerPage.init() extrai videoId do hash
    ↓
PlayerPage.loadYTAPI() carrega YouTube IFrame API
    ↓
youtubeService.getVideoDetails(videoId) busca título
    ↓
PlayerPage.initPlayer() cria YT.Player
    ↓
YouTube Player carrega vídeo
    ↓
onReady event → Inicia progress bar
    ↓
onStateChange events → Atualiza controles
    ↓
Usuário interage (play/pause/mute/fullscreen)
    ↓
Player atualiza estado visual
```

### 5.5. Fluxo de Toggle de "Minha Lista" (Futuro)

```
Usuário clica no botão '+' de um card
    ↓
Event listener captura click
    ↓
list.service.toggleItem(videoId, species)
    ↓
localStorageService.get(`petflix_list_${species}`, [])
    ↓
Verifica se videoId está na lista
    ├─> Se está → Remove da lista
    └─> Se não está → Adiciona à lista
    ↓
localStorageService.set(key, updatedList)
    ↓
Atualiza ícone visualmente (+ → ✓)
    ↓
Dispara evento customizado (opcional)
    ↓
Componentes subscribers atualizam UI
```

---

## 6. Configuração e Deploy

### 6.1. Tecnologias e Dependências

```json
{
  "dependencies": {
    "firebase": "^9.23.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.17",
    "autoprefixer": "^10.4.22",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.17",
    "vite": "^5.0.0"
  }
}
```

### 6.2. Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento (Vite)
npm run build    # Gera build de produção
npm run preview  # Preview do build de produção
```

### 6.3. Variáveis de Ambiente

**Firebase Config** (`src/config/firebase.js`):
- `apiKey`: Chave da API do Firebase
- `authDomain`: Domínio de autenticação
- `projectId`: ID do projeto Firebase
- `storageBucket`: Bucket de storage
- `messagingSenderId`: ID do sender
- `appId`: ID da aplicação

**YouTube API** (`src/config/constants.js`):
- `YOUTUBE_CONFIG.API_KEY`: Chave da API do YouTube (para buscar detalhes de vídeos)

### 6.4. Estrutura de Build

O Vite gera:
- `dist/index.html`: HTML de entrada
- `dist/assets/`: Assets otimizados (JS, CSS, imagens)

### 6.5. Deploy

**Netlify/Vercel:**
1. Conectar repositório
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Variáveis de ambiente: Configurar se necessário

**Firebase Hosting:**
```bash
firebase init hosting
firebase deploy --only hosting
```

---

## 7. Extensões Futuras

### 7.1. Funcionalidades Planejadas

- [ ] **Minha Lista**: Sistema completo de favoritos
- [ ] **Histórico de Visualização**: Rastrear vídeos assistidos
- [ ] **Recomendações**: Algoritmo de recomendação baseado em histórico
- [ ] **Múltiplos Perfis**: Suporte a vários perfis por usuário
- [ ] **Comentários**: Sistema de comentários nos vídeos
- [ ] **Avaliações**: Sistema de likes/dislikes

### 7.2. Melhorias Técnicas

- [ ] **Service Worker**: PWA com cache offline
- [ ] **Code Splitting**: Lazy loading de rotas
- [ ] **Virtual Scrolling**: Para listas grandes
- [ ] **Error Boundary**: Tratamento global de erros
- [ ] **Analytics**: Integração com Google Analytics
- [ ] **A/B Testing**: Framework de testes A/B

---

## 8. Convenções de Código

### 8.1. Nomenclatura

- **Arquivos**: PascalCase para componentes (`Navbar.js`), camelCase para serviços (`auth.service.js`)
- **Funções**: camelCase (`getBySpecies`, `renderRoute`)
- **Constantes**: UPPER_SNAKE_CASE (`STORAGE_KEYS`, `ROUTES`)
- **Componentes**: PascalCase (`CategoryRow`, `ThumbnailCard`)

### 8.2. Estrutura de Componentes

```javascript
// Component Pattern
export function ComponentName({ prop1, prop2 }) {
  return `<div>...</div>`;
}

// Page Pattern
export function render() {
  return `<div>...</div>`;
}

export function init() {
  // Lógica de inicialização
}

export function afterRender() {
  // Lógica após renderização
}
```

### 8.3. Imports

- **Relativos**: `'./component.js'` ou `'../service.js'`
- **Absolutos**: Não suportados (configurar no Vite se necessário)
- **Barrel Exports**: Usar `index.js` para exportar múltiplos itens

---

## 9. Troubleshooting

### 9.1. Problemas Comuns

**Router não funciona:**
- Verificar se `#app` existe no DOM
- Verificar se `initRouter()` foi chamado
- Verificar console para erros de rota

**Autenticação não persiste:**
- Verificar se `setupAuthPersistence()` foi chamado
- Verificar configuração do Firebase
- Limpar localStorage e tentar novamente

**Conteúdo não aparece:**
- Verificar se tema está aplicado no body (`theme-dog` ou `theme-cat`)
- Verificar se `content.service.js` tem dados
- Verificar console para erros de filtragem

**Player não carrega:**
- Verificar se YouTube API está carregada
- Verificar se `videoId` é válido
- Verificar CORS e políticas do YouTube

---

## 10. Referências

- **Firebase Auth v9**: https://firebase.google.com/docs/auth/web/start
- **YouTube IFrame API**: https://developers.google.com/youtube/iframe_api_reference
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vite**: https://vitejs.dev/guide/

---

**Documentação gerada em:** 2024  
**Mantida por:** Equipe Petflix  
**Versão do Projeto:** MVP Completo

