import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAnilist, ANIME_DETAILS_QUERY } from '../api/anilist';
import { AnimeMedia } from '../types';
import { saveProgress } from '../store/progress';
import { ChevronLeft, ArrowDownUp, LayoutGrid, List as ListIcon, PlayCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { MarqueeText } from '../components/MarqueeText';

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

  const episodeTitleMap = new Map<number, string>();
  const episodeThumbMap = new Map<number, string>();
  
  if (anime?.streamingEpisodes) {
    anime.streamingEpisodes.forEach(episode => {
      const match = episode.title.match(/Episode\s+(\d+)(?:\s*[-:]\s*(.*))?/i);
      if (match) {
        const epNum = parseInt(match[1]);
        if (match[2]) {
          episodeTitleMap.set(epNum, match[2].trim());
        }
        if (episode.thumbnail) {
          episodeThumbMap.set(epNum, episode.thumbnail);
        }
      }
    });
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col min-h-[calc(100vh-3.5rem)] pb-12">
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

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-12">
        {/* Left Side: Video Player */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="w-full bg-black rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5 flex flex-col aspect-video shrink-0">
            <div className="w-full h-full relative">
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

        {/* Right Side: Episodes Section */}
        <div className="w-full sm:max-w-[400px] md:max-w-[450px] lg:max-w-none mx-auto lg:mx-0 lg:w-[320px] xl:w-[360px] shrink-0 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#EDF1F5] flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
              Episodes
            </h2>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setIsListView(!isListView)}
                className="p-1.5 text-gray-400 hover:text-primary transition-colors bg-gray-800 rounded-lg border border-white/5"
                title="Toggle View Mode"
              >
                {isListView ? <LayoutGrid size={16} /> : <ListIcon size={16} />}
              </button>
              <button 
                onClick={() => setSortDesc(!sortDesc)}
                className="p-1.5 text-gray-400 hover:text-primary transition-colors bg-gray-800 rounded-lg border border-white/5"
                title="Sort Order"
              >
                <ArrowDownUp size={16} />
              </button>
            </div>
          </div>
          
          <div className={cn(
            "gap-2 overflow-y-auto custom-scrollbar pr-2 lg:max-h-[calc(100vh-12rem)] pb-4",
            isListView 
              ? "flex flex-col gap-3" 
              : "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-5"
          )}>
          {episodes.map(epNum => (
            isListView ? (
              <Link
                key={epNum}
                to={`/watch/${anime.id}/${epNum}`}
                className={cn(
                  "flex items-center gap-4 bg-gray-800 hover:bg-gray-700 hover:border-primary/50 border rounded-xl p-3 font-bold text-sm text-gray-300 transition-all shadow-lg group relative overflow-hidden",
                  epNum === currentEp ? "border-primary/50 ring-1 ring-primary/50" : "border-white/5"
                )}
              >
                <div className="w-24 sm:w-28 aspect-video flex-shrink-0 relative rounded-lg overflow-hidden bg-gray-900">
                  <img 
                    src={episodeThumbMap.get(epNum) || anime.bannerImage || anime.coverImage.extraLarge || anime.coverImage.large} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={`Episode ${epNum}`} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col mb-1">
                    <span className={cn("text-lg font-black leading-tight", epNum === currentEp ? "text-primary" : "text-white")}>Ep {epNum}</span>
                    <span className="text-xs font-medium text-gray-400 truncate group-hover:text-white transition-colors">
                      {episodeTitleMap.get(epNum) || `Episode ${epNum}`}
                    </span>
                  </div>
                </div>
                <PlayCircle size={24} className={cn("mr-2 flex-shrink-0 transition-colors", epNum === currentEp ? "text-primary" : "text-gray-500 group-hover:text-primary")} />
              </Link>
            ) : (
              <Link
                key={epNum}
                to={`/watch/${anime.id}/${epNum}`}
                className={cn(
                  "relative aspect-square flex-col text-center bg-gray-800 hover:border-primary border rounded-xl flex items-center justify-center transition-all hover:scale-105 hover:-translate-y-1 shadow-lg overflow-hidden group",
                  epNum === currentEp ? "border-primary ring-1 ring-primary" : "border-white/5"
                )}
              >
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={episodeThumbMap.get(epNum) || anime.bannerImage || anime.coverImage.extraLarge || anime.coverImage.large} 
                    alt={`Episode ${epNum}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-30" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0F] via-[#0B0C0F]/40 to-transparent opacity-80" />
                </div>
                
                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-2">
                  <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:opacity-0 group-hover:scale-90">
                    <span className={cn(
                      "text-xl md:text-2xl lg:text-lg xl:text-xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]",
                      epNum === currentEp ? "text-primary" : "text-white"
                    )}>
                      {epNum}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-105 group-hover:scale-100">
                    <MarqueeText 
                      text={episodeTitleMap.get(epNum) || `Episode ${epNum}`}
                      className="text-[10px] md:text-[11px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-tight"
                    />
                  </div>
                </div>
              </Link>
            )
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
