document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupLink = document.getElementById('signupLink');
    
    // Usuários válidos (simulação)
    const validUsers = [
        { email: 'pet@example.com', password: 'pet123', petType: 'dog' },
        { email: 'teste@teste.com', password: 'teste123', petType: 'cat' }
    ];
    
    checkRememberedUser();
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        const petType = document.querySelector('input[name="petType"]:checked')?.value;
        
        if (!petType) {
            alert('Por favor, selecione se você tem cachorro ou gato!');
            return;
        }
        
        const user = validUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            if (remember) {
                localStorage.setItem('rememberedUser', JSON.stringify({ 
                    email, 
                    password,
                    petType
                }));
            } else {
                localStorage.removeItem('rememberedUser');
            }
            
            // Redireciona para a página correta baseada no tipo de pet
            if (petType === 'dog') {
                window.location.href = 'indexcach.html';
            } else {
                window.location.href = 'indexgato.html';
            }
        } else {
            alert('Email ou senha incorretos!');
        }
    });
    
    // ... resto do código permanece igual
});