import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDX9IXYznJTNUc4-w90Cwogh6rqNixOMCA",
  authDomain: "anihame.firebaseapp.com",
  projectId: "anihame",
  storageBucket: "anihame.firebasestorage.app",
  messagingSenderId: "553195568550",
  appId: "1:553195568550:web:066c2c63cbc842f3f1e367"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
