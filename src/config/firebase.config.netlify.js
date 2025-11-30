// Chaves de PRODUÇÃO (expostas no cliente; restrinja por HTTP referrer no GCP!)
window.__PETFLIX_KEYS = Object.assign({}, window.__PETFLIX_KEYS, {
  firebase: {
    apiKey: "AIzaSyAb_0r54B3fL3CmLukhuXYgtxfIpj9IgvU",
    authDomain: "petflix-de1c3.firebaseapp.com",
    databaseURL: "https://petflix-de1c3-default-rtdb.firebaseio.com",
    projectId: "petflix-de1c3",
    storageBucket: "petflix-de1c3.appspot.com",
    messagingSenderId: "863177295284",
    appId: "1:863177295284:web:SEU_APPID"
  },
  youtube: {
    apiKey: "AIzaSyAiqiAQ8rFDwxO4IwuRqO2mfTSsirA3fX4" // restrita a `https://flixpet.netlify.app/*`
  }
});









