/**
 * YouTube API Loading Service
 * Serviço robusto para carregar a API do YouTube IFrame de forma segura
 * Implementa padrão Singleton para evitar múltiplas cargas simultâneas
 */

// Promise singleton para garantir que múltiplas chamadas compartilhem a mesma Promise
let loadPromise = null;
let scriptInjected = false;

/**
 * Carrega a API do YouTube IFrame de forma segura
 * @returns {Promise<typeof window.YT>} Promise que resolve quando a API está pronta
 */
export function loadYouTubeAPI() {
  // Se a API já está carregada, retorna imediatamente
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }

  // Se já existe uma Promise de carregamento em andamento, retorna a mesma
  if (loadPromise) {
    return loadPromise;
  }

  // Cria uma nova Promise para o carregamento
  loadPromise = new Promise((resolve, reject) => {
    // Verifica se o script já foi injetado
    if (!scriptInjected) {
      // Verifica se já existe um script do YouTube API no DOM
      const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
      
      if (!existingScript) {
        // Injeta o script do YouTube API
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        tag.defer = true;
        
        tag.onerror = () => {
          scriptInjected = false;
          loadPromise = null;
          reject(new Error('Falha ao carregar a API do YouTube'));
        };
        
        // Insere o script antes do primeiro script existente ou no head
        const firstScript = document.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(tag, firstScript);
        } else {
          document.head.appendChild(tag);
        }
        
        scriptInjected = true;
      } else {
        scriptInjected = true;
      }
    }

    // Polling de segurança: verifica periodicamente se a API já está disponível
    // Isso é útil caso o callback não seja chamado (ex: script já carregado anteriormente)
    let pollCount = 0;
    const maxPolls = 300; // 30 segundos (100ms * 300)
    let pollInterval = null;

    // Função auxiliar para verificar se a API está pronta e resolver
    const checkAndResolve = () => {
      if (window.YT && window.YT.Player) {
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
        loadPromise = null;
        resolve(window.YT);
        return true;
      }
      return false;
    };

    // Verifica imediatamente se a API já está disponível (caso o script já tenha sido carregado)
    if (checkAndResolve()) {
      return;
    }

    // Configura o callback global que será chamado quando a API estiver pronta
    // Salva o callback anterior se existir
    const previousCallback = window.onYouTubeIframeAPIReady;
    
    window.onYouTubeIframeAPIReady = () => {
      // Restaura o callback anterior se existir
      if (previousCallback && typeof previousCallback === 'function') {
        previousCallback();
      }
      
      // Verifica se a API está realmente disponível
      checkAndResolve();
    };

    // Inicia o polling de segurança
    pollInterval = setInterval(() => {
      pollCount++;
      
      if (checkAndResolve()) {
        return;
      }
      
      // Se excedeu o número máximo de tentativas, rejeita
      if (pollCount >= maxPolls) {
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
        loadPromise = null;
        scriptInjected = false;
        reject(new Error('Timeout ao carregar a API do YouTube'));
      }
    }, 100);

    // Timeout de segurança adicional (30 segundos)
    setTimeout(() => {
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
      if (loadPromise) {
        loadPromise = null;
        scriptInjected = false;
        reject(new Error('Timeout ao carregar a API do YouTube'));
      }
    }, 30000);
  });

  return loadPromise;
}
