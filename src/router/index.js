/**
 * Router - Sistema de roteamento SPA baseado em hash
 */
import { routes } from './routes.js';
import { getCurrentPath } from './navigator.js';

let currentRoute = null;
let appContainer = null;

/**
 * Encontra rota pelo path
 */
function findRoute(path) {
  // Remove query params e hash
  const cleanPath = path.split('?')[0].split('#')[0];
  
  // Procura rota exata
  let route = routes.find(r => r.path === cleanPath);
  
  // Se não encontrou, procura rota com redirect
  if (!route) {
    route = routes.find(r => r.redirect);
  }
  
  return route;
}

/**
 * Executa middlewares
 */
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

/**
 * Renderiza rota
 */
async function renderRoute(route) {
  // Remove overlay de busca se ainda existir (segurança extra)
  const overlay = document.getElementById('searchOverlay');
  if (overlay) overlay.remove();
  
  if (!appContainer) {
    appContainer = document.getElementById('app');
    if (!appContainer) {
      console.error('Container #app não encontrado');
      return;
    }
  }
  
  // Executa middlewares
  const canProceed = await executeMiddlewares(route, currentRoute?.path);
  if (!canProceed) {
    return;
  }
  
  // Atualiza título da página
  if (route.meta && route.meta.title) {
    document.title = route.meta.title;
  }
  
  // Renderiza componente
  try {
    const component = route.component;
    const usePublicLayout = route.meta && route.meta.layout === 'public';
    const useAppLayout = route.meta && route.meta.layout === 'app';
    const useAdminLayout = route.meta && route.meta.layout === 'admin';

    if (usePublicLayout) {
      const { render: layoutRender, init: layoutInit } = await import('../components/layout/PublicLayout/PublicLayout.js');
      appContainer.innerHTML = layoutRender('');

      // Render page inside public layout content
      const contentEl = document.getElementById('publicContent');
      if (!contentEl) throw new Error('Elemento #publicContent não encontrado no PublicLayout');

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
    } else if (useAppLayout) {
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
    } else if (useAdminLayout) {
      const { render: layoutRender, init: layoutInit } = await import('../components/layout/AdminLayout/AdminLayout.js');
      appContainer.innerHTML = layoutRender('');

      // Render page inside admin layout content
      const contentEl = document.getElementById('adminContent');
      if (!contentEl) throw new Error('Elemento #adminContent não encontrado no AdminLayout');

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
    } else {
      // Sem layout
      let html;
      if (component && typeof component.render === 'function') {
        html = await component.render();
      } else if (typeof component === 'function') {
        html = await component();
      } else {
        throw new Error('Componente inválido: ' + route.path);
      }
      appContainer.innerHTML = html;
      if (component && typeof component.afterRender === 'function') {
        console.log('Router: Chamando afterRender para', route.path);
        await component.afterRender();
      } else if (component && typeof component.init === 'function') {
        console.log('Router: Chamando init para', route.path);
        await component.init();
      }
    }

    currentRoute = route;
    
    console.log(`✅ Rota renderizada: ${route.path}`);
  } catch (error) {
    console.error(`❌ Erro ao renderizar rota ${route.path}:`, error);
    appContainer.innerHTML = `
      <div style="padding: 2rem; text-align: center;">
        <h1>Erro ao carregar página</h1>
        <p>${error.message}</p>
      </div>
    `;
  }
}

/**
 * Navega para uma rota
 */
export function navigateTo(path) {
  const route = findRoute(path);
  
  if (!route) {
    console.warn(`Rota não encontrada: ${path}, redirecionando para /home`);
    // Evita loop infinito - redireciona para /home se rota não encontrada
    if (path !== '/home') {
      window.location.hash = '#/home';
    }
    return;
  }
  
  // Se tem redirect, navega para a rota de destino
  if (route.redirect) {
    window.location.hash = `#${route.redirect}`;
    return;
  }
  
  renderRoute(route);
}

/**
 * Inicializa router
 */
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

export default {
  initRouter,
  navigateTo
};

