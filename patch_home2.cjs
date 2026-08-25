const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Stop latest fetch until loading is false
content = content.replace(
  "  useEffect(() => {\n    let isMounted = true;\n    const fetchLatest = async () => {",
  "  useEffect(() => {\n    if (loading) return;\n    let isMounted = true;\n    const fetchLatest = async () => {"
);

// We need to separate the Banner from the containerVariants so it can show immediately
// And wrap the rest in the containerVariants, but ONLY when !loading

// First, replace the old return block
const oldReturnStart = `  return (
    <motion.div 
      className="flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <Banner trending={trending} />
      </motion.div>
      <div className="flex-1 flex flex-col p-4 md:p-6 lg:px-8 gap-6 max-w-7xl mx-auto w-full">`;

const newReturnStart = `  return (
    <div className="flex flex-col">
      {/* Banner is outside the stagger, it animates in as soon as it has data */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Banner trending={trending} />
      </motion.div>

      {/* Rest of the page waits for the Banner to finish loading before mounting and staggering in */}
      {!loading && (
        <motion.div 
          className="flex-1 flex flex-col p-4 md:p-6 lg:px-8 gap-6 max-w-7xl mx-auto w-full"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >`;

content = content.replace(oldReturnStart, newReturnStart);

const oldReturnEnd = `        </div>
      </div>
    </motion.div>
  );`;

const newReturnEnd = `        </div>
        </motion.div>
      )}
    </div>
  );`;

content = content.replace(oldReturnEnd, newReturnEnd);

fs.writeFileSync('src/pages/Home.tsx', content);
