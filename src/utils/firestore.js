import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyAEX4CAtOpMci3Z7tQPZIbBkit1eQEENt0",
    authDomain: "menugallego-4c37b.firebaseapp.com",
    projectId: "menugallego-4c37b",
    storageBucket: "menugallego-4c37b.appspot.com",
    messagingSenderId: "925471762811",
    appId: "1:925471762811:web:5f5bc93fb80a5727dfb5de"
  };
// Inicializa o Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
export { db };