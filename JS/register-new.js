// register-new.js - Script de registro puro (sem módulos ES6)

// Funções auxiliares
function showError(message) {
  const errorMessage = document.getElementById('errorMessage');
  if (errorMessage) {
    errorMessage.innerHTML = typeof message === 'string' ? message : '';
    errorMessage.style.display = 'block';
    errorMessage.scrollIntoView({ behavior: 'smooth' });
  }
}

function showSuccess(message) {
  const successMessage = document.getElementById('successMessage');
  if (successMessage) {
    successMessage.innerHTML = typeof message === 'string' ? message : '';
    successMessage.style.display = 'block';
    successMessage.scrollIntoView({ behavior: 'smooth' });
  }
}

function hideAllMessages() {
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  if (errorMessage) errorMessage.style.display = 'none';
  if (successMessage) successMessage.style.display = 'none';
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password && password.length >= 6;
}

function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}

function getFirebaseAuthErrorMessage(error) {
  const errorMessages = {
    'auth/email-already-in-use': 'Este e-mail já está em uso. Por favor, use outro e-mail ou faça login.',
    'auth/invalid-email': 'O e-mail fornecido é inválido. Por favor, insira um e-mail válido.',
    'auth/weak-password': 'A senha é muito fraca. Por favor, escolha uma senha mais forte.',
    'auth/operation-not-allowed': 'Operação não permitida. Contate o suporte.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.'
  };

  return errorMessages[error.code] || `Ocorreu um erro durante o cadastro: ${error.message}`;
}

function setButtonLoading(button, loading) {
  if (!button) return;

  if (loading) {
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cadastrando...';
    button.disabled = true;
  } else {
    button.innerHTML = 'Cadastrar';
    button.disabled = false;
  }
}

// Inicialização quando o DOM estiver pronto
function initRegisterPage() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const registerButton = document.getElementById('registerButton');

    // Esconde mensagens anteriores
    hideAllMessages();

    // Validações
    if (!name || !name.trim()) {
      showError('Nome é obrigatório.');
      return;
    }

    if (!email || !email.trim()) {
      showError('E-mail é obrigatório.');
      return;
    }

    if (!validateEmail(email)) {
      showError('E-mail inválido.');
      return;
    }

    if (!password || !password.trim()) {
      showError('Senha é obrigatória.');
      return;
    }

    if (!validatePassword(password)) {
      showError('Senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (!confirmPassword || !confirmPassword.trim()) {
      showError('Confirmação de senha é obrigatória.');
      return;
    }

    if (!passwordsMatch(password, confirmPassword)) {
      showError('As senhas não coincidem.');
      return;
    }

    // Mostra loading
    setButtonLoading(registerButton, true);

    try {
      // Cadastro com Firebase
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Envia e-mail de verificação
      await user.sendEmailVerification();

      // Salva informações adicionais no banco de dados
      if (window.db) {
        const userData = {
          name: name,
          email: email,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          emailVerified: false
        };
        
        await window.db.ref('users/' + user.uid).set(userData);
      }

      showSuccess(`
        <h4 class="alert-heading">Cadastro realizado com sucesso!</h4>
        <p>Enviamos um e-mail de verificação para <strong>${email}</strong>.</p>
        <p>Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.</p>
        <hr>
        <p class="mb-0">Não recebeu o e-mail? <a href="#" id="resendEmailLink">Reenviar</a></p>
      `);

      // Adiciona evento ao link de reenvio
      const resendLink = document.getElementById('resendEmailLink');
      if (resendLink) {
        resendLink.addEventListener('click', async function(e) {
          e.preventDefault();
          const currentUser = firebase.auth().currentUser;
          if (currentUser) {
            try {
              await currentUser.sendEmailVerification();
              showSuccess('E-mail de verificação reenviado com sucesso!');
            } catch (error) {
              showError('Erro ao reenviar e-mail: ' + error.message);
            }
          } else {
            showError('Nenhum usuário logado encontrado. Por favor, faça login novamente.');
          }
        });
      }

      form.reset();
    } catch (error) {
      const message = getFirebaseAuthErrorMessage(error);
      showError(message);
    } finally {
      setButtonLoading(registerButton, false);
    }
  });
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRegisterPage);
} else {
  initRegisterPage();
}






