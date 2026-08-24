const fs = require('fs');
let code = fs.readFileSync('src/components/home/TrendingGrid.tsx', 'utf8');

code = code.replace(
  'className="snap-start shrink-0 w-28 sm:w-32 md:w-36 lg:w-40"',
  'className="snap-start shrink-0 w-24 sm:w-28 md:w-32 lg:w-36"'
);
fs.writeFileSync('src/components/home/TrendingGrid.tsx', code);
