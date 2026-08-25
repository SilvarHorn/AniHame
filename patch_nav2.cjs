const fs = require('fs');

let navContent = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

const navCode = `
  const [showPreview, setShowPreview] = useState(false);
  const { profile, currentUser } = useAuth();
  const [localAvatar, setLocalAvatar] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadLocalProfile = () => {
      try {
        const saved = localStorage.getItem('anime_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.avatar) setLocalAvatar(parsed.avatar);
        }
      } catch (e) {}
    };
    loadLocalProfile();
    window.addEventListener('profile-updated', loadLocalProfile);
    window.addEventListener('storage', loadLocalProfile);
    return () => {
      window.removeEventListener('profile-updated', loadLocalProfile);
      window.removeEventListener('storage', loadLocalProfile);
    };
  }, []);

  const displayAvatar = profile?.photoURL || localAvatar;
`;

navContent = navContent.replace(
  "  const [showPreview, setShowPreview] = useState(false);\n  const { profile } = useAuth();\n  const navigate = useNavigate();",
  navCode.trim()
);

navContent = navContent.replace(
  "\{profile\?.photoURL \? \(",
  "{displayAvatar ? ("
);

navContent = navContent.replace(
  "<img src=\{profile\.photoURL\}",
  "<img src={displayAvatar}"
);

fs.writeFileSync('src/components/layout/Navbar.tsx', navContent);
