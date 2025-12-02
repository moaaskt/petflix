/**
 * LoginPage - Página de Login estilo Netflix
 */
import { authService } from '../services/auth/auth.service.js';
import { navigateTo } from '../router/navigator.js';
import { LoadingSpinner } from '../components/ui/Loading/LoadingSpinner.js';

/**
 * Renderiza a página de login
 * @returns {string} HTML da página
 */
export function render() {
  console.log('LoginPage: Renderizando HTML');
  return `
    <div class="relative min-h-screen w-full overflow-hidden">
      <img src="https://images.unsplash.com/photo-1574375927938-d5a98e8efe85?q=80&w=2669&auto=format&fit=crop" alt="background" class="absolute inset-0 w-full h-full object-cover z-0" />
      <div class="absolute inset-0 z-10 bg-black/60 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      <div class="relative z-20 flex flex-col justify-center items-center min-h-screen px-4">
        <div class="bg-black/75 backdrop-blur-sm p-8 md:p-16 rounded-md w-full max-w-md min-h-[500px]">
          <h1 class="text-3xl font-bold text-white mb-8">Entrar</h1>
          <form id="login-form" class="flex flex-col">
            <input type="email" id="login-email" class="w-full bg-[#333] rounded px-4 py-3 mb-4 text-white placeholder-gray-500 focus:outline-none focus:bg-[#444]" placeholder="Email" required>
            <input type="password" id="login-password" class="w-full bg-[#333] rounded px-4 py-3 mb-2 text-white placeholder-gray-500 focus:outline-none focus:bg-[#444]" placeholder="Senha" required>
            <div id="login-error" class="text-red-500 text-sm mt-2 mb-2" style="display:none;"></div>
            <button type="submit" id="login-button" class="w-full bg-[#e50914] text-white font-bold py-3 rounded mt-6 hover:bg-[#f6121d] transition">Entrar</button>
            <div class="flex items-center justify-between text-gray-400 text-sm mt-4">
              <label class="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" class="accent-[#e50914]" id="remember-me" />
                <span>Lembre-se de mim</span>
              </label>
              <a href="#" class="hover:underline">Precisa de ajuda?</a>
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
  const errorDiv = document.getElementById('login-error');
  const button = document.getElementById('login-button');

  if (!form) return;

  console.log('LoginPage: Tentando anexar listener ao form...');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validação básica
    if (!email || !password) {
      showError('Por favor, preencha todos os campos.');
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
        navigateTo('/home');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      console.log('Auth: Erro capturado', error);
      // Mensagens de erro amigáveis
      let message = 'Ocorreu um erro ao fazer login. Tente novamente.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Senha incorreta ou email não cadastrado.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Muitas tentativas falhas. Tente novamente mais tarde.';
      } else if (error.message) {
        message = error.message;
      }
      showError(message);
    } finally {
      setLoading(false);
      const overlay = document.getElementById('loadingOverlay');
      if (overlay) overlay.remove();
    }
  });
  console.log('LoginPage: Listener anexado com sucesso');

  function showError(message) {
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  }

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
