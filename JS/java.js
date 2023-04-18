const movieVideo = document.querySelector('.movie-video');
const movieTitle = document.querySelector('.movie-title');

movieVideo.addEventListener('play', () => {
  movieTitle.classList.add('hide');
});

movieVideo.addEventListener('pause', () => {
  movieTitle.classList.remove('hide');
});

movieVideo.addEventListener('ended', () => {
  movieTitle.classList.remove('hide');
});