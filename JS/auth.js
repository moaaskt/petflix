document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    // Usuários válidos (simulação)
    const validUsers = [
        { email: 'pet@email.com', password: 'senha123' },
        { email: 'teste@teste.com', password: 'teste123' }
    ];

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Verifica credenciais
        const userExists = validUsers.some(u => u.email === email && u.password === password);

        if (userExists) {
            sessionStorage.setItem('isLoggedIn', 'true');
            
            // Redireciona para INDEX (escolha do pet)
            window.location.href = 'home.html';
        } else {
            alert('Credenciais inválidas!');
        }
    });
});