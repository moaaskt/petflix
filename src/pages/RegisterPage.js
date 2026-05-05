import { authService } from '../services/auth/auth.service.js';
import { Toast } from '../utils/toast.js';

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

        <!-- Register Card -->
        <div class="glass-panel backdrop-blur-3xl p-10 md:p-14 rounded-3xl w-full max-w-[520px] border border-white/10 shadow-2xl animate-fade-in-up">
          <h1 class="text-4xl font-black text-white mb-2 tracking-tight">Criar <span class="text-zinc-500 font-medium">conta</span></h1>
          <p class="text-zinc-400 mb-10 text-sm font-medium">Junte-se à maior comunidade de entretenimento para pets do mundo.</p>
          
          <form id="register-form" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label for="register-name" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Nome Completo</label>
                <input type="text" id="register-name" 
                  class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all duration-300" 
                  placeholder="Seu nome" required>
              </div>
              <div class="space-y-1.5">
                <label for="register-email" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">E-mail</label>
                <input type="email" id="register-email" 
                  class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all duration-300" 
                  placeholder="exemplo@petflix.com" required>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label for="register-password" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Senha</label>
                <input type="password" id="register-password" 
                  class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all duration-300" 
                  placeholder="••••••••" required minlength="6">
              </div>
              <div class="space-y-1.5">
                <label for="register-confirm-password" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Confirmar</label>
                <input type="password" id="register-confirm-password" 
                  class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all duration-300" 
                  placeholder="••••••••" required minlength="6">
              </div>
            </div>

            <button type="submit" id="register-button" 
              class="group relative w-full overflow-hidden bg-red-600 text-white font-black py-4 rounded-2xl mt-4 transition-all hover:bg-red-700 active:scale-[0.98] shadow-lg shadow-red-600/20">
              <span class="relative z-10 flex items-center justify-center gap-2 tracking-widest">
                CADASTRAR AGORA
              </span>
            </button>

            <div class="text-zinc-500 text-sm mt-10 text-center font-medium">
              Já tem uma conta? <a href="#/login" class="text-white font-bold hover:underline decoration-red-600 underline-offset-4">Fazer login</a>
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


export function init() {
  const form = document.getElementById('register-form');
  const nameInput = document.getElementById('register-name');
  const emailInput = document.getElementById('register-email');
  const passwordInput = document.getElementById('register-password');
  const confirmPasswordInput = document.getElementById('register-confirm-password');
  const button = document.getElementById('register-button');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!name || !email || !password || !confirmPassword) {
      Toast.error('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      Toast.error('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      Toast.warning('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);
      await authService.signUp(email, password, name);

      Toast.success('Conta criada com sucesso! Verifique seu email para ativar a conta.');
      // Pequeno delay para mostrar o toast de sucesso antes de navegar
      setTimeout(() => {
        window.location.hash = '#/login';
      }, 1500);

    } catch (error) {
      console.error('Erro no cadastro:', error);

      let message = 'Ocorreu um erro ao criar conta. Tente novamente.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Este email já está em uso.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Email inválido.';
      } else if (error.code === 'auth/weak-password') {
        message = 'A senha é muito fraca. Escolha uma senha mais forte.';
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
      button.textContent = isLoading ? 'Cadastrando...' : 'Cadastrar';
    }
    if (nameInput) nameInput.disabled = isLoading;
    if (emailInput) emailInput.disabled = isLoading;
    if (passwordInput) passwordInput.disabled = isLoading;
    if (confirmPasswordInput) confirmPasswordInput.disabled = isLoading;
  }
}
