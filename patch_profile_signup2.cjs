const fs = require('fs');
let content = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

// Add db, doc, setDoc imports
if (!content.includes("from 'firebase/firestore'")) {
  content = content.replace(
    "import { auth } from '../lib/firebase';",
    "import { auth, db } from '../lib/firebase';\nimport { doc, setDoc } from 'firebase/firestore';"
  );
}

const newAuthLogic = `
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (authMode === 'register') {
      if (!username.trim()) {
        setAuthError('Username is required for registration.');
        return;
      }
      if (password !== confirmPassword) {
        setAuthError('Passwords do not match.');
        return;
      }
    }

    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName: username });
        const docRef = doc(db, 'users', userCred.user.uid);
        await setDoc(docRef, { displayName: username }, { merge: true });
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    }
  };
`;

// Replace the previous handleEmailAuth
const oldAuthLogicRegex = /const handleEmailAuth = async[^{]+{[^}]+}(?:[^}]+})*(?:\s*\} catch [^}]+\})?\s*};/m;
// I'll replace it more safely using indexOf
const authStart = content.indexOf('const handleEmailAuth');
const authEnd = content.indexOf('const handleGoogleLogin') - 1; // It's right before handleGoogleLogin

if (authStart !== -1 && authEnd !== -1) {
  content = content.substring(0, authStart) + newAuthLogic.trim() + "\n\n  " + content.substring(content.indexOf('const handleGoogleLogin'));
}

fs.writeFileSync('src/pages/Profile.tsx', content);
