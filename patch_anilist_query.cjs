const fs = require('fs');
let api = fs.readFileSync('src/api/anilist.ts', 'utf8');

// 1. Remove from MEDIA_FRAGMENT
api = api.replace(
`    genres
    startDate { year month day }
    endDate { year month day }
    studios(isMain: true) { edges { isMain node { name } } }
    nextAiringEpisode {`,
`    genres
    nextAiringEpisode {`
);

// 2. Add to ANIME_DETAILS_QUERY
// It's after ...MediaFragment
api = api.replace(
`      ...MediaFragment
      streamingEpisodes {`,
`      ...MediaFragment
      startDate { year month day }
      endDate { year month day }
      studios(isMain: true) { edges { isMain node { name } } }
      streamingEpisodes {`
);

fs.writeFileSync('src/api/anilist.ts', api);
console.log('patched anilist.ts');
