const fs = require('fs');

// Patch types.ts
let types = fs.readFileSync('src/types.ts', 'utf8');
types = types.replace(
  "type?: string;",
  "type?: string;\n  format?: string;"
);
fs.writeFileSync('src/types.ts', types);

// Patch anilist.ts
let anilist = fs.readFileSync('src/api/anilist.ts', 'utf8');
anilist = anilist.replace(
  "idMal\n    type\n",
  "idMal\n    type\n    format\n"
);
fs.writeFileSync('src/api/anilist.ts', anilist);

