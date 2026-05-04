import { db } from '../config/firebase.js';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { authService } from './auth/auth.service.js';

/**
 * RatingService - Gerencia as avaliações de conteúdo
 */
export const ratingService = {
  /**
   * Salva uma avaliação para um conteúdo
   * @param {string} contentId - ID do conteúdo (filme/série)
   * @param {number} rating - Avaliação de 1 a 5
   */
  async saveRating(contentId, rating) {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const profileId = localStorage.getItem('petflix_selected_profile_id');
    if (!profileId) throw new Error('Nenhum perfil selecionado');

    try {
      const ratingRef = doc(db, 'users', user.uid, 'profiles', profileId, 'ratings', contentId);
      await setDoc(ratingRef, {
        rating,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      throw error;
    }
  },

  /**
   * Obtém a avaliação de um conteúdo para o perfil atual
   * @param {string} contentId - ID do conteúdo
   */
  async getRating(contentId) {
    const user = authService.getCurrentUser();
    if (!user) return null;

    const profileId = localStorage.getItem('petflix_selected_profile_id');
    if (!profileId) return null;

    try {
      const ratingRef = doc(db, 'users', user.uid, 'profiles', profileId, 'ratings', contentId);
      const docSnap = await getDoc(ratingRef);
      
      if (docSnap.exists()) {
        return docSnap.data().rating;
      }
      return 0;
    } catch (error) {
      console.error('Erro ao obter avaliação:', error);
      return 0;
    }
  }
};
