/**
 * MoviesPage - Página de filmes unificada
 */
import { Carousel } from '../../components/Carousel.js';
import '../../styles/pages/movies.css';

export function render() {
  const title = 'Filmes';
  const mockItems = [
    {
      title: 'Demon Slayer',
      thumbnail: 'https://i.ytimg.com/vi/2MKkj1DQ0NU/maxresdefault.jpg',
      videoId: '2MKkj1DQ0NU'
    },
    {
      title: 'One Piece',
      thumbnail: 'https://i.ytimg.com/vi/0bZB5u28P8E/maxresdefault.jpg',
      videoId: '0bZB5u28P8E'
    },
    {
      title: 'Naruto',
      thumbnail: 'https://i.ytimg.com/vi/-G9EoDQFhHk/maxresdefault.jpg',
      videoId: '-G9EoDQFhHk'
    }
  ];

  return `
    <div class="page page--movies">
      <div class="container">
        <header class="page-header">
          <h2 class="section-title">${title}</h2>
        </header>
      </div>
      
      <section class="section">
        ${Carousel({ 
          title: 'Populares (Mock)', 
          items: mockItems 
        })}
      </section>

      <section class="section">
        ${Carousel({ 
          title: 'Filmes de Cachorro (YouTube API)', 
          query: 'filmes de cachorro completo dublado' 
        })}
      </section>

      <section class="section">
        ${Carousel({ 
          title: 'Animações de Pets (YouTube API)', 
          query: 'filmes pets animação' 
        })}
      </section>
    </div>
  `;
}

export function init() {
  // Inicialização da MoviesPage (se necessário)
}

// Função global para fechar modal (usada no HTML)
window.closeModal = function() {
  const modal = document.getElementById('moviesModal');
  const iframe = document.getElementById('modalVideo');
  
  if (modal && iframe) {
    iframe.src = '';
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
};


// Função global para scroll do carrossel (usada no HTML)
window.scrollCarousel = function(containerId, scrollAmount) {
  const container = document.getElementById(containerId);
  if (container) {
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }
};

