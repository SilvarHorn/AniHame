const fs = require('fs');
let code = fs.readFileSync('src/pages/AnimeDetails.tsx', 'utf8');

// replace imports
code = code.replace(
  "import { cn } from '../lib/utils';",
  "import { cn } from '../lib/utils';\nimport { getAnimeListStatus, addOrUpdateToList, removeFromList, MyListStatus } from '../utils/myList';"
);

// replace state definition
code = code.replace(
  "const [isListView, setIsListView] = useState(false);",
  "const [isListView, setIsListView] = useState(false);\n  const [listStatus, setListStatus] = useState<MyListStatus | null>(null);"
);

// update useEffect
code = code.replace(
  "setAnime(data.Media);",
  "setAnime(data.Media);\n          setListStatus(getAnimeListStatus(Number(id)));"
);

// add handle change function
const handleCode = `  const handleListStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '') {
      removeFromList(Number(id));
      setListStatus(null);
    } else if (anime) {
      const status = val as MyListStatus;
      addOrUpdateToList(anime, status);
      setListStatus(status);
      window.dispatchEvent(new Event('my-list-updated'));
    }
  };

  if (error) {`;
code = code.replace("  if (error) {", handleCode);

const dropdownCode = `<Link 
              to={\`/watch/\${anime.id}/1\`}
              className="w-full bg-primary hover:bg-primary-hover text-[#0B0C0F] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg mb-3"
            >
              <Play size={20} fill="currentColor" />
              Watch Episode 1
            </Link>
            
            <div className="relative">
              <select
                value={listStatus || ''}
                onChange={handleListStatusChange}
                className="w-full appearance-none bg-gray-800 border border-white/10 hover:border-primary/50 text-gray-200 font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-center cursor-pointer"
              >
                <option value="">+ Add to My List</option>
                <option value="WATCHING">Watching</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On-Hold</option>
                <option value="DROPPED">Dropped</option>
                <option value="PLAN_TO_WATCH">Plan to Watch</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center px-2 text-gray-400">
                ▼
              </div>
            </div>`;
code = code.replace(/<Link[\s\S]*?Watch Episode 1\s*<\/Link>/, dropdownCode);

fs.writeFileSync('src/pages/AnimeDetails.tsx', code);
