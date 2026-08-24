const fs = require('fs');
let code = fs.readFileSync('src/api/anilist.ts', 'utf8');
code = code.replace(/  return json\.data;\n\n  const json = await response\.json\(\);\n  if \(json\.errors\) {\n    throw new Error\(json\.errors\[0\]\.message\);\n  }\n    \n  return json\.data;/g, '  return json.data;');
fs.writeFileSync('src/api/anilist.ts', code);
