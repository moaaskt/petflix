/**
 * Script de Seed para popular o Firestore com dados mockados
 * Este script verifica se a coleção 'movies' está vazia e popula com dados do ALL_CONTENT
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
    console.log('🌱 Iniciando migração de dados para o Firestore...');

    const moviesRef = collection(db, 'movies');
    
    // Verifica se a coleção já possui dados
    const snapshot = await getDocs(moviesRef);
    
    if (!snapshot.empty) {
      console.log('✅ Banco de dados já populado. Pulando migração.');
      return;
    }

    console.log('📦 Banco vazio detectado. Iniciando upload dos dados...');

    // Loop através do ALL_CONTENT e adiciona cada item ao Firestore
    for (const movie of ALL_CONTENT) {
      try {
        await addDoc(moviesRef, movie);
        console.log(`✅ Filme "${movie.title}" salvo com sucesso!`);
      } catch (error) {
        console.error(`❌ Erro ao salvar filme "${movie.title}":`, error);
      }
    }

    console.log('🎉 Migração concluída! Total de filmes migrados:', ALL_CONTENT.length);
  } catch (error) {
    console.error('❌ Erro durante a migração do banco de dados:', error);
    // Não lança o erro para não quebrar a aplicação caso o Firebase esteja offline
    console.warn('⚠️ A aplicação continuará funcionando, mas os dados podem não estar disponíveis.');
  }
}

