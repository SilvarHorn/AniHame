const fs = require('fs');
let code = fs.readFileSync('src/api/anilist.ts', 'utf8');

// The duplicate block is from line 22 to 26 roughly
// Let's just find and replace the whole function definition
const newFunc = `export async function fetchAnilist<T = any>(query: string, variables: any = {}): Promise<T> {
  const response = await fetch(ANILIST_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query, variables })
  });
  
  const json = await response.json().catch(()=>null);
  if (json && json.errors) {
    throw new Error(json.errors[0].message);
  }
  if (!response.ok) {
    throw new Error('HTTP Error ' + response.status);
  }
  return json.data;
}`;

code = code.replace(/export async function fetchAnilist[\s\S]*?return json\.data;\n}/, newFunc);
fs.writeFileSync('src/api/anilist.ts', code);
