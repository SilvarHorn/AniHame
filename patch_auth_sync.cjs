const fs = require('fs');

let content = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

// Inside onSnapshot, when we setProfile, we should also sync to localStorage
const syncStr = `
            if (snap.exists()) {
              const data = snap.data() as UserProfile;
              setProfile(data);
              // Sync to local storage for Layout.tsx to pick up theme
              try {
                const localData = {
                  username: data.displayName || 'User',
                  avatar: data.photoURL || '',
                  themeColor: data.themeColor || '#8AD7D0',
                  bgGradient: data.bgGradient || ''
                };
                localStorage.setItem('anime_profile', JSON.stringify(localData));
                window.dispatchEvent(new Event('profile-updated'));
              } catch(e) {}
            }
`;

content = content.replace(
  /            if \(snap\.exists\(\)\) \{\n              setProfile\(snap\.data\(\) as UserProfile\);\n            \}/,
  syncStr.trim()
);

fs.writeFileSync('src/contexts/AuthContext.tsx', content);
