const fs = require('fs');

// Patch App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
if (!appContent.includes('AuthProvider')) {
  appContent = appContent.replace(
    "import React from 'react';",
    "import React from 'react';\nimport { AuthProvider } from './contexts/AuthContext';"
  );
  appContent = appContent.replace(
    "export default function App() {\n  return (\n    <BrowserRouter>",
    "export default function App() {\n  return (\n    <AuthProvider>\n    <BrowserRouter>"
  );
  appContent = appContent.replace(
    "    </BrowserRouter>\n  );\n}",
    "    </BrowserRouter>\n    </AuthProvider>\n  );\n}"
  );
  fs.writeFileSync('src/App.tsx', appContent);
}
