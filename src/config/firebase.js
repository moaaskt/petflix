/**
 * Firebase Configuration - Configuração do Firebase usando compat mode
 */
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAb_0r54B3fL3CmLukhuXYgtxfIpj9IgvU",
  authDomain: "petflix-de1c3.firebaseapp.com",
  databaseURL: "https://petflix-de1c3-default-rtdb.firebaseio.com",
  projectId: "petflix-de1c3",
  storageBucket: "petflix-de1c3.appspot.com",
  messagingSenderId: "863177295284",
  appId: "1:863177295284:web:SEU_APPID"
};

let app;
let auth;
let database;
let db;

/**
 * Inicializa Firebase
 */
export async function initFirebase() {
  if (!app) {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    database = firebase.database();
    db = firebase.firestore();
    
    // Configura persistência LOCAL
    try {
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } catch (e) {
      console.warn('Persistência Auth falhou:', e);
    }
    
    console.log('✅ Firebase inicializado');
  }
  
  return { app, auth, database, db };
}

export { app, auth, database, db };

/**
 * Obtém instância do Auth
 */
export function getAuth() {
  if (!auth) {
    throw new Error('Firebase não foi inicializado. Chame initFirebase() primeiro.');
  }
  return auth;
}

/**
 * Obtém instância do Database
 */
export function getDatabase() {
  if (!database) {
    throw new Error('Firebase não foi inicializado. Chame initFirebase() primeiro.');
  }
  return database;
}

/**
 * Obtém instância do App
 */
export function getApp() {
  if (!app) {
    throw new Error('Firebase não foi inicializado. Chame initFirebase() primeiro.');
  }
  return app;
}

export default { initFirebase, getAuth, getDatabase, getApp };
