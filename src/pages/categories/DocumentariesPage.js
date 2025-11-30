/**
 * DocumentariesPage - Página de documentários unificada
 */
import { Carousel } from '../../components/Carousel.js';
import '../../styles/pages/documentaries.css';

export function render() {
  const title = 'Documentários';
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
    <div class="page page--documentaries">
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
          title: 'Vida Selvagem (YouTube API)', 
          query: 'documentários vida selvagem animais' 
        })}
      </section>

      <section class="section">
        ${Carousel({ 
          title: 'Cuidados com Pets (YouTube API)', 
          query: 'dicas cuidados pets veterinário' 
        })}
      </section>
    </div>
  `;
}

export function init() {
  // Inicialização da DocumentariesPage (se necessário)
}

// Funções globais para uso no HTML
window.closeModal = function() {
  const modal = document.getElementById('docsModal');
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

