import { db, collection } from '../config/firebase.js';
import { getDocs } from 'firebase/firestore';

// Cache local para evitar múltiplas leituras do Firestore
let cachedContent = null;
let isLoading = false;
let loadPromise = null;

/**
 * Carrega todos os conteúdos do Firestore (com cache)
 * @returns {Promise<Array>}
 */
async function loadAllContent() {
  // Se já temos os dados em cache, retorna imediatamente
  if (cachedContent !== null) {
    return cachedContent;
  }

  // Se já está carregando, espera a promessa existente
  if (isLoading && loadPromise) {
    return loadPromise;
  }

  // Inicia o carregamento
  isLoading = true;
  loadPromise = (async () => {
    try {
      const moviesRef = collection(db, 'movies');
      const snapshot = await getDocs(moviesRef);
      
      const content = [];
      snapshot.forEach((doc) => {
        content.push({ id: doc.id, ...doc.data() });
      });

      // Salva no cache
      cachedContent = content;
      isLoading = false;
      
      return content;
    } catch (error) {
      console.error('❌ Erro ao carregar conteúdo do Firestore:', error);
      isLoading = false;
      // Retorna array vazio em caso de erro (ex: sem internet)
      return [];
    }
  })();

  return loadPromise;
}

/**
 * Retorna todos os conteúdos
 * @returns {Promise<Array>}
 */
export async function getAll() {
  return await loadAllContent();
}

/**
 * Filtra conteúdos por espécie (dog/cat)
 * @param {string} species - Espécie do animal
 * @returns {Promise<Array>}
 */
export async function getBySpecies(species) {
  const s = (species || '').toLowerCase();
  const all = await loadAllContent();
  return all.filter(i => i.species === s);
}

/**
 * Retorna conteúdo em destaque (featured) de uma espécie
 * @param {string} species - Espécie do animal
 * @returns {Promise<Object>}
 */
export async function getFeatured(species) {
  const all = await getBySpecies(species);
  const list = all.filter(i => i.featured);
  
  if (list.length > 0) return list[Math.floor(Math.random() * list.length)];
  if (all.length > 0) return all[0];
  
  // Retorna objeto padrão caso não encontre nada
  return { 
    id: 'error', 
    title: 'Conteúdo Indisponível', 
    description: 'Tente outro perfil.', 
    image: '/assets/hero-fallback.jpg', 
    type: 'movie', 
    species: (species || 'dog'), 
    genre: 'drama', 
    videoId: '', 
    featured: false, 
    trending: false, 
    original: false 
  };
}

/**
 * Filtra conteúdos por categoria (type)
 * @param {string} species - Espécie do animal
 * @param {string} type - Tipo do conteúdo (movie, series, doc)
 * @returns {Promise<Array>}
 */
export async function getByCategory(species, type) {
  const s = (species || '').toLowerCase();
  const t = (type || '').toLowerCase();
  const all = await loadAllContent();
  return all.filter(i => i.species === s && i.type === t);
}

/**
 * Filtra conteúdos por gênero
 * @param {string} species - Espécie do animal
 * @param {string} genre - Gênero do conteúdo
 * @returns {Promise<Array>}
 */
export async function getByGenre(species, genre) {
  const s = (species || '').toLowerCase();
  const g = (genre || '').toLowerCase();
  const all = await loadAllContent();
  return all.filter(i => i.species === s && i.genre === g);
}

/**
 * Retorna conteúdos em alta (trending)
 * @param {string} species - Espécie do animal
 * @param {number} limit - Limite de resultados
 * @returns {Promise<Array>}
 */
export async function getTrending(species, limit = 20) {
  const base = await getBySpecies(species);
  const list = base.filter(i => i.trending);
  const pool = list.length > 0 ? list : base;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(limit, shuffled.length));
}

/**
 * Retorna conteúdos originais da plataforma
 * @param {string} species - Espécie do animal
 * @returns {Promise<Array>}
 */
export async function getOriginals(species) {
  const all = await getBySpecies(species);
  return all.filter(i => i.original === true);
}

/**
 * Busca conteúdos por texto
 * @param {string} query - Termo de busca
 * @param {string} species - Espécie do animal (opcional)
 * @returns {Promise<Array>}
 */
export async function searchContent(query, species) {
  const q = (query || '').toLowerCase().trim();
  const base = species ? await getBySpecies(species) : await loadAllContent();
  
  if (!q) return [];
  
  return base.filter(item => (
    (item.title || '').toLowerCase().includes(q) ||
    (item.description || '').toLowerCase().includes(q)
  )).slice(0, 20);
}

/**
 * Mantém ALL_CONTENT exportado para compatibilidade com o seed script
 * Este array será usado apenas pelo seed-db.js
 */
