
import React, { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import JoinUs from './pages/JoinUs';
import Education from './pages/Education'; 
import About from './pages/About';
import PostDetail from './pages/PostDetail';
import PageDetail from './pages/PageDetail';
import NewsArchive from './pages/NewsArchive';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-white text-slate-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Functionele Pagina's */}
            <Route path="/lid-worden" element={<JoinUs />} />
            <Route path="/nieuws" element={<NewsArchive />} />
            <Route path="/nieuws/:slug" element={<PostDetail />} />
            <Route path="/jeugd" element={<Education />} />
            <Route path="/opleiding" element={<Education />} />
            
            {/* Specifieke landingspagina voor Over Ons (overzicht) */}
            <Route path="/over-ons" element={<About />} />

            {/* Catch-all voor content pagina's (Fanfare, Malletband, Geschiedenis, Steun-ons etc.) */}
            {/* Dit zorgt voor mooie platte URL's zoals sdg.nl/fanfare */}
            <Route path="/:slug" element={<PageDetail />} />
            
            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
