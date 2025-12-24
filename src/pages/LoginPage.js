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
      console.log('✅ AuthState já sincronizado:', currentState.user);
      resolve(currentState.user);
      return;
    }

    // Se não, aguarda a atualização
    console.log('⏳ Aguardando sincronização do AuthState...');
    const unsubscribe = AuthState.subscribe((state) => {
      if (state.user) {
        console.log('✅ AuthState sincronizado!', state.user);
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
  console.log('LoginPage: Renderizando HTML');
  return `
    <div class="relative min-h-screen w-full overflow-hidden">
      <div class="absolute inset-0 w-full h-full bg-cover bg-center z-0" style="background-image: url('/assets/background-index.jpg');"></div>
      <div class="absolute inset-0 z-10 bg-black/60 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      <div class="relative z-20 flex flex-col justify-center items-center min-h-screen px-4">
        <div class="bg-black/75 backdrop-blur-sm p-8 md:p-16 rounded-md w-full max-w-md min-h-[500px]">
          <h1 class="text-3xl font-bold text-white mb-8">Entrar</h1>
          <form id="login-form" class="flex flex-col">
            <input type="email" id="login-email" class="w-full bg-[#333] rounded px-4 py-3 mb-4 text-white placeholder-gray-500 focus:outline-none focus:bg-[#444]" placeholder="Email" required>
            <input type="password" id="login-password" class="w-full bg-[#333] rounded px-4 py-3 mb-2 text-white placeholder-gray-500 focus:outline-none focus:bg-[#444]" placeholder="Senha" required>
            <button type="submit" id="login-button" class="w-full bg-[#e50914] text-white font-bold py-3 rounded mt-6 hover:bg-[#f6121d] transition">Entrar</button>
            <div class="flex items-center justify-between text-gray-400 text-sm mt-4">
              <label class="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" class="accent-[#e50914]" id="remember-me" />
                <span>Lembre-se de mim</span>
              </label>
              <a href="#/forgot-password" id="help-link" class="cursor-pointer hover:underline hover:text-white transition-colors">Precisa de ajuda?</a>
            </div>
            <div class="text-gray-400 text-sm mt-6">
              Novo por aqui? <a href="#/register" class="text-white hover:underline">Criar conta</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

/**
 * Inicializa o comportamento da página
 */
export function init() {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const button = document.getElementById('login-button');
  const helpLink = document.getElementById('help-link');

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

  console.log('LoginPage: Tentando anexar listener ao form...');
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
      await new Promise((r) => setTimeout(r, 1500));
      console.log('Auth: Tentando logar com email...', email);
      const user = await authService.signIn(email, password);
      if (user) {
        console.log('Auth: Sucesso');
        // Reset do contador em caso de sucesso
        failedAttempts = 0;
        Toast.success('Login realizado com sucesso!');

        // 🔒 CORREÇÃO DO BUG DE RACE CONDITION
        // Aguarda o AuthState sincronizar antes de redirecionar
        await waitForAuth();

        // 🚀 FORCE ENTRY: Navegação direta via hash (bypass router)
        console.log('🚀 Forçando navegação para Home via window.location...');
        window.location.hash = '#/home';
      }
    } catch (error) {
      console.error('Erro no login:', error);
      console.log('Auth: Erro capturado', error);

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
  console.log('LoginPage: Listener anexado com sucesso');

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
