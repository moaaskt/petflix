/**
 * Routes Configuration - Configuração de rotas
 */
import * as LoginPage from '../pages/LoginPage.js';
import * as RegisterPage from '../pages/RegisterPage.js';
import * as ForgotPasswordPage from '../pages/ForgotPasswordPage.js';
import * as HomePage from '../pages/home/HomePage.js';
import * as MoviesPage from '../pages/categories/MoviesPage.js';
import * as SeriesPage from '../pages/categories/SeriesPage.js';
import * as DocumentariesPage from '../pages/categories/DocumentariesPage.js';
import * as ProfilePage from '../pages/ProfilePage.js';
import * as AccountPage from '../pages/account/AccountPage.js';
import * as DashboardPage from '../pages/dashboard/DashboardPage.js';
import * as PlayerPage from '../pages/player/PlayerPage.js';
import * as AdminMoviesPage from '../pages/admin/AdminMoviesPage.js';
import * as AdminDashboardPage from '../pages/admin/AdminDashboardPage.js';
import * as MyListPage from '../pages/MyListPage.js';

/**
 * Middleware para verificar autenticação
 */
async function requireAuth(to, from, next) {
  const { AuthState } = await import('../state/AuthState.js');
  const state = AuthState.getState();
  
  if (!state.user) {
    next('/login');
    return false;
  }
  return true;
}

/**
 * Middleware para verificar email verificado
 */
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

/**
 * Middleware para verificar se o usuário é administrador
 */
async function requireAdmin(to, from, next) {
  const { AuthState } = await import('../state/AuthState.js');
  const { authService } = await import('../services/auth/auth.service.js');
  const { getUserRole } = await import('../services/user.service.js');
  const { Toast } = await import('../utils/toast.js');
  
  const currentUser = authService.getCurrentUser();
  
  if (!currentUser) {
    next('/login');
    return false;
  }
  
  // Verifica a role no estado primeiro
  const state = AuthState.getState();
  let role = state.user?.role;
  
  // Se não estiver no estado, busca no Firestore
  if (!role) {
    try {
      role = await getUserRole(currentUser.uid);
    } catch (error) {
      console.error('Erro ao obter role do usuário:', error);
      role = 'user';
    }
  }
  
  if (role !== 'admin') {
    Toast.error('Acesso restrito a administradores');
    next('/dashboard');
    return false;
  }
  
  return true;
}

/**
 * Definição de rotas
 */
export const routes = [
  {
    path: '/login',
    component: LoginPage,
    meta: {
      title: 'Login - PetFlix',
      requiresAuth: false,
      layout: 'public'
    }
  },
  {
    path: '/register',
    component: RegisterPage,
    meta: {
      title: 'Cadastro - PetFlix',
      requiresAuth: false,
      layout: 'public'
    }
  },
  {
    path: '/forgot-password',
    component: ForgotPasswordPage,
    meta: {
      title: 'Recuperar Senha - PetFlix',
      requiresAuth: false,
      layout: 'public'
    }
  },
  {
    path: '/home',
    component: HomePage,
    meta: {
      title: 'Selecione seu Perfil - PetFlix',
      requiresAuth: true,
      layout: 'public',
      middleware: [requireAuth] 
      // Removi requireEmailVerified daqui para evitar loop, 
      // já que a lógica de requireEmailVerified redireciona para /home
    }
  },
  {
    path: '/dashboard',
    component: DashboardPage,
    meta: {
      title: 'Dashboard - PetFlix',
      requiresAuth: true,
      layout: 'app',
      middleware: [requireAuth, requireEmailVerified]
    }
  },
  {
    path: '/filmes',
    component: MoviesPage,
    meta: {
      title: 'Filmes - PetFlix',
      requiresAuth: true,
      layout: 'app',
      middleware: [requireAuth, requireEmailVerified]
    }
  },
  {
    path: '/series',
    component: SeriesPage,
    meta: {
      title: 'Séries - PetFlix',
      requiresAuth: true,
      layout: 'app',
      middleware: [requireAuth, requireEmailVerified]
    }
  },
  {
    path: '/docs',
    component: DocumentariesPage,
    meta: {
      title: 'Documentários - PetFlix',
      requiresAuth: true,
      layout: 'app',
      middleware: [requireAuth, requireEmailVerified]
    }
  },
  {
    path: '/player',
    component: PlayerPage,
    meta: {
      title: 'Player - PetFlix',
      requiresAuth: true,
      layout: 'app',
      middleware: [requireAuth]
    }
  },
  {
    path: '/profile',
    component: ProfilePage,
    meta: {
      title: 'Perfil - PetFlix',
      requiresAuth: true,
      middleware: [requireAuth]
    }
  },
  {
    path: '/conta',
    component: AccountPage,
    meta: {
      title: 'Minha Conta - PetFlix',
      requiresAuth: true,
      layout: 'app',
      middleware: [requireAuth]
    }
  },
  {
    path: '/my-list',
    component: MyListPage,
    meta: {
      title: 'Minha Lista - PetFlix',
      requiresAuth: true,
      layout: 'app',
      middleware: [requireAuth, requireEmailVerified]
    }
  },
  {
    path: '/admin',
    component: AdminDashboardPage,
    meta: {
      title: 'Dashboard Admin - PetFlix',
      requiresAuth: true,
      layout: 'admin',
      middleware: [requireAuth, requireAdmin]
    }
  },
  {
    path: '/admin/movies',
    component: AdminMoviesPage,
    meta: {
      title: 'Gerenciar Filmes - PetFlix',
      requiresAuth: true,
      layout: 'admin',
      middleware: [requireAuth, requireAdmin]
    }
  },
  {
    path: '/',
    redirect: '/home',
    meta: {
      requiresAuth: true
    }
  }
];

export default routes;
