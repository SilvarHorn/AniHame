const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

const oldMobileProfile = `
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <User size={16} />
            )}
            <span>Profile</span>
`;

const newMobileProfile = `
            {displayAvatar ? (
              <img src={displayAvatar} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <User size={16} />
            )}
            <span className="truncate max-w-[150px]">{displayUsername}</span>
`;

if (content.includes("<span>Profile</span>")) {
  content = content.replace(oldMobileProfile.trim(), newMobileProfile.trim());
}

// Since I might have missed the mobile view entirely because whitespace differs, let's just do a regex replace for the text "Profile" inside that button.
content = content.replace(
  "<span>Profile</span>",
  '<span className="truncate max-w-[150px]">{displayUsername}</span>'
);

content = content.replace(
  "{avatar ?",
  "{displayAvatar ?"
);

content = content.replace(
  "src={avatar}",
  "src={displayAvatar}"
);

fs.writeFileSync('src/components/layout/Navbar.tsx', content);
