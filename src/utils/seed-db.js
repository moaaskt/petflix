/**
 * Script de Seed para popular o Firestore com dados mockados
 * Este script verifica se a coleção 'content' está vazia e popula com dados do ALL_CONTENT
 */
import { db, collection } from '../config/firebase.js';
import { getDocs, addDoc } from 'firebase/firestore';
import { ALL_CONTENT } from '../services/content.service.js';

/**
 * Semeia o banco de dados com os dados mockados
 * @returns {Promise<void>}
 */
export async function seedDatabase() {
  try {

    const contentRef = collection(db, 'content');
    
    // Verifica se a coleção já possui dados
    const snapshot = await getDocs(contentRef);
    
    if (!snapshot.empty) {
      return;
    }


    // Loop através do ALL_CONTENT e adiciona cada item ao Firestore
    for (const movie of ALL_CONTENT) {
      try {
        await addDoc(contentRef, movie);
      } catch (error) {
        console.error(`❌ Erro ao salvar filme "${movie.title}":`, error);
      }
    }

  } catch (error) {
    console.error('❌ Erro durante a migração do banco de dados:', error);
    // Não lança o erro para não quebrar a aplicação caso o Firebase esteja offline
    console.warn('⚠️ A aplicação continuará funcionando, mas os dados podem não estar disponíveis.');
  }
}

