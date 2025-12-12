import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Recruitment from '../components/Recruitment';
import NewsGrid from '../components/NewsGrid';

const Home: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if there is a scrollTo ID in the location state
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        // Small timeout to ensure DOM is ready/rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      
      // Optional: Clear state to prevent scrolling on refresh? 
      // React Router state persists on refresh usually, but handling that is minor.
      // We can replace history state if needed, but not critical for this demo.
    }
  }, [location]);

  return (
    <>
      <Hero />
      
      {/* Intro Section */}
      <section id="over-ons" className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Al meer dan 75 jaar een muzikaal begrip</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            SDG Sint Jansklooster is een bruisende muziekvereniging waar plezier en prestatie hand in hand gaan. 
            Met ons fanfareorkest, de actieve slagwerkgroep en een groeiende jeugdafdeling zijn we diep geworteld 
            in de gemeenschap. Wij geloven dat muziek verbindt, verbroedert en vrolijk maakt.
          </p>
        </div>
      </section>

      <Recruitment />
      <NewsGrid />
      
      {/* Contact anchor */}
      <div id="contact"></div>
    </>
  );
};

export default Home;