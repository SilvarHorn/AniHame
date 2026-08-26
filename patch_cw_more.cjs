const fs = require('fs');

let content = fs.readFileSync('src/components/home/ContinueWatching.tsx', 'utf8');

const target = `<div className="relative flex-[0_0_200px] sm:flex-[0_0_220px]">`;
const replacement = `<motion.div layout className="relative flex-[0_0_200px] sm:flex-[0_0_220px]">`;
content = content.replace(target, replacement);

const targetEnd = `</Link>
          </div>`;
const replacementEnd = `</Link>
          </motion.div>`;
content = content.replace(targetEnd, replacementEnd);

fs.writeFileSync('src/components/home/ContinueWatching.tsx', content);
