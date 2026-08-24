import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Trending from './pages/Trending';
import AnimeDetails from './pages/AnimeDetails';
import Watch from './pages/Watch';
import Profile from './pages/Profile';
import Schedule from './pages/Schedule';
import ContinueWatching from './pages/ContinueWatching';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
          <Route path="/watch/:id/:ep" element={<Watch />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/continue-watching" element={<ContinueWatching />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
