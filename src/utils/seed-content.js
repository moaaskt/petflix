/**
 * Script de Seed para popular o Firestore com conteúdo real e de alta qualidade
 * Popula a coleção 'content' com YouTube IDs válidos e dados curados
 */
import { db, collection } from '../config/firebase.js';
import { getDocs, addDoc, writeBatch, doc } from 'firebase/firestore';

/**
 * Lista de conteúdo curado para popular o banco de dados
 */
const CURATED_CONTENT = [
  // Destaque (Hero)
  {
    title: "Gato de Botas 2: O Último Pedido",
    description: "O Gato de Botas descobre que sua paixão pela aventura cobrou seu preço: ele queimou oito de suas nove vidas.",
    thumbnail: "https://image.tmdb.org/t/p/original/tGwO4xcBjhXC0p5qlkw37TrH6S6.jpg",
    videoId: "sJfq2j4lJbU",
    category: "Destaque",
    rating: "98% Relevante",
    duration: "1h 42m",
    featured: true,
    trending: true,
    type: "movie",
    species: "cat",
    genre: "adventure"
  },
  
  // Filmes (Trailers)
  {
    title: "Marley & Eu",
    description: "Uma história emocionante de amor entre um cão e sua família.",
    thumbnail: "https://image.tmdb.org/t/p/original/6c4F6Xg0W2YyYX8qV2m8mK7w8z.jpg",
    videoId: "0UM79R8I10M",
    category: "Filmes",
    rating: "85% Relevante",
    duration: "2h 0m",
    featured: false,
    trending: true,
    type: "movie",
    species: "dog",
    genre: "drama"
  },
  {
    title: "Sempre ao Seu Lado",
    description: "A história real de lealdade canina além do tempo.",
    thumbnail: "https://image.tmdb.org/t/p/original/9dw840VOr3YBkrYxtJ7wuKNAoK5.jpg",
    videoId: "Y6U7mAnPtw4",
    category: "Filmes",
    rating: "92% Relevante",
    duration: "1h 33m",
    featured: false,
    trending: true,
    type: "movie",
    species: "dog",
    genre: "drama"
  },
  {
    title: "Quatro Vidas de um Cachorro",
    description: "A jornada de um cão por várias vidas em busca de seu propósito.",
    thumbnail: "https://img.youtube.com/vi/1jLOOCADTGs/maxresdefault.jpg",
    videoId: "1jLOOCADTGs",
    category: "Filmes",
    rating: "88% Relevante",
    duration: "1h 40m",
    featured: false,
    trending: true,
    type: "movie",
    species: "dog",
    genre: "drama"
  },
  {
    title: "Beethoven: O Magnífico",
    description: "As travessuras de um São Bernardo adorável e sua família.",
    thumbnail: "https://img.youtube.com/vi/ki626jR8rPw/maxresdefault.jpg",
    videoId: "ki626jR8rPw",
    category: "Filmes",
    rating: "75% Relevante",
    duration: "1h 27m",
    featured: false,
    trending: true,
    type: "movie",
    species: "dog",
    genre: "comedy"
  },
  
  // Animação
  {
    title: "Pets: A Vida Secreta dos Bichos",
    description: "O que seus animais de estimação fazem quando você não está em casa?",
    thumbnail: "https://img.youtube.com/vi/i-80SGWfEjM/maxresdefault.jpg",
    videoId: "i-80SGWfEjM",
    category: "Animação",
    rating: "82% Relevante",
    duration: "1h 27m",
    featured: false,
    trending: true,
    type: "movie",
    species: "dog",
    genre: "comedy"
  },
  {
    title: "Bolt: Supercão",
    description: "Um cão super-herói descobre o mundo real em uma aventura épica.",
    thumbnail: "https://img.youtube.com/vi/s3r8hX_jLRg/maxresdefault.jpg",
    videoId: "s3r8hX_jLRg",
    category: "Animação",
    rating: "80% Relevante",
    duration: "1h 36m",
    featured: false,
    trending: true,
    type: "movie",
    species: "dog",
    genre: "adventure"
  },
  {
    title: "DC Liga dos Superpets",
    description: "Os animais de estimação dos super-heróis se unem para salvar o dia.",
    thumbnail: "https://img.youtube.com/vi/1jLOOCADTGs/maxresdefault.jpg",
    videoId: "1jLOOCADTGs",
    category: "Animação",
    rating: "78% Relevante",
    duration: "1h 45m",
    featured: false,
    trending: true,
    type: "movie",
    species: "dog",
    genre: "action"
  },
  {
    title: "O Rei Leão (Live Action)",
    description: "A clássica história do leão que se torna rei, agora em live action.",
    thumbnail: "https://img.youtube.com/vi/7TavVZMewpY/maxresdefault.jpg",
    videoId: "7TavVZMewpY",
    category: "Animação",
    rating: "90% Relevante",
    duration: "1h 58m",
    featured: false,
    trending: true,
    type: "movie",
    species: "cat",
    genre: "adventure"
  },
  
  // Comédia (Virais)
  {
    title: "Ultimate Dog Tease",
    description: "O vídeo clássico do cachorro que quer bacon.",
    thumbnail: "https://img.youtube.com/vi/nGeKSiCQkPw/maxresdefault.jpg",
    videoId: "nGeKSiCQkPw",
    category: "Comédia",
    rating: "95% Relevante",
    duration: "2m 15s",
    featured: false,
    trending: true,
    type: "doc",
    species: "dog",
    genre: "comedy"
  },
  {
    title: "Funny Cats Compilation",
    description: "Compilação hilária dos melhores momentos felinos.",
    thumbnail: "https://img.youtube.com/vi/ByH9LuSILxU/maxresdefault.jpg",
    videoId: "ByH9LuSILxU",
    category: "Comédia",
    rating: "88% Relevante",
    duration: "10m 30s",
    featured: false,
    trending: true,
    type: "doc",
    species: "cat",
    genre: "comedy"
  },
  {
    title: "Talking Dog",
    description: "Um cachorro que parece falar e se comunica de forma única.",
    thumbnail: "https://img.youtube.com/vi/1sTEQC2X1G4/maxresdefault.jpg",
    videoId: "1sTEQC2X1G4",
    category: "Comédia",
    rating: "85% Relevante",
    duration: "1m 45s",
    featured: false,
    trending: true,
    type: "doc",
    species: "dog",
    genre: "comedy"
  },
  {
    title: "Surprised Kitty",
    description: "O gato mais surpreso da internet.",
    thumbnail: "https://img.youtube.com/vi/0Bmhjf0rKe8/maxresdefault.jpg",
    videoId: "0Bmhjf0rKe8",
    category: "Comédia",
    rating: "92% Relevante",
    duration: "0m 30s",
    featured: false,
    trending: true,
    type: "doc",
    species: "cat",
    genre: "comedy"
  }
];

