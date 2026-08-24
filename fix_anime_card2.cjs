const fs = require('fs');
let code = fs.readFileSync('src/components/ui/AnimeCard.tsx', 'utf8');

code = code.replace(
  'className="flex flex-col gap-2 group cursor-pointer"',
  'className="flex flex-col gap-2 group cursor-pointer" draggable={false}'
);

fs.writeFileSync('src/components/ui/AnimeCard.tsx', code);
