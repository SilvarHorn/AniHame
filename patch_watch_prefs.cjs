const fs = require('fs');

// Patch Watch.tsx to use preferences
let watchContent = fs.readFileSync('src/pages/Watch.tsx', 'utf8');

// Add import
watchContent = watchContent.replace(
  "import { cn } from '../lib/utils';",
  "import { cn } from '../lib/utils';\nimport { useAuth } from '../contexts/AuthContext';"
);

// Get context inside component
watchContent = watchContent.replace(
  "export default function Watch() {",
  "export default function Watch() {\n  const { profile } = useAuth();"
);

// Apply defaults when loaded
// Add a useEffect to set preferences
const eff = `
  useEffect(() => {
    if (profile?.preferences) {
      setServerType(profile.preferences.defaultServer);
      setAudioType(profile.preferences.defaultAudio);
    }
  }, [profile]);
`;

watchContent = watchContent.replace(
  "  const dropdownRef = useRef<HTMLDivElement>(null);",
  "  const dropdownRef = useRef<HTMLDivElement>(null);\n" + eff
);

fs.writeFileSync('src/pages/Watch.tsx', watchContent);
