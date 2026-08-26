const apiContent = require('fs').readFileSync('src/api/anilist.ts', 'utf8');

const query = apiContent.match(/export const ANIME_DETAILS_QUERY = \`([\s\S]*?)\`;/)[1]
   .replace('${MEDIA_FRAGMENT}', apiContent.match(/export const MEDIA_FRAGMENT = \`([\s\S]*?)\`;/)[1]);

fetch('https://graphql.anilist.co', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, variables: { id: 1 } })
}).then(res => res.json()).then(d => {
  if (d.errors) {
    console.error(d.errors);
  } else {
    console.log(d.data.Media.title);
    console.log(d.data.Media.studios);
  }
}).catch(console.error);
