const fs = require('fs');

let content = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

const newUseEffect = `
  useEffect(() => {
    let unsubDoc: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        
        try {
          const docSnap = await getDoc(docRef);
          
          if (!docSnap.exists()) {
            const initialProfile: UserProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              preferences: defaultPreferences
            };
            await setDoc(docRef, initialProfile);
            setProfile(initialProfile);
          }
          
          if (unsubDoc) unsubDoc();
          
          unsubDoc = onSnapshot(docRef, (snap) => {
            if (snap.exists()) {
              setProfile(snap.data() as UserProfile);
            }
          }, (err) => {
            console.error("Snapshot error ignored:", err);
          });
          
        } catch (e) {
          console.error("Auth context error:", e);
        }
        
        setLoading(false);
      } else {
        setProfile(null);
        setLoading(false);
        if (unsubDoc) {
          unsubDoc();
          unsubDoc = undefined;
        }
      }
    });

    return () => {
      unsubscribe();
      if (unsubDoc) unsubDoc();
    };
  }, []);
`;

content = content.replace(
  /  useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/,
  newUseEffect.trim()
);

fs.writeFileSync('src/contexts/AuthContext.tsx', content);
