/**
 * LoginPage - Página de Login estilo Netflix
 */
import { authService } from '../services/auth/auth.service.js';
import { navigateTo } from '../router/navigator.js';
import { LoadingSpinner } from '../components/ui/Loading/LoadingSpinner.js';
import { Toast } from '../utils/toast.js';
import { AuthState } from '../state/AuthState.js';

/**
 * Helper: Aguarda o AuthState sincronizar com o Firebase Auth
 * Resolve quando AuthState.user for diferente de null
 * @returns {Promise<Object>} User object do AuthState
 */
function waitForAuth() {
  return new Promise((resolve) => {
    // Verifica imediatamente se já está no estado
    const currentState = AuthState.getState();
    if (currentState.user) {
      resolve(currentState.user);
      return;
    }

    // Se não, aguarda a atualização
    const unsubscribe = AuthState.subscribe((state) => {
      if (state.user) {
        unsubscribe();
        resolve(state.user);
      }
    });
  });
}

/**
 * Renderiza a página de login
 * @returns {string} HTML da página
 */
export function render() {
  return `
    <div class="relative min-h-screen w-full overflow-hidden font-sans">
      <!-- Background com overlay dinâmico -->
      <div class="absolute inset-0 w-full h-full bg-cover bg-center scale-105 animate-slow-zoom z-0" style="background-image: url('/assets/background-index.jpg');"></div>
      <div class="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-black/70"></div>
      
      <div class="relative z-20 flex flex-col justify-center items-center min-h-screen px-4 py-12">
        <!-- Logo Topo (Opcional mas bom para branding) -->
        <div class="mb-10 transition-transform hover:scale-105 duration-500">
          <span class="text-red-600 text-5xl font-black tracking-tighter shadow-red-600/20 drop-shadow-2xl">PETFLIX</span>
        </div>

        <!-- Login Card -->
        <div class="glass-panel backdrop-blur-3xl p-10 md:p-14 rounded-3xl w-full max-w-[480px] border border-white/10 shadow-2xl animate-fade-in-up">
          <h1 class="text-4xl font-black text-white mb-2 tracking-tight">Bem-vindo <span class="text-zinc-500 font-medium">de volta</span></h1>
          <p class="text-zinc-400 mb-10 text-sm font-medium">Acesse sua conta para continuar assistindo seus pets favoritos.</p>
          
          <form id="login-form" class="space-y-6">
            <div class="space-y-1.5">
              <label for="login-email" class="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">E-mail</label>
              <div class="relative group">
                <input type="email" id="login-email" 
                  class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all duration-300" 
                  placeholder="exemplo@petflix.com" required>
              </div>
            </div>

            <div class="space-y-1.5">
              <div class="flex justify-between items-center px-1">
                <label for="login-password" class="text-xs font-bold text-zinc-500 uppercase tracking-widest">Senha</label>
                <a href="#/forgot-password" class="text-xs font-bold text-zinc-400 hover:text-white transition-colors">Esqueceu a senha?</a>
              </div>
              <div class="relative group">
                <input type="password" id="login-password" 
                  class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all duration-300" 
                  placeholder="••••••••" required>
              </div>
            </div>

            <button type="submit" id="login-button" 
              class="group relative w-full overflow-hidden bg-red-600 text-white font-black py-4 rounded-2xl mt-4 transition-all hover:bg-red-700 active:scale-[0.98] shadow-lg shadow-red-600/20">
              <span class="relative z-10 flex items-center justify-center gap-2">
                ENTRAR
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 transition-transform group-hover:translate-x-1">
                  <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
                </svg>
              </span>
            </button>

            <!-- Quick Access (Estilizado como botões secundários elegantes) -->
            <div class="pt-6 border-t border-white/5 space-y-4">
              <p class="text-center text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Acesso Rápido</p>
              <div class="flex gap-4">
                <button type="button" id="quick-visitor" class="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold py-3 px-4 rounded-xl transition-all border border-white/5 hover:border-white/10">Visitante</button>
                <button type="button" id="quick-admin" class="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold py-3 px-4 rounded-xl transition-all border border-white/5 hover:border-white/10">Administrador</button>
              </div>
            </div>

            <div class="flex items-center gap-2 px-1">
              <label class="relative flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" class="peer sr-only" id="remember-me" />
                <div class="w-5 h-5 border-2 border-zinc-600 rounded-md peer-checked:bg-red-600 peer-checked:border-red-600 transition-all"></div>
                <svg class="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity left-[3px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                </svg>
                <span class="text-zinc-500 text-xs font-medium group-hover:text-zinc-400 transition-colors">Lembre-se de mim</span>
              </label>
            </div>

            <div class="text-zinc-500 text-sm mt-10 text-center font-medium">
              Novo no Petflix? <a href="#/register" class="text-white font-bold hover:underline decoration-red-600 underline-offset-4">Criar conta agora</a>
            </div>
          </form>
        </div>
        
        <!-- Footer Simples -->
        <div class="mt-20 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
          &copy; 2024 Petflix Entretenimento Pet S.A.
        </div>
      </div>
    </div>
  `;
}


