const fs = require('fs');
let content = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

// Change setDoc(docRef, initialProfile) to setDoc(docRef, initialProfile, { merge: true })
content = content.replace(
  'await setDoc(docRef, initialProfile);',
  'await setDoc(docRef, initialProfile, { merge: true });'
);

fs.writeFileSync('src/contexts/AuthContext.tsx', content);
