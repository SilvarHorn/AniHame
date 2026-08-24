const fs = require('fs');
let code = fs.readFileSync('src/components/home/TrendingGrid.tsx', 'utf8');

code = code.replace(
  /group-hover\\\/trending/g,
  'group-hover/trending'
);

fs.writeFileSync('src/components/home/TrendingGrid.tsx', code);
