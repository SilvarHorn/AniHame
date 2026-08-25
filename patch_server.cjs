const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');

const mappingCode = `
let animeMappings: any[] | null = null;
let mappingFetchPromise: Promise<any> | null = null;

async function getAnimeMappings() {
  if (animeMappings) return animeMappings;
  if (!mappingFetchPromise) {
    mappingFetchPromise = fetch('https://raw.githubusercontent.com/SilvarHorn/anime-lists/master/anime-list-mini.json')
      .then(res => res.json())
      .then(data => {
        animeMappings = data;
        return data;
      })
      .catch(err => {
        console.error("Failed to fetch anime mappings", err);
        mappingFetchPromise = null;
        return [];
      });
  }
  return mappingFetchPromise;
}

  app.get("/api/mapping/:anilistId", async (req, res) => {
    const anilistId = parseInt(req.params.anilistId, 10);
    if (isNaN(anilistId)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    try {
      const mappings = await getAnimeMappings();
      const mapping = mappings.find((m: any) => m.anilist_id === anilistId);
      if (mapping) {
        res.json(mapping);
      } else {
        res.status(404).json({ error: "Mapping not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
`;

server = server.replace(
  '  app.get("/api/health", (req, res) => {\n    res.json({ status: "ok" });\n  });',
  '  app.get("/api/health", (req, res) => {\n    res.json({ status: "ok" });\n  });\n' + mappingCode
);

fs.writeFileSync('server.ts', server);
