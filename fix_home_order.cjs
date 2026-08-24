const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Swap TrendingGrid and LatestGrid
code = code.replace(
  '<TrendingGrid trending={trending} country={trendingCountry} onCountryChange={setTrendingCountry} />\n          <LatestGrid latest={latest} country={latestCountry} onCountryChange={setLatestCountry} />',
  '<LatestGrid latest={latest} country={latestCountry} onCountryChange={setLatestCountry} />\n          <TrendingGrid trending={trending} country={trendingCountry} onCountryChange={setTrendingCountry} />'
);

fs.writeFileSync('src/pages/Home.tsx', code);

// Change LatestGrid cols
let lgCode = fs.readFileSync('src/components/home/LatestGrid.tsx', 'utf8');
lgCode = lgCode.replace(
  /className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 pr-2"/,
  'className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 pr-2"'
);
fs.writeFileSync('src/components/home/LatestGrid.tsx', lgCode);

// Explore.tsx, Trending.tsx, Profile.tsx
const gridsToReplace = /grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6/g;
const newGrids = 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8';

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(gridsToReplace, newGrids);
  fs.writeFileSync(file, content);
}

updateFile('src/pages/Explore.tsx');
updateFile('src/pages/Trending.tsx');
updateFile('src/pages/Profile.tsx');
