const fs = require('fs');
let content = fs.readFileSync('src/pages/Watch.tsx', 'utf8');

// Replace the Episode Controls block.
// I'll use regex or string replace to carefully extract and replace it.

const oldBlock = `          {/* Episode Controls */}
          <div className="flex items-center justify-between bg-[#151F2E] p-4 rounded-xl border border-primary/10 shrink-0">
            {currentEp > 1 ? (
              <Link
                to={\`/watch/\${animeId}/\${currentEp - 1}\`}
                className="px-4 py-2 bg-gray-800 hover:bg-primary hover:text-[#0B0C0F] text-gray-300 rounded-lg transition-colors font-bold text-sm"
              >
                Previous Episode
              </Link>
            ) : (
              <div className="px-4 py-2 bg-gray-800/50 text-gray-500 rounded-lg font-bold text-sm cursor-not-allowed">
                Previous Episode
              </div>
            )}
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
                  MegaPlay AniList
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
                  MegaPlay MAL
                </button>
                <button
                  onClick={() => setServerType('vidsrc')}
                  disabled={!imdbId}
                  className={cn(
                    "px-3 sm:px-4 py-1.5 rounded-md text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    serverType === 'vidsrc' ? "bg-primary text-[#0B0C0F] shadow-sm" : "text-gray-400 hover:text-gray-200"
                  )}
                  title={!imdbId ? "IMDb ID not available for this anime" : undefined}
                >
                  VidSrc
                </button>
              </div>
              {/* Audio Type Selector */}
              {serverType !== 'vidsrc' && (
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
              )}
            </div>
            {currentEp < Math.max(1, episodeCount) ? (
              <Link
                to={\`/watch/\${animeId}/\${currentEp + 1}\`}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-[#0B0C0F] rounded-lg transition-colors font-bold text-sm"
              >
                Next Episode
              </Link>
            ) : (
              <div className="px-4 py-2 bg-gray-800/50 text-gray-500 rounded-lg font-bold text-sm cursor-not-allowed">
                Next Episode
              </div>
            )}
          </div>`;

const newBlock = `          {/* Episode Controls */}
          <div className="flex flex-col lg:flex-row items-center justify-between bg-[#151F2E] p-4 rounded-xl border border-primary/10 shrink-0 gap-4">
            {/* Mobile Nav: Prev / Next */}
            <div className="flex lg:hidden items-center justify-between w-full">
              {currentEp > 1 ? (
                <Link
                  to={\`/watch/\${animeId}/\${currentEp - 1}\`}
                  className="px-4 py-2 bg-gray-800 hover:bg-primary hover:text-[#0B0C0F] text-gray-300 rounded-lg transition-colors font-bold text-sm"
                >
                  Prev
                </Link>
              ) : (
                <div className="px-4 py-2 bg-gray-800/50 text-gray-500 rounded-lg font-bold text-sm cursor-not-allowed">
                  Prev
                </div>
              )}
              {currentEp < Math.max(1, episodeCount) ? (
                <Link
                  to={\`/watch/\${animeId}/\${currentEp + 1}\`}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-[#0B0C0F] rounded-lg transition-colors font-bold text-sm"
                >
                  Next
                </Link>
              ) : (
                <div className="px-4 py-2 bg-gray-800/50 text-gray-500 rounded-lg font-bold text-sm cursor-not-allowed">
                  Next
                </div>
              )}
            </div>

            {/* Desktop Nav: Prev */}
            <div className="hidden lg:block">
              {currentEp > 1 ? (
                <Link
                  to={\`/watch/\${animeId}/\${currentEp - 1}\`}
                  className="px-4 py-2 bg-gray-800 hover:bg-primary hover:text-[#0B0C0F] text-gray-300 rounded-lg transition-colors font-bold text-sm"
                >
                  Previous Episode
                </Link>
              ) : (
                <div className="px-4 py-2 bg-gray-800/50 text-gray-500 rounded-lg font-bold text-sm cursor-not-allowed">
                  Previous Episode
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 flex-wrap justify-center w-full lg:w-auto">
              {/* Server Selector */}
              <div className="flex items-center bg-gray-800 rounded-lg p-1 w-full sm:w-auto justify-center">
                <button
                  onClick={() => setServerType('ani')}
                  className={cn(
                    "flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-colors",
                    serverType === 'ani' ? "bg-primary text-[#0B0C0F] shadow-sm" : "text-gray-400 hover:text-gray-200"
                  )}
                >
                  AniList
                </button>
                <button
                  onClick={() => setServerType('mal')}
                  disabled={!anime?.idMal}
                  className={cn(
                    "flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    serverType === 'mal' ? "bg-primary text-[#0B0C0F] shadow-sm" : "text-gray-400 hover:text-gray-200"
                  )}
                  title={!anime?.idMal ? "MAL ID not available for this anime" : undefined}
                >
                  MAL
                </button>
                <button
                  onClick={() => setServerType('vidsrc')}
                  disabled={!imdbId}
                  className={cn(
                    "flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    serverType === 'vidsrc' ? "bg-primary text-[#0B0C0F] shadow-sm" : "text-gray-400 hover:text-gray-200"
                  )}
                  title={!imdbId ? "IMDb ID not available for this anime" : undefined}
                >
                  VidSrc
                </button>
              </div>
              {/* Audio Type Selector */}
              {serverType !== 'vidsrc' && (
                <div className="flex items-center bg-gray-800 rounded-lg p-1 w-full sm:w-auto justify-center mt-2 sm:mt-0">
                  <button
                    onClick={() => setAudioType('sub')}
                    className={cn(
                      "flex-1 sm:flex-none px-6 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-colors",
                      audioType === 'sub' ? "bg-primary text-[#0B0C0F] shadow-sm" : "text-gray-400 hover:text-gray-200"
                    )}
                  >
                    Sub
                  </button>
                  <button
                    onClick={() => setAudioType('dub')}
                    className={cn(
                      "flex-1 sm:flex-none px-6 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-colors",
                      audioType === 'dub' ? "bg-primary text-[#0B0C0F] shadow-sm" : "text-gray-400 hover:text-gray-200"
                    )}
                  >
                    Dub
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Nav: Next */}
            <div className="hidden lg:block">
              {currentEp < Math.max(1, episodeCount) ? (
                <Link
                  to={\`/watch/\${animeId}/\${currentEp + 1}\`}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-[#0B0C0F] rounded-lg transition-colors font-bold text-sm"
                >
                  Next Episode
                </Link>
              ) : (
                <div className="px-4 py-2 bg-gray-800/50 text-gray-500 rounded-lg font-bold text-sm cursor-not-allowed">
                  Next Episode
                </div>
              )}
            </div>
          </div>`;

if (content.includes('Megaplay AniList')) {
   // typo fix
}
content = content.replace(oldBlock, newBlock);

fs.writeFileSync('src/pages/Watch.tsx', content);
console.log('patched watch controls');
