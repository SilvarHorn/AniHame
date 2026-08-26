const fs = require('fs');

let content = fs.readFileSync('src/components/home/LatestGrid.tsx', 'utf8');

const targetCols = `  const cols = {
    base: 3,
    sm: 4,
    md: 5,
    lg: 6,
    xl: 7,
    '2xl': 8
  };`;

const replaceCols = `  const cols = {
    base: 3,
    sm: 4,
    md: 6,
    lg: 6,
    xl: 8,
    '2xl': 8
  };`;

content = content.replace(targetCols, replaceCols);

const targetClasses = `  const gridClasses = [
    'grid gap-3 pr-2',
    gridCols[cols.base],
    smGridCols[cols.sm],
    mdGridCols[cols.md],
    lgGridCols[cols.lg],
    xlGridCols[cols.xl],
    xxlGridCols[cols['2xl']]
  ].join(' ');`;

const replaceClasses = `  const gridClasses = [
    'grid gap-4 md:gap-6',
    gridCols[cols.base],
    smGridCols[cols.sm],
    mdGridCols[cols.md],
    lgGridCols[cols.lg],
    xlGridCols[cols.xl],
    xxlGridCols[cols['2xl']]
  ].join(' ');`;

content = content.replace(targetClasses, replaceClasses);

fs.writeFileSync('src/components/home/LatestGrid.tsx', content);
console.log('patched');
