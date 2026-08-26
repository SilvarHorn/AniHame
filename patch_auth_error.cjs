const fs = require('fs');
let content = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

// Add import
content = content.replace(
  "import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';",
  "import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';\nimport { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';"
);

// Update getDoc
content = content.replace(
  `        } catch (error) {
          console.error("Error fetching user profile:", error);
        }`,
  `        } catch (error: any) {
          if (error?.message?.includes('offline')) {
            console.error("Firebase is offline. Check database ID config.");
          } else {
            handleFirestoreError(error, OperationType.GET, 'users/' + user.uid);
          }
        }`
);

// Update updateDoc for profile data
content = content.replace(
  `    try {
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }`,
  `    try {
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users/' + currentUser.uid);
    }`
);

// Update updateDoc for preferences
content = content.replace(
  `    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const currentPrefs = profile?.preferences || defaultPreferences;
      await updateDoc(docRef, {
        preferences: { ...currentPrefs, ...newPrefs }
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
    }`,
  `    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const currentPrefs = profile?.preferences || defaultPreferences;
      await updateDoc(docRef, {
        preferences: { ...currentPrefs, ...newPrefs }
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users/' + currentUser.uid);
    }`
);

fs.writeFileSync('src/contexts/AuthContext.tsx', content);
console.log('patched context error handler');
