import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import JoinUs from './pages/JoinUs';
import Education from './pages/Education'; 
import About from './pages/About'; // Imported new About page
import PostDetail from './pages/PostDetail';
import PageDetail from './pages/PageDetail';
import NewsArchive from './pages/NewsArchive';
import { Menu, X } from 'lucide-react';

// Helper component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Main App Component simulating Layout
const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-white text-slate-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lid-worden" element={<JoinUs />} />
            
            {/* News & Agenda */}
            <Route path="/nieuws" element={<NewsArchive />} />
            <Route path="/nieuws/:slug" element={<PostDetail />} />
            
            {/* Custom Education Page (Opleiding/Jeugd) */}
            <Route path="/jeugd" element={<Education />} />
            <Route path="/opleiding" element={<Education />} />

            {/* NEW: Dedicated Scrollytelling Page for Over Ons */}
            <Route path="/over-ons" element={<About />} />

            {/* Structure for Groups (Fanfare, Malletband) */}
            <Route path="/groepen/:slug" element={<PageDetail />} />
            
            {/* Catch-all for other subpages (like privacy) */}
            <Route path="/over-ons/:slug" element={<PageDetail />} />
            
            {/* Catch-all for other top-level pages */}
            <Route path="/:slug" element={<PageDetail />} />

            {/* Fallback for 404s redirects to Home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;