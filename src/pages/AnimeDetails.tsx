import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAnilist, ANIME_DETAILS_QUERY } from '../api/anilist';
import { AnimeMedia } from '../types';
import { Play, Star, Calendar, Info, ExternalLink, ArrowDownUp, LayoutGrid, List as ListIcon, PlayCircle, MonitorPlay } from 'lucide-react';
import { cn } from '../lib/utils';
import { MarqueeText } from '../components/MarqueeText';
import { AnimeInfo } from '../components/ui/AnimeInfo';
import { getAnimeListStatus, addOrUpdateToList, removeFromList, MyListStatus } from '../utils/myList';
import AnimeCard from '../components/ui/AnimeCard';

const getRelatedAnime = (media: AnimeMedia) => {
  if (!media.relations || !media.relations.edges) return [];
  
  const uniqueAnime = new Map<number, { node: AnimeMedia, relationType: string }>();
  
  const traverse = (edges: any[], isDirect: boolean) => {
    edges.forEach(edge => {
      if (!edge || !edge.node) return;
      
      if (edge.node.type === 'ANIME' && edge.node.id !== media.id) {
        if (!uniqueAnime.has(edge.node.id)) {
           uniqueAnime.set(edge.node.id, {
             node: edge.node,
             relationType: isDirect ? edge.relationType : 'FRANCHISE'
           });
        } else if (isDirect) {
           uniqueAnime.set(edge.node.id, {
             node: edge.node,
             relationType: edge.relationType
           });
        }
      }
      
      if (edge.node.relations && edge.node.relations.edges) {
        traverse(edge.node.relations.edges, false);
      }
    });
  };
  
  traverse(media.relations.edges, true);
  
  return Array.from(uniqueAnime.values()).sort((a, b) => {
    if (a.relationType !== 'FRANCHISE' && b.relationType === 'FRANCHISE') return -1;
    if (a.relationType === 'FRANCHISE' && b.relationType !== 'FRANCHISE') return 1;
    return 0;
  });
};

export default function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState<AnimeMedia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [sortDesc, setSortDesc] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [listStatus, setListStatus] = useState<MyListStatus | null>(null);
  const [imdbId, setImdbId] = useState<string | null>(null);

  useEffect(() => {
    const loadDetails = async () => {
      setError('');
      try {
        const data = await fetchAnilist(ANIME_DETAILS_QUERY, { id: Number(id) });

        if (data?.Media) {
          setAnime(data.Media);
          setListStatus(getAnimeListStatus(Number(id)));
          
          fetch(`/api/mapping/${id}`)
            .then(res => res.json())
            .then(mapping => {
              if (mapping && mapping.imdb_id && mapping.imdb_id.length > 0) {
                // Sometimes it's an array, sometimes maybe a string, handle safely
                const iId = Array.isArray(mapping.imdb_id) ? mapping.imdb_id[0] : mapping.imdb_id;
                setImdbId(iId);
              }
            })
            .catch(err => console.error("Failed to fetch mapping", err));
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

  const relatedAnimeList = React.useMemo(() => anime ? getRelatedAnime(anime) : [], [anime]);

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
  const episodeThumbMap = new Map<number, string>();
  if (anime?.streamingEpisodes) {
    anime.streamingEpisodes.forEach(ep => {
      const match = ep.title.match(/Episode\s+(\d+)(?:\s*[-:]\s*(.*))?/i);
      if (match) {
        const epNum = parseInt(match[1]);
        if (match[2]) {
          episodeTitleMap.set(epNum, match[2].trim());
        }
        if (ep.thumbnail) {
          episodeThumbMap.set(epNum, ep.thumbnail);
        }
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

      <div className="w-full px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-12">
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
            
            <div className="relative mb-4">
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

            <div className="flex flex-col gap-2">
              <a
                href={`https://anilist.co/anime/${anime.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#02A9FF]/10 hover:bg-[#02A9FF]/20 text-[#02A9FF] border border-[#02A9FF]/30 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <ExternalLink size={16} />
                AniList
              </a>
              {anime.idMal && (
                <a
                  href={`https://myanimelist.net/anime/${anime.idMal}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#2E51A2]/10 hover:bg-[#2E51A2]/20 text-[#5383E8] border border-[#2E51A2]/30 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  <ExternalLink size={16} />
                  MyAnimeList
                </a>
              )}
              {imdbId && (
                <a
                  href={`https://www.imdb.com/title/${imdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#F5C518]/10 hover:bg-[#F5C518]/20 text-[#F5C518] border border-[#F5C518]/30 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  <ExternalLink size={16} />
                  IMDb
                </a>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="flex-grow pt-8 md:pt-32">
            <h1 className="text-3xl md:text-5xl font-bold text-[#EDF1F5] mb-4">
              {title}
            </h1>
            <div className="mb-12">
              <AnimeInfo anime={anime} hideTitle={true} className="bg-transparent border-none p-0 sm:p-0" />
            </div>
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
                      className="flex items-center gap-4 bg-gray-800 hover:bg-gray-700 hover:border-primary/50 border border-white/5 rounded-xl p-3 font-bold text-sm text-gray-300 transition-all shadow-lg group relative overflow-hidden"
                    >
                      <div className="w-32 aspect-video flex-shrink-0 relative rounded-lg overflow-hidden bg-gray-900">
                        <img 
                          src={episodeThumbMap.get(ep) || anime.bannerImage || anime.coverImage.extraLarge || anime.coverImage.large} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          alt={`Episode ${ep}`} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl font-black text-white">{ep}</span>
                          <span className="text-sm font-medium text-gray-400 truncate group-hover:text-white transition-colors">
                            {episodeTitleMap.get(ep) || `Episode ${ep}`}
                          </span>
                        </div>
                      </div>
                      <PlayCircle size={24} className="text-gray-500 group-hover:text-primary mr-2 flex-shrink-0" />
                    </Link>
                  ) : (
                    <Link
                      key={ep}
                      to={`/watch/${anime.id}/${ep}`}
                      className="relative aspect-video flex-col text-center bg-gray-800 hover:border-primary border border-white/5 rounded-xl flex items-center justify-center transition-all hover:scale-105 hover:-translate-y-1 shadow-lg overflow-hidden group"
                    >
                      <div className="absolute inset-0 w-full h-full">
                        <img 
                          src={episodeThumbMap.get(ep) || anime.bannerImage || anime.coverImage.extraLarge || anime.coverImage.large} 
                          alt={`Episode ${ep}`} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-30" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0F] via-[#0B0C0F]/40 to-transparent opacity-80" />
                      </div>
                      
                      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-2">
                        <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:opacity-0 group-hover:scale-90">
                          <span className="text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            {ep}
                          </span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-105 group-hover:scale-100">
                          <MarqueeText 
                            text={episodeTitleMap.get(ep) || `Episode ${ep}`}
                            className="text-xs text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-tight"
                          />
                        </div>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            </div>

            {/* Related Anime Section */}
            {relatedAnimeList.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#EDF1F5] flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
                    Related Anime
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {relatedAnimeList.map(item => (
                    <div key={item.node.id} className="flex flex-col gap-2">
                      <AnimeCard anime={item.node} />
                      <span className="text-xs text-primary font-bold uppercase tracking-wider text-center">{item.relationType.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
