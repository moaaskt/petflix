import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAb_0r54B3fL3CmLukhuXYgtxfIpj9IgvU',
  authDomain: 'petflix-de1c3.firebaseapp.com',
  projectId: 'petflix-de1c3',
  storageBucket: 'petflix-de1c3.appspot.com',
  messagingSenderId: '863177295284',
  appId: '1:863177295284:web:SEU_APPID'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { collection };

export async function setupAuthPersistence() {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (e) {
    console.warn('Persistência Auth (local) falhou:', e);
  }
}

export default { app, auth, db };
