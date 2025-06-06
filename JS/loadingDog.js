// js/loadingDog.js
let isLoadingActive = false;

// Adiciona o estilo dinâmico para a animação do cachorro
const addDogLoadingStyles = () => {
  const style = document.createElement('style');
  style.id = 'dog-loading-styles';
  style.textContent = `
    @keyframes dogBounce {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-15px) rotate(-5deg); }
      50% { transform: translateY(0) rotate(0deg); }
      75% { transform: translateY(-10px) rotate(5deg); }
    }
    
    @keyframes dogWag {
      0% { transform: rotate(-10deg); }
      100% { transform: rotate(10deg); }
    }
    
    .dog-loading-icon {
      color: #e67e22 !important;
      animation: dogBounce 1s infinite ease-in-out;
      position: relative;
    }
    
    .dog-loading-icon::after {
      content: "\\f6d6";
      font-family: "Font Awesome 6 Free";
      position: absolute;
      right: -20px;
      bottom: -5px;
      font-size: 0.6em;
      animation: dogWag 0.3s infinite alternate;
      opacity: 0.8;
    }
    
    .dog-loading-text {
      color: #e67e22;
      font-weight: 600;
      margin-top: 10px;
      text-shadow: 0 0 5px rgba(230, 126, 34, 0.3);
    }
  `;
  document.head.appendChild(style);
};

// Remove os estilos quando não são mais necessários
const removeDogLoadingStyles = () => {
  const style = document.getElementById('dog-loading-styles');
  if (style) {
    style.remove();
  }
};

function showLoading(message = "Carregando...") {
  if (isLoadingActive) return;
  
  isLoadingActive = true;
  addDogLoadingStyles();
  
  const loadingHTML = `
    <div class="loading-overlay" id="loadingOverlay">
      <div class="loading-spinner">
        <i class="fas fa-dog dog-loading-icon"></i>
        <p class="dog-loading-text">${message}</p>
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
      removeDogLoadingStyles();
    }, 500);
  }
}

function initPageLoading() {
  // Mostra o loading com mensagem padrão
  showLoading("Carregando...");
  
  // Esconde o loading quando tudo estiver pronto
  window.addEventListener('load', function() {
    // Tempo mínimo de exibição (1.5 segundos)
    setTimeout(hideLoading, 1000);
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