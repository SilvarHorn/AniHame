const fs = require('fs');
let content = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

// 1. Add states and updateProfile import
content = content.replace(
  "import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';",
  "import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';"
);

content = content.replace(
  "  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');",
  "  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n  const [username, setUsername] = useState('');\n  const [confirmPassword, setConfirmPassword] = useState('');"
);

// 2. Update handleEmailAuth
const oldAuthLogic = `
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    }
  };
`;

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
        // Since AuthContext creates the doc, let's update it here just in case. But AuthContext will use user.displayName next time it reads it, and local storage will be handled when auth updates.
        // Actually, just calling updateProfile and reloading/forcing state update is good.
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    }
  };
`;
content = content.replace(oldAuthLogic.trim(), newAuthLogic.trim());

// 3. Update the UI
// Find where the form fields are
const uiSearchString = `                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0C0F] text-[#EDF1F5] px-4 py-3 rounded-lg border border-gray-800 focus:border-primary outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0B0C0F] text-[#EDF1F5] px-4 py-3 rounded-lg border border-gray-800 focus:border-primary outline-none"
                  required
                />`;

const uiReplaceString = `                {authMode === 'register' && (
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#0B0C0F] text-[#EDF1F5] px-4 py-3 rounded-lg border border-gray-800 focus:border-primary outline-none"
                    required
                  />
                )}
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0C0F] text-[#EDF1F5] px-4 py-3 rounded-lg border border-gray-800 focus:border-primary outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0B0C0F] text-[#EDF1F5] px-4 py-3 rounded-lg border border-gray-800 focus:border-primary outline-none"
                  required
                />
                {authMode === 'register' && (
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#0B0C0F] text-[#EDF1F5] px-4 py-3 rounded-lg border border-gray-800 focus:border-primary outline-none"
                    required
                  />
                )}`;
                
content = content.replace(uiSearchString, uiReplaceString);

fs.writeFileSync('src/pages/Profile.tsx', content);
