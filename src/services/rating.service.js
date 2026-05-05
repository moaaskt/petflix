import { db } from '../config/firebase.js';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { authService } from './auth/auth.service.js';

// Cache local para evitar múltiplas leituras ao Firestore
let ratingsCache = {};
let lastProfileId = null;

/**
 * RatingService - Gerencia as avaliações de conteúdo
 */
export const ratingService = {
  /**
   * Salva uma avaliação para um conteúdo
   */
  async saveRating(contentId, rating) {
    const user = authService.getCurrentUser();
    if (!user) return;

    const profileId = localStorage.getItem('petflix_selected_profile_id');
    if (!profileId) return;

    try {
      const ratingRef = doc(db, 'users', user.uid, 'profiles', profileId, 'ratings', contentId);
      await setDoc(ratingRef, {
        rating,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      // Atualiza o cache local
      ratingsCache[contentId] = rating;
      return true;
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
    }
  },

  /**
   * Obtém a avaliação de um conteúdo (usa cache se disponível)
   */
  async getRating(contentId) {
    const profileId = localStorage.getItem('petflix_selected_profile_id');
    
    // Se mudou o perfil, limpa o cache
    if (profileId !== lastProfileId) {
      ratingsCache = {};
      lastProfileId = profileId;
    }

    // Se já temos no cache, retorna
    if (ratingsCache[contentId] !== undefined) {
      return ratingsCache[contentId];
    }

    const user = authService.getCurrentUser();
    if (!user || !profileId) return 0;

    try {
      const ratingRef = doc(db, 'users', user.uid, 'profiles', profileId, 'ratings', contentId);
      const docSnap = await getDoc(ratingRef);
      
      const rating = docSnap.exists() ? docSnap.data().rating : 0;
      ratingsCache[contentId] = rating;
      return rating;
    } catch (error) {
      return 0;
    }
  },

  /**
   * Carrega todas as avaliações do perfil de uma vez (opcional para otimização)
   */
  async preloadRatings() {
    const user = authService.getCurrentUser();
    const profileId = localStorage.getItem('petflix_selected_profile_id');
    if (!user || !profileId) return;

    try {
      const ratingsRef = collection(db, 'users', user.uid, 'profiles', profileId, 'ratings');
      const snapshot = await getDocs(ratingsRef);
      const newCache = {};
      snapshot.forEach(doc => {
        newCache[doc.id] = doc.data().rating;
      });
      ratingsCache = newCache;
      lastProfileId = profileId;
    } catch (error) {
      console.error('Erro ao pre-carregar avaliações:', error);
    }
  }
};
