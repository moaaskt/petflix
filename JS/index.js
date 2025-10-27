

// Adicione esta função para mostrar mensagens informativas
function showInfo(message) {
    const infoAlert = document.createElement('div');
    infoAlert.className = 'alert alert-info alert-message alert-dismissible fade show';
    infoAlert.innerHTML = `
        <span>${message}</span>
        <button type="button" class="btn-close" onclick="this.parentElement.style.display='none'"></button>
    `;
    document.body.appendChild(infoAlert);
    setTimeout(() => infoAlert.remove(), 10000);
}

        // Configuração do Firebase (substitua com suas credenciais)


        // Inicializa o Firebase
        

        // Efeito de toggle para senha
        document.querySelector('.password-toggle').addEventListener('click', function () {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            } else {
                passwordInput.type = 'password';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            }
        });

        // Efeito de foco nos inputs
        document.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('focus', function () {
                this.style.boxShadow = '0 0 0 3px rgba(229, 9, 20, 0.2)';
            });
            input.addEventListener('blur', function () {
                this.style.boxShadow = 'none';
            });
        });

        // Recuperar estado "Lembre-se de mim" do localStorage
        document.addEventListener('DOMContentLoaded', function () {
            const rememberMe = localStorage.getItem('petflixRememberMe');
            const savedEmail = localStorage.getItem('petflixEmail');

            if (rememberMe === 'true' && savedEmail) {
                document.getElementById('remember').checked = true;
                document.getElementById('email').value = savedEmail;
            }
        });

        // Manipulação do formulário de login
        document.getElementById('loginForm').addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember').checked;
            const loginButton = document.getElementById('loginButton');

            // Salvar email se "Lembre-se de mim" estiver marcado
            if (rememberMe) {
                localStorage.setItem('petflixRememberMe', 'true');
                localStorage.setItem('petflixEmail', email);
            } else {
                localStorage.removeItem('petflixRememberMe');
                localStorage.removeItem('petflixEmail');
            }

            // Mostrar loading no botão
            loginButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Entrando...';
            loginButton.disabled = true;

            // Guard: valida inicialização do Firebase
            const auth = window.auth;
            if (!auth || typeof auth.signInWithEmailAndPassword !== 'function') {
                showError('Falha ao inicializar a autenticação. Por favor, recarregue a página.');
                loginButton.innerHTML = 'Entrar';
                loginButton.disabled = false;
                return;
            }

            // Login com Firebase Auth
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;

                    // Verifica se o e-mail foi confirmado
                    if (!user.emailVerified) {
                        auth.signOut();
                        showError('Por favor, verifique seu e-mail antes de fazer login. Enviamos um link de confirmação para seu e-mail.');
                        loginButton.innerHTML = 'Entrar';
                        loginButton.disabled = false;
                        return;
                    }

                    // Redireciona para a página principal após login bem-sucedido
                    showSuccess('Login realizado com sucesso! Redirecionando...');
                    setTimeout(() => {
                        window.location.href = 'home.html';
                    }, 1500);
                })
                .catch((error) => {
                    let errorMsg = '';
                    switch (error.code) {
                        case 'auth/user-not-found':
                            errorMsg = 'E-mail não cadastrado. Por favor, verifique ou cadastre-se.';
                            break;
                        case 'auth/wrong-password':
                            errorMsg = 'Senha incorreta. Por favor, tente novamente.';
                            break;
                        case 'auth/invalid-email':
                            errorMsg = 'O e-mail fornecido é inválido.';
                            break;
                        case 'auth/too-many-requests':
                            errorMsg = 'Muitas tentativas de login. Por favor, tente novamente mais tarde.';
                            break;
                        case 'auth/user-disabled':
                            errorMsg = 'Esta conta foi desativada. Entre em contato com o suporte.';
                            break;
                        default:
                            errorMsg = 'Ocorreu um erro durante o login: ' + error.message;
                    }
                    showError(errorMsg);
                    loginButton.innerHTML = 'Entrar';
                    loginButton.disabled = false;
                });
        });

        // Recuperação de senha
        document.getElementById('forgotPassword').addEventListener('click', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;

            if (!email) {
                showError('Por favor, insira seu e-mail para redefinir a senha.');
                return;
            }

            window.auth.sendPasswordResetEmail(email)
                .then(() => {
                    showSuccess('Enviamos um e-mail para redefinir sua senha. Por favor, verifique sua caixa de entrada.');
                })
                .catch((error) => {
                    showError('Ocorreu um erro ao enviar o e-mail de redefinição: ' + error.message);
                });
        });

        // Funções para mostrar mensagens
        function showError(message) {
            const errorAlert = document.getElementById('errorAlert');
            document.getElementById('errorText').textContent = message;
            errorAlert.style.display = 'block';
            setTimeout(() => dismissAlert('errorAlert'), 5000);
        }

        function showSuccess(message) {
            const successAlert = document.getElementById('successAlert');
            document.getElementById('successText').textContent = message;
            successAlert.style.display = 'block';
            setTimeout(() => dismissAlert('successAlert'), 5000);
        }

        function dismissAlert(id) {
            document.getElementById(id).style.display = 'none';
        }
