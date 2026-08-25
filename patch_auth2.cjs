const fs = require('fs');

let content = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

// Update UserProfile interface
content = content.replace(
  "  photoURL: string | null;\n  preferences: UserPreferences;\n}",
  "  photoURL: string | null;\n  bio?: string;\n  themeColor?: string;\n  bgGradient?: string;\n  preferences: UserPreferences;\n}"
);

// Update AuthContextType interface
content = content.replace(
  "  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;\n}",
  "  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;\n  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;\n}"
);

// Update Context default value
content = content.replace(
  "  updatePreferences: async () => {},\n});",
  "  updatePreferences: async () => {},\n  updateProfileData: async () => {},\n});"
);

// Add updateProfileData function
const updateProfileDataFunc = `
  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!currentUser || !profile) return;
    const docRef = doc(db, 'users', currentUser.uid);
    await setDoc(docRef, data, { merge: true });
  };
`;
content = content.replace(
  "  const updatePreferences = async",
  updateProfileDataFunc + "\n  const updatePreferences = async"
);

// Update the Provider value
content = content.replace(
  "value={{ currentUser, profile, loading, updatePreferences }}",
  "value={{ currentUser, profile, loading, updatePreferences, updateProfileData }}"
);

fs.writeFileSync('src/contexts/AuthContext.tsx', content);
