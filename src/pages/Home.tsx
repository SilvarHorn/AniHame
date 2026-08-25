import React, { useEffect, useState } from 'react';
import Banner from '../components/home/Banner';
import TrendingGrid from '../components/home/TrendingGrid';
import LatestGrid from '../components/home/LatestGrid';
import ContinueWatching from '../components/home/ContinueWatching';
import Timetable from '../components/home/Timetable';
import { fetchAnilist, TRENDING_ANIME_QUERY, LATEST_UPDATED_ANIME_QUERY } from '../api/anilist';
import { AnimeMedia } from '../types';

export default function Home() {
  const [trending, setTrending] = useState<AnimeMedia[]>([]);
  const [latest, setLatest] = useState<AnimeMedia[]>([]);
  
  const getProfileRegion = () => {
    try {
      const saved = localStorage.getItem('anime_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.defaultRegion !== undefined) return parsed.defaultRegion;
      }
    } catch (e) {}
    return 'JP';
  };

  const [loading, setLoading] = useState(true);
  const [trendingCountry, setTrendingCountry] = useState(getProfileRegion);
  const [latestCountry, setLatestCountry] = useState(getProfileRegion);
  const [latestPage, setLatestPage] = useState(1);
  const [latestHasNext, setLatestHasNext] = useState(false);
  const [isFetchingLatest, setIsFetchingLatest] = useState(false);
  const [error, setError] = useState('');

  // Fetch Trending
  useEffect(() => {
    const fetchTrending = async () => {
      setError('');
      try {
        const data = await fetchAnilist(TRENDING_ANIME_QUERY, { 
          page: 1, 
          perPage: 20,
          countryOfOrigin: trendingCountry || undefined
        });
        setTrending(data?.Page?.media || []);
      } catch (error) {
        console.error('Error fetching trending:', error);
        setError('Failed to fetch trending anime.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, [trendingCountry]);

  // Fetch Latest
  useEffect(() => {
    let isMounted = true;
    const fetchLatest = async () => {
      setIsFetchingLatest(true);
      setError('');
      try {
        const data = await fetchAnilist(LATEST_UPDATED_ANIME_QUERY, { 
          page: latestPage, 
          perPage: 24,
          countryOfOrigin: latestCountry || undefined
        });
        if (isMounted) {
          setLatest(data?.Page?.media || []);
          setLatestHasNext(data?.Page?.pageInfo?.hasNextPage || false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching latest:', err);
          setError('Failed to fetch latest updates.');
        }
      } finally {
        if (isMounted) {
          setIsFetchingLatest(false);
        }
      }
    };
    fetchLatest();
    return () => { isMounted = false; };
  }, [latestCountry, latestPage]);

  // Reset page on country change
  useEffect(() => {
    setLatestPage(1);
  }, [latestCountry]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500 font-medium">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Banner trending={trending} />
      <div className="flex-1 flex flex-col p-4 md:p-6 lg:px-8 gap-6 max-w-7xl mx-auto w-full">
        <ContinueWatching />
        <div className="flex flex-col gap-8">
          <LatestGrid 
            latest={latest} 
            country={latestCountry} 
            onCountryChange={setLatestCountry}
            page={latestPage}
            hasNextPage={latestHasNext}
            isLoading={isFetchingLatest}
            onNextPage={() => setLatestPage(p => p + 1)}
            onPrevPage={() => setLatestPage(p => Math.max(1, p - 1))}
          />
          <TrendingGrid trending={trending} country={trendingCountry} onCountryChange={setTrendingCountry} />
          <div className="w-full">
            <Timetable />
          </div>
        </div>
      </div>
    </div>
  );
}
