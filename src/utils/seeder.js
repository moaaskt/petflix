
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
    },
    {
        title: "A Propósito de um Cão",
        description: "Um cão descobre o sentido de sua existência ao reencarnar em várias raças ao longo de décadas, sempre voltando ao garoto que o amou primeiro.",
        thumbnail: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=Ws-9ra38AlI",
        category: "movie",
        genre: "drama",
        species: "dog",
        featured: true,
        trending: true,
        rating: 4.8
    },
    {
        title: "Togo",
        description: "A história verídica e emocionante do cão Togo e seu treinador Leonhard Seppala, que lideraram a missão de salvamento mais perigosa da história do Alasca.",
        thumbnail: "https://images.unsplash.com/photo-1605897472359-85e4b94d685d?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=4NkELIOxAFA",
        category: "movie",
        genre: "adventure",
        species: "dog",
        featured: false,
        trending: true,
        rating: 4.9
    },
    {
        title: "Oito Abaixo de Zero",
        description: "Um guia de expedição é forçado a abandonar seus oito cães de trenó na Antártida. Determinados a sobreviver, os cães lutam pelos meses seguintes até o retorno de seu dono.",
        thumbnail: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=fF-u6OqXxSY",
        category: "movie",
        genre: "adventure",
        species: "dog",
        featured: true,
        trending: false,
        rating: 4.7
    },
    {
        title: "Turner & Hooch",
        description: "Um policial meticuloso e organizado precisa cuidar de um cão enorme e destruidor que é a única testemunha de um assassinato.",
        thumbnail: "https://images.unsplash.com/photo-1534361960057-19f4434a4428?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=FKxjpj4Ipz0",
        category: "movie",
        genre: "comedy",
        species: "dog",
        featured: false,
        trending: false,
        rating: 4.3
    },
    {
        title: "101 Dálmatas",
        description: "Quando a malvada Cruela De Vil sequestra 99 filhotes de dálmata para fazer um casaco de pele, os pais Pongo e Perdita se unem a outros animais para salvá-los.",
        thumbnail: "https://images.unsplash.com/photo-1583512603806-077998240c7a?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=eLdLSCOCGAo",
        category: "movie",
        genre: "adventure",
        species: "dog",
        featured: true,
        trending: false,
        rating: 4.6
    },
    {
        title: "A Dama e o Vagabundo",
        description: "Lady, uma cocker spaniel criada em lar abastado, conhece o aventureiro Vagabundo, um cão de rua sem dono. Juntos vivem uma história de amor inesquecível.",
        thumbnail: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=7a1ZEQgD4tU",
        category: "movie",
        genre: "romance",
        species: "dog",
        featured: false,
        trending: false,
        rating: 4.5
    },
    {
        title: "Isle of Dogs: Ilha dos Cachorros",
        description: "Quando os cães são banidos de uma cidade japonesa por decreto do prefeito, um menino de 12 anos cruza o mar em busca de seu fiel protetor.",
        thumbnail: "https://images.unsplash.com/photo-1508216310976-d05cef3f8ca8?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=dt__kig8PVU",
        category: "movie",
        genre: "animation",
        species: "dog",
        featured: true,
        trending: false,
        rating: 4.8
    },
    {
        title: "Frankenweenie",
        description: "Após a morte de seu cão Sparky, o jovem Victor Frankenstein usa experimentos científicos para trazê-lo de volta à vida, com resultados imprevisíveis.",
        thumbnail: "https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=bcrCpp6CXSQ",
        category: "movie",
        genre: "animation",
        species: "dog",
        featured: false,
        trending: false,
        rating: 4.4
    },
    {
        title: "Gato de Botas: O Último Desejo",
        description: "O Gato de Botas descobre que desperdiçou oito de suas nove vidas e parte em uma épica busca pela lendária Última Estrela de Desejo para recuperá-las.",
        thumbnail: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=A9bKkBpQA5k",
        category: "movie",
        genre: "action",
        species: "cat",
        featured: true,
        trending: true,
        original: true,
        rating: 4.9
    },
    {
        title: "A Viagem de Chihiro",
        description: "Uma menina de 10 anos se perde em um mundo espiritual mágico e precisa trabalhar num balneário para espíritos a fim de salvar seus pais transformados em porcos.",
        thumbnail: "https://images.unsplash.com/photo-1518791841217-8f162f1912da?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=ByXuk9QqQkk",
        category: "movie",
        genre: "animation",
        species: "cat",
        featured: false,
        trending: true,
        rating: 5.0
    },
    {
        title: "Kedi: Gatos de Istambul",
        description: "Um documentário encantador sobre os milhares de gatos que perambulam livremente pelas ruas de Istambul e as pessoas cujas vidas eles tocam.",
        thumbnail: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=ga2S86R7pkM",
        category: "doc",
        genre: "documentary",
        species: "cat",
        featured: false,
        trending: false,
        rating: 4.8
    },
    {
        title: "Cats & Dogs",
        description: "Uma batalha secreta ocorre entre cães e gatos pelo domínio da Terra. Com espiões, gadgets e planos mirabolantes, os felinos tentam tomar o controle do mundo.",
        thumbnail: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=1r4bpXOULvM",
        category: "movie",
        genre: "comedy",
        species: "cat",
        featured: false,
        trending: false,
        rating: 4.0
    },
    {
        title: "Cruella",
        description: "A história de origem da icônica vilã Cruela De Vil, uma jovem designer de moda determinada a se tornar uma lenda na cena da moda londrina dos anos 70.",
        thumbnail: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=gmRKv7n2If8",
        category: "movie",
        genre: "drama",
        species: "dog",
        featured: true,
        trending: true,
        rating: 4.6
    },
    {
        title: "Pets 2: A Vida Secreta dos Bichos 2",
        description: "Max e seus amigos estão de volta em novas aventuras: um fazendeiro corajoso, um gato ladrão e o fluffy Snowball embarcam em missões separadas e divertidas.",
        thumbnail: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=lsm8FqgB4kA",
        category: "movie",
        genre: "comedy",
        species: "dog",
        featured: false,
        trending: false,
        rating: 4.3
    },
    {
        title: "Uma Lição de Amor",
        description: "Um professor de inglês mal-humorado e solitário aprende sobre amizade e propósito após adotar acidentalmente um gato de rua chamado Bob.",
        thumbnail: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=D8x9JFwHB18",
        category: "movie",
        genre: "drama",
        species: "cat",
        featured: false,
        trending: true,
        rating: 4.7
    },
    {
        title: "Cão da Lua",
        description: "Série documental que acompanha equipes de resgate de animais ao redor do Brasil, mostrando histórias reais de cães e gatos que encontraram um lar.",
        thumbnail: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=Ws-9ra38AlI",
        category: "doc",
        genre: "documentary",
        species: "dog",
        featured: false,
        trending: false,
        original: true,
        rating: 4.6
    },
    {
        title: "Fafarazzi",
        description: "Série cômica em que um gato paparazzi infiltra-se nas mansões dos animais mais famosos do mundo para revelar seus maiores segredos.",
        thumbnail: "https://images.unsplash.com/photo-1615796153287-98eacf0abb13?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=T_l4hT2F0Fk",
        category: "series",
        genre: "comedy",
        species: "cat",
        featured: false,
        trending: true,
        original: true,
        rating: 4.4
    },
    {
        title: "Patrulha Canina: O Filme",
        description: "Ryder e os filhotes da Patrulha Canina enfrentam seu maior desafio quando o prefeito corrupto Humdinger assume o controle de uma metrópole e traz o caos.",
        thumbnail: "https://images.unsplash.com/photo-1558929996-da64ba858215?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=Fy0OTbAo-iA",
        category: "movie",
        genre: "animation",
        species: "dog",
        featured: true,
        trending: false,
        rating: 4.5
    },
    {
        title: "Cão Selvagem",
        description: "Documentário que mergulha no mundo dos lobos e a fascinante ligação evolutiva com os cães domésticos modernos, revelando os instintos que ainda vivem em todo pet.",
        thumbnail: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1080&q=80",
        videoUrl: "https://www.youtube.com/watch?v=Ws-9ra38AlI",
        category: "doc",
        genre: "documentary",
        species: "dog",
        featured: false,
        trending: false,
        rating: 4.5
    }
];

/**
 * Popula o banco de dados com filmes de teste
 * @returns {Promise<{success: boolean, added: number, message: string}>}
 */
export async function seedDatabase() {
    try {
        const contentCollection = collection(db, 'content');

        // Verifica títulos existentes para não duplicar
        const snapshot = await getDocs(contentCollection);
        const existingTitles = new Set(snapshot.docs.map(d => d.data().title));

        const batch = writeBatch(db);
        let count = 0;

        MOVIES.forEach(movie => {
            if (existingTitles.has(movie.title)) return; // pula duplicatas
            const docRef = doc(contentCollection);
            const videoId = movie.videoUrl ? movie.videoUrl.split('v=')[1]?.split('&')[0] : 'Ws-9ra38AlI';

            batch.set(docRef, {
                ...movie,
                image: movie.thumbnail,
                videoId: videoId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            count++;
        });

        if (count === 0) {
            return { success: true, added: 0, message: 'Nenhum conteúdo novo para adicionar.' };
        }
        await batch.commit();
        return { success: true, added: count, message: `${count} conteúdos adicionados com sucesso!` };

    } catch (error) {
        console.error('Erro ao popular banco:', error);
        return { success: false, error: error.message };
    }
}
