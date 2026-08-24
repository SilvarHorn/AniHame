import React, { useEffect, useState } from 'react';
import { format, fromUnixTime } from 'date-fns';
import { fetchAnilist, AIRING_SCHEDULE_QUERY } from '../api/anilist';
import { AiringSchedule } from '../types';
import { Link } from 'react-router-dom';

export default function Schedule() {
  const [schedule, setSchedule] = useState<AiringSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const getProfileRegion = () => {
    try {
      const saved = localStorage.getItem('anime_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.defaultRegion !== undefined) return parsed.defaultRegion;
      }
    } catch (e) {}
    return '';
  };
  
  const [country, setCountry] = useState(getProfileRegion);
  const [selectedDay, setSelectedDay] = useState('');

  useEffect(() => {
    const loadSchedule = async () => {
      setError('');
      try {
        const now = Math.floor(Date.now() / 1000);
        // Get next 7 days
        const nextWeek = now + 7 * 24 * 60 * 60;
        
        const data = await fetchAnilist(AIRING_SCHEDULE_QUERY, {
          airingAt_greater: now,
          airingAt_lesser: nextWeek,
          perPage: 150 // Fetch a larger batch for the full schedule
        });
        
        if (data?.Page?.airingSchedules) {
          setSchedule(data.Page.airingSchedules);
        }
      } catch (err) {
        console.error('Error fetching schedule:', err);
        setError('Failed to fetch schedule.');
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  const filteredSchedule = schedule.filter(item => country ? item.media.countryOfOrigin === country : true);
  
  // Group by day of the week
  const groupedSchedule: Record<string, AiringSchedule[]> = {};
  filteredSchedule.forEach(item => {
    const date = fromUnixTime(item.airingAt);
    const day = format(date, 'EEEE, MMM d');
    if (!groupedSchedule[day]) {
      groupedSchedule[day] = [];
    }
    groupedSchedule[day].push(item);
  });

  const days = Object.keys(groupedSchedule);
  useEffect(() => {
    if (days.length > 0 && !days.includes(selectedDay)) {
      setSelectedDay(days[0]);
    }
  }, [days, selectedDay]);

  const activeItems = groupedSchedule[selectedDay] || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
        <h1 className="text-2xl font-bold text-[#EDF1F5] flex items-center gap-3">
          <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
          Weekly Schedule
        </h1>
        <select 
          value={country} 
          onChange={(e) => setCountry(e.target.value)}
          className="bg-[#151F2E] border border-gray-700 text-[#EDF1F5] text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary"
        >
          <option value="">All Regions</option>
          <option value="JP">Japanese Anime</option>
          <option value="CN">Chinese Donghua</option>
        </select>
      </div>

      {error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : Object.keys(groupedSchedule).length === 0 ? (
        <div className="text-center text-gray-500 py-12">No schedule data available.</div>
      ) : (
        <div className="space-y-4">
          <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  selectedDay === day 
                    ? 'bg-primary text-[#0B0C0F]' 
                    : 'bg-[#151F2E] text-gray-400 hover:text-[#EDF1F5] border border-gray-800'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="bg-[#151F2E] rounded-xl border border-primary/10 overflow-hidden">
            <div className="divide-y divide-gray-800">
              {activeItems.map(item => (
                <Link 
                  key={item.id}
                  to={`/anime/${item.media.id}`}
                  className="flex flex-row items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors group"
                >
                  <div className="text-primary font-bold text-sm w-12 shrink-0">
                    {format(fromUnixTime(item.airingAt), 'HH:mm')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#EDF1F5] truncate group-hover:text-primary transition-colors">
                      {item.media.title.english || item.media.title.romaji}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      Episode {item.episode}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
