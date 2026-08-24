const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const oldLayout = `<div className="h-[600px] lg:h-[800px] w-full">
            <Timetable />
          </div>`;

const newLayout = `<div className="w-full">
            <Timetable />
          </div>`;

code = code.replace(oldLayout, newLayout);
fs.writeFileSync('src/pages/Home.tsx', code);
