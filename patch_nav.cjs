const fs = require('fs');

let navContent = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

// Replace local storage profile load with Auth context
navContent = navContent.replace(
  "import { Search, User, Tv, Menu, X } from 'lucide-react';",
  "import { Search, User, Tv, Menu, X } from 'lucide-react';\nimport { useAuth } from '../../contexts/AuthContext';"
);

navContent = navContent.replace(
  "  const [showPreview, setShowPreview] = useState(false);\n  const [avatar, setAvatar] = useState('');\n  const navigate = useNavigate();",
  "  const [showPreview, setShowPreview] = useState(false);\n  const { profile } = useAuth();\n  const navigate = useNavigate();"
);

// Remove the old loadProfile useEffect
navContent = navContent.replace(
  /  useEffect\(\(\) => \{\n    const loadProfile[\s\S]*?\}, \[\]\);\n/,
  ""
);

// Replace avatar source
navContent = navContent.replace(
  "{avatar ? (",
  "{profile?.photoURL ? ("
);

navContent = navContent.replace(
  '<img src={avatar}',
  '<img src={profile.photoURL}'
);

fs.writeFileSync('src/components/layout/Navbar.tsx', navContent);
