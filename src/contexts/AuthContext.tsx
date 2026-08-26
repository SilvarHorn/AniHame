import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';

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
  currentUser: User | null;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync basic info to local storage for quick access like Navbar
  useEffect(() => {
    if (profile) {
      try {
        localStorage.setItem('app_user_profile', JSON.stringify(profile));
        const navData = {
          username: profile.displayName || (currentUser ? 'User' : 'Guest'),
          avatar: profile.photoURL || '',
          themeColor: profile.themeColor || '#8AD7D0',
          bgGradient: profile.bgGradient || ''
        };
        localStorage.setItem('anime_profile', JSON.stringify(navData));
        window.dispatchEvent(new Event('profile-updated'));
      } catch (e) {}
    } else {
      localStorage.removeItem('app_user_profile');
    }
  }, [profile, currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch or create profile
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              photoURL: user.photoURL,
              preferences: defaultPreferences
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error: any) {
          if (error?.message?.includes('offline')) {
            console.error("Firebase is offline. Check database ID config.");
          } else {
            handleFirestoreError(error, OperationType.GET, 'users/' + user.uid);
          }
        }
      } else {
        // Guest mode fallback
        setProfile(defaultProfile);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    
    setProfile(prev => {
      const p = prev || defaultProfile;
      return { ...p, ...data };
    });
    
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users/' + currentUser.uid);
    }
  };

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    if (!currentUser) return;
    
    setProfile(prev => {
      const p = prev || defaultProfile;
      const currentPrefs = p.preferences || defaultPreferences;
      return { 
        ...p, 
        preferences: { ...currentPrefs, ...newPrefs } 
      };
    });
    
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const currentPrefs = profile?.preferences || defaultPreferences;
      await updateDoc(docRef, {
        preferences: { ...currentPrefs, ...newPrefs }
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users/' + currentUser.uid);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      profile, 
      loading, 
      updatePreferences, 
      updateProfileData 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
