import { authService } from '../services/auth/auth.service.js';
import '../styles/pages/register.css';
import { Toast } from '../utils/toast.js';

export function render() {
  return `
    <div class="register-page">
      <div class="register-card">
        <h1 class="register-title">Criar conta</h1>
        <form id="register-form" class="register-form">
          <div class="register-input-group">
            <input type="text" id="register-name" class="register-input" placeholder="Nome completo" required>
          </div>
          <div class="register-input-group">
            <input type="email" id="register-email" class="register-input" placeholder="Email" required>
          </div>
          <div class="register-input-group">
            <input type="password" id="register-password" class="register-input" placeholder="Senha" required minlength="6">
          </div>
          <div class="register-input-group">
            <input type="password" id="register-confirm-password" class="register-input" placeholder="Confirmar senha" required minlength="6">
          </div>

          <button type="submit" class="register-button" id="register-button">Cadastrar</button>

          <div class="register-link">
            Já tem uma conta? <a href="#/login">Entrar</a>
          </div>
        </form>
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
