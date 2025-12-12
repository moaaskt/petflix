import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';

// Carrega variáveis de ambiente
// IMPORTANTE: Todas as variáveis devem estar configuradas no arquivo .env (desenvolvimento) 
// e no painel da Vercel (produção)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validação: verifica se todas as variáveis de ambiente necessárias estão configuradas
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(
  varName => !import.meta.env[varName] || import.meta.env[varName].trim() === ''
);

if (missingVars.length > 0) {
  const envType = import.meta.env.PROD ? 'produção (Vercel)' : 'desenvolvimento (.env)';
  const errorMessage = `❌ Variáveis de ambiente do Firebase faltando em ${envType}: ${missingVars.join(', ')}.\n` +
    `📝 ${import.meta.env.PROD 
      ? 'Configure as variáveis de ambiente no painel da Vercel (Settings > Environment Variables) antes do deploy.' 
      : 'Crie um arquivo .env na raiz do projeto baseado no .env.example e preencha com suas credenciais do Firebase.'}`;
  console.error(errorMessage);
  throw new Error(errorMessage);
}

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
