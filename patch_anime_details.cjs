const fs = require('fs');

let infoContent = fs.readFileSync('src/components/ui/AnimeInfo.tsx', 'utf8');
infoContent = infoContent.replace(
  'export function AnimeInfo({ anime, className }: { anime: AnimeMedia, className?: string }) {',
  'export function AnimeInfo({ anime, className, hideTitle = false }: { anime: AnimeMedia, className?: string, hideTitle?: boolean }) {'
);
infoContent = infoContent.replace(
  '<h2 className="text-2xl font-bold text-[#EDF1F5] mb-4">About {title}</h2>',
  '{!hideTitle && <h2 className="text-2xl font-bold text-[#EDF1F5] mb-4">About {title}</h2>}'
);
fs.writeFileSync('src/components/ui/AnimeInfo.tsx', infoContent);

let detailsContent = fs.readFileSync('src/pages/AnimeDetails.tsx', 'utf8');

// Add import
if (!detailsContent.includes('AnimeInfo')) {
  detailsContent = detailsContent.replace(
    "import { MarqueeText } from '../components/MarqueeText';",
    "import { MarqueeText } from '../components/MarqueeText';\nimport { AnimeInfo } from '../components/ui/AnimeInfo';"
  );
}

const startString = `<div className="flex-grow pt-8 md:pt-32">
            <h1 className="text-3xl md:text-5xl font-bold text-[#EDF1F5] mb-4">
              {title}
            </h1>`;

const endString = `{/* Episodes Section */}`;

// Extract what is currently between them
const startIndex = detailsContent.indexOf(startString) + startString.length;
const endIndex = detailsContent.indexOf(endString);

if (startIndex > startString.length && endIndex > startIndex) {
  const toReplace = detailsContent.substring(startIndex, endIndex);
  
  detailsContent = detailsContent.replace(toReplace, `
            <div className="mb-12">
              <AnimeInfo anime={anime} hideTitle={true} className="bg-transparent border-none p-0 sm:p-0" />
            </div>
            `);
  fs.writeFileSync('src/pages/AnimeDetails.tsx', detailsContent);
  console.log("Patched AnimeDetails.tsx");
} else {
  console.log("Could not find replacement block.");
}
