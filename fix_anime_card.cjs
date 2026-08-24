const fs = require('fs');
let code = fs.readFileSync('src/components/ui/AnimeCard.tsx', 'utf8');

code = code.replace(
  'className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"',
  'className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" draggable={false}'
);

fs.writeFileSync('src/components/ui/AnimeCard.tsx', code);
