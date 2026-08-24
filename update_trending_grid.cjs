const fs = require('fs');
let code = fs.readFileSync('src/components/home/TrendingGrid.tsx', 'utf8');

code = code.replace(
  /hide-scrollbar pb-4/g,
  'dotted-scrollbar pb-4'
);

fs.writeFileSync('src/components/home/TrendingGrid.tsx', code);
