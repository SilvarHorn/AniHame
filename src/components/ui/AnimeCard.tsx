import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { AnimeMedia } from '../../types';

interface AnimeCardProps {
  key?: React.Key;
  anime: AnimeMedia;
  showProgress?: boolean;
  progressEpisode?: number;
  orientation?: 'portrait' | 'landscape';
}

export default function AnimeCard({ anime, showProgress, progressEpisode, orientation = 'portrait' }: AnimeCardProps) {
  const title = anime.title.english || anime.title.romaji;
  
  const isLandscape = orientation === 'landscape';
  const imageSrc = isLandscape && anime.bannerImage ? anime.bannerImage : anime.coverImage.large;

  return (
    <Link 
      to={showProgress && progressEpisode ? `/watch/${anime.id}/${progressEpisode}` : `/anime/${anime.id}`}
      className="flex flex-col gap-2 group cursor-pointer" draggable={false}
    >
      <div className={`${isLandscape ? 'aspect-[16/9]' : 'aspect-[3/4]'} bg-gray-800 rounded relative overflow-hidden border border-white/5`}>
        <img 
          src={imageSrc} 
          alt={title}
          loading="lazy"
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" draggable={false}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-[#0B0C0F]">
            <Play size={20} fill="currentColor" className="ml-1" />
          </div>
        </div>

        {/* Rating */}
        {anime.averageScore && (
          <div className="absolute top-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold text-primary">
            {(anime.averageScore / 10).toFixed(1)}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-[11px] sm:text-xs font-bold truncate text-[#EDF1F5] group-hover:text-primary transition-colors">
          {title}
        </div>
        
        {showProgress && progressEpisode && (
          <span className="text-[10px] text-primary">
            Ep {progressEpisode}
          </span>
        )}
      </div>
    </Link>
  );
}
