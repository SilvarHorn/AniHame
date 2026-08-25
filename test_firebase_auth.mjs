import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  projectId: "pacific-exchange-qc9s2",
  appId: "1:647584619616:web:d0c8a7379f16d08a07f705",
  apiKey: "AIzaSyAuic-GJpxDPGK6n7J2pwXXX8oLLIMEJ9U",
  authDomain: "pacific-exchange-qc9s2.firebaseapp.com",
  storageBucket: "pacific-exchange-qc9s2.firebasestorage.app",
  messagingSenderId: "647584619616"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function test() {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, "testuser1234567@example.com", "password123");
    console.log("Success!", userCred.user.uid);
  } catch(e) {
    console.error("Auth error:", e);
  }
  process.exit(0);
}
test();
