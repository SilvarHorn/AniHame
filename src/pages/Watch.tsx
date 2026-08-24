import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAnilist, ANIME_DETAILS_QUERY } from '../api/anilist';
import { AnimeMedia } from '../types';
import { saveProgress } from '../store/progress';
import { ChevronLeft, ListVideo, ArrowDownUp, LayoutGrid, List as ListIcon, PlayCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Watch() {
  const { id, ep } = useParams();
  const [anime, setAnime] = useState<AnimeMedia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortDesc, setSortDesc] = useState(false);
  const [isListView, setIsListView] = useState(false);
  
  const animeId = Number(id);
  const currentEp = Number(ep);

  useEffect(() => {
    const loadDetails = async () => {
      setError('');
      try {
        const data = await fetchAnilist(ANIME_DETAILS_QUERY, { id: animeId });
        if (data?.Media) {
          setAnime(data.Media);
          
          // Save to progress
          saveProgress({
            animeId: data.Media.id,
            animeTitle: data.Media.title.english || data.Media.title.romaji,
            coverImage: data.Media.coverImage.extraLarge,
            lastEpisodeWatched: currentEp,
            timestamp: Date.now()
          });
        } else {
          setError('Anime not found.');
        }
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Failed to load video details.');
      } finally {
        setLoading(false);
      }
    };

    if (animeId) loadDetails();
  }, [animeId, currentEp]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500 font-medium">Error: {error}</div>
      </div>
    );
  }

  if (!anime) return null;

  // Same logic to get available episodes
  let episodeCount = anime.episodes || 12;
  if (anime.nextAiringEpisode) {
    episodeCount = anime.nextAiringEpisode.episode - 1;
  }

  let episodes = Array.from({ length: Math.max(1, episodeCount) }, (_, i) => i + 1);
  if (sortDesc) {
    episodes = episodes.reverse();
  }

  const iframeUrl = `https://anilink.cc/watch/${animeId}/${currentEp}?variant=sub&primaryColor=%238AD7D0&secondaryColor=%23B2EFEA&iconColor=%23FFFFFF`;

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 lg:h-[calc(100vh-3.5rem)] flex flex-col min-h-[calc(100vh-3.5rem)]">
      <div className="flex items-center gap-4 mb-4 md:mb-6 shrink-0">
        <Link 
          to={`/anime/${anime.id}`}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-lg transition-colors border border-white/5"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-[#EDF1F5] line-clamp-1">
          {anime.title.english || anime.title.romaji}
          <span className="text-primary ml-2 font-medium">Episode {currentEp}</span>
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 flex-1 min-h-0">
        {/* Left Side - Video Player */}
        <div className="w-full lg:flex-1 flex flex-col gap-4">
          <div className="w-full bg-black rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5 flex flex-col aspect-video lg:aspect-auto shrink-0 lg:flex-1">
            <div className="w-full h-full relative lg:flex-1">
              <iframe 
                src={iframeUrl}
                allowFullScreen
                className="absolute inset-0 w-full h-full border-none"
                title={`Watch ${anime.title.romaji} Episode ${currentEp}`}
              ></iframe>
            </div>
          </div>
          
          {/* Episode Controls */}
          <div className="flex items-center justify-between bg-[#151F2E] p-4 rounded-xl border border-primary/10 shrink-0">
            {currentEp > 1 ? (
              <Link
                to={`/watch/${animeId}/${currentEp - 1}`}
                className="px-4 py-2 bg-gray-800 hover:bg-primary hover:text-[#0B0C0F] text-gray-300 rounded-lg transition-colors font-bold text-sm"
              >
                Previous Episode
              </Link>
            ) : (
              <div className="px-4 py-2 bg-gray-800/50 text-gray-500 rounded-lg font-bold text-sm cursor-not-allowed">
                Previous Episode
              </div>
            )}
            
            {currentEp < Math.max(1, episodeCount) ? (
              <Link
                to={`/watch/${animeId}/${currentEp + 1}`}
                className="px-4 py-2 bg-gray-800 hover:bg-primary hover:text-[#0B0C0F] text-gray-300 rounded-lg transition-colors font-bold text-sm"
              >
                Next Episode
              </Link>
            ) : (
              <div className="px-4 py-2 bg-gray-800/50 text-gray-500 rounded-lg font-bold text-sm cursor-not-allowed">
                Next Episode
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Episode List */}
        <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col bg-[#151F2E] rounded-xl border border-primary/10 overflow-hidden lg:h-full max-h-[450px] lg:max-h-none">
          <div className="p-3 md:p-4 bg-[#0B0C0F]/50 border-b border-primary/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ListVideo size={18} className="text-primary" />
              <h2 className="font-semibold text-[#EDF1F5]">Episodes</h2>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsListView(!isListView)}
                className="p-1.5 text-gray-400 hover:text-primary transition-colors bg-gray-800 rounded"
                title="Toggle View Mode"
              >
                {isListView ? <LayoutGrid size={14} /> : <ListIcon size={14} />}
              </button>
              <button 
                onClick={() => setSortDesc(!sortDesc)}
                className="p-1.5 text-gray-400 hover:text-primary transition-colors bg-gray-800 rounded"
                title="Sort Order"
              >
                <ArrowDownUp size={14} />
              </button>
            </div>
          </div>
          <div className={cn(
            "p-3 md:p-4 overflow-y-auto flex-1 custom-scrollbar content-start",
            isListView 
              ? "flex flex-col gap-2" 
              : "grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-5 gap-1.5 md:gap-2"
          )}>
            {episodes.map(epNum => (
              isListView ? (
                <Link
                  key={epNum}
                  to={`/watch/${animeId}/${epNum}`}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all shadow-sm border",
                    epNum === currentEp 
                      ? "bg-primary text-[#0B0C0F] border-transparent" 
                      : "bg-gray-800 text-gray-300 hover:bg-primary hover:text-[#0B0C0F] border-white/5"
                  )}
                >
                  <PlayCircle size={16} className={epNum === currentEp ? "text-[#0B0C0F]" : "text-gray-500"} />
                  <span className="font-semibold text-sm">Episode {epNum}</span>
                </Link>
              ) : (
                <Link
                  key={epNum}
                  to={`/watch/${animeId}/${epNum}`}
                  className={cn(
                    "aspect-square rounded flex items-center justify-center font-bold text-[10px] md:text-xs transition-all shadow-sm border",
                    epNum === currentEp 
                      ? "bg-primary text-[#0B0C0F] border-transparent" 
                      : "bg-gray-800 text-gray-400 hover:bg-primary hover:text-[#0B0C0F] border-white/5"
                  )}
                >
                  {epNum}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
