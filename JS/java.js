const searchIcon = document.getElementById('searchIcon');
const searchInput = document.getElementById('searchInput');

searchIcon.addEventListener('click', () => {
  searchInput.style.display = 'block';
  searchInput.focus();
});

document.addEventListener('click', (event) => {
  const isSearchInputClicked = searchInput.contains(event.target);
  const isSearchIconClicked = searchIcon.contains(event.target);
  
  if (!isSearchInputClicked && !isSearchIconClicked) {
    searchInput.style.display = 'none';
  }
});
