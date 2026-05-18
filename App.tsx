
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import JoinUs from './pages/JoinUs';
import Education from './pages/Education'; 
import About from './pages/About';
import PostDetail from './pages/PostDetail';
import PageDetail from './pages/PageDetail';
import NewsArchive from './pages/NewsArchive';
import { initGA, usePageTracking } from './hooks/usePageTracking';
import CookieConsentBanner from './components/CookieConsentBanner';

// Initialiseer Google Analytics
// Dit wordt nu afgehandeld en beveiligd in usePageTracking
initGA();

const PageTracker = () => {
  usePageTracking();
  return null;
};

const ScrollManager = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const scrollPositions = React.useRef<Record<string, number>>({});

  React.useEffect(() => {
    const handleScroll = () => {
      scrollPositions.current[location.key] = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.key]);

  React.useEffect(() => {
    if (navType === 'POP') {
      const pos = scrollPositions.current[location.key];
      if (pos !== undefined) {
        // Restore immediately, and also slightly delayed to account for rendering
        window.scrollTo(0, pos);
        setTimeout(() => window.scrollTo(0, pos), 50);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.key, navType]);

  return null;
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <PageTracker />
        <ScrollManager />
        <div className="flex flex-col min-h-screen bg-white text-slate-900">
          {/* De Cookie banner wordt altijd gerenderd. Logica zit intern. */}
          <CookieConsentBanner />
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
    </HelmetProvider>
  );
};

export default App;
