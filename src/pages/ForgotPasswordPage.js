/**
 * ForgotPasswordPage - Página de Recuperação de Senha
 */
import { authService } from '../services/auth/auth.service.js';
import { navigateTo } from '../router/navigator.js';
import { Toast } from '../utils/toast.js';

/**
 * Renderiza a página de recuperação de senha
 * @returns {string} HTML da página
 */
export function render() {
  return `
    <div class="relative min-h-screen w-full overflow-hidden">
      <div class="absolute inset-0 w-full h-full bg-cover bg-center z-0" style="background-image: url('/assets/background-index.jpg');"></div>
      <div class="absolute inset-0 z-10 bg-black/60 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      <div class="relative z-20 flex flex-col justify-center items-center min-h-screen px-4">
        <div class="bg-black/75 backdrop-blur-sm p-8 md:p-16 rounded-md w-full max-w-md min-h-[400px]">
          <h1 class="text-3xl font-bold text-white mb-2">Recuperar Senha</h1>
          <p class="text-gray-400 text-sm mb-8">Digite seu e-mail para receber um link de recuperação</p>
          <form id="forgot-password-form" class="flex flex-col">
            <input 
              type="email" 
              id="forgot-email" 
              class="w-full bg-[#333] rounded px-4 py-3 mb-6 text-white placeholder-gray-500 focus:outline-none focus:bg-[#444]" 
              placeholder="Email" 
              required
              autocomplete="email"
            >
            <button 
              type="submit" 
              id="forgot-button" 
              class="w-full bg-[#e50914] text-white font-bold py-3 rounded hover:bg-[#f6121d] transition"
            >
              Enviar Link
            </button>
            <div class="text-gray-400 text-sm mt-6 text-center">
              <a href="#/login" class="text-white hover:underline">Voltar para o login</a>
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
  const form = document.getElementById('forgot-password-form');
  const emailInput = document.getElementById('forgot-email');
  const button = document.getElementById('forgot-button');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    // Validação básica
    if (!email) {
      Toast.error('Por favor, digite seu e-mail.');
      return;
    }

    try {
      setLoading(true);
      await authService.sendPasswordResetEmail(email);
      
      Toast.success('Link de recuperação enviado! Verifique sua caixa de entrada.');
      
      // Redireciona para login após 2 segundos
      setTimeout(() => {
        navigateTo('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao enviar email de recuperação:', error);
      
      // Tradução de erros
      let message = 'Ocorreu um erro ao enviar o email. Tente novamente.';
      
      if (error.code === 'auth/user-not-found') {
        message = 'E-mail não cadastrado. Verifique o endereço digitado.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'E-mail inválido. Verifique o formato.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
      } else if (error.message) {
        message = error.message;
      }
      
      Toast.error(message);
    } finally {
      setLoading(false);
    }
  });

  function setLoading(isLoading) {
    if (button) {
      button.disabled = isLoading;
      button.textContent = isLoading ? 'Enviando...' : 'Enviar Link';
    }
    if (emailInput) emailInput.disabled = isLoading;
  }
}

export function afterRender() {
  init();
}
