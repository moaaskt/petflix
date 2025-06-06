let isLoadingActive = false;

// Adiciona o estilo dinâmico para a animação do gato
const addCatLoadingStyles = () => {
  const style = document.createElement('style');
  style.id = 'cat-loading-styles';
  style.textContent = `
    @keyframes catBounce {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-15px) rotate(-5deg); }
      50% { transform: translateY(0) rotate(0deg); }
      75% { transform: translateY(-10px) rotate(5deg); }
    }
    
    @keyframes catWag {
      0% { transform: rotate(-10deg); }
      100% { transform: rotate(10deg); }
    }
    
    .cat-loading-icon {
      color: #e50914 !important;
      animation: catBounce 1s infinite ease-in-out;
      position: relative;
    }
    
    .cat-loading-icon::after {
      content: "\\f6be"; /*
      font-family: "Font Awesome 6 Free";
      position: absolute;
      right: -20px;
      bottom: -5px;
      font-size: 0.6em;
      animation: catWag 0.3s infinite alternate;
      opacity: 0.8;
    }
    
    .cat-loading-text {
      color: #e50914;
      font-weight: 600;
      margin-top: 10px;
      text-shadow: 0 0 5px rgba(243, 156, 18, 0.3);
    }
  `;
  document.head.appendChild(style);
};

// Remove os estilos quando não são mais necessários
const removeCatLoadingStyles = () => {
  const style = document.getElementById('cat-loading-styles');
  if (style) {
    style.remove();
  }
};

function showLoading(message = "Carregando...") {
  if (isLoadingActive) return;
  
  isLoadingActive = true;
  addCatLoadingStyles();
  
  const loadingHTML = `
    <div class="loading-overlay" id="loadingOverlay">
      <div class="loading-spinner">
        <i class="fas fa-cat cat-loading-icon"></i>
        <p class="cat-loading-text">${message}</p>
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
      removeCatLoadingStyles();
    }, 500);
  }
}

function initPageLoading() {
  // Mostra o loading com mensagem padrão
  showLoading("Carregando...");
  
  // Esconde o loading quando tudo estiver pronto
  window.addEventListener('load', function() {
    // Tempo mínimo de exibição (1.5 segundos)
    setTimeout(hideLoading, 700);
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