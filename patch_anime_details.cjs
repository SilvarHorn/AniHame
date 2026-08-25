const fs = require('fs');
let content = fs.readFileSync('src/pages/AnimeDetails.tsx', 'utf8');

// add state
content = content.replace(
  "const [listStatus, setListStatus] = useState<MyListStatus | null>(null);",
  "const [listStatus, setListStatus] = useState<MyListStatus | null>(null);\n  const [imdbId, setImdbId] = useState<string | null>(null);"
);

// add fetch
const fetchCode = `
        if (data?.Media) {
          setAnime(data.Media);
          setListStatus(getAnimeListStatus(Number(id)));
          
          fetch(\`/api/mapping/\${id}\`)
            .then(res => res.json())
            .then(mapping => {
              if (mapping && mapping.imdb_id && mapping.imdb_id.length > 0) {
                // Sometimes it's an array, sometimes maybe a string, handle safely
                const iId = Array.isArray(mapping.imdb_id) ? mapping.imdb_id[0] : mapping.imdb_id;
                setImdbId(iId);
              }
            })
            .catch(err => console.error("Failed to fetch mapping", err));
        } else {
`;
content = content.replace(
  `        if (data?.Media) {\n          setAnime(data.Media);\n          setListStatus(getAnimeListStatus(Number(id)));\n        } else {`,
  fetchCode
);

// add button
const buttonsCode = `
              {anime.idMal && (
                <a
                  href={\`https://myanimelist.net/anime/\${anime.idMal}\`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#2E51A2]/10 hover:bg-[#2E51A2]/20 text-[#5383E8] border border-[#2E51A2]/30 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  <ExternalLink size={16} />
                  MyAnimeList
                </a>
              )}
              {imdbId && (
                <a
                  href={\`https://www.imdb.com/title/\${imdbId}\`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#F5C518]/10 hover:bg-[#F5C518]/20 text-[#F5C518] border border-[#F5C518]/30 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  <ExternalLink size={16} />
                  IMDb
                </a>
              )}
`;
content = content.replace(
  /\{anime\.idMal && \([\s\S]*?<\/a>\n              \)\}/,
  buttonsCode.trim()
);

fs.writeFileSync('src/pages/AnimeDetails.tsx', content);
