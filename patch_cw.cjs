const fs = require('fs');

let content = fs.readFileSync('src/components/home/ContinueWatching.tsx', 'utf8');

// Add AnimatePresence and motion
if (!content.includes('import { motion, AnimatePresence } from')) {
  content = content.replace(
    "import { Play, X } from 'lucide-react';",
    "import { Play, X } from 'lucide-react';\nimport { motion, AnimatePresence } from 'motion/react';"
  );
}

// Replace the mapping
const target = `{progress.map((item) => (
            <div key={item.animeId} className="relative flex-[0_0_200px] sm:flex-[0_0_220px] group">`;

const replacement = `<AnimatePresence mode="popLayout">
            {progress.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
                transition={{ duration: 0.3 }}
                key={item.animeId} 
                className="relative flex-[0_0_200px] sm:flex-[0_0_220px] group"
              >`;

content = content.replace(target, replacement);

const targetEnd = `              </button>
            </div>
          ))}`;

const replacementEnd = `              </button>
              </motion.div>
            ))}
          </AnimatePresence>`;

content = content.replace(targetEnd, replacementEnd);

fs.writeFileSync('src/components/home/ContinueWatching.tsx', content);
