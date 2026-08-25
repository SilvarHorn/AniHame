const fs = require('fs');
let content = fs.readFileSync('src/api/anilist.ts', 'utf8');

// Change ANILIST_API_URL to the real endpoint to avoid server-side IP rate limiting
content = content.replace(
  "export const ANILIST_API_URL = '/api/anilist';",
  "export const ANILIST_API_URL = 'https://graphql.anilist.co';"
);

// Increase retries slightly and add a bit of jitter
content = content.replace(
  "export async function fetchAnilist<T = any>(query: string, variables: any = {}, retries = 3): Promise<T> {",
  "export async function fetchAnilist<T = any>(query: string, variables: any = {}, retries = 5): Promise<T> {"
);

content = content.replace(
  "          await new Promise(r => setTimeout(r, 1000 * (i + 1)));",
  "          const delay = parseInt(response.headers.get('Retry-After') || '0') * 1000 || (1000 * Math.pow(2, i) + Math.random() * 1000);\n          await new Promise(r => setTimeout(r, delay));"
);

content = content.replace(
  "      await new Promise(r => setTimeout(r, 1000 * (i + 1)));",
  "      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i) + Math.random() * 1000));"
);

fs.writeFileSync('src/api/anilist.ts', content);
