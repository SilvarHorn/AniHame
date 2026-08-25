const fs = require('fs');
let content = fs.readFileSync('src/pages/Watch.tsx', 'utf8');

const malBtn = `
                <button
                  onClick={() => setServerType('mal')}
                  disabled={!anime?.idMal}
                  className={cn(
                    "px-3 sm:px-4 py-1.5 rounded-md text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    serverType === 'mal' ? "bg-primary text-[#0B0C0F] shadow-sm" : "text-gray-400 hover:text-gray-200"
                  )}
                  title={!anime?.idMal ? "MAL ID not available for this anime" : undefined}
                >
                  MAL
                </button>
`;

const embedBtn = malBtn + `                <button
                  onClick={() => setServerType('2embed')}
                  disabled={!imdbId}
                  className={cn(
                    "px-3 sm:px-4 py-1.5 rounded-md text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    serverType === '2embed' ? "bg-primary text-[#0B0C0F] shadow-sm" : "text-gray-400 hover:text-gray-200"
                  )}
                  title={!imdbId ? "IMDb ID not available for this anime" : undefined}
                >
                  2Embedded
                </button>
`;

content = content.replace(malBtn, embedBtn);
fs.writeFileSync('src/pages/Watch.tsx', content);
