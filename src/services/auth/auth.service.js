/**
 * Auth Service - Serviço de autenticação Firebase v9 Modular
 */
import { auth } from '../../config/firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail as firebaseSendPasswordResetEmail, 
  sendEmailVerification, 
  onAuthStateChanged 
} from "firebase/auth";
import { db } from '../../config/firebase.js';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { AuthError, ServiceError } from '../../utils/helpers/errors.js';
import { getFirebaseAuthErrorMessage } from '../../utils/helpers/errors.js';

class AuthService {
  /**
   * Faz login com email e senha
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<Object>} Dados do usuário
   */
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verifica se o email foi verificado
      if (!user.emailVerified) {
        await firebaseSignOut(auth);
        throw new AuthError('Por favor, verifique seu e-mail antes de fazer login. Enviamos um link de confirmação para seu e-mail.', 'email-not-verified');
      }

      return userCredential;
    } catch (error) {
      const message = getFirebaseAuthErrorMessage(error);
      throw new AuthError(message, error.code);
    }
  }

  /**
   * Cria nova conta
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @param {string} name - Nome do usuário
   * @returns {Promise<Object>} Dados do usuário
   */
  async signUp(email, password, name) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Envia email de verificação
      await sendEmailVerification(user);

      // Salva informações adicionais no Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          name: name,
          email: email,
          createdAt: serverTimestamp(),
          emailVerified: false
        });
      } catch (dbError) {
        console.warn('Erro ao salvar dados do usuário no Firestore:', dbError);
        // Não bloqueia o registro se falhar ao salvar no Firestore
      }

      return user;
    } catch (error) {
      const message = getFirebaseAuthErrorMessage(error);
      throw new AuthError(message, error.code);
    }
  }

  /**
   * Faz logout
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      throw new ServiceError('Erro ao fazer logout', error);
    }
  }

  /**
   * Envia email de recuperação de senha
   * @param {string} email - Email do usuário
   * @returns {Promise<void>}
   */
  async sendPasswordResetEmail(email) {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (error) {
      const message = getFirebaseAuthErrorMessage(error);
      throw new AuthError(message, error.code);
    }
  }

  /**
   * Reenvia email de verificação
   * @returns {Promise<void>}
   */
  async resendVerificationEmail() {
    const user = auth.currentUser;
    if (!user) {
      throw new AuthError('Nenhum usuário logado encontrado');
    }

    try {
      await sendEmailVerification(user);
    } catch (error) {
      const message = getFirebaseAuthErrorMessage(error);
      throw new AuthError(message, error.code);
    }
  }

  /**
   * Obtém usuário atual
   * @returns {Object|null} Usuário atual ou null
   */
  getCurrentUser() {
    return auth.currentUser;
  }

  /**
   * Observa mudanças no estado de autenticação
   * @param {Function} callback - Callback a ser chamado
   * @returns {Function} Função para cancelar o observer
   */
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }
}

export const authService = new AuthService();
