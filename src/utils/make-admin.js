/**
 * Make Admin Utility - Script utilitário para promover usuários a Administrador
 * 
 * Uso:
 *   import { setAdminRole } from './utils/make-admin.js';
 *   await setAdminRole('email@exemplo.com');
 */
import { db, auth } from '../config/firebase.js';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

/**
 * Promove um usuário a Administrador baseado no email
 * @param {string} targetEmail - Email do usuário a ser promovido
 * @returns {Promise<void>}
 */
export async function setAdminRole(targetEmail) {
  try {
    if (!targetEmail || typeof targetEmail !== 'string' || !targetEmail.includes('@')) {
      throw new Error('Email inválido fornecido');
    }

    // Verifica se o usuário está logado e se o email bate com o targetEmail
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.email === targetEmail) {
      // Usuário está logado e o email bate - usa o uid diretamente
      const userRef = doc(db, 'users', currentUser.uid);
      
      // Usa setDoc com merge: true para criar o documento se não existir
      await setDoc(userRef, {
        email: targetEmail,
        role: 'admin'
      }, { merge: true });

      console.log(`👑 Usuário [${targetEmail}] agora é um Administrador!`);
      console.log(`📝 Document ID: ${currentUser.uid}`);
      return;
    }

    // Fallback: Busca usuário na coleção 'users' pelo email (se não estiver logado ou email não bater)
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', targetEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error(`❌ Usuário com email "${targetEmail}" não encontrado no Firestore.`);
      console.warn('💡 Verifique se o usuário já fez cadastro e se o email está correto.');
      console.warn('💡 Dica: Se o usuário existe no Firebase Auth mas não no Firestore, faça login com esse email primeiro.');
      return;
    }

    // Atualiza o documento encontrado usando setDoc com merge
    // Nota: getDocs pode retornar múltiplos documentos se houver duplicatas (não deveria acontecer)
    // Vamos atualizar apenas o primeiro encontrado
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, 'users', userDoc.id);
    
    await setDoc(userRef, {
      email: targetEmail,
      role: 'admin'
    }, { merge: true });

    console.log(`👑 Usuário [${targetEmail}] agora é um Administrador!`);
    console.log(`📝 Document ID: ${userDoc.id}`);
    
  } catch (error) {
    console.error('❌ Erro ao promover usuário a administrador:', error);
    throw error;
  }
}

export default {
  setAdminRole
};
