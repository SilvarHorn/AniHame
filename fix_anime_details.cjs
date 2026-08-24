const fs = require('fs');

let code = fs.readFileSync('src/pages/AnimeDetails.tsx', 'utf8');

const mapCode = `
  const episodeTitleMap = new Map<number, string>();
  if (anime?.streamingEpisodes) {
    anime.streamingEpisodes.forEach(ep => {
      const match = ep.title.match(/Episode\\s+(\\d+)\\s*[-:]\\s*(.*)/i);
      if (match) {
        episodeTitleMap.set(parseInt(match[1]), match[2].trim());
      }
    });
  }
`;

code = code.replace(
  "let episodes = Array.from({ length: Math.max(1, episodeCount) }, (_, i) => i + 1);",
  mapCode + "\n  let episodes = Array.from({ length: Math.max(1, episodeCount) }, (_, i) => i + 1);"
);

// List View Replace
code = code.replace(
  '<span className="text-base font-semibold">Episode {ep}</span>',
  '<span className="text-base font-semibold">Episode {ep}{episodeTitleMap.has(ep) ? `: ${episodeTitleMap.get(ep)}` : ""}</span>'
);

// Box View Replace
// from: {ep}
// to: Episode {ep}: {episodeTitleMap.get(ep)}
code = code.replace(
  /className="aspect-square([^"]+)"[\s\S]*?>\s*\{ep\}\s*<\/Link>/,
  `className="aspect-square flex-col text-center p-2$1">\n                      <span className="text-lg">{ep}</span>\n                      {episodeTitleMap.has(ep) && (\n                        <span className="text-[10px] sm:text-xs font-normal text-gray-400 line-clamp-2 mt-1 px-1">\n                          {episodeTitleMap.get(ep)}\n                        </span>\n                      )}\n                    </Link>`
);

// Wait, the requested format is "Episode number":"Episode Title" for BOTH.
// "Use the format "Episode number":"Episode Title" in the list view of the episodes only and on the box view of the episodes."
// Okay, let's explicitly format it as "Episode {ep}:{episodeTitle}" for the box view as well!

code = code.replace(
  /<span className="text-lg">\{ep\}<\/span>[\s\S]*?\{episodeTitleMap\.has\(ep\) && \([\s\S]*?<span className="text-\[10px\] sm:text-xs font-normal text-gray-400 line-clamp-2 mt-1 px-1">[\s\S]*?\{episodeTitleMap\.get\(ep\)\}[\s\S]*?<\/span>[\s\S]*?\)\]?\}?/,
  `
                      <span className="text-lg">{ep}</span>
                      {episodeTitleMap.has(ep) && (
                        <span className="text-[10px] sm:text-xs font-normal text-gray-400 line-clamp-2 mt-1 px-1">
                          {episodeTitleMap.get(ep)}
                        </span>
                      )}
  `
);
fs.writeFileSync('src/pages/AnimeDetails.tsx', code);
