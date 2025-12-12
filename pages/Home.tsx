import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Recruitment from '../components/Recruitment';
import NewsGrid from '../components/NewsGrid';
import AgendaList from '../components/AgendaList';

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
    }
  }, [location]);

  return (
    <>
      <Hero />
      
      {/* Intro Section */}
      <section id="over-ons" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="text-sdg-gold font-bold uppercase tracking-widest text-sm mb-4 block">Onze Vereniging</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight">Al meer dan 75 jaar een <span className="text-sdg-red italic">muzikaal begrip</span></h2>
          <p className="text-xl text-slate-600 leading-relaxed font-light">
            SDG Sint Jansklooster is een bruisende muziekvereniging waar plezier en prestatie hand in hand gaan. 
            Met ons fanfareorkest, de actieve slagwerkgroep en een groeiende jeugdafdeling zijn we diep geworteld 
            in de gemeenschap. Wij geloven dat muziek verbindt, verbroedert en vrolijk maakt.
          </p>
          <div className="mt-10 h-1 w-20 bg-sdg-gold mx-auto rounded-full"></div>
        </div>
      </section>

      <AgendaList />
      <NewsGrid />
      <Recruitment />
      
      {/* Contact anchor */}
      <div id="contact"></div>
    </>
  );
};

export default Home;