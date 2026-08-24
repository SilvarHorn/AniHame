const fs = require('fs');
let code = fs.readFileSync('src/components/home/Timetable.tsx', 'utf8');

// Change `.slice(0, 5)` to `.slice(0, 10)` or `.slice(0, 12)`
// And change the container of the items from `space-y-2` to a grid on larger screens.
code = code.replace(
  '<div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">',
  '<div className="flex-1 overflow-y-auto custom-scrollbar pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">'
);
code = code.replace(
  '{filteredSchedule.slice(0, 5).map(item => {',
  '{filteredSchedule.slice(0, 12).map(item => {'
);
code = code.replace(
  'py-1.5 border-b border-gray-800 hover:bg-white/5 transition-colors group px-2 rounded-lg',
  'py-2 border border-gray-800 bg-[#0B0C0F] hover:border-primary/50 transition-colors group px-3 rounded-lg'
);
fs.writeFileSync('src/components/home/Timetable.tsx', code);
