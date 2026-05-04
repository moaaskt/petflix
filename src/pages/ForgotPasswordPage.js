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
    <div class="relative min-h-screen w-full overflow-hidden font-sans">
      <!-- Background com overlay dinâmico -->
      <div class="absolute inset-0 w-full h-full bg-cover bg-center scale-105 animate-slow-zoom z-0" style="background-image: url('/assets/background-index.jpg');"></div>
      <div class="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-black/70"></div>
      
      <div class="relative z-20 flex flex-col justify-center items-center min-h-screen px-4 py-12">
        <!-- Logo Topo -->
        <div class="mb-10 transition-transform hover:scale-105 duration-500">
          <span class="text-red-600 text-5xl font-black tracking-tighter shadow-red-600/20 drop-shadow-2xl">PETFLIX</span>
        </div>

        <!-- Forgot Password Card -->
        <div class="glass-panel backdrop-blur-3xl p-10 md:p-14 rounded-3xl w-full max-w-[480px] border border-white/10 shadow-2xl animate-fade-in-up">
          <h1 class="text-4xl font-black text-white mb-2 tracking-tight">Recuperar <span class="text-zinc-500 font-medium">acesso</span></h1>
          <p class="text-zinc-400 mb-10 text-sm font-medium">Digite seu e-mail cadastrado e enviaremos um link para você redefinir sua senha.</p>
          
          <form id="forgot-password-form" class="space-y-8">
            <div class="space-y-2">
              <label for="forgot-email" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Seu E-mail</label>
              <div class="relative group">
                <input type="email" id="forgot-email" 
                  class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all duration-300" 
                  placeholder="exemplo@petflix.com" required autocomplete="email">
              </div>
            </div>

            <div class="space-y-4">
              <button type="submit" id="forgot-button" 
                class="group relative w-full overflow-hidden bg-red-600 text-white font-black py-4 rounded-2xl transition-all hover:bg-red-700 active:scale-[0.98] shadow-lg shadow-red-600/20">
                <span class="relative z-10 flex items-center justify-center gap-2 tracking-widest">
                  ENVIAR LINK
                </span>
              </button>

              <a href="#/login" 
                class="block w-full text-center py-4 bg-white/5 border border-white/5 text-zinc-400 font-black rounded-2xl text-xs tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all uppercase">
                Voltar para o login
              </a>
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
