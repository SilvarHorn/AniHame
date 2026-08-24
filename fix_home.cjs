const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const oldLayout = `<div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-[3] flex flex-col gap-6">
            <TrendingGrid trending={trending} country={trendingCountry} onCountryChange={setTrendingCountry} />
            <LatestGrid latest={latest} country={latestCountry} onCountryChange={setLatestCountry} />
          </div>
          <div className="flex-[2] flex flex-col h-[500px] lg:h-auto lg:self-stretch min-h-0">
            <Timetable />
          </div>
        </div>`;

const newLayout = `<div className="flex flex-col gap-8">
          <TrendingGrid trending={trending} country={trendingCountry} onCountryChange={setTrendingCountry} />
          <LatestGrid latest={latest} country={latestCountry} onCountryChange={setLatestCountry} />
          <div className="h-[600px] lg:h-[800px] w-full">
            <Timetable />
          </div>
        </div>`;

code = code.replace(oldLayout, newLayout);
fs.writeFileSync('src/pages/Home.tsx', code);
