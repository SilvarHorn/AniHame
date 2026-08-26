const fs = require('fs');
let content = fs.readFileSync('src/pages/Watch.tsx', 'utf8');

// 1. Add import
if (!content.includes('AnimeInfo')) {
  content = content.replace("import { MarqueeText } from '../components/MarqueeText';", "import { MarqueeText } from '../components/MarqueeText';\nimport { AnimeInfo } from '../components/ui/AnimeInfo';");
}

// 2. Add desktop layout (hidden lg:block) below episode controls
// The episode controls end right before the Right Side block:
const episodeControlsEnd = `              )}
            </div>
          </div>
        </div>

        {/* Right Side: Episodes Section */}`;

const replaceWithDesktopInfo = `              )}
            </div>
          </div>

          <div className="hidden lg:block mt-4">
            <AnimeInfo anime={anime} />
          </div>
        </div>

        {/* Right Side: Episodes Section */}`;

content = content.replace(episodeControlsEnd, replaceWithDesktopInfo);

// 3. Add mobile layout (block lg:hidden) below episodes list
const endOfFile = `        </div>
      </div>
      </div>
    </div>
  );
}`;

const replaceWithMobileInfo = `        </div>
      </div>

      <div className="block lg:hidden mt-8 mb-8">
        <AnimeInfo anime={anime} />
      </div>

      </div>
    </div>
  );
}`;

content = content.replace(endOfFile, replaceWithMobileInfo);

fs.writeFileSync('src/pages/Watch.tsx', content);
console.log('patched anime info');
