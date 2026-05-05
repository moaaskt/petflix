/**
 * Script de Seed para popular o Firestore com conteúdo real e de alta qualidade
 * Popula a coleção 'content' com YouTube IDs válidos e dados curados
 */
import { db } from '../config/firebase.js';
import { collection, getDocs, addDoc, writeBatch, doc } from 'firebase/firestore';

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
  },

  // Filmes Populares - Cães
  {
    title: "A Propósito de um Cão",
    description: "Um cão descobre o sentido de sua existência ao reencarnar em várias raças ao longo de décadas, sempre voltando ao garoto que o amou primeiro.",
    thumbnail: "https://img.youtube.com/vi/Ws-9ra38AlI/maxresdefault.jpg",
    videoId: "Ws-9ra38AlI",
    category: "Filmes",
    rating: "91% Relevante",
    duration: "1h 40m",
    featured: true,
    trending: true,
    type: "movie",
    species: "dog",
    genre: "drama"
  },
  {
    title: "Togo",
    description: "A história verídica e emocionante do cão Togo e seu treinador, que lideraram a missão de salvamento mais perigosa da história do Alasca.",
    thumbnail: "https://img.youtube.com/vi/4NkELIOxAFA/maxresdefault.jpg",
    videoId: "4NkELIOxAFA",
    category: "Filmes",
    rating: "96% Relevante",
    duration: "1h 54m",
    featured: false,
    trending: true,
    type: "movie",
    species: "dog",
    genre: "adventure"
  },
  {
    title: "Oito Abaixo de Zero",
    description: "Um guia de expedição é forçado a abandonar seus oito cães de trenó na Antártida. Determinados a sobreviver, os cães lutam pelos meses seguintes até o retorno de seu dono.",
    thumbnail: "https://img.youtube.com/vi/fF-u6OqXxSY/maxresdefault.jpg",
    videoId: "fF-u6OqXxSY",
    category: "Filmes",
    rating: "87% Relevante",
    duration: "2h 0m",
    featured: true,
    trending: false,
    type: "movie",
    species: "dog",
    genre: "adventure"
  },
  {
    title: "Turner & Hooch",
    description: "Um policial meticuloso e organizado precisa cuidar de um cão enorme e destruidor que é a única testemunha de um assassinato.",
    thumbnail: "https://img.youtube.com/vi/FKxjpj4Ipz0/maxresdefault.jpg",
    videoId: "FKxjpj4Ipz0",
    category: "Filmes",
    rating: "79% Relevante",
    duration: "1h 40m",
    featured: false,
    trending: false,
    type: "movie",
    species: "dog",
    genre: "comedy"
  },
  {
    title: "Isle of Dogs: Ilha dos Cachorros",
    description: "Quando os cães são banidos de uma cidade japonesa por decreto do prefeito, um garoto de 12 anos cruza o mar em busca de seu fiel protetor.",
    thumbnail: "https://img.youtube.com/vi/dt__kig8PVU/maxresdefault.jpg",
    videoId: "dt__kig8PVU",
    category: "Animação",
    rating: "93% Relevante",
    duration: "1h 41m",
    featured: true,
    trending: false,
    type: "movie",
    species: "dog",
    genre: "animation"
  },
  {
    title: "Frankenweenie",
    description: "Após a morte de seu cão Sparky, o jovem Victor Frankenstein usa experimentos científicos para trazê-lo de volta à vida, com resultados imprevisíveis.",
    thumbnail: "https://img.youtube.com/vi/bcrCpp6CXSQ/maxresdefault.jpg",
    videoId: "bcrCpp6CXSQ",
    category: "Animação",
    rating: "84% Relevante",
    duration: "1h 27m",
    featured: false,
    trending: false,
    type: "movie",
    species: "dog",
    genre: "animation"
  },
  {
    title: "101 Dálmatas",
    description: "Quando a malvada Cruela De Vil sequestra 99 filhotes de dálmata, os pais Pongo e Perdita se unem a outros animais para salvá-los.",
    thumbnail: "https://img.youtube.com/vi/eLdLSCOCGAo/maxresdefault.jpg",
    videoId: "eLdLSCOCGAo",
    category: "Animação",
    rating: "89% Relevante",
    duration: "1h 19m",
    featured: true,
    trending: false,
    type: "movie",
    species: "dog",
    genre: "adventure"
  },
  {
    title: "Cruella",
    description: "A história de origem da icônica vilã Cruela De Vil, uma jovem designer de moda determinada a se tornar uma lenda na cena londrina dos anos 70.",
    thumbnail: "https://img.youtube.com/vi/gmRKv7n2If8/maxresdefault.jpg",
    videoId: "gmRKv7n2If8",
    category: "Filmes",
    rating: "88% Relevante",
    duration: "2h 14m",
    featured: true,
    trending: true,
    type: "movie",
    species: "dog",
    genre: "drama"
  },
  {
    title: "Pets 2: A Vida Secreta dos Bichos 2",
    description: "Max e seus amigos estão de volta em novas aventuras: um fazendeiro corajoso, um gato ladrão e Snowball embarcam em missões separadas e divertidas.",
    thumbnail: "https://img.youtube.com/vi/lsm8FqgB4kA/maxresdefault.jpg",
    videoId: "lsm8FqgB4kA",
    category: "Animação",
    rating: "81% Relevante",
    duration: "1h 26m",
    featured: false,
    trending: false,
    type: "movie",
    species: "dog",
    genre: "comedy"
  },
  {
    title: "A Dama e o Vagabundo",
    description: "Lady, uma cocker spaniel de lar abastado, conhece o aventureiro Vagabundo. Juntos vivem uma história de amor inesquecível pelas ruas da cidade.",
    thumbnail: "https://img.youtube.com/vi/7a1ZEQgD4tU/maxresdefault.jpg",
    videoId: "7a1ZEQgD4tU",
    category: "Animação",
    rating: "86% Relevante",
    duration: "1h 16m",
    featured: false,
    trending: false,
    type: "movie",
    species: "dog",
    genre: "romance"
  },
  {
    title: "Patrulha Canina: O Filme",
    description: "Ryder e os filhotes da Patrulha Canina enfrentam seu maior desafio quando o prefeito corrupto Humdinger assume o controle de uma metrópole.",
    thumbnail: "https://img.youtube.com/vi/Fy0OTbAo-iA/maxresdefault.jpg",
    videoId: "Fy0OTbAo-iA",
    category: "Animação",
    rating: "82% Relevante",
    duration: "1h 28m",
    featured: true,
    trending: false,
    type: "movie",
    species: "dog",
    genre: "animation"
  },

  // Filmes Populares - Gatos
  {
    title: "Gato de Botas: O Último Desejo",
    description: "O Gato de Botas descobre que queimou oito de suas nove vidas e parte em uma épica busca pela lendária Última Estrela de Desejo para recuperá-las.",
    thumbnail: "https://img.youtube.com/vi/A9bKkBpQA5k/maxresdefault.jpg",
    videoId: "A9bKkBpQA5k",
    category: "Animação",
    rating: "98% Relevante",
    duration: "1h 42m",
    featured: true,
    trending: true,
    type: "movie",
    species: "cat",
    genre: "action"
  },
  {
    title: "Cats & Dogs",
    description: "Uma batalha secreta ocorre entre cães e gatos pelo domínio da Terra, com espiões, gadgets e planos mirabolantes para tomar o controle do mundo.",
    thumbnail: "https://img.youtube.com/vi/1r4bpXOULvM/maxresdefault.jpg",
    videoId: "1r4bpXOULvM",
    category: "Filmes",
    rating: "76% Relevante",
    duration: "1h 27m",
    featured: false,
    trending: false,
    type: "movie",
    species: "cat",
    genre: "comedy"
  },
  {
    title: "Uma Lição de Amor",
    description: "Um músico solitário aprende sobre amizade e propósito após adotar acidentalmente um gato de rua chamado Bob que transforma sua vida.",
    thumbnail: "https://img.youtube.com/vi/D8x9JFwHB18/maxresdefault.jpg",
    videoId: "D8x9JFwHB18",
    category: "Filmes",
    rating: "90% Relevante",
    duration: "1h 43m",
    featured: false,
    trending: true,
    type: "movie",
    species: "cat",
    genre: "drama"
  },
  {
    title: "Aristogatas",
    description: "Com a ajuda de um gato de rua, uma família de felinos parisienses deve escapar de um mordomo ciumento que os sequestrou para herdar uma fortuna.",
    thumbnail: "https://img.youtube.com/vi/QCHlEZBfBk8/maxresdefault.jpg",
    videoId: "QCHlEZBfBk8",
    category: "Animação",
    rating: "88% Relevante",
    duration: "1h 18m",
    featured: false,
    trending: false,
    type: "movie",
    species: "cat",
    genre: "adventure"
  },

  // Documentários
  {
    title: "Kedi: Gatos de Istambul",
    description: "Um documentário encantador sobre os milhares de gatos que perambulam pelas ruas de Istambul e as pessoas cujas vidas eles tocam profundamente.",
    thumbnail: "https://img.youtube.com/vi/ga2S86R7pkM/maxresdefault.jpg",
    videoId: "ga2S86R7pkM",
    category: "Documentários",
    rating: "96% Relevante",
    duration: "1h 19m",
    featured: false,
    trending: true,
    type: "doc",
    species: "cat",
    genre: "documentary"
  },
  {
    title: "O Mundo Animal: Felinos",
    description: "Série documental fascinante que explora a vida dos grandes felinos na natureza, revelando comportamentos surpreendentes e instintos primitivos.",
    thumbnail: "https://img.youtube.com/vi/ga2S86R7pkM/maxresdefault.jpg",
    videoId: "ga2S86R7pkM",
    category: "Documentários",
    rating: "93% Relevante",
    duration: "52m",
    featured: false,
    trending: false,
    type: "doc",
    species: "cat",
    genre: "documentary"
  },
  {
    title: "A Evolução dos Cães",
    description: "Documentário científico que revela como os lobos se tornaram os melhores amigos do homem ao longo de 15.000 anos de evolução compartilhada.",
    thumbnail: "https://img.youtube.com/vi/Ws-9ra38AlI/maxresdefault.jpg",
    videoId: "Ws-9ra38AlI",
    category: "Documentários",
    rating: "91% Relevante",
    duration: "1h 0m",
    featured: false,
    trending: false,
    type: "doc",
    species: "dog",
    genre: "documentary"
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

    const snapshot = await getDocs(contentRef);
    const existingTitles = new Set(snapshot.docs.map(d => d.data().title));

    const toInsert = force
      ? CURATED_CONTENT
      : CURATED_CONTENT.filter(item => !existingTitles.has(item.title));

    if (toInsert.length === 0) {
      console.log('ℹ️ Nenhum conteúdo novo para adicionar.');
      return;
    }

    const BATCH_LIMIT = 500;
    let batch = writeBatch(db);
    let batchCount = 0;

    for (let i = 0; i < toInsert.length; i++) {
      const item = toInsert[i];

      const contentData = {
        ...item,
        image: item.thumbnail,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = doc(contentRef);
      batch.set(docRef, contentData);
      batchCount++;

      if (batchCount >= BATCH_LIMIT || i === toInsert.length - 1) {
        await batch.commit();
        if (i < toInsert.length - 1) {
          batch = writeBatch(db);
          batchCount = 0;
        }
      }
    }

    console.log(`✅ ${toInsert.length} conteúdos adicionados com sucesso!`);

  } catch (error) {
    console.error('❌ Erro durante a população do banco de dados:', error);
    throw error;
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
