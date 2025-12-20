
import { db } from '../config/firebase.js';
import { collection, addDoc, getDocs, writeBatch, doc } from 'firebase/firestore';

const MOVIES = [
    {
        title: "Pets: A Vida Secreta dos Bichos",
        description: "A vida tranquila de Max como cão favorito vira de cabeça para baixo quando sua dona traz para casa um vira-lata desleixado chamado Duke.",
        thumbnail: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=i-80SGWfEjM",
        category: "movie",
        genre: "comedy",
        species: "dog",
        featured: true,
        rating: 4.8
    },
    {
        title: "Marley & Eu",
        description: "Uma família aprende lições importantes de vida com seu adorável, mas desobediente e neurótico cachorro.",
        thumbnail: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=SOGO3X4b9G0",
        category: "movie",
        genre: "drama",
        species: "dog",
        featured: false,
        rating: 4.9
    },
    {
        title: "DC Liga dos Superpets",
        description: "Krypto, o Supercão, e Superman são melhores amigos inseparáveis, compartilhando os mesmos superpoderes e lutando contra o crime em Metrópolis lado a lado.",
        thumbnail: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=1jkw2JPCl18",
        category: "movie",
        genre: "action",
        species: "dog",
        featured: true,
        rating: 4.5
    },
    {
        title: "Garfield: O Filme",
        description: "O gato gordo favorito de todos, Garfield, passa seu tempo cochilando, comendo lasanha e aprontando, até que seu dono Jon se apaixona por uma veterinária.",
        thumbnail: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=Ym322S93c8M",
        category: "movie",
        genre: "comedy",
        species: "cat",
        featured: true,
        rating: 4.2
    },
    {
        title: "O Rei Leão",
        description: "A jornada de Simba, um jovem leão que deve assumir seu lugar como rei da Pedra do Reino após a trágica morte de seu pai.",
        thumbnail: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=7TavVZMewpY",
        category: "movie",
        genre: "drama",
        species: "cat", // Close enough to a cat for this context? Or just 'cat' theme.
        featured: true,
        rating: 5.0
    },
    {
        title: "Aristogatas",
        description: "Com a ajuda de um gato de rua, uma família de felinos parisienses criada para herdar uma fortuna deve escapar de um mordomo ciumento que os sequestrou.",
        thumbnail: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=7TavVZMewpY",
        category: "movie",
        genre: "adventure",
        species: "cat",
        featured: false,
        rating: 4.6
    },
    {
        title: "Sempre ao Seu Lado",
        description: "Um professor universitário cria um laço duradouro com um cão que encontra na estação de trem, um laço que dura muito além de sua vida.",
        thumbnail: "https://images.unsplash.com/photo-1588269845464-899356434867?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=T_l4hT2F0Fk",
        category: "movie",
        genre: "drama",
        species: "dog",
        featured: false,
        rating: 4.9
    },
    {
        title: "Beethoven: O Magnífico",
        description: "Um cachorro de São Bernardo gigante traz muita alegria e confusão para a família Newton.",
        thumbnail: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=T_l4hT2F0Fk",
        category: "movie",
        genre: "comedy",
        species: "dog",
        featured: false,
        rating: 4.3
    },
    {
        title: "Bolt: Supercão",
        description: "O astro canino de um programa de ação e ficção científica acredita que seus poderes são reais e embarca em uma missão pelo país para salvar sua dona.",
        thumbnail: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=T_l4hT2F0Fk",
        category: "movie",
        genre: "adventure",
        species: "dog",
        featured: false,
        rating: 4.5
    },
    {
        title: "Gato de Botas",
        description: "Uma história de aventura sobre o Gato de Botas enquanto ele se une a Humpty Dumpty e Kitty Pata Mansa para roubar o famoso Ganso que põe ovos de ouro.",
        thumbnail: "https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=T_l4hT2F0Fk",
        category: "movie",
        genre: "action",
        species: "cat",
        featured: true,
        rating: 4.7
    },
    {
        title: "Planeta Animal",
        description: "Uma série documental fascinante explorando a vida selvagem ao redor do mundo, com foco especial nos felinos e canídeos da natureza.",
        thumbnail: "https://images.unsplash.com/photo-1472491235688-bdc81a63246e?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=T_l4hT2F0Fk",
        category: "doc",
        genre: "documentary",
        species: "cat",
        featured: false,
        rating: 4.8
    },
    {
        title: "A Jornada",
        description: "Um documentário emocionante sobre a evolução dos cães domesticados e sua parceria histórica com os humanos.",
        thumbnail: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=T_l4hT2F0Fk",
        category: "doc",
        genre: "documentary",
        species: "dog",
        featured: false,
        rating: 4.7
    },
    {
        title: "K-9: Um Policial Bom Pra Cachorro",
        description: "Um policial extravagante recebe um parceiro improvável: um pastor alemão altamente treinado e inteligente.",
        thumbnail: "https://images.unsplash.com/photo-1558929996-da64ba858215?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=T_l4hT2F0Fk",
        category: "movie",
        genre: "action",
        species: "dog",
        featured: false,
        rating: 4.4
    },
    {
        title: "Keanu: Cadê Meu Gato?",
        description: "Dois amigos tramam um plano para recuperar um gatinho roubado, infiltrando-se em uma gangue de rua perigosa.",
        thumbnail: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=T_l4hT2F0Fk",
        category: "movie",
        genre: "comedy",
        species: "cat",
        featured: false,
        rating: 4.1
    },
    {
        title: "Cães de Aluguel",
        description: "Uma série dramática (apenas o nome é similar!) sobre um grupo de cães de rua que formam uma família improvável.",
        thumbnail: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=T_l4hT2F0Fk",
        category: "series",
        genre: "drama",
        species: "dog",
        featured: false,
        rating: 4.6
    },
    {
        title: "Diário de um Gato",
        description: "Série animada que narra o dia a dia sob a perspectiva cínica e divertida de um gato doméstico mimado.",
        thumbnail: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=T_l4hT2F0Fk",
        category: "series",
        genre: "comedy",
        species: "cat",
        featured: false,
        rating: 4.7
    }
];

/**
 * Popula o banco de dados com filmes de teste
 * @returns {Promise<{success: boolean, added: number, message: string}>}
 */
export async function seedDatabase() {
    try {
        const moviesCollection = collection(db, 'movies');

        // Opcional: Limpar coleção existente (CUIDADO EM PRODUÇÃO!)
        // Para simplificar e evitar muitas leituras/escritas, vamos apenas adicionar
        // Se quiser limpar: buscar todos docs e deletar em batch.

        // Vamos verificar se já existem filmes para não duplicar excessivamente
        const snapshot = await getDocs(moviesCollection);
        if (!snapshot.empty && snapshot.size > 5) {
            console.log('Banco já parece populado. Pulando seed massivo.');
            return { success: true, added: 0, message: 'Banco já populado' };
        }

        const batch = writeBatch(db);
        let count = 0;

        MOVIES.forEach(movie => {
            const docRef = doc(moviesCollection); // Gera ID automático
            batch.set(docRef, {
                ...movie,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            count++;
        });

        await batch.commit();
        console.log(`Sucesso! ${count} filmes adicionados.`);
        return { success: true, added: count, message: `${count} filmes adicionados com sucesso!` };

    } catch (error) {
        console.error('Erro ao popular banco:', error);
        return { success: false, error: error.message };
    }
}
