const fs = require('fs');
let content = fs.readFileSync('src/pages/Watch.tsx', 'utf8');

// Add state
content = content.replace(
  "const [audioType, setAudioType] = useState<'sub' | 'dub'>('sub');",
  "const [audioType, setAudioType] = useState<'sub' | 'dub'>('sub');\n  const [serverType, setServerType] = useState<'ani' | 'mal'>('ani');"
);

// Update iframeUrl
content = content.replace(
  "const iframeUrl = `https://megaplay.buzz/stream/ani/${animeId}/${currentEp}/${audioType}`;",
  "const iframeUrl = serverType === 'mal' && anime?.idMal ? `https://megaplay.buzz/stream/mal/${anime.idMal}/${currentEp}/${audioType}` : `https://megaplay.buzz/stream/ani/${animeId}/${currentEp}/${audioType}`;"
);

// Update Episode Controls
const newControls = `
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
              {/* Server Selector */}
              <div className="flex items-center bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setServerType('ani')}
                  className={cn(
                    "px-3 sm:px-4 py-1.5 rounded-md text-sm font-bold transition-colors",
                    serverType === 'ani' ? "bg-primary text-[#0B0C0F] shadow-sm" : "text-gray-400 hover:text-gray-200"
                  )}
                >
                  AniList
                </button>
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
              </div>

              {/* Audio Type Selector */}
              <div className="flex items-center bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setAudioType('sub')}
                  className={cn(
                    "px-3 sm:px-4 py-1.5 rounded-md text-sm font-bold transition-colors",
                    audioType === 'sub' ? "bg-primary text-[#0B0C0F] shadow-sm" : "text-gray-400 hover:text-gray-200"
                  )}
                >
                  Sub
                </button>
                <button
                  onClick={() => setAudioType('dub')}
                  className={cn(
                    "px-3 sm:px-4 py-1.5 rounded-md text-sm font-bold transition-colors",
                    audioType === 'dub' ? "bg-primary text-[#0B0C0F] shadow-sm" : "text-gray-400 hover:text-gray-200"
                  )}
                >
                  Dub
                </button>
              </div>
            </div>
`;

content = content.replace(
  /\{\/\* Audio Type Selector \*\/\}.*?<\/div>/s,
  newControls.trim()
);

fs.writeFileSync('src/pages/Watch.tsx', content);
