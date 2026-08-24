import React, { useEffect, useState } from 'react';
import { fetchAnilist, TRENDING_ANIME_QUERY } from '../api/anilist';
import { AnimeMedia } from '../types';
import AnimeCard from '../components/ui/AnimeCard';

export default function Trending() {
  const [trending, setTrending] = useState<AnimeMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAnilist(TRENDING_ANIME_QUERY, { 
          page: page, 
          perPage: 24,
        });
        const results = data?.Page?.media || [];
        setTrending(results);
        setHasNextPage(results.length === 24);
      } catch (error) {
        console.error('Error fetching trending:', error);
        setError('Failed to fetch trending anime.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[#EDF1F5] flex items-center gap-3">
          <span className="w-1.5 h-8 bg-primary rounded-full inline-block"></span>
          Trending Anime
        </h1>
      </div>

      {loading ? (
        <div className="text-center text-primary py-12">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : trending.length > 0 ? (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
            {trending.map(anime => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
          
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-[#151F2E] text-white rounded-lg disabled:opacity-50 hover:bg-gray-800 transition-colors font-bold text-sm"
            >
              Previous
            </button>
            <span className="text-gray-400 font-medium">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!hasNextPage}
              className="px-4 py-2 bg-[#151F2E] text-white rounded-lg disabled:opacity-50 hover:bg-gray-800 transition-colors font-bold text-sm"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="text-gray-400 py-12 text-center">
          No trending anime found.
        </div>
      )}
    </div>
  );
}
