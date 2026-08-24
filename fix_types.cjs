const fs = require('fs');

let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace(
  "nextAiringEpisode: NextAiringEpisode | null;",
  "nextAiringEpisode: NextAiringEpisode | null;\n  streamingEpisodes?: { title: string; url: string; thumbnail: string; site: string }[];"
);
fs.writeFileSync('src/types.ts', code);

// Now update ANIME_DETAILS_QUERY in src/api/anilist.ts
let anilistCode = fs.readFileSync('src/api/anilist.ts', 'utf8');
anilistCode = anilistCode.replace(
  "      startDate {\n        year\n        month\n        day\n      }",
  "      startDate {\n        year\n        month\n        day\n      }\n      streamingEpisodes {\n        title\n        thumbnail\n        url\n        site\n      }"
);
fs.writeFileSync('src/api/anilist.ts', anilistCode);
