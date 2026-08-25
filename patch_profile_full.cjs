const fs = require('fs');

// We need to write the complete new Profile.tsx keeping the auth AND my list
const content = `
import React, { useState, useEffect } from 'react';
import { User, LogOut, Save, Mail, Key } from 'lucide-react';
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
  const { currentUser, profile, loading, updatePreferences } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState('');
  
  const [defaultServer, setDefaultServer] = useState<'ani' | 'mal' | 'vidsrc'>('ani');
  const [defaultAudio, setDefaultAudio] = useState<'sub' | 'dub'>('sub');
  const [isSaving, setIsSaving] = useState(false);

  // List states
  const [activeTab, setActiveTab] = useState<MyListStatus | 'ALL'>('ALL');
  const [myList, setMyList] = useState<MyListItem[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    if (profile) {
      setDefaultServer(profile.preferences.defaultServer);
      setDefaultAudio(profile.preferences.defaultAudio);
    }
  }, [profile]);

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

  const handleSavePreferences = async () => {
    setIsSaving(true);
    await updatePreferences({ defaultServer, defaultAudio });
    setIsSaving(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full min-h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-[#151F2E] rounded-2xl border border-white/5 shadow-xl">
        <h2 className="text-2xl font-bold text-[#EDF1F5] mb-6 text-center">
          {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key size={18} className="text-gray-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {authError && <div className="text-red-400 text-sm mt-1">{authError}</div>}

          <button
            type="submit"
            className="w-full mt-2 bg-primary hover:bg-primary-hover text-[#0B0C0F] font-bold py-2.5 rounded-lg transition-colors"
          >
            {authMode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-800"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-800"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 bg-white hover:bg-gray-100 text-gray-900 font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 text-center text-sm text-gray-400">
          {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="text-primary hover:underline font-bold"
          >
            {authMode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    );
  }

  const filteredList = activeTab === 'ALL' ? myList : myList.filter(i => i.status === activeTab);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Profile Section */}
      <div className="bg-[#151F2E] rounded-2xl border border-white/5 p-6 md:p-8 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="relative group">
            {profile?.photoURL ? (
              <img 
                src={profile.photoURL} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full border-4 border-gray-800 object-cover bg-gray-900"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-gray-800 bg-gray-900 flex items-center justify-center">
                <User size={40} className="text-gray-500" />
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-[#EDF1F5] mb-2">{profile?.displayName || 'User'}</h1>
            <p className="text-gray-400 max-w-2xl">{profile?.email}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => signOut(auth)}
              className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors border border-white/5"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8">
          <h2 className="text-xl font-bold text-[#EDF1F5] mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
            Playback Preferences
          </h2>

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
                      onChange={() => setDefaultServer(server)}
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
                      onChange={() => setDefaultAudio(audio)}
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

          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleSavePreferences}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-[#0B0C0F] px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </button>
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
