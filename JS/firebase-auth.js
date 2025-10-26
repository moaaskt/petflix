// firebase-auth.js



// Inicializa o Firebase
const auth = window.auth;
const database = window.db;

// Função para verificar autenticação
function checkAuth(requireAuth = true, requireEmailVerified = true) {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged((user) => {
            if (requireAuth && !user) {
                // Redireciona para login se não estiver autenticado
                window.location.href = 'index.html';
                reject('Usuário não autenticado');
            } else if (requireEmailVerified && user && !user.emailVerified) {
                // Redireciona para verificação de e-mail
                window.location.href = 'home.html'; // TODO: criar verify-email.html futuramente
                reject('E-mail não verificado');
            } else {
                resolve(user);
            }
        });
    });
}

// Função para logout
function logout() {
    return auth.signOut()
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Erro ao fazer logout:', error);
        });
}

// Exporta as funções necessárias
window.authFunctions = {
    checkAuth,
    logout,
    auth,
    database
};