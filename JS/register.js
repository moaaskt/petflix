
// Inicializa o Firebase
    const auth = window.auth;
const database = window.db;

    // Manipulação do formulário de cadastro
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const registerButton = document.getElementById('registerButton');

        // Esconde mensagens anteriores
        hideAllMessages();

        // Validações básicas
        if (password !== confirmPassword) {
            showError('As senhas não coincidem. Por favor, tente novamente.');
            return;
        }

        if (password.length < 6) {
            showError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        // Mostrar loading no botão
        registerButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cadastrando...';
        registerButton.disabled = true;

        // Cadastro com Firebase Auth
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Envia e-mail de verificação
                return userCredential.user.sendEmailVerification()
                    .then(() => {
                        // Salva informações adicionais no banco de dados
                        const user = userCredential.user;
                        const userData = {
                            name: name,
                            email: email,
                            createdAt: firebase.database.ServerValue.TIMESTAMP,
                            emailVerified: false
                        };
                        
                        return database.ref('users/' + user.uid).set(userData);
                    })
                    .then(() => {
                        showSuccess(`
                            <h4 class="alert-heading">Cadastro realizado com sucesso!</h4>
                            <p>Enviamos um e-mail de verificação para <strong>${email}</strong>.</p>
                            <p>Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.</p>
                            <hr>
                            <p class="mb-0">Não recebeu o e-mail? <a href="#" id="resendEmailLink">Reenviar</a></p>
                        `);
                        
                        // Adiciona evento ao link de reenvio
                        document.getElementById('resendEmailLink').addEventListener('click', function(e) {
                            e.preventDefault();
                            resendVerificationEmail(email);
                        });
                        
                        document.getElementById('registerForm').reset();
                    });
            })
            .catch((error) => {
                handleRegisterError(error);
            })
            .finally(() => {
                registerButton.innerHTML = 'Cadastrar';
                registerButton.disabled = false;
            });
    });

    // Função para reenviar e-mail de verificação
    function resendVerificationEmail(email) {
        const user = auth.currentUser;
        
        if (user) {
            user.sendEmailVerification()
                .then(() => {
                    showSuccess('E-mail de verificação reenviado com sucesso!');
                })
                .catch((error) => {
                    showError('Erro ao reenviar e-mail: ' + error.message);
                });
        } else {
            showError('Nenhum usuário logado encontrado. Por favor, faça login novamente.');
        }
    }

    // Função para tratar erros de cadastro
    function handleRegisterError(error) {
        let errorMsg = '';
        switch(error.code) {
            case 'auth/email-already-in-use':
                errorMsg = 'Este e-mail já está em uso. Por favor, use outro e-mail ou faça login.';
                break;
            case 'auth/invalid-email':
                errorMsg = 'O e-mail fornecido é inválido. Por favor, insira um e-mail válido.';
                break;
            case 'auth/weak-password':
                errorMsg = 'A senha é muito fraca. Por favor, escolha uma senha mais forte.';
                break;
            case 'auth/operation-not-allowed':
                errorMsg = 'Operação não permitida. Contate o suporte.';
                break;
            default:
                errorMsg = 'Ocorreu um erro durante o cadastro: ' + error.message;
        }
        showError(errorMsg);
    }

    // Funções auxiliares
    function showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.innerHTML = typeof message === 'string' ? message : '';
        errorMessage.style.display = 'block';
        errorMessage.scrollIntoView({ behavior: 'smooth' });
    }

    function showSuccess(message) {
        const successMessage = document.getElementById('successMessage');
        successMessage.innerHTML = typeof message === 'string' ? message : '';
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }

    function hideAllMessages() {
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('successMessage').style.display = 'none';
    }
