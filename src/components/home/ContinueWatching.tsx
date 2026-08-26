import React, { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { getProgress, removeProgress } from '../../store/progress';
import { Link } from 'react-router-dom';
import { Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ContinueWatching() {
  const [progress, setProgress] = useState(getProgress());
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });
  
  // Refresh when needed, but typically progress is loaded on mount
  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (progress.length === 0) return null;

  return (
    <section className="shrink-0 w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Continue Watching</h2>
        <Link to="/continue-watching" className="text-[10px] text-primary cursor-pointer hover:text-white transition-colors">View All</Link>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          <AnimatePresence mode="popLayout">
            {progress.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
                transition={{ duration: 0.3 }}
                key={item.animeId} 
                className="relative flex-[0_0_200px] sm:flex-[0_0_220px] group"
              >
              <Link 
                to={`/watch/${item.animeId}/${item.lastEpisodeWatched}`}
                className="block relative cursor-pointer"
              >
                <div className="relative h-28 rounded-lg overflow-hidden bg-gray-800 mb-2 border border-white/5">
                  <img 
                    src={item.coverImage} 
                    alt={item.animeTitle} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-[#0B0C0F]">
                      <Play size={20} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-primary" style={{ width: '75%', boxShadow: '0 0 10px #8AD7D0' }}></div>
                </div>
                <h3 className="text-xs font-semibold text-[#EDF1F5] truncate group-hover:text-primary transition-colors">
                  {item.animeTitle}
                </h3>
                <p className="text-[10px] text-gray-500">
                  Episode {item.lastEpisodeWatched}
                </p>
              </Link>
              <button 
                className="absolute top-2 right-2 bg-black/60 hover:bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeProgress(item.animeId);
                  setProgress(getProgress());
                }}
              >
                <X size={14} />
              </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.div layout className="relative flex-[0_0_200px] sm:flex-[0_0_220px]">
            <Link to="/continue-watching" className="flex items-center justify-center border-2 border-dashed border-gray-800 rounded-lg h-28 text-gray-700 hover:text-gray-500 hover:border-gray-700 transition-colors text-[10px] font-bold">
              + MORE ACTIVE SERIES
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
