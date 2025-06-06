// js/loading.js
let isLoadingActive = false;

function showLoading(message = "Carregando...") {
    if (isLoadingActive) return;
    
    isLoadingActive = true;
    const loadingHTML = `
        <div class="loading-overlay" id="loadingOverlay">
            <div class="loading-spinner">
                <i class="fas fa-paw"></i>
                <p>${message}</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', loadingHTML);
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('fade-out');
        setTimeout(() => {
            loadingOverlay.remove();
            isLoadingActive = false;
        }, 500);
    }
}

function initPageLoading() {
    // Mostra o loading com mensagem padrão
    showLoading();
    
    // Esconde o loading quando tudo estiver pronto
    window.addEventListener('load', function() {
        // Tempo mínimo de exibição (1.5 segundos)
        setTimeout(hideLoading, 1500);
    });
    
    // Fallback: esconde após 10 segundos mesmo se não carregar
    setTimeout(hideLoading, 10000);
}

// Inicia automaticamente quando o script é carregado
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se já está logado
    if (!sessionStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }
    
    initPageLoading();
});