const fs = require('fs');
let types = fs.readFileSync('src/types.ts', 'utf8');

const newFields = `  status: string;
  startDate?: { year: number | null; month: number | null; day: number | null };
  endDate?: { year: number | null; month: number | null; day: number | null };
  studios?: { edges: { isMain: boolean; node: { name: string } }[] };`;

types = types.replace('  status: string;', newFields);
fs.writeFileSync('src/types.ts', types);

let api = fs.readFileSync('src/api/anilist.ts', 'utf8');

const newFrag = `    genres
    startDate { year month day }
    endDate { year month day }
    studios(isMain: true) { edges { isMain node { name } } }
    nextAiringEpisode {`;

api = api.replace('    genres\n    nextAiringEpisode {', newFrag);
fs.writeFileSync('src/api/anilist.ts', api);
console.log('patched types and api');
