import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

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

useEffect(() => {
    let unsubDoc: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        
        try {
          const docSnap = await getDoc(docRef);
          
          if (!docSnap.exists()) {
            const initialProfile: UserProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              preferences: defaultPreferences
            };
            await setDoc(docRef, initialProfile, { merge: true });
            setProfile(initialProfile);
          }
          
          if (unsubDoc) unsubDoc();
          
          unsubDoc = onSnapshot(docRef, (snap) => {
if (snap.exists()) {
              const data = snap.data() as UserProfile;
              setProfile(data);
              // Sync to local storage for Layout.tsx to pick up theme
              try {
                const localData = {
                  username: data.displayName || 'User',
                  avatar: data.photoURL || '',
                  themeColor: data.themeColor || '#8AD7D0',
                  bgGradient: data.bgGradient || ''
                };
                localStorage.setItem('anime_profile', JSON.stringify(localData));
                window.dispatchEvent(new Event('profile-updated'));
              } catch(e) {}
            }
          }, (err) => {
            console.error("Snapshot error ignored:", err);
          });
          
        } catch (e) {
          console.error("Auth context error:", e);
        }
        
        setLoading(false);
      } else {
        setProfile(null);
        setLoading(false);
        if (unsubDoc) {
          unsubDoc();
          unsubDoc = undefined;
        }
      }
    });

    return () => {
      unsubscribe();
      if (unsubDoc) unsubDoc();
    };
  }, []);


  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!currentUser || !profile) return;
    const docRef = doc(db, 'users', currentUser.uid);
    await setDoc(docRef, data, { merge: true });
  };

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    if (!currentUser || !profile) return;
    
    const updatedPreferences = { ...profile.preferences, ...newPrefs };
    const docRef = doc(db, 'users', currentUser.uid);
    await setDoc(docRef, { preferences: updatedPreferences }, { merge: true });
  };

  return (
    <AuthContext.Provider value={{ currentUser, profile, loading, updatePreferences, updateProfileData }}>
      {children}
    </AuthContext.Provider>
  );
};
