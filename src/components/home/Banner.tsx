import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { AnimeMedia } from '../../types';
import { Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BannerProps {
  trending: AnimeMedia[];
}

export default function Banner({ trending }: BannerProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!trending || trending.length === 0) return null;

  // Ensure we have up to 10 for the banner
  const bannerAnime = trending.slice(0, 10);

  return (
    <div className="relative w-full h-[50vh] min-h-[400px] overflow-hidden shrink-0 group">
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {bannerAnime.map((anime, index) => (
            <div key={anime.id} className="relative flex-[0_0_100%] h-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${anime.bannerImage || anime.coverImage.extraLarge})` }}
              >
                {/* Gradients for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C0F] via-[#0B0C0F]/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0F] via-transparent to-transparent md:hidden" />
              </div>
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-center px-6 md:px-12 gap-3 w-full md:w-2/3 max-w-7xl mx-auto">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary text-[#0B0C0F] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      TRENDING #{index + 1}
                    </span>
                    {anime.averageScore && (
                      <span className="text-primary text-xs font-semibold">
                        ★ {(anime.averageScore / 10).toFixed(1)} Score
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 line-clamp-2 leading-tight">
                    {anime.title.english || anime.title.romaji}
                  </h1>
                  
                  <p className="text-gray-400 text-sm md:text-base mb-6 line-clamp-2 md:line-clamp-3 max-w-lg">
                    {anime.description?.replace(/<[^>]*>?/gm, '') || 'No description available.'}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <Link 
                      to={`/watch/${anime.id}/1`}
                      className="bg-primary hover:bg-primary-hover text-[#0B0C0F] font-bold py-2.5 px-6 rounded-md flex items-center gap-2 transition-colors text-sm"
                    >
                      <Play size={16} fill="currentColor" />
                      Watch Now
                    </Link>
                    <Link 
                      to={`/anime/${anime.id}`}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold py-2.5 px-6 rounded-md flex items-center gap-2 transition-colors text-sm"
                    >
                      <Info size={16} />
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-10 px-4">
        {bannerAnime.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`transition-all duration-300 rounded-full ${
              index === selectedIndex
                ? 'w-6 h-2 bg-primary'
                : 'w-2 h-2 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
