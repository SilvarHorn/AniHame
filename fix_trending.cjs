const fs = require('fs');

const code = `import React, { useRef } from 'react';
import { AnimeMedia } from '../../types';
import AnimeCard from '../ui/AnimeCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TrendingGridProps {
  trending: AnimeMedia[];
  country: string;
  onCountryChange: (country: string) => void;
}

export default function TrendingGrid({ trending, country, onCountryChange }: TrendingGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!trending || trending.length === 0) return null;

  return (
    <div className="flex flex-col h-full w-full relative group">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Trending Now</h2>
        <div className="flex items-center gap-3">
          <select 
            value={country} 
            onChange={(e) => onCountryChange(e.target.value)}
            className="bg-[#151F2E] border border-gray-700 text-gray-400 text-[10px] uppercase font-bold rounded px-2 py-0.5 focus:outline-none focus:border-primary"
          >
            <option value="">All Regions</option>
            <option value="JP">Japanese</option>
            <option value="CN">Chinese</option>
          </select>
          <div className="flex gap-2">
            <button onClick={() => scroll(-300)} className="p-1 bg-gray-800 rounded hover:bg-primary hover:text-black transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll(300)} className="p-1 bg-gray-800 rounded hover:bg-primary hover:text-black transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="relative w-full">
        <button 
          onClick={() => scroll(-400)} 
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-black transition-all hidden sm:block"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div 
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4"
        >
          {trending.map((anime) => (
            <div key={anime.id} className="snap-start shrink-0 w-28 sm:w-32 md:w-36 lg:w-40">
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => scroll(400)} 
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-black transition-all hidden sm:block"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/home/TrendingGrid.tsx', code);
