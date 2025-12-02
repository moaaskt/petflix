/**
 * LoginPage - Página de Login estilo Netflix
 */
import { authService } from '../services/auth/auth.service.js';
import { navigateTo } from '../router/navigator.js';
import '../styles/pages/login.css';

/**
 * Renderiza a página de login
 * @returns {string} HTML da página
 */
export function render() {
  console.log('LoginPage: Renderizando HTML');
  return `
    <div class="login-page">
      <div class="login-card">
        <h1 class="login-title">Entrar</h1>
        <form id="login-form" class="login-form">
          <div class="login-input-group">
            <input type="email" id="login-email" class="login-input" placeholder="Email" required>
          </div>
          <div class="login-input-group">
            <input type="password" id="login-password" class="login-input" placeholder="Senha" required>
          </div>
          
          <div class="login-error text-red-500 mt-2" id="login-error"></div>
          
          <button type="submit" class="login-button" id="login-button">Entrar</button>
          
          <div class="login-link">
            Novo por aqui? <a href="#/register">Criar conta</a>
          </div>
        </form>
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
