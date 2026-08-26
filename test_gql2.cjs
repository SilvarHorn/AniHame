const apiContent = require('fs').readFileSync('src/api/anilist.ts', 'utf8');
const frag = apiContent.match(/export const MEDIA_FRAGMENT = \`([\s\S]*?)\`;/)[1];
const q = apiContent.match(/export const ANIME_DETAILS_QUERY = \`([\s\S]*?)\`;/)[1];
const fullQuery = frag + '\n' + q;

fetch('https://graphql.anilist.co', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: fullQuery, variables: { id: 1 } })
}).then(res => res.json()).then(console.log).catch(console.error);
