import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchAnilist, SEARCH_ANIME_QUERY } from '../api/anilist';
import { AnimeMedia } from '../types';
import AnimeCard from '../components/ui/AnimeCard';
import MultiSelect from '../components/ui/MultiSelect';
import { motion, AnimatePresence } from 'motion/react';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, i) => CURRENT_YEAR + 1 - i);

const SEASONS = [
  { label: 'Winter', value: 'WINTER' },
  { label: 'Spring', value: 'SPRING' },
  { label: 'Summer', value: 'SUMMER' },
  { label: 'Fall', value: 'FALL' },
];

const FORMATS = [
  { label: 'TV', value: 'TV' },
  { label: 'TV Short', value: 'TV_SHORT' },
  { label: 'Movie', value: 'MOVIE' },
  { label: 'Special', value: 'SPECIAL' },
  { label: 'OVA', value: 'OVA' },
  { label: 'ONA', value: 'ONA' },
  { label: 'Music', value: 'MUSIC' },
];

const SORTS = [
  { label: 'Popularity', value: 'POPULARITY_DESC' },
  { label: 'Score', value: 'SCORE_DESC' },
  { label: 'Trending', value: 'TRENDING_DESC' },
  { label: 'Updated', value: 'UPDATED_AT_DESC' },
  { label: 'Newest', value: 'START_DATE_DESC' },
];

export default function Explore() {
  const [searchParams] = useSearchParams();
  const initialSearchQuery = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchResults, setSearchResults] = useState<AnimeMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('');
  const [year, setYear] = useState<string | number>('');
  const [season, setSeason] = useState<string>('');
  const [formats, setFormats] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState('POPULARITY_DESC');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Sync initial query if it changes from URL (e.g. Navbar search)
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setPage(1); // reset to first page on new search
  }, [searchParams]);

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAnilist(SEARCH_ANIME_QUERY, { 
          search: searchQuery || undefined,
          genre_in: genre ? [genre] : undefined,
          status_in: status ? [status] : undefined,
          seasonYear: year ? Number(year) : undefined,
          season: season ? season : undefined,
          format_in: formats.length > 0 ? formats : undefined,
          sort: [sort],
          page: page,
          perPage: 24
        });
        
        const results = data?.Page?.media || [];
        setSearchResults(results);
        setHasNextPage(results.length === 24); // simple check
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('Failed to fetch anime.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [searchQuery, genre, status, year, season, formats, sort, page]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[#EDF1F5] flex items-center gap-3">
          <span className="w-1.5 h-8 bg-primary rounded-full inline-block"></span>
          Explore Anime
        </h1>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search anime..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full bg-[#151F2E] border border-gray-700 text-[#EDF1F5] rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center mt-2">
          <select 
            value={sort} 
            onChange={e => { setSort(e.target.value); setPage(1); }}
            className="bg-[#151F2E] border border-gray-700 text-[#EDF1F5] text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-primary"
          >
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select 
            value={genre} 
            onChange={e => { setGenre(e.target.value); setPage(1); }}
            className="bg-[#151F2E] border border-gray-700 text-[#EDF1F5] text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Adventure">Adventure</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Slice of Life">Slice of Life</option>
          </select>
          <select 
            value={status} 
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="bg-[#151F2E] border border-gray-700 text-[#EDF1F5] text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="">All Status</option>
            <option value="RELEASING">Releasing</option>
            <option value="FINISHED">Finished</option>
            <option value="NOT_YET_RELEASED">Upcoming</option>
          </select>
          
          <select 
            value={year} 
            onChange={e => { setYear(e.target.value); setPage(1); }}
            className="bg-[#151F2E] border border-gray-700 text-[#EDF1F5] text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="">All Years</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          
          <select 
            value={season} 
            onChange={e => { setSeason(e.target.value); setPage(1); }}
            className="bg-[#151F2E] border border-gray-700 text-[#EDF1F5] text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="">All Seasons</option>
            {SEASONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          
          <MultiSelect 
            label="Format"
            options={FORMATS}
            selected={formats}
            onChange={(v) => { setFormats(v); setPage(1); }}
          />
        </div>
      </div>

      {loading && searchResults.length === 0 ? (
        <div className="min-h-[400px]"></div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : searchResults.length > 0 ? (
        <>
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={searchResults.map(a => a?.id).join('-')}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6"
              >
                {searchResults.map(anime => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 bg-[#151F2E] text-white rounded-lg disabled:opacity-50 hover:bg-gray-800 transition-colors font-bold text-sm"
            >
              Previous
            </button>
            <span className="text-gray-400 font-medium">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!hasNextPage || loading}
              className="px-4 py-2 bg-[#151F2E] text-white rounded-lg disabled:opacity-50 hover:bg-gray-800 transition-colors font-bold text-sm"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="text-gray-400 py-12 text-center">
          No anime found matching your criteria.
        </div>
      )}
    </div>
  );
}
