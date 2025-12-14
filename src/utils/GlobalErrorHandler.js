/**
 * GlobalErrorHandler - Tratador de erros global usando JavaScript Nativo
 * 
 * Captura erros não tratados e exibe uma tela de erro amigável
 */

/**
 * Renderiza a tela de erro
 */
function renderErrorScreen() {
  document.body.innerHTML = `
    <div class="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 class="text-4xl font-bold">Perdido no Espaço?</h1>
      <p class="text-gray-400 mt-4">Ops, algo deu errado.</p>
      <button 
        onclick="window.location.reload()" 
        class="bg-white text-black px-6 py-2 rounded mt-8 hover:bg-gray-200 transition cursor-pointer"
      >
        Recarregar
      </button>
    </div>
  `;
}

/**
 * Inicializa o tratamento global de erros
 */
export function initGlobalErrorHandling() {
  // Handler para erros de script JavaScript
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('❌ Erro capturado:', {
      message,
      source,
      lineno,
      colno,
      error
    });
    
    // Renderiza a tela de erro
    renderErrorScreen();
    
    // Retorna true para prevenir o comportamento padrão do navegador
    return true;
  };

  // Handler para Promises rejeitadas não tratadas (erros de API, etc)
  window.addEventListener('unhandledrejection', function(event) {
    console.error('❌ Promise rejeitada não tratada:', event.reason);
    
    // Renderiza a tela de erro
    renderErrorScreen();
    
    // Previne o log padrão no console
    event.preventDefault();
  });

  console.log('✅ Global Error Handler inicializado');
}
