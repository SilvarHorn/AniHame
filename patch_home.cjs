const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Add motion import
content = content.replace(
  "import { AnimeMedia } from '../types';",
  "import { AnimeMedia } from '../types';\nimport { motion } from 'motion/react';"
);

// Add variants
const variantsCode = `
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
`;

content = content.replace(
  "export default function Home() {",
  variantsCode + "\nexport default function Home() {"
);

// Replace return block
const oldReturn = `  return (
    <div className="flex flex-col">
      <Banner trending={trending} />
      <div className="flex-1 flex flex-col p-4 md:p-6 lg:px-8 gap-6 max-w-7xl mx-auto w-full">
        <ContinueWatching />
        <div className="flex flex-col gap-8">
          <LatestGrid 
            latest={latest} 
            country={latestCountry} 
            onCountryChange={setLatestCountry}
            page={latestPage}
            hasNextPage={latestHasNext}
            isLoading={isFetchingLatest}
            onNextPage={() => setLatestPage(p => p + 1)}
            onPrevPage={() => setLatestPage(p => Math.max(1, p - 1))}
          />
          <TrendingGrid trending={trending} country={trendingCountry} onCountryChange={setTrendingCountry} />
          <div className="w-full">
            <Timetable />
          </div>
        </div>
      </div>
    </div>
  );`;

const newReturn = `  return (
    <motion.div 
      className="flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <Banner trending={trending} />
      </motion.div>
      <div className="flex-1 flex flex-col p-4 md:p-6 lg:px-8 gap-6 max-w-7xl mx-auto w-full">
        <motion.div variants={itemVariants}>
          <ContinueWatching />
        </motion.div>
        <div className="flex flex-col gap-8">
          <motion.div variants={itemVariants}>
            <LatestGrid 
              latest={latest} 
              country={latestCountry} 
              onCountryChange={setLatestCountry}
              page={latestPage}
              hasNextPage={latestHasNext}
              isLoading={isFetchingLatest}
              onNextPage={() => setLatestPage(p => p + 1)}
              onPrevPage={() => setLatestPage(p => Math.max(1, p - 1))}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <TrendingGrid trending={trending} country={trendingCountry} onCountryChange={setTrendingCountry} />
          </motion.div>
          <motion.div variants={itemVariants} className="w-full">
            <Timetable />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );`;

content = content.replace(oldReturn, newReturn);

fs.writeFileSync('src/pages/Home.tsx', content);
