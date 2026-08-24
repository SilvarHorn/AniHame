import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [themeColor, setThemeColor] = useState('#8AD7D0');
  const [bgGradient, setBgGradient] = useState('');
  
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('anime_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.themeColor) {
            setThemeColor(parsed.themeColor);
            document.documentElement.style.setProperty('--theme-color', parsed.themeColor);
            document.documentElement.style.setProperty('--theme-color-hover', parsed.themeColor);
          }
          if (parsed.bgGradient !== undefined) {
            setBgGradient(parsed.bgGradient);
          }
        }
      } catch (e) {}
    };
    
    // Initial load
    handleStorageChange();
    
    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    // Custom event for local changes in the same window
    window.addEventListener('profile-updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profile-updated', handleStorageChange);
    };
  }, []);

  return (
    <div 
      className="min-h-screen text-[#EDF1F5] font-sans selection:bg-primary/30 bg-fixed relative overflow-hidden"
      style={
        bgGradient?.includes('gradient')
          ? { backgroundImage: bgGradient }
          : { backgroundColor: bgGradient || '#0B0C0F' }
      }
    >
      {/* Repeating Pattern for empty margins on ultra-wide screens */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none hidden xl:block opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(var(--theme-color) 2px, transparent 2px)',
          backgroundSize: '32px 32px',
          maskImage: 'linear-gradient(to right, black 0%, black calc(50% - 44rem), transparent calc(50% - 40rem), transparent calc(50% + 40rem), black calc(50% + 44rem), black 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 0%, black calc(50% - 44rem), transparent calc(50% - 40rem), transparent calc(50% + 40rem), black calc(50% + 44rem), black 100%)'
        }}
      />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="pt-14 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
