const fs = require('fs');
const apiContent = fs.readFileSync('src/api/anilist.ts', 'utf8');

const regex = /export const MEDIA_FRAGMENT = \`([\s\S]*?)\`;/;
const match = apiContent.match(regex);
const frag = match[1];

const queryRegex = /export const ANIME_DETAILS_QUERY = \`([\s\S]*?)\`;/;
const matchQuery = apiContent.match(queryRegex);
const q = matchQuery[1];

const fullQuery = frag + '\n' + q;
console.log(fullQuery);
