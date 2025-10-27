// firebase-auth.js

// Persistência LOCAL da sessão
try {
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
} catch (e) {
  console.warn('Persistência Auth falhou:', e);
}

// Inicializa o Firebase
const auth = window.auth;
const database = window.db;

// Listener global: redireciona apenas em páginas protegidas
const __PETFLIX_PROTECTED_PAGES__ = ["indexcach.html", "indexgato.html", "filmes.html", "series.html"];
firebase.auth().onAuthStateChanged((user) => {
  const current = window.location.pathname.split("/").pop();
  if (!user && __PETFLIX_PROTECTED_PAGES__.includes(current)) {
    window.location.href = 'index.html';
  }
});

// Função para verificar autenticação
function checkAuth(requireAuth = true, requireEmailVerified = true) {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged((user) => {
            if (requireAuth && !user) {
                const current = window.location.pathname.split("/").pop();
                if (__PETFLIX_PROTECTED_PAGES__.includes(current)) {
                  window.location.href = 'index.html';
                }
                reject('Usuário não autenticado');
            } else if (requireEmailVerified && user && !user.emailVerified) {
                window.location.href = 'home.html';
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