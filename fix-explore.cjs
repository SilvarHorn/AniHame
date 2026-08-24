const fs = require('fs');

// 1. Update anilist.ts
let apiCode = fs.readFileSync('src/api/anilist.ts', 'utf8');
apiCode = apiCode.replace(
  /\$seasonYear_in: \[Int\], \$season_in: \[MediaSeason\]/,
  '$seasonYear: Int, $season: MediaSeason'
);
apiCode = apiCode.replace(
  /seasonYear_in: \$seasonYear_in, season_in: \$season_in/,
  'seasonYear: $seasonYear, season: $season'
);

// Better error handling for the fetchAnilist while we're at it
apiCode = apiCode.replace(
  "if (!response.ok) {\n    throw new Error('Network response was not ok');\n  }",
  "const json = await response.json().catch(()=>null);\n  if (json && json.errors) {\n    throw new Error(json.errors[0].message);\n  }\n  if (!response.ok) {\n    throw new Error('HTTP Error ' + response.status);\n  }\n  return json.data;"
);
// Remove the old json parsing below it
apiCode = apiCode.replace(
  "const json = await response.json();\n  if (json.errors) {\n    throw new Error(json.errors[0].message);\n  }\n    \n  return json.data;",
  ""
);

fs.writeFileSync('src/api/anilist.ts', apiCode);

// 2. Update Explore.tsx
let expCode = fs.readFileSync('src/pages/Explore.tsx', 'utf8');
expCode = expCode.replace(
  "const [years, setYears] = useState<(string | number)[]>([]);",
  "const [year, setYear] = useState<string | number>('');"
);
expCode = expCode.replace(
  "const [seasons, setSeasons] = useState<(string | number)[]>([]);",
  "const [season, setSeason] = useState<string>('');"
);

expCode = expCode.replace(
  /seasonYear_in: years\.length > 0 \? years : undefined,\n\s*season_in: seasons\.length > 0 \? seasons : undefined,/,
  'seasonYear: year ? Number(year) : undefined,\n          season: season ? season : undefined,'
);

// Update dependencies array
expCode = expCode.replace(
  "years, seasons",
  "year, season"
);

// Update UI
const yearsMulti = /<MultiSelect\s*label="Years"[\s\S]*?onChange=\{\(v\) => \{ setYears\(v\); setPage\(1\); \}\}\s*\/>/;
const seasonsMulti = /<MultiSelect\s*label="Seasons"[\s\S]*?onChange=\{\(v\) => \{ setSeasons\(v\); setPage\(1\); \}\}\s*\/>/;

const yearSelect = `<select 
            value={year} 
            onChange={e => { setYear(e.target.value); setPage(1); }}
            className="bg-[#151F2E] border border-gray-700 text-[#EDF1F5] text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="">All Years</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>`;

const seasonSelect = `<select 
            value={season} 
            onChange={e => { setSeason(e.target.value); setPage(1); }}
            className="bg-[#151F2E] border border-gray-700 text-[#EDF1F5] text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="">All Seasons</option>
            {SEASONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>`;

expCode = expCode.replace(yearsMulti, yearSelect);
expCode = expCode.replace(seasonsMulti, seasonSelect);

fs.writeFileSync('src/pages/Explore.tsx', expCode);
console.log('Fixed Explore');
