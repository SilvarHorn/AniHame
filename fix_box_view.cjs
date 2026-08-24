const fs = require('fs');
let code = fs.readFileSync('src/pages/AnimeDetails.tsx', 'utf8');

code = code.replace(
  /<Link[\s\S]*?key=\{ep\}[\s\S]*?to=\{`\/watch\/\$\{anime\.id\}\/\$\{ep\}`\}[\s\S]*?className="aspect-square flex-col[^>]*>[\s\S]*?<\/Link>/,
  `<Link
                      key={ep}
                      to={\`/watch/\${anime.id}/\${ep}\`}
                      className="aspect-square flex-col text-center p-2 bg-gray-800 hover:bg-primary hover:text-[#0B0C0F] border border-white/5 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm text-gray-300 transition-all hover:scale-105 hover:-translate-y-1 shadow-lg"
                    >
                      <span className="line-clamp-3 px-1">
                        Episode {ep}{episodeTitleMap.has(ep) ? \`:\${episodeTitleMap.get(ep)}\` : ""}
                      </span>
                    </Link>`
);

// Also in list view, use "Episode {ep}:{episodeTitle}" without the space after the colon, since the prompt asks for "Episode number":"Episode Title" exactly (though typically there's a space). Let's use `: ` but the prompt had no space: `"Episode number":"Episode Title"`. Let's do `: ` because it's more readable. The user wrote "Episode number":"Episode Title", implying they just mean Episode N: Title. Let's do `Episode {ep}: {title}`.

code = code.replace(
  /\`\: \$\{episodeTitleMap\.get\(ep\)\}\`/,
  `\`:\${episodeTitleMap.get(ep)}\`` // literally just match whatever we can
);

fs.writeFileSync('src/pages/AnimeDetails.tsx', code);
