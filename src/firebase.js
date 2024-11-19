import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBCkzMC3CqbosQrqFj5ntArtEss90dLqoM",
    authDomain: "nodeuserdataproject.firebaseapp.com",
    projectId: "nodeuserdataproject",
    storageBucket: "nodeuserdataproject.firebasestorage.app",
    messagingSenderId: "143368158691",
    appId: "1:143368158691:web:e4e504e5dfd9c2615bb4d6",
    measurementId: "G-BNH0JRSK18"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore();

export { db, auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, signOut };