import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

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


  app.post("/api/anilist", async (req, res) => {
    try {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(req.body)
      });
      
      const data = await response.text();
      res.status(response.status).send(data);
    } catch (error: any) {
      console.error("Anilist Proxy Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
