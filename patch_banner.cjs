const fs = require('fs');
let content = fs.readFileSync('src/components/home/Banner.tsx', 'utf8');

content = content.replace(
  'className="relative w-full h-[32vh] min-h-[256px] md:min-h-[304px] lg:min-h-[336px] overflow-hidden shrink-0 group rounded-2xl shadow-2xl border border-gray-800"',
  'className="relative w-full h-[40vh] md:h-[32vh] min-h-[320px] md:min-h-[304px] lg:min-h-[336px] overflow-hidden shrink-0 group rounded-2xl shadow-2xl border border-gray-800"'
);

fs.writeFileSync('src/components/home/Banner.tsx', content);
console.log('patched');