/**
 * Popula o banco de dados com conteúdo curado
 * @param {boolean} force - Se true, força a população mesmo se já houver dados
 * @returns {Promise<void>}
 */
export async function populateDatabase(force = false) {
  try {

    const contentRef = collection(db, 'content');
    
    // Verifica se a coleção já possui dados
    const snapshot = await getDocs(contentRef);
    
    if (!snapshot.empty && !force) {
      return;
    }

    if (force && !snapshot.empty) {
    }


    // Usa writeBatch para inserir múltiplos documentos de uma vez (mais eficiente)
    const BATCH_LIMIT = 500; // Limite do Firestore por batch
    let batch = writeBatch(db);
    let batchCount = 0;

    for (let i = 0; i < CURATED_CONTENT.length; i++) {
      const item = CURATED_CONTENT[i];
      
      // Adiciona timestamp de criação
      const contentData = {
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Cria referência para novo documento
      const docRef = doc(contentRef);
      batch.set(docRef, contentData);
      batchCount++;

      // Se atingiu o limite do batch ou é o último item, commita o batch
      if (batchCount >= BATCH_LIMIT || i === CURATED_CONTENT.length - 1) {
        await batch.commit();
        
        // Se ainda há itens, cria um novo batch
        if (i < CURATED_CONTENT.length - 1) {
          batch = writeBatch(db);
          batchCount = 0;
        }
      }
    }

  } catch (error) {
    console.error('❌ Erro durante a população do banco de dados:', error);
    // Não lança o erro para não quebrar a aplicação caso o Firebase esteja offline
    console.warn('⚠️ A aplicação continuará funcionando, mas os dados podem não estar disponíveis.');
    throw error; // Re-throw para que o chamador possa tratar se necessário
  }
}

/**
 * Função auxiliar para popular usando addDoc (alternativa mais simples)
 * @param {boolean} force - Se true, força a população mesmo se já houver dados
 * @returns {Promise<void>}
 */
export async function populateDatabaseSimple(force = false) {
  try {

    const contentRef = collection(db, 'content');
    
    // Verifica se a coleção já possui dados
    const snapshot = await getDocs(contentRef);
    
    if (!snapshot.empty && !force) {
      return;
    }


    // Adiciona cada item individualmente
    for (const item of CURATED_CONTENT) {
      try {
        const contentData = {
          ...item,
          image: item.thumbnail, // Alias para compatibilidade com o sistema existente
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await addDoc(contentRef, contentData);
      } catch (error) {
        console.error(`❌ Erro ao salvar "${item.title}":`, error);
      }
    }

  } catch (error) {
    console.error('❌ Erro durante a população do banco de dados:', error);
    console.warn('⚠️ A aplicação continuará funcionando, mas os dados podem não estar disponíveis.');
    throw error;
  }
}
