import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

export interface UserPreferences {
  defaultServer: 'ani' | 'mal' | 'vidsrc';
  defaultAudio: 'sub' | 'dub';
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  bio?: string;
  themeColor?: string;
  bgGradient?: string;
  preferences: UserPreferences;
}

interface AuthContextType {
  currentUser: any | null;
  profile: UserProfile | null;
  loading: boolean;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const defaultPreferences: UserPreferences = {
  defaultServer: 'ani',
  defaultAudio: 'sub',
};

const defaultProfile: UserProfile = {
  uid: 'local-user',
  email: null,
  displayName: 'Guest',
  photoURL: null,
  preferences: defaultPreferences
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  profile: null,
  loading: true,
  updatePreferences: async () => {},
  updateProfileData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isInitialMount = useRef(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('app_user_profile');
      if (stored) {
        setProfile(JSON.parse(stored));
      } else {
        setProfile(defaultProfile);
      }
    } catch (e) {
      setProfile(defaultProfile);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (profile) {
      try {
        localStorage.setItem('app_user_profile', JSON.stringify(profile));
        const navData = {
          username: profile.displayName || 'Guest',
          avatar: profile.photoURL || '',
          themeColor: profile.themeColor || '#8AD7D0',
          bgGradient: profile.bgGradient || ''
        };
        localStorage.setItem('anime_profile', JSON.stringify(navData));
        window.dispatchEvent(new Event('profile-updated'));
      } catch (e) {}
    }
  }, [profile]);

  const updateProfileData = async (data: Partial<UserProfile>) => {
    setProfile(prev => {
      const p = prev || defaultProfile;
      return { ...p, ...data };
    });
  };

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    setProfile(prev => {
      const p = prev || defaultProfile;
      const currentPrefs = p.preferences || defaultPreferences;
      return { 
        ...p, 
        preferences: { ...currentPrefs, ...newPrefs } 
      };
    });
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser: { id: 'local-user', email: 'guest@local' }, 
      profile, 
      loading, 
      updatePreferences, 
      updateProfileData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