export const ALL_CONTENT = [
  { id: 'DOG-ACT-001', title: 'Operação Petisco', description: 'Uma equipe canina enfrenta uma missão cheia de ação para resgatar petiscos raros.', image: 'https://images.unsplash.com/photo-1507149833265-60c372daea22?w=1200&auto=format&fit=crop', type: 'movie', species: 'dog', genre: 'action', videoId: 'Ws-9ra38AlI', featured: true, trending: true, original: false },
  { id: 'DOG-DRM-002', title: 'O Cão que Sabia Demais', description: 'Um cão com um passado misterioso descobre sua verdadeira família.', image: 'https://images.unsplash.com/photo-1546422401-e64280fa5db5?w=1200&auto=format&fit=crop', type: 'movie', species: 'dog', genre: 'drama', videoId: 'ki8wHMR-yOI', featured: true, trending: true, original: false },
  { id: 'DOG-ADV-003', title: 'Correndo Atrás do Carteiro', description: 'Uma aventura pelas ruas da cidade em busca do carteiro fugitivo.', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&auto=format&fit=crop', type: 'movie', species: 'dog', genre: 'adventure', videoId: 'UqtFvSKhKmA', featured: false, trending: true, original: false },
  { id: 'DOG-DOC-004', title: 'Dormindo no Sofá', description: 'Documentário sobre a arte canina de relaxar em sofás.', image: 'https://images.unsplash.com/photo-1484249170766-998fa6edf891?w=1200&auto=format&fit=crop', type: 'doc', species: 'dog', genre: 'drama', videoId: 'fEPkp0iFMTI', featured: false, trending: false, original: false },
  { id: 'DOG-DRM-005', title: 'Marley & Eu', description: 'Uma história emocionante de amor entre um cão e sua família.', image: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?w=1200&auto=format&fit=crop', type: 'movie', species: 'dog', genre: 'drama', videoId: 'Ws-9ra38AlI', featured: true, trending: true, original: false },
  { id: 'DOG-CMD-006', title: 'Beethoven', description: 'As travessuras de um São Bernardo adorável.', image: 'https://images.unsplash.com/photo-1522276498395-0bf99e9bd9c1?w=1200&auto=format&fit=crop', type: 'movie', species: 'dog', genre: 'comedy', videoId: 'ki8wHMR-yOI', featured: true, trending: true, original: false },
  { id: 'DOG-ACT-007', title: 'K-9', description: 'Policial e seu cão combatendo o crime.', image: 'https://images.unsplash.com/photo-1543466835-00a54d68f1f1?w=1200&auto=format&fit=crop', type: 'movie', species: 'dog', genre: 'action', videoId: 'UqtFvSKhKmA', featured: false, trending: true, original: false },
  { id: 'DOG-DRM-008', title: 'Sempre ao Seu Lado', description: 'Lealdade canina além do tempo.', image: 'https://images.unsplash.com/photo-1534367610401-9f0e9961cd3f?w=1200&auto=format&fit=crop', type: 'movie', species: 'dog', genre: 'drama', videoId: 'UFY8vW5IedY', featured: true, trending: true, original: false },
  { id: 'DOG-DRM-009', title: "A Dog's Purpose", description: 'A jornada de um cão por várias vidas.', image: 'https://images.unsplash.com/photo-1548095115-45697e961f98?w=1200&auto=format&fit=crop', type: 'movie', species: 'dog', genre: 'drama', videoId: '1jLOOCADTGs', featured: false, trending: true, original: false },
  { id: 'DOG-SER-010', title: 'Aventuras Caninas', description: 'Diversão e ação com cães heróis.', image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=1200&auto=format&fit=crop', type: 'series', species: 'dog', genre: 'adventure', videoId: 'MjbKt2bVFec', featured: false, trending: true, original: false },
  { id: 'DOG-DOC-011', title: 'Documentário Canino', description: 'Curiosidades e histórias sobre cães.', image: 'https://images.unsplash.com/photo-1490257387906-0adad35d47c6?w=1200&auto=format&fit=crop', type: 'doc', species: 'dog', genre: 'drama', videoId: 'fEPkp0iFMTI', featured: false, trending: false, original: false },
  { id: 'DOG-ACT-012', title: 'Bolt', description: 'Um cão super-herói descobre o mundo real.', image: 'https://images.unsplash.com/photo-1556225061-6a532a6a67a0?w=1200&auto=format&fit=crop', type: 'movie', species: 'dog', genre: 'action', videoId: 'UEk9r1375d0', featured: false, trending: true, original: false },
  { id: 'DOG-ADV-013', title: 'Clifford', description: 'O gigante cão vermelho em grandes aventuras.', image: 'https://images.unsplash.com/photo-1521302080490-5925f74a9631?w=1200&auto=format&fit=crop', type: 'movie', species: 'dog', genre: 'adventure', videoId: 'Cliff-123', featured: false, trending: false, original: false },
  { id: 'DOG-SER-014', title: 'Lassie', description: 'A clássica heroína canina.', image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=1200&auto=format&fit=crop', type: 'series', species: 'dog', genre: 'adventure', videoId: 'Lassie-456', featured: false, trending: true, original: false },
  { id: 'DOG-DRM-015', title: 'Bons Garotos', description: 'Histórias emocionantes de cães heróis.', image: 'https://images.unsplash.com/photo-1543466835-00a54d68f1f1?w=1200&auto=format&fit=crop', type: 'movie', species: 'dog', genre: 'drama', videoId: 'N-nzEPmjM1c', featured: false, trending: true, original: false },
  { id: 'DOG-ACT-016', title: 'Heróis de Quatro Patas', description: 'Cães salvando o dia.', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200&auto=format&fit=crop', type: 'movie', species: 'dog', genre: 'action', videoId: 'lAKXRYTb6B8', featured: false, trending: true, original: false },
  { id: 'DOG-DOC-017', title: 'Resgate Animal', description: 'Operações de resgate que inspiram.', image: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1200&auto=format&fit=crop', type: 'doc', species: 'dog', genre: 'drama', videoId: 'fEPkp0iFMTI', featured: false, trending: true, original: false },
  { id: 'DOG-SER-018', title: 'Patrulha do Parque', description: 'Série de aventuras caninas no parque.', image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=1200&auto=format&fit=crop', type: 'series', species: 'dog', genre: 'adventure', videoId: '1jLOOCADTGs', featured: false, trending: false, original: false },
  { id: 'DOG-SER-019', title: 'Filhotes em Ação', description: 'Filhotes explorando o mundo.', image: 'https://images.unsplash.com/photo-1504595403659-9088ce801e29?w=1200&auto=format&fit=crop', type: 'series', species: 'dog', genre: 'comedy', videoId: 'MjbKt2bVFec', featured: false, trending: true, original: false },
  { id: 'DOG-ORG-020', title: 'Cães do Bairro', description: 'Original Petflix sobre a vida canina urbana.', image: 'https://images.unsplash.com/photo-1558944351-5711d26e46b4?w=1200&auto=format&fit=crop', type: 'series', species: 'dog', genre: 'comedy', videoId: 'DOG-ORG-020-VID', featured: false, trending: true, original: true },
  { id: 'CAT-ACT-001', title: 'A Vingança do Sachê', description: 'Um herói felino em busca do sachê perdido.', image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200&auto=format&fit=crop', type: 'movie', species: 'cat', genre: 'action', videoId: '6pbreU5ChmA', featured: true, trending: true, original: false },
  { id: 'CAT-CMD-002', title: 'Derrubando Copos', description: 'Comédia sobre gatos e a gravidade.', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop', type: 'movie', species: 'cat', genre: 'comedy', videoId: '8nQF3zVotOg', featured: true, trending: true, original: false },
  { id: 'CAT-DRM-003', title: 'O Ponto Vermelho', description: 'Drama felino perseguindo um inalcançável ponto de luz.', image: 'https://images.unsplash.com/photo-1511044568930-3382016e2997?w=1200&auto=format&fit=crop', type: 'movie', species: 'cat', genre: 'drama', videoId: 'Gar-789', featured: false, trending: true, original: false },
  { id: 'CAT-DOC-004', title: 'A Caixa de Papelão', description: 'Documentário sobre a fascinação dos gatos por caixas.', image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1200&auto=format&fit=crop', type: 'doc', species: 'cat', genre: 'drama', videoId: 'CatDoc-555', featured: false, trending: false, original: false },
  { id: 'CAT-ACT-005', title: 'Gato de Botas', description: 'O felino destemido em novas aventuras.', image: 'https://images.unsplash.com/photo-1535930749574-13993338e0d2?w=1200&auto=format&fit=crop', type: 'movie', species: 'cat', genre: 'action', videoId: '6pbreU5ChmA', featured: true, trending: true, original: false },
  { id: 'CAT-CMD-006', title: 'Aristogatas', description: 'Gatos elegantes em uma aventura musical.', image: 'https://images.unsplash.com/photo-1526312426976-1d7b0b4b5a7d?w=1200&auto=format&fit=crop', type: 'movie', species: 'cat', genre: 'comedy', videoId: '8nQF3zVotOg', featured: true, trending: true, original: false },
  { id: 'CAT-CMD-007', title: 'Garfield', description: 'O gato preguiçoso e suas comédias.', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200&auto=format&fit=crop', type: 'movie', species: 'cat', genre: 'comedy', videoId: 'Gar-789', featured: false, trending: true, original: false },
  { id: 'CAT-ADV-008', title: 'O Reino dos Gatos', description: 'Fantasia felina mágica.', image: 'https://images.unsplash.com/photo-1521302080490-5925f74a9631?w=1200&auto=format&fit=crop', type: 'movie', species: 'cat', genre: 'adventure', videoId: 'Reino-012', featured: false, trending: false, original: false },
  { id: 'CAT-ACT-009', title: 'Keanu', description: 'Resgatar um gatinho nunca foi tão insano.', image: 'https://images.unsplash.com/photo-1516367933306-76bf1d07e52d?w=1200&auto=format&fit=crop', type: 'movie', species: 'cat', genre: 'action', videoId: 'Keanu-111', featured: false, trending: true, original: false },
  { id: 'CAT-DRM-010', title: 'Um Gato de Rua Chamado Bob', description: 'Uma amizade transformadora.', image: 'https://images.unsplash.com/photo-1555685812-4b7432e443c8?w=1200&auto=format&fit=crop', type: 'movie', species: 'cat', genre: 'drama', videoId: 'Bob-222', featured: false, trending: true, original: false },
  { id: 'CAT-SER-011', title: 'Pets: Chloe', description: 'A vida secreta de uma gata esperta.', image: 'https://images.unsplash.com/photo-1495360010541-32531be3b5c9?w=1200&auto=format&fit=crop', type: 'series', species: 'cat', genre: 'comedy', videoId: 'Chloe-333', featured: false, trending: true, original: false },
  { id: 'CAT-SER-012', title: 'Manda-Chuva', description: 'Gatos da rua com estilo.', image: 'https://images.unsplash.com/photo-1526312426976-1d7b0b4b5a7d?w=1200&auto=format&fit=crop', type: 'series', species: 'cat', genre: 'comedy', videoId: 'TopCat-444', featured: false, trending: true, original: false },
  { id: 'CAT-DOC-013', title: 'Documentário Felino', description: 'Mundos e mistérios dos gatos.', image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=1200&auto=format&fit=crop', type: 'doc', species: 'cat', genre: 'drama', videoId: 'CatDoc-555', featured: false, trending: false, original: false },
  { id: 'CAT-SER-014', title: 'Vida de Gato', description: 'Cotidiano dos felinos.', image: 'https://images.unsplash.com/photo-1507149833265-60c372daea22?w=1200&auto=format&fit=crop', type: 'series', species: 'cat', genre: 'drama', videoId: 'CatLife-666', featured: false, trending: true, original: false },
  { id: 'CAT-DOC-015', title: 'Soneca da Tarde', description: 'Histórias relaxantes de sonecas felinas.', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200&auto=format&fit=crop', type: 'doc', species: 'cat', genre: 'drama', videoId: 'CAT-DOC-015-VID', featured: false, trending: true, original: false },
  { id: 'CAT-SER-016', title: 'Caçadores de Laser', description: 'Gatos em perseguição ao ponto vermelho.', image: 'https://images.unsplash.com/photo-1511044568930-3382016e2997?w=1200&auto=format&fit=crop', type: 'series', species: 'cat', genre: 'action', videoId: 'CAT-SER-016-VID', featured: false, trending: true, original: false },
  { id: 'CAT-ACT-017', title: 'Gatos Ninjas', description: 'Felinos silenciosos e habilidosos.', image: 'https://images.unsplash.com/photo-1535930749574-13993338e0d2?w=1200&auto=format&fit=crop', type: 'movie', species: 'cat', genre: 'action', videoId: 'CAT-ACT-017-VID', featured: false, trending: true, original: false },
  { id: 'CAT-SER-018', title: 'Fofuras Peludas', description: 'Série de comédia com gatos irresistíveis.', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop', type: 'series', species: 'cat', genre: 'comedy', videoId: 'CAT-SER-018-VID', featured: false, trending: true, original: false },
  { id: 'CAT-DRM-019', title: 'Mistérios Felinos', description: 'Dramas e mistérios do universo dos gatos.', image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=1200&auto=format&fit=crop', type: 'movie', species: 'cat', genre: 'drama', videoId: 'CAT-DRM-019-VID', featured: false, trending: true, original: false },
  { id: 'CAT-ORG-020', title: 'O Império dos Miaus', description: 'Original Petflix sobre a ascensão felina.', image: 'https://images.unsplash.com/photo-1495360010541-32531be3b5c9?w=1200&auto=format&fit=crop', type: 'series', species: 'cat', genre: 'drama', videoId: 'CAT-ORG-020-VID', featured: true, trending: true, original: true }
];

export default { getAll, getBySpecies, getFeatured, getByCategory, getByGenre, getTrending, getOriginals, searchContent };
