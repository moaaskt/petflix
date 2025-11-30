// auth.js - Processamento de ações do Firebase Authentication

(function() {
    'use strict';

    // Elementos DOM
    const statusEl = document.getElementById('status');
    const spinnerEl = document.getElementById('spinner');
    const passwordFormEl = document.getElementById('password-form');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordBtn = document.getElementById('confirmPassword');

    // Função para obter parâmetros da URL
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            mode: params.get('mode'),
            oobCode: params.get('oobCode'),
            apiKey: params.get('apiKey'),
            lang: params.get('lang') || 'pt'
        };
    }

    // Função para mostrar mensagem
    function showMessage(message, type) {
        statusEl.textContent = message;
        statusEl.className = type || 'info';
        
        if (type === 'success' || type === 'error') {
            spinnerEl.classList.add('hidden');
        }
    }

    // Função para redirecionar
    function redirectToIndex() {
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 3000);
    }

    // Função para traduzir erros
    function translateError(error) {
        const errorCode = error.code;
        
        if (errorCode === 'auth/invalid-action-code' || errorCode === 'auth/invalid-verification-code') {
            return 'Código inválido. Por favor, solicite um novo link.';
        }
        
        if (errorCode === 'auth/expired-action-code') {
            return 'Código expirado. Por favor, solicite um novo link.';
        }
        
        if (errorCode === 'auth/user-disabled') {
            return 'Esta conta foi desativada.';
        }
        
        if (errorCode === 'auth/weak-password') {
            return 'A senha deve ter pelo menos 6 caracteres.';
        }
        
        if (errorCode === 'auth/action-code-already-used') {
            return 'Este link já foi usado. Por favor, solicite um novo link.';
        }
        
        // Erro genérico
        return error.message || 'Ocorreu um erro. Por favor, tente novamente.';
    }

    // 1. verifyEmail - Verificação de e-mail
    function handleVerifyEmail(oobCode) {
        showMessage('Verificando e-mail...', 'info');
        
        firebase.auth().applyActionCode(oobCode)
            .then(function() {
                showMessage('E-mail verificado com sucesso! Redirecionando...', 'success');
                redirectToIndex();
            })
            .catch(function(error) {
                showMessage(translateError(error), 'error');
            });
    }

    // 2. resetPassword - Redefinição de senha
    function handleResetPassword(oobCode) {
        showMessage('Verificando código de redefinição...', 'info');
        
        // Primeiro verifica o código
        firebase.auth().verifyPasswordResetCode(oobCode)
            .then(function(email) {
                showMessage('Código válido! Digite sua nova senha.', 'success');
                spinnerEl.classList.add('hidden');
                passwordFormEl.style.display = 'block';
                newPasswordInput.focus();
                
                // Handler do botão de confirmação
                confirmPasswordBtn.addEventListener('click', function() {
                    const newPassword = newPasswordInput.value.trim();
                    
                    if (!newPassword || newPassword.length < 6) {
                        showMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
                        return;
                    }
                    
                    confirmPasswordBtn.disabled = true;
                    confirmPasswordBtn.textContent = 'Atualizando...';
                    showMessage('Atualizando senha...', 'info');
                    
                    // Confirma a redefinição
                    firebase.auth().confirmPasswordReset(oobCode, newPassword)
                        .then(function() {
                            showMessage('Senha atualizada com sucesso! Redirecionando...', 'success');
                            redirectToIndex();
                        })
                        .catch(function(error) {
                            confirmPasswordBtn.disabled = false;
                            confirmPasswordBtn.textContent = 'Atualizar senha';
                            showMessage(translateError(error), 'error');
                        });
                });
                
                // Permitir Enter no input
                newPasswordInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        confirmPasswordBtn.click();
                    }
                });
            })
            .catch(function(error) {
                showMessage(translateError(error), 'error');
            });
    }

    // 3. recoverEmail - Recuperação de e-mail
    function handleRecoverEmail(oobCode) {
        showMessage('Restaurando e-mail...', 'info');
        
        firebase.auth().applyActionCode(oobCode)
            .then(function() {
                showMessage('E-mail antigo restaurado com sucesso! Redirecionando...', 'success');
                redirectToIndex();
            })
            .catch(function(error) {
                showMessage(translateError(error), 'error');
            });
    }

    // 4. verifyAndChangeEmail - Verificação e mudança de e-mail
    function handleVerifyAndChangeEmail(oobCode) {
        showMessage('Verificando e atualizando e-mail...', 'info');
        
        firebase.auth().applyActionCode(oobCode)
            .then(function() {
                showMessage('E-mail verificado e atualizado com sucesso! Redirecionando...', 'success');
                redirectToIndex();
            })
            .catch(function(error) {
                showMessage(translateError(error), 'error');
            });
    }

    // Função principal - processa a ação baseada no mode
    function processAction() {
        const params = getUrlParams();
        
        // Validação básica
        if (!params.mode || !params.oobCode) {
            showMessage('Link inválido. Parâmetros obrigatórios não encontrados.', 'error');
            return;
        }
        
        // Switch principal baseado no mode
        switch (params.mode) {
            case 'verifyEmail':
                handleVerifyEmail(params.oobCode);
                break;
                
            case 'resetPassword':
                handleResetPassword(params.oobCode);
                break;
                
            case 'recoverEmail':
                handleRecoverEmail(params.oobCode);
                break;
                
            case 'verifyAndChangeEmail':
                handleVerifyAndChangeEmail(params.oobCode);
                break;
                
            default:
                showMessage('Ação não reconhecida: ' + params.mode, 'error');
        }
    }

    // Aguarda o Firebase estar pronto e processa
    document.addEventListener('DOMContentLoaded', function() {
        // Verifica se o Firebase está disponível
        if (typeof firebase === 'undefined') {
            showMessage('Erro ao carregar Firebase. Verifique sua conexão.', 'error');
            return;
        }
        
        // Aguarda um pouco para garantir que o Firebase foi inicializado
        setTimeout(function() {
            try {
                processAction();
            } catch (error) {
                showMessage('Erro ao processar ação: ' + error.message, 'error');
                console.error('Erro:', error);
            }
        }, 100);
    });
})();
