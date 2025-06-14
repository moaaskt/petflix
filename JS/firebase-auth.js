// firebase-auth.js

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAb_0r54B3fL3CmLukhuXYgtxfIpj9IgvU",
    authDomain: "petflix-de1c3.firebaseapp.com",
    databaseURL: "https://petflix-de1c3-default-rtdb.firebaseio.com",
    projectId: "petflix-de1c3",
    storageBucket: "petflix-de1c3.firebasestorage.app",
    messagingSenderId: "863177295284",
    appId: "1:863177295284:web:df1e4a77f827f57ef31ee1",
    measurementId: "G-CB4B5KB2Z0"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

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
                window.location.href = 'verify-email.html';
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