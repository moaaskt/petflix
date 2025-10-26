/* JS/firebase-config.js */
(function () {
  if (window._petflixFirebaseReady) return;

  const firebaseConfig = window.__FIREBASE_CONFIG__ || {
    apiKey: "SUA_API_KEY_ATUAL",
    authDomain: "petflix-de1c3.firebaseapp.com",
    databaseURL: "https://petflix-de1c3-default-rtdb.firebaseio.com",
    projectId: "petflix-de1c3",
    storageBucket: "petflix-de1c3.appspot.com",
    messagingSenderId: "XXXX",
    appId: "1:XXXX:web:YYYY"
  };

  const app = firebase.initializeApp(firebaseConfig);
  window.firebaseApp = app;
  window.auth = firebase.auth();
  window.db = firebase.database ? firebase.database() : null;
  window._petflixFirebaseReady = true;
})();