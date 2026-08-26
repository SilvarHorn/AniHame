import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Trending from './pages/Trending';
import AnimeDetails from './pages/AnimeDetails';
import Watch from './pages/Watch';
import Profile from './pages/Profile';
import Schedule from './pages/Schedule';
import ContinueWatching from './pages/ContinueWatching';

import Auth from './pages/Auth';

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore: key is an intrinsic React prop */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/explore" element={<PageWrapper><Explore /></PageWrapper>} />
        <Route path="/trending" element={<PageWrapper><Trending /></PageWrapper>} />
        <Route path="/anime/:id" element={<PageWrapper><AnimeDetails /></PageWrapper>} />
        <Route path="/watch/:id/:ep" element={<PageWrapper><Watch /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/schedule" element={<PageWrapper><Schedule /></PageWrapper>} />
        <Route path="/continue-watching" element={<PageWrapper><ContinueWatching /></PageWrapper>} />
        <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </BrowserRouter>
    </AuthProvider>
  );
}
