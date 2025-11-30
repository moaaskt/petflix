/**
 * HomePage - Página de seleção de perfil
 * Retorna HTML puro, sem estilização ainda
 */
export function render() {
  return `
    <div>
      <h1>Selecione seu Perfil</h1>
      <p>Quem está assistindo?</p>
      <div>
        <button data-pet="dog">Cachorro</button>
        <button data-pet="cat">Gato</button>
      </div>
      <p>Por enquanto, use <a href="#/home">#/home</a> para seleção de perfil</p>
    </div>
  `;
}

export function init() {
  // Inicialização da HomePage (se necessário)
}

