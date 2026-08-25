const fs = require('fs');

const content = `
import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, Save, Mail, Key, Edit3, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import AnimeCard from '../components/ui/AnimeCard';
import { MyListStatus, getMyList, MyListItem } from '../utils/myList';
import { cn } from '../lib/utils';

const TABS: { label: string; value: MyListStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Watching', value: 'WATCHING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'On-Hold', value: 'ON_HOLD' },
  { label: 'Dropped', value: 'DROPPED' },
  { label: 'Plan to Watch', value: 'PLAN_TO_WATCH' }
];

export default function Profile() {
  const { currentUser, profile, loading, updatePreferences, updateProfileData } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState('');
  
  // Local profile state for guests & editing
  const [isEditing, setIsEditing] = useState(false);
  const [localDisplayName, setLocalDisplayName] = useState('User');
  const [localAvatar, setLocalAvatar] = useState('');
  
  // Preferences state
  const [defaultServer, setDefaultServer] = useState<'ani' | 'mal' | 'vidsrc'>('ani');
  const [defaultAudio, setDefaultAudio] = useState<'sub' | 'dub'>('sub');
  
  // Theme state
  const [themeColor, setThemeColor] = useState('#8AD7D0');
  const [gradType, setGradType] = useState('solid');
  const [gradDir, setGradDir] = useState('to right');
  const [gradColor1, setGradColor1] = useState('#0B0C0F');
  const [gradColor2, setGradColor2] = useState('#243b55');
  const [bgGradient, setBgGradient] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // List states
  const [activeTab, setActiveTab] = useState<MyListStatus | 'ALL'>('ALL');
  const [myList, setMyList] = useState<MyListItem[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 24;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with AuthContext or LocalStorage
  useEffect(() => {
    if (currentUser && profile) {
      setLocalDisplayName(profile.displayName || 'User');
      setLocalAvatar(profile.photoURL || '');
      setDefaultServer(profile.preferences?.defaultServer || 'ani');
      setDefaultAudio(profile.preferences?.defaultAudio || 'sub');
      setThemeColor(profile.themeColor || '#8AD7D0');
      setBgGradient(profile.bgGradient || '');
    } else if (!currentUser) {
      // Load from local storage for guests
      try {
        const saved = localStorage.getItem('anime_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.username) setLocalDisplayName(parsed.username);
          if (parsed.avatar) setLocalAvatar(parsed.avatar);
          if (parsed.themeColor) setThemeColor(parsed.themeColor);
          if (parsed.bgGradient !== undefined) setBgGradient(parsed.bgGradient);
        }
      } catch (e) {}
    }
  }, [currentUser, profile]);

  useEffect(() => {
    setMyList(getMyList());
    const handleListUpdate = () => setMyList(getMyList());
    window.addEventListener('my-list-updated', handleListUpdate);
    return () => window.removeEventListener('my-list-updated', handleListUpdate);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setAuthError(err.message || 'Google Login failed');
    }
  };

  const updateGradient = (t: string, d: string, c1: string, c2: string) => {
    setGradType(t);
    setGradDir(d);
    setGradColor1(c1);
    setGradColor2(c2);
    let str = '';
    if (t === 'solid') str = '';
    else if (t === 'linear') str = \`linear-gradient(\${d}, \${c1}, \${c2})\`;
    else str = \`radial-gradient(\${d}, \${c1}, \${c2})\`;
    setBgGradient(str);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    
    if (currentUser && profile) {
      // Save to Firebase
      await updateProfileData({
        displayName: localDisplayName,
        photoURL: localAvatar,
        themeColor,
        bgGradient
      });
      await updatePreferences({ defaultServer, defaultAudio });
    } else {
      // Save to LocalStorage (Guests)
      try {
        const localData = {
          username: localDisplayName,
          avatar: localAvatar,
          themeColor,
          bgGradient
        };
        localStorage.setItem('anime_profile', JSON.stringify(localData));
        window.dispatchEvent(new Event('profile-updated'));
      } catch (e) {}
    }
    
    setIsEditing(false);
    setIsSaving(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full min-h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const filteredList = activeTab === 'ALL' ? myList : myList.filter(i => i.status === activeTab);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {!currentUser && (
        <div className="mb-8 p-6 bg-[#151F2E] rounded-2xl border border-white/5 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-[#EDF1F5] mb-2 flex items-center gap-2">
                <span className="text-yellow-500">⚠️</span> Not Logged In
              </h2>
              <p className="text-gray-400">You can customize your profile and settings here, but <strong className="text-white">preferences will not be saved</strong> across devices unless you log in.</p>
            </div>
            <div className="w-full md:w-auto">
              <form onSubmit={handleEmailAuth} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white outline-none w-full sm:w-48"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white outline-none w-full sm:w-48"
                />
                <button type="submit" onClick={() => setAuthMode('login')} className="px-4 py-2 bg-primary text-[#0B0C0F] font-bold rounded-lg shrink-0">Log In</button>
                <button type="button" onClick={handleGoogleLogin} className="px-4 py-2 bg-white text-black font-bold rounded-lg shrink-0">Google</button>
              </form>
              {authError && <div className="text-red-400 text-sm mt-2 text-right">{authError}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-[#151F2E] rounded-2xl border border-white/5 p-6 md:p-8 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="relative group">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
            {localAvatar ? (
              <img 
                src={localAvatar} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full border-4 border-gray-800 object-cover bg-gray-900"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-gray-800 bg-gray-900 flex items-center justify-center">
                <User size={40} className="text-gray-500" />
              </div>
            )}
            {isEditing && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera size={24} className="text-white" />
              </button>
            )}
          </div>
          
          <div className="flex-1 text-center sm:text-left w-full">
            {isEditing ? (
              <input
                type="text"
                value={localDisplayName}
                onChange={(e) => setLocalDisplayName(e.target.value)}
                className="text-3xl font-bold text-[#EDF1F5] bg-transparent border-b-2 border-primary focus:outline-none w-full max-w-xs mb-2"
                placeholder="Username"
              />
            ) : (
              <h1 className="text-3xl font-bold text-[#EDF1F5] mb-2">{localDisplayName}</h1>
            )}
            <p className="text-gray-400 max-w-2xl">{currentUser ? currentUser.email : 'Guest User'}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {isEditing ? (
              <button 
                onClick={handleSaveAll}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-[#0B0C0F] px-5 py-2.5 rounded-xl font-bold transition-colors border border-white/5 disabled:opacity-50"
              >
                <Save size={18} />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors border border-white/5"
              >
                <Edit3 size={18} />
                Edit Profile
              </button>
            )}
            
            {currentUser && (
              <button 
                onClick={() => signOut(auth)}
                className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-red-400 px-5 py-2.5 rounded-xl font-bold transition-colors border border-white/5"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-white/5 pt-8">
          <h2 className="text-xl font-bold text-[#EDF1F5] mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
            Theme & Preferences
          </h2>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-900/50 p-5 rounded-xl border border-white/5">
              <label className="block text-sm font-medium text-gray-400 mb-3">Theme Color</label>
              <div className="flex flex-wrap gap-3">
                {['#8AD7D0', '#FF8A65', '#9575CD', '#4DB6AC', '#F06292', '#64B5F6'].map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      setThemeColor(color);
                      if (!isEditing) setIsEditing(true);
                    }}
                    className={cn(
                      "w-8 h-8 rounded-full transition-transform",
                      themeColor === color ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-gray-900" : "hover:scale-110"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gray-900/50 p-5 rounded-xl border border-white/5">
              <label className="block text-sm font-medium text-gray-400 mb-3">Background Gradient</label>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => { updateGradient('solid', '', '', ''); if(!isEditing) setIsEditing(true); }}
                  className="w-8 h-8 rounded-full border-2 border-gray-700 hover:border-primary transition-colors bg-[#0B0C0F] flex items-center justify-center text-xs text-gray-500 font-bold"
                  title="Solid Black"
                >X</button>
                <button 
                  onClick={() => { updateGradient('linear', 'to right', '#0f2027', '#2c5364'); if(!isEditing) setIsEditing(true); }}
                  className="w-8 h-8 rounded-full border-2 border-gray-700 hover:border-primary transition-colors"
                  style={{ background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)' }}
                  title="Ocean Night"
                />
                <button 
                  onClick={() => { updateGradient('linear', 'to right', '#141e30', '#243b55'); if(!isEditing) setIsEditing(true); }}
                  className="w-8 h-8 rounded-full border-2 border-gray-700 hover:border-primary transition-colors"
                  style={{ background: 'linear-gradient(to right, #141e30, #243b55)' }}
                  title="Deep Blue"
                />
                <button 
                  onClick={() => { updateGradient('radial', 'circle at top right', '#1a1a2e', '#0f3460'); if(!isEditing) setIsEditing(true); }}
                  className="w-8 h-8 rounded-full border-2 border-gray-700 hover:border-primary transition-colors"
                  style={{ background: 'radial-gradient(circle at top right, #1a1a2e, #16213e, #0f3460)' }}
                  title="Cosmic Void"
                />
                <button 
                  onClick={() => { updateGradient('linear', '45deg', '#2b1055', '#7597de'); if(!isEditing) setIsEditing(true); }}
                  className="w-8 h-8 rounded-full border-2 border-gray-700 hover:border-primary transition-colors"
                  style={{ background: 'linear-gradient(45deg, #2b1055, #7597de)' }}
                  title="Purple Dusk"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 p-5 rounded-xl border border-white/5">
              <label className="block text-sm font-medium text-gray-400 mb-3">Default Video Server</label>
              <div className="flex flex-col gap-2">
                {(['ani', 'mal', 'vidsrc'] as const).map(server => (
                  <label key={server} className="flex items-center gap-3 p-3 rounded-lg border border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors">
                    <input 
                      type="radio" 
                      name="server" 
                      value={server} 
                      checked={defaultServer === server}
                      onChange={() => { setDefaultServer(server); if(!isEditing) setIsEditing(true); }}
                      className="text-primary focus:ring-primary bg-gray-900 border-gray-700"
                    />
                    <span className="text-sm font-medium text-gray-200">
                      {server === 'ani' ? 'MegaPlay AniList' : server === 'mal' ? 'MegaPlay MAL' : 'VidSrc'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/50 p-5 rounded-xl border border-white/5">
              <label className="block text-sm font-medium text-gray-400 mb-3">Default Audio Track</label>
              <div className="flex flex-col gap-2">
                {(['sub', 'dub'] as const).map(audio => (
                  <label key={audio} className="flex items-center gap-3 p-3 rounded-lg border border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors">
                    <input 
                      type="radio" 
                      name="audio" 
                      value={audio} 
                      checked={defaultAudio === audio}
                      onChange={() => { setDefaultAudio(audio); if(!isEditing) setIsEditing(true); }}
                      className="text-primary focus:ring-primary bg-gray-900 border-gray-700"
                    />
                    <span className="text-sm font-medium text-gray-200">
                      {audio === 'sub' ? 'Subtitled (Japanese)' : 'Dubbed (English)'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* List Section */}
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
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-colors",
                activeTab === tab.value 
                  ? 'bg-primary text-[#0B0C0F]' 
                  : 'bg-[#151F2E] text-gray-400 hover:text-[#EDF1F5] border border-gray-800'
              )}
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
`;

fs.writeFileSync('src/pages/Profile.tsx', content);
