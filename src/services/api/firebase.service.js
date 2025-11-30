/**
 * Firebase Service - Serviço para interagir com Firestore
 * Usando Firebase v9 Modular
 */
import { db } from '../../config/firebase.js';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { ServiceError } from '../../utils/helpers/errors.js';

class FirebaseService {
  /**
   * Verifica se o database está disponível
   * @returns {boolean} True se disponível
   */
  isAvailable() {
    return db !== null && db !== undefined;
  }

  /**
   * Salva dados no Firestore
   * @param {string} path - Caminho no database (ex: 'users/123')
   * @param {Object} data - Dados a salvar
   * @returns {Promise<void>}
   */
  async set(path, data) {
    if (!this.isAvailable()) {
      throw new ServiceError('Firebase Database não está disponível');
    }

    try {
      const pathParts = path.split('/');
      if (pathParts.length !== 2) {
        throw new ServiceError('Caminho inválido. Use formato: collection/document');
      }

      const [collection, documentId] = pathParts;
      await setDoc(doc(db, collection, documentId), {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw new ServiceError('Erro ao salvar dados no Firebase', error);
    }
  }

  /**
   * Obtém dados do Firestore
   * @param {string} path - Caminho no database (ex: 'users/123')
   * @returns {Promise<Object|null>} Dados obtidos ou null se não existir
   */
  async get(path) {
    if (!this.isAvailable()) {
      throw new ServiceError('Firebase Database não está disponível');
    }

    try {
      const pathParts = path.split('/');
      if (pathParts.length !== 2) {
        throw new ServiceError('Caminho inválido. Use formato: collection/document');
      }

      const [collection, documentId] = pathParts;
      const docRef = doc(db, collection, documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      throw new ServiceError('Erro ao obter dados do Firebase', error);
    }
  }

  /**
   * Atualiza dados no Firestore
   * @param {string} path - Caminho no database (ex: 'users/123')
   * @param {Object} updates - Dados a atualizar
   * @returns {Promise<void>}
   */
  async update(path, updates) {
    if (!this.isAvailable()) {
      throw new ServiceError('Firebase Database não está disponível');
    }

    try {
      const pathParts = path.split('/');
      if (pathParts.length !== 2) {
        throw new ServiceError('Caminho inválido. Use formato: collection/document');
      }

      const [collection, documentId] = pathParts;
      await updateDoc(doc(db, collection, documentId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw new ServiceError('Erro ao atualizar dados no Firebase', error);
    }
  }

  /**
   * Remove dados do Firestore
   * @param {string} path - Caminho no database (ex: 'users/123')
   * @returns {Promise<void>}
   */
  async remove(path) {
    if (!this.isAvailable()) {
      throw new ServiceError('Firebase Database não está disponível');
    }

    try {
      const pathParts = path.split('/');
      if (pathParts.length !== 2) {
        throw new ServiceError('Caminho inválido. Use formato: collection/document');
      }

      const [collection, documentId] = pathParts;
      await deleteDoc(doc(db, collection, documentId));
    } catch (error) {
      throw new ServiceError('Erro ao remover dados do Firebase', error);
    }
  }
}

export const firebaseService = new FirebaseService();
