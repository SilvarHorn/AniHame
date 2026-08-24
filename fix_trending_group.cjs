const fs = require('fs');
let code = fs.readFileSync('src/components/home/TrendingGrid.tsx', 'utf8');

code = code.replace(
  'className="flex flex-col w-full relative group"',
  'className="flex flex-col w-full relative group/trending"'
);

code = code.replace(
  /group-hover:opacity-100/g,
  'group-hover\\/trending:opacity-100'
);

fs.writeFileSync('src/components/home/TrendingGrid.tsx', code);
