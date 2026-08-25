const fs = require('fs');
let content = fs.readFileSync('src/pages/Watch.tsx', 'utf8');

// 1. Add state and modify serverType
content = content.replace(
  "const [serverType, setServerType] = useState<'ani' | 'mal'>('ani');",
  "const [serverType, setServerType] = useState<'ani' | 'mal' | '2embed'>('ani');\n  const [imdbId, setImdbId] = useState<string | null>(null);"
);

// 2. Add fetch for imdbId
const fetchLogic = `
        const data = await fetchAnilist(ANIME_DETAILS_QUERY, { id: animeId });
        if (data?.Media) {
          setAnime(data.Media);

          // Fetch mapping
          fetch(\`/api/mapping/\${animeId}\`)
            .then(res => res.json())
            .then(mapping => {
              if (mapping && mapping.imdb_id && mapping.imdb_id.length > 0) {
                const iId = Array.isArray(mapping.imdb_id) ? mapping.imdb_id[0] : mapping.imdb_id;
                setImdbId(iId);
              }
            })
            .catch(err => console.error("Failed to fetch mapping", err));

          // Save to progress
`;
content = content.replace(
  "        const data = await fetchAnilist(ANIME_DETAILS_QUERY, { id: animeId });\n        if (data?.Media) {\n          setAnime(data.Media);\n              \n          // Save to progress",
  fetchLogic
);

// 3. Modify iframeUrl
const urlLogic = `
  let iframeUrl = '';
  if (serverType === '2embed' && imdbId) {
    iframeUrl = \`https://www.2embed.cc/embedtv/\${imdbId}&s=1&e=\${currentEp}\`;
  } else if (serverType === 'mal' && anime?.idMal) {
    iframeUrl = \`https://megaplay.buzz/stream/mal/\${anime.idMal}/\${currentEp}/\${audioType}\`;
  } else {
    iframeUrl = \`https://megaplay.buzz/stream/ani/\${animeId}/\${currentEp}/\${audioType}\`;
  }
`;
content = content.replace(
  "  const iframeUrl = serverType === 'mal' && anime?.idMal ? `https://megaplay.buzz/stream/mal/${anime.idMal}/${currentEp}/${audioType}` : `https://megaplay.buzz/stream/ani/${animeId}/${currentEp}/${audioType}`;",
  urlLogic.trim()
);

fs.writeFileSync('src/pages/Watch.tsx', content);
