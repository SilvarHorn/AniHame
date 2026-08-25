import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "pacific-exchange-qc9s2",
  appId: "1:647584619616:web:d0c8a7379f16d08a07f705",
  apiKey: "AIzaSyAuic-GJpxDPGK6n7J2pwXXX8oLLIMEJ9U",
  authDomain: "pacific-exchange-qc9s2.firebaseapp.com",
  storageBucket: "pacific-exchange-qc9s2.firebasestorage.app",
  messagingSenderId: "647584619616"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-d6342aa4-f89b-419f-8ee8-a301819a9e22");
export const googleProvider = new GoogleAuthProvider();