/**
 * Inicializa o comportamento da página
 */
export function init() {
  // Se já estiver logado, redireciona para seleção de perfis
  const state = AuthState.getState();
  if (state.user) {
    window.location.hash = '#/home';
    return;
  }

  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const button = document.getElementById('login-button');
  const helpLink = document.getElementById('help-link');

  const quickVisitor = document.getElementById('quick-visitor');
  const quickAdmin = document.getElementById('quick-admin');

  if (quickVisitor) {
    quickVisitor.addEventListener('click', () => {
      emailInput.value = 'barih96834@tatefarm.com';
      passwordInput.value = '11223344';
      form.requestSubmit();
    });
  }

  if (quickAdmin) {
    quickAdmin.addEventListener('click', () => {
      emailInput.value = 'jijopa9184@tatefarm.com';
      passwordInput.value = '11223344';
      form.requestSubmit();
    });
  }

  // Contador de tentativas falhas
  let failedAttempts = 0;

  if (!form) return;

  // Listener para o link "Precisa de ajuda?"
  if (helpLink) {
    helpLink.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('/forgot-password');
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validação básica
    if (!email || !password) {
      Toast.error('Por favor, preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      const spinner = new LoadingSpinner({ type: 'default' });
      spinner.show();
      
      // Removido o delay artificial de 1.5s para login imediato
      const user = await authService.signIn(email, password);
      
      if (user) {
        // Reset do contador em caso de sucesso
        failedAttempts = 0;
        Toast.success('Login realizado com sucesso!');

        // 🔒 CORREÇÃO DO BUG DE RACE CONDITION
        // Aguarda o AuthState sincronizar antes de redirecionar
        await waitForAuth();

        // 🚀 FORCE ENTRY: Navegação direta para seleção de perfis
        window.location.hash = '#/home';
      }
    } catch (error) {
      console.error('Erro no login:', error);

      // Incrementa contador de tentativas falhas
      failedAttempts++;

      // Verifica se atingiu 3 tentativas
      if (failedAttempts >= 3) {
        Toast.warning('Muitas tentativas falhas. Vamos redefinir sua senha?');
        // Aguarda 2 segundos e redireciona para recuperação de senha
        setTimeout(() => {
          navigateTo('/forgot-password');
        }, 2000);
        return;
      }

      // Tradução de erros do Firebase para português
      let message = 'Ocorreu um erro ao fazer login. Tente novamente.';

      switch (error.code) {
        case 'auth/invalid-login-credentials':
        case 'auth/invalid-credential':
          message = 'E-mail ou senha incorretos.';
          break;
        case 'auth/user-not-found':
          message = 'Usuário não encontrado.';
          break;
        case 'auth/wrong-password':
          message = 'Senha incorreta.';
          break;
        case 'auth/too-many-requests':
          message = 'Muitas tentativas. Tente novamente mais tarde.';
          break;
        case 'auth/invalid-email':
          message = 'E-mail inválido. Verifique o formato.';
          break;
        case 'auth/user-disabled':
          message = 'Esta conta foi desativada. Entre em contato com o suporte.';
          break;
        case 'auth/network-request-failed':
          message = 'Erro de conexão. Verifique sua internet.';
          break;
        case 'email-not-verified':
          message = error.message || 'Por favor, verifique seu e-mail antes de fazer login.';
          break;
        default:
          // Se tiver mensagem customizada, usa ela, senão usa a padrão
          if (error.message && !error.message.includes('auth/')) {
            message = error.message;
          }
          break;
      }

      Toast.error(message);
    } finally {
      setLoading(false);
      const overlay = document.getElementById('loadingOverlay');
      if (overlay) overlay.remove();
    }
  });

  function setLoading(isLoading) {
    if (button) {
      button.disabled = isLoading;
      button.textContent = isLoading ? 'Entrando...' : 'Entrar';
    }
    if (emailInput) emailInput.disabled = isLoading;
    if (passwordInput) passwordInput.disabled = isLoading;
  }
}

export function afterRender() {
  init();
}
