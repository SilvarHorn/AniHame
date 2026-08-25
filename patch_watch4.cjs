const fs = require('fs');
let content = fs.readFileSync('src/pages/Watch.tsx', 'utf8');

const warningCode = `
          {serverType === '2embed' && window.self !== window.top && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
              <span className="text-yellow-500 text-xl leading-none">⚠️</span>
              <div>
                <span className="font-bold text-yellow-500">2Embedded Preview Blocked:</span> This video server blocks embedded preview windows. 
                To watch using 2Embedded, please <strong>open this application in a new browser tab</strong> using the button at the top right of the screen.
              </div>
            </div>
          )}
          <div className="w-full bg-black rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5 flex flex-col aspect-video shrink-0">
`;

content = content.replace(
  '<div className="w-full bg-black rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5 flex flex-col aspect-video shrink-0">',
  warningCode.trim()
);

fs.writeFileSync('src/pages/Watch.tsx', content);
