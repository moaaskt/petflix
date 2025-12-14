/**
 * Dashboard Service - Serviço para estatísticas do Dashboard Admin
 */
import { db } from '../../config/firebase.js';
import { collection, getDocs, getCountFromServer, query, where } from 'firebase/firestore';

/**
 * Obtém estatísticas do dashboard
 * @returns {Promise<Object>} Objeto com estatísticas do sistema
 */
export async function getDashboardStats() {
  try {
    // Contagem total de usuários
    const usersRef = collection(db, 'users');
    const usersCountSnapshot = await getCountFromServer(usersRef);
    const totalUsers = usersCountSnapshot.data().count;

    // Contagem total de conteúdo
    const contentRef = collection(db, 'content');
    const contentCountSnapshot = await getCountFromServer(contentRef);
    const totalContent = contentCountSnapshot.data().count;

    // Busca todos os documentos de content para fazer agregações
    const contentSnapshot = await getDocs(contentRef);
    
    // Inicializa contadores
    const contentBySpecies = {
      dog: 0,
      cat: 0
    };
    
    const contentByCategory = {
      movie: 0,
      series: 0,
      doc: 0
    };

    // Itera sobre os documentos para contar por espécie e categoria
    contentSnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Conta por espécie
      if (data.species === 'dog') {
        contentBySpecies.dog++;
      } else if (data.species === 'cat') {
        contentBySpecies.cat++;
      }
      
      // Conta por categoria (type)
      if (data.type === 'movie') {
        contentByCategory.movie++;
      } else if (data.type === 'series') {
        contentByCategory.series++;
      } else if (data.type === 'doc') {
        contentByCategory.doc++;
      }
    });

    // Status do servidor (hardcoded por enquanto)
    const serverStatus = 'Online';

    return {
      totalUsers,
      totalContent,
      contentBySpecies,
      contentByCategory,
      serverStatus
    };
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas do dashboard:', error);
    
    // Retorna valores padrão em caso de erro
    return {
      totalUsers: 0,
      totalContent: 0,
      contentBySpecies: {
        dog: 0,
        cat: 0
      },
      contentByCategory: {
        movie: 0,
        series: 0,
        doc: 0
      },
      serverStatus: 'Offline'
    };
  }
}

export default {
  getDashboardStats
};
