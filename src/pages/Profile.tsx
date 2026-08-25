import React, { useState, useEffect, useRef } from 'react';
import { User, Edit3, Save, Share2 } from 'lucide-react';
import AnimeCard from '../components/ui/AnimeCard';
import { MyListStatus, getMyList, MyListItem } from '../utils/myList';

const TABS: { label: string; value: MyListStatus }[] = [
  { label: 'Watching', value: 'WATCHING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'On-Hold', value: 'ON_HOLD' },
  { label: 'Dropped', value: 'DROPPED' },
  { label: 'Plan to Watch', value: 'PLAN_TO_WATCH' }
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<MyListStatus>('WATCHING');
  const [myList, setMyList] = useState<MyListItem[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 24;

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('anime_profile');
    return saved ? JSON.parse(saved) : {
      username: 'OtakuUser',
      bio: 'Just another anime fan.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=OtakuUser',
      defaultRegion: 'JP',
      themeColor: '#8AD7D0'
    };
  });

  const [gradType, setGradType] = useState('linear');
  const [gradDir, setGradDir] = useState('to right');
  const [gradColor1, setGradColor1] = useState('#141e30');
  const [gradColor2, setGradColor2] = useState('#243b55');

  const updateGradient = (t: string, d: string, c1: string, c2: string) => {
    setGradType(t);
    setGradDir(d);
    setGradColor1(c1);
    setGradColor2(c2);
    let str = '';
    if (t === 'solid') str = c1;
    else if (t === 'linear') str = `linear-gradient(${d}, ${c1}, ${c2})`;
    else str = `radial-gradient(${d}, ${c1}, ${c2})`;
    setProfile(prev => ({ ...prev, bgGradient: str }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setMyList(getMyList());
    
    // Listen for custom event if list changes elsewhere
    const handleListUpdate = () => setMyList(getMyList());
    window.addEventListener('my-list-updated', handleListUpdate);
    return () => window.removeEventListener('my-list-updated', handleListUpdate);
  }, []);

  // When tab changes, reset page
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const handleSave = () => {
    localStorage.setItem('anime_profile', JSON.stringify(profile));
    window.dispatchEvent(new Event('profile-updated'));
    setIsEditing(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Profile link copied to clipboard!');
  };

  const filteredList = myList
    .filter(item => item.status === activeTab)
    .sort((a, b) => b.addedAt - a.addedAt);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const paginatedList = filteredList.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[#151F2E] rounded-2xl border border-primary/10 p-8 mb-12 flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="relative group shrink-0">
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
          />
          <img 
            src={profile.avatar} 
            alt={profile.username}
            className="w-32 h-32 rounded-full bg-gray-800 object-cover border-4 border-gray-800"
          />
          {isEditing && (
            <button 
              className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => fileInputRef.current?.click()}
            >
              <Edit3 className="text-white" />
            </button>
          )}
        </div>
        
        <div className="flex-1">
          {isEditing ? (
            <div className="flex flex-col gap-4 max-w-md">
              <input 
                type="text"
                value={profile.username}
                onChange={e => setProfile({ ...profile, username: e.target.value })}
                className="bg-[#0B0C0F] text-[#EDF1F5] px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-primary"
                placeholder="Username"
              />
              <textarea 
                value={profile.bio}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                className="bg-[#0B0C0F] text-[#EDF1F5] px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-primary resize-none h-24"
                placeholder="Bio"
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Default Region</label>
                <select
                  value={profile.defaultRegion}
                  onChange={e => setProfile({ ...profile, defaultRegion: e.target.value })}
                  className="bg-[#0B0C0F] text-[#EDF1F5] px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-primary"
                >
                  <option value="JP">Japanese (Anime)</option>
                  <option value="CN">Chinese (Donghua)</option>
                  <option value="">All Regions</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Theme Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={profile.themeColor || '#8AD7D0'}
                    onChange={e => setProfile({ ...profile, themeColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                  <span className="text-sm text-gray-400">{profile.themeColor || '#8AD7D0'}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Background</label>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-3 bg-[#0B0C0F] p-4 rounded-lg border border-gray-700">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Type</label>
                        <select 
                          value={gradType} 
                          onChange={e => updateGradient(e.target.value, gradDir, gradColor1, gradColor2)}
                          className="bg-[#151F2E] text-[#EDF1F5] px-2 py-1.5 rounded border border-gray-600 text-sm focus:outline-none focus:border-primary"
                        >
                          <option value="solid">Solid Color</option>
                          <option value="linear">Linear Gradient</option>
                          <option value="radial">Radial Gradient</option>
                        </select>
                      </div>
                      
                      {gradType !== 'solid' && (
                        <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
                          <label className="text-[10px] text-gray-500 uppercase font-bold">Direction</label>
                          <select 
                            value={gradDir} 
                            onChange={e => updateGradient(gradType, e.target.value, gradColor1, gradColor2)}
                            className="bg-[#151F2E] text-[#EDF1F5] px-2 py-1.5 rounded border border-gray-600 text-sm focus:outline-none focus:border-primary"
                          >
                            {gradType === 'linear' ? (
                              <>
                                <option value="to right">To Right</option>
                                <option value="to bottom">To Bottom</option>
                                <option value="to bottom right">To Bottom Right</option>
                                <option value="45deg">45 Degrees</option>
                              </>
                            ) : (
                              <>
                                <option value="circle at center">Center</option>
                                <option value="circle at top right">Top Right</option>
                                <option value="circle at top left">Top Left</option>
                                <option value="circle at bottom">Bottom</option>
                              </>
                            )}
                          </select>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-6 mt-1">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">{gradType === 'solid' ? 'Color' : 'Start Color'}</label>
                        <div className="flex items-center gap-2 bg-[#151F2E] border border-gray-600 rounded p-1 pr-3">
                          <input
                            type="color"
                            value={gradColor1}
                            onChange={e => updateGradient(gradType, gradDir, e.target.value, gradColor2)}
                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                          />
                          <span className="text-xs text-gray-400 font-mono uppercase">{gradColor1}</span>
                        </div>
                      </div>
                      
                      {gradType !== 'solid' && (
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-gray-500 uppercase font-bold">End Color</label>
                          <div className="flex items-center gap-2 bg-[#151F2E] border border-gray-600 rounded p-1 pr-3">
                            <input
                              type="color"
                              value={gradColor2}
                              onChange={e => updateGradient(gradType, gradDir, gradColor1, e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                            />
                            <span className="text-xs text-gray-400 font-mono uppercase">{gradColor2}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase mb-2">Or Choose a Preset</div>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => {
                          setGradType('linear');
                          setGradDir('to right');
                          setGradColor1('#0f2027');
                          setGradColor2('#2c5364');
                          setProfile({ ...profile, bgGradient: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)' });
                        }}
                        className="w-8 h-8 rounded-full border-2 border-gray-700 hover:border-primary transition-colors"
                        style={{ background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)' }}
                        title="Ocean Night"
                      />
                      <button 
                        onClick={() => {
                          setGradType('linear');
                          setGradDir('to right');
                          setGradColor1('#141e30');
                          setGradColor2('#243b55');
                          setProfile({ ...profile, bgGradient: 'linear-gradient(to right, #141e30, #243b55)' });
                        }}
                        className="w-8 h-8 rounded-full border-2 border-gray-700 hover:border-primary transition-colors"
                        style={{ background: 'linear-gradient(to right, #141e30, #243b55)' }}
                        title="Deep Blue"
                      />
                      <button 
                        onClick={() => {
                          setGradType('linear');
                          setGradDir('to bottom');
                          setGradColor1('#000000');
                          setGradColor2('#434343');
                          setProfile({ ...profile, bgGradient: 'linear-gradient(to bottom, #000000, #434343)' });
                        }}
                        className="w-8 h-8 rounded-full border-2 border-gray-700 hover:border-primary transition-colors"
                        style={{ background: 'linear-gradient(to bottom, #000000, #434343)' }}
                        title="Midnight Gray"
                      />
                      <button 
                        onClick={() => {
                          setGradType('radial');
                          setGradDir('circle at top right');
                          setGradColor1('#1a1a2e');
                          setGradColor2('#0f3460');
                          setProfile({ ...profile, bgGradient: 'radial-gradient(circle at top right, #1a1a2e, #16213e, #0f3460)' });
                        }}
                        className="w-8 h-8 rounded-full border-2 border-gray-700 hover:border-primary transition-colors"
                        style={{ background: 'radial-gradient(circle at top right, #1a1a2e, #16213e, #0f3460)' }}
                        title="Cosmic Void"
                      />
                      <button 
                        onClick={() => {
                          setGradType('linear');
                          setGradDir('45deg');
                          setGradColor1('#2b1055');
                          setGradColor2('#7597de');
                          setProfile({ ...profile, bgGradient: 'linear-gradient(45deg, #2b1055, #7597de)' });
                        }}
                        className="w-8 h-8 rounded-full border-2 border-gray-700 hover:border-primary transition-colors"
                        style={{ background: 'linear-gradient(45deg, #2b1055, #7597de)' }}
                        title="Purple Dusk"
                      />
                      <button 
                        onClick={() => {
                          setGradType('solid');
                          setGradColor1('#0B0C0F');
                          setProfile({ ...profile, bgGradient: '' });
                        }}
                        className="w-8 h-8 rounded-full border-2 border-gray-700 hover:border-primary transition-colors bg-[#0B0C0F] flex items-center justify-center text-xs text-gray-500 font-bold"
                        title="Default Solid Black"
                      >
                        X
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-[#EDF1F5] mb-2">{profile.username}</h1>
              <p className="text-gray-400 max-w-2xl">{profile.bio}</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {isEditing ? (
            <button 
              onClick={handleSave}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-[#0B0C0F] px-6 py-2.5 rounded-xl font-bold transition-colors"
            >
              <Save size={18} />
              Save
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors border border-white/5"
              >
                <Edit3 size={18} />
                Edit Profile
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-[#0B0C0F] px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-primary/20"
              >
                <Share2 size={18} />
                Share List
              </button>
            </>
          )}
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-[#EDF1F5] flex items-center gap-3">
            <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
            My List
          </h2>
          <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm font-bold border border-white/5 whitespace-nowrap">
            {filteredList.length} Anime
          </span>
        </div>

        <div className="flex overflow-x-auto gap-2 pb-4 mb-4 custom-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === tab.value 
                  ? 'bg-primary text-[#0B0C0F]' 
                  : 'bg-[#151F2E] text-gray-400 hover:text-[#EDF1F5] border border-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {paginatedList.length > 0 ? (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
              {paginatedList.map((item) => (
                <AnimeCard 
                  key={item.animeId} 
                  anime={item.anime as any} 
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-[#151F2E] text-white rounded-lg disabled:opacity-50 hover:bg-gray-800 transition-colors font-bold text-sm"
                >
                  Previous
                </button>
                <span className="text-gray-400 font-medium">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-[#151F2E] text-white rounded-lg disabled:opacity-50 hover:bg-gray-800 transition-colors font-bold text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-[#151F2E] rounded-2xl border border-gray-800 border-dashed">
            <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-[#EDF1F5] mb-2">No anime found</h3>
            <p className="text-gray-400">Add anime to your "{TABS.find(t => t.value === activeTab)?.label}" list to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
