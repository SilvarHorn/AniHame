const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

content = content.replace(
  "  const [localAvatar, setLocalAvatar] = useState('');",
  "  const [localAvatar, setLocalAvatar] = useState('');\n  const [localUsername, setLocalUsername] = useState('');"
);

content = content.replace(
  "          if (parsed.avatar) setLocalAvatar(parsed.avatar);",
  "          if (parsed.avatar) setLocalAvatar(parsed.avatar);\n          if (parsed.username) setLocalUsername(parsed.username);"
);

content = content.replace(
  "  const displayAvatar = profile?.photoURL || localAvatar;",
  "  const displayAvatar = profile?.photoURL || localAvatar;\n  const displayUsername = profile?.username || localUsername || 'Profile';"
);

content = content.replace(
  '<span className="text-xs font-semibold text-[#EDF1F5] group-hover:text-primary transition-colors">Profile</span>',
  '<span className="text-xs font-semibold text-[#EDF1F5] group-hover:text-primary transition-colors truncate max-w-[100px]">{displayUsername}</span>'
);

content = content.replace(
  '{avatar ? (\\n              <img src={avatar}',
  '{displayAvatar ? (\\n              <img src={displayAvatar}'
); // Need to use string exact replacement

fs.writeFileSync('src/components/layout/Navbar.tsx', content);
