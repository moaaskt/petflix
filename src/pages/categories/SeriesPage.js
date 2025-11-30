/**
 * SeriesPage - Página de séries unificada
 */
import { Carousel } from '../../components/Carousel.js';
import '../../styles/pages/series.css';

export function render() {
  const title = 'Séries';
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
    <div class="page page--series">
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
          title: 'Séries de Animais (YouTube API)', 
          query: 'séries animais natgeo' 
        })}
      </section>

      <section class="section">
        ${Carousel({ 
          title: 'Desenhos de Pets (YouTube API)', 
          query: 'desenhos animados animais completo' 
        })}
      </section>
    </div>
  `;
}

export function init() {
  // Inicialização da SeriesPage (se necessário)
}

// Funções globais para uso no HTML
window.closeModal = function() {
  const modal = document.getElementById('seriesModal');
  const iframe = document.getElementById('modalVideo');
  
  if (modal && iframe) {
    iframe.src = '';
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
};


window.scrollCarousel = function(containerId, scrollAmount) {
  const container = document.getElementById(containerId);
  if (container) {
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }
};

