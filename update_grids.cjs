const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace perPage: 25 with perPage: 24
  content = content.replace(/perPage: 25/g, 'perPage: 24');
  
  // Also check if there's any hardcoded 25 length check
  content = content.replace(/length === 25/g, 'length === 24');
  
  // For Profile.tsx itemsPerPage
  content = content.replace(/const itemsPerPage = 25;/g, 'const itemsPerPage = 24;');

  // Replace grid classes
  content = content.replace(/grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5/g, 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6');
  content = content.replace(/grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6/g, 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6');

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + filePath);
}

['src/pages/Explore.tsx', 'src/pages/Trending.tsx', 'src/pages/Profile.tsx'].forEach(updateFile);

