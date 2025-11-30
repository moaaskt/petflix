// login.js - Script de login puro (sem módulos ES6)

// Funções auxiliares
function showAlert(message, type = 'danger') {
  // Remove alerta anterior
  const existing = document.getElementById('alert-container');
  if (existing) {
    existing.remove();
  }

  const alert = document.createElement('div');
  alert.id = 'alert-container';
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.setAttribute('role', 'alert');
  alert.innerHTML = `
    <span>${message}</span>
    <button type="button" class="btn-close" aria-label="Close" onclick="this.parentElement.remove()"></button>
  `;

  document.body.insertAdjacentElement('afterbegin', alert);

  // Remove automaticamente após 5 segundos
  setTimeout(() => {
    if (alert.parentElement) {
      alert.remove();
    }
  }, 5000);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password && password.length >= 6;
}

function setButtonLoading(button, loading) {
  if (!button) return;

  if (loading) {
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Entrando...';
    button.disabled = true;
  } else {
    button.innerHTML = 'Entrar';
    button.disabled = false;
  }
}

function getRememberMe() {
  try {
    return localStorage.getItem('petflixRememberMe') === 'true';
  } catch {
    return false;
  }
}

function setRememberMe(remember) {
  try {
    localStorage.setItem('petflixRememberMe', remember ? 'true' : 'false');
  } catch {
    // Ignora erro
  }
}

function getEmail() {
  try {
    return localStorage.getItem('petflixEmail');
  } catch {
    return null;
  }
}

function setEmail(email) {
  try {
    localStorage.setItem('petflixEmail', email);
  } catch {
    // Ignora erro
  }
}

function removeEmail() {
  try {
    localStorage.removeItem('petflixEmail');
  } catch {
    // Ignora erro
  }
}

function getFirebaseAuthErrorMessage(error) {
  const errorMessages = {
    'auth/user-not-found': 'E-mail não cadastrado. Por favor, verifique ou cadastre-se.',
    'auth/wrong-password': 'Senha incorreta. Por favor, tente novamente.',
    'auth/invalid-email': 'O e-mail fornecido é inválido.',
    'auth/too-many-requests': 'Muitas tentativas de login. Por favor, tente novamente mais tarde.',
    'auth/user-disabled': 'Esta conta foi desativada. Entre em contato com o suporte.',
    'auth/email-already-in-use': 'Este e-mail já está em uso.',
    'auth/weak-password': 'A senha é muito fraca.',
    'auth/operation-not-allowed': 'Operação não permitida.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.'
  };

  return errorMessages[error.code] || `Ocorreu um erro: ${error.message}`;
}

// Inicialização quando o DOM estiver pronto
function initLoginPage() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  // Carrega email lembrado
  const rememberMe = getRememberMe();
  const savedEmail = getEmail();
  if (rememberMe && savedEmail) {
    const rememberCheckbox = document.getElementById('remember');
    const emailInput = document.getElementById('email');
    if (rememberCheckbox) rememberCheckbox.checked = true;
    if (emailInput) emailInput.value = savedEmail;
  }

  // Configura formulário de login
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    const loginButton = document.getElementById('loginButton');

    // Validação
    if (!email || !email.trim()) {
      showAlert('E-mail é obrigatório.');
      return;
    }

    if (!validateEmail(email)) {
      showAlert('E-mail inválido.');
      return;
    }

    if (!password || !password.trim()) {
      showAlert('Senha é obrigatória.');
      return;
    }

    if (!validatePassword(password)) {
      showAlert('Senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Salva preferências
    if (rememberMe) {
      setRememberMe(true);
      setEmail(email);
    } else {
      setRememberMe(false);
      removeEmail();
    }

    // Mostra loading
    setButtonLoading(loginButton, true);

    try {
      // Login com Firebase
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Verifica se o email foi verificado
      if (!user.emailVerified) {
        await firebase.auth().signOut();
        showAlert('Por favor, verifique seu e-mail antes de fazer login. Enviamos um link de confirmação para seu e-mail.');
        setButtonLoading(loginButton, false);
        return;
      }

      showAlert('Login realizado com sucesso! Redirecionando...', 'success');
      
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 1500);
    } catch (error) {
      const message = getFirebaseAuthErrorMessage(error);
      showAlert(message);
      setButtonLoading(loginButton, false);
    }
  });

  // Recuperação de senha
  const forgotPassword = document.getElementById('forgotPassword');
  if (forgotPassword) {
    forgotPassword.addEventListener('click', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value.trim();

      if (!email) {
        showAlert('Por favor, insira seu e-mail para redefinir a senha.');
        return;
      }

      try {
        await firebase.auth().sendPasswordResetEmail(email);
        showAlert('Enviamos um e-mail para redefinir sua senha. Por favor, verifique sua caixa de entrada.', 'success');
      } catch (error) {
        const message = getFirebaseAuthErrorMessage(error);
        showAlert(message);
      }
    });
  }

  // Toggle de senha
  const toggle = document.querySelector('.password-toggle');
  if (toggle) {
    toggle.addEventListener('click', function() {
      const passwordInput = document.getElementById('password');
      const icon = toggle.querySelector('i');

      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      } else {
        passwordInput.type = 'password';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      }
    });
  }

  // Efeito de foco nos inputs
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
      this.style.boxShadow = '0 0 0 3px rgba(229, 9, 20, 0.2)';
    });
    input.addEventListener('blur', function() {
      this.style.boxShadow = 'none';
    });
  });
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoginPage);
} else {
  initLoginPage();
}






