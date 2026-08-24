import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAnilist, ANIME_DETAILS_QUERY } from '../api/anilist';
import { AnimeMedia } from '../types';
import { Play, Star, Calendar, Info, ExternalLink, ArrowDownUp, LayoutGrid, List as ListIcon, PlayCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { getAnimeListStatus, addOrUpdateToList, removeFromList, MyListStatus } from '../utils/myList';

export default function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState<AnimeMedia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [sortDesc, setSortDesc] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [listStatus, setListStatus] = useState<MyListStatus | null>(null);

  useEffect(() => {
    const loadDetails = async () => {
      setError('');
      try {
        const data = await fetchAnilist(ANIME_DETAILS_QUERY, { id: Number(id) });
        if (data?.Media) {
          setAnime(data.Media);
          setListStatus(getAnimeListStatus(Number(id)));
        } else {
          setError('Anime not found.');
        }
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Failed to fetch anime details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadDetails();
  }, [id]);

  const handleListStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '') {
      removeFromList(Number(id));
      setListStatus(null);
    } else if (anime) {
      const status = val as MyListStatus;
      addOrUpdateToList(anime, status);
      setListStatus(status);
      window.dispatchEvent(new Event('my-list-updated'));
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500 font-medium">Error: {error}</div>
      </div>
    );
  }

  if (!anime) return null;

  const title = anime.title.english || anime.title.romaji;
  
  // Create episode boxes
  let episodeCount = anime.episodes || 12; // Fallback
  if (anime.nextAiringEpisode) {
    episodeCount = anime.nextAiringEpisode.episode - 1;
  }
  
  const episodeTitleMap = new Map<number, string>();
  if (anime?.streamingEpisodes) {
    anime.streamingEpisodes.forEach(ep => {
      const match = ep.title.match(/Episode\s+(\d+)\s*[-:]\s*(.*)/i);
      if (match) {
        episodeTitleMap.set(parseInt(match[1]), match[2].trim());
      }
    });
  }

  let episodes = Array.from({ length: Math.max(1, episodeCount) }, (_, i) => i + 1);
  if (sortDesc) {
    episodes = episodes.reverse();
  }

  return (
    <div>
      {/* Banner Area */}
      <div className="relative w-full h-[40vh] min-h-[300px] overflow-hidden">
        <img 
          src={anime.bannerImage || anime.coverImage.extraLarge} 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0F] via-[#0B0C0F]/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Cover & Actions */}
          <div className="w-48 md:w-64 flex-shrink-0 mx-auto md:mx-0">
            <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5 bg-gray-800 aspect-[3/4] mb-6">
              <img 
                src={anime.coverImage.extraLarge} 
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <Link 
              to={`/watch/${anime.id}/1`}
              className="w-full bg-primary hover:bg-primary-hover text-[#0B0C0F] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg mb-3"
            >
              <Play size={20} fill="currentColor" />
              Watch Episode 1
            </Link>
            
            <div className="relative">
              <select
                value={listStatus || ''}
                onChange={handleListStatusChange}
                className="w-full appearance-none bg-gray-800 border border-white/10 hover:border-primary/50 text-gray-200 font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-center cursor-pointer"
              >
                <option value="">+ Add to My List</option>
                <option value="WATCHING">Watching</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On-Hold</option>
                <option value="DROPPED">Dropped</option>
                <option value="PLAN_TO_WATCH">Plan to Watch</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center px-2 text-gray-400">
                ▼
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="flex-grow pt-8 md:pt-32">
            <h1 className="text-3xl md:text-5xl font-bold text-[#EDF1F5] mb-4">
              {title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6 font-medium">
              <div className="flex items-center gap-1.5 text-primary">
                <Star size={18} fill="currentColor" />
                <span className="text-lg">{anime.averageScore}%</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
              <div className="flex items-center gap-1.5">
                <Calendar size={18} />
                <span>{anime.status}</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
              <div className="flex items-center gap-1.5">
                <Info size={18} />
                <span>{episodeCount} Episodes</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {anime.genres.map(genre => (
                <span 
                  key={genre}
                  className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-bold text-gray-300"
                >
                  {genre}
                </span>
              ))}
            </div>

            <p 
              className="text-gray-400 leading-relaxed mb-12 text-sm md:text-base max-w-3xl"
              dangerouslySetInnerHTML={{ __html: anime.description }}
            />

            {/* Episodes Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#EDF1F5] flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
                  Episodes
                </h2>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsListView(!isListView)}
                    className="p-2 text-gray-400 hover:text-primary transition-colors bg-gray-800 rounded-lg border border-white/5"
                    title="Toggle View Mode"
                  >
                    {isListView ? <LayoutGrid size={18} /> : <ListIcon size={18} />}
                  </button>
                  <button 
                    onClick={() => setSortDesc(!sortDesc)}
                    className="p-2 text-gray-400 hover:text-primary transition-colors bg-gray-800 rounded-lg border border-white/5"
                    title="Sort Order"
                  >
                    <ArrowDownUp size={18} />
                  </button>
                </div>
              </div>
              
              <div className={cn(
                "gap-3",
                isListView 
                  ? "flex flex-col" 
                  : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              )}>
                {episodes.map(ep => (
                  isListView ? (
                    <Link
                      key={ep}
                      to={`/watch/${anime.id}/${ep}`}
                      className="flex items-center gap-4 bg-gray-800 hover:bg-primary hover:text-[#0B0C0F] border border-white/5 rounded-xl p-4 font-bold text-sm text-gray-300 transition-all hover:scale-[1.01] shadow-lg group"
                    >
                      <PlayCircle size={20} className="text-gray-500 group-hover:text-[#0B0C0F]" />
                      <span className="text-base font-semibold">
                        Episode {ep}{episodeTitleMap.has(ep) ? `:"${episodeTitleMap.get(ep)}"` : ""}
                      </span>
                    </Link>
                  ) : (
                    <Link
                      key={ep}
                      to={`/watch/${anime.id}/${ep}`}
                      className="aspect-square flex-col text-center p-2 bg-gray-800 hover:bg-primary hover:text-[#0B0C0F] border border-white/5 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm text-gray-300 transition-all hover:scale-105 hover:-translate-y-1 shadow-lg"
                    >
                      <span className="line-clamp-3 px-1">
                        Episode {ep}{episodeTitleMap.has(ep) ? `:"${episodeTitleMap.get(ep)}"` : ""}
                      </span>
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
