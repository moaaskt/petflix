// No seu arquivo JS (ex: series-api.js)
async function fetchPetVideos() {
  const petType = PET_TYPE === 'dog' ? 'cachorros' : 'gatos';
  const response = await fetch(
    `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=documentario+sobre+${petType}&type=video&key=SUA_CHAVE_YOUTUBE`
  );
  const data = await response.json();
  displayVideos(data.items);
}

// Chave Pública para Testes (pode ter limites):
const YT_API_KEY = 'AIzaSyB5D1R7W9ZZn1hQj7n5Q5Q5Q5Q5Q5Q5Q5Q5';