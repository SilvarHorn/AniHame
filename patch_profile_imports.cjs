const fs = require('fs');
let content = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

if (!content.includes('import { doc, setDoc }')) {
  content = content.replace(
    "import { auth, googleProvider } from '../lib/firebase';",
    "import { auth, googleProvider, db } from '../lib/firebase';\nimport { doc, setDoc } from 'firebase/firestore';"
  );
}

if (!content.includes('updateProfile')) {
  content = content.replace(
    "import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';",
    "import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';"
  );
}

fs.writeFileSync('src/pages/Profile.tsx', content);
