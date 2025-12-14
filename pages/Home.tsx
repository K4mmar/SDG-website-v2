import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Recruitment from '../components/Recruitment';
import NewsGrid from '../components/NewsGrid';
import AgendaList from '../components/AgendaList';
import Testimonials from '../components/Testimonials';
import { Music, Users } from 'lucide-react';

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
      
      {/* Intro Section - Redesigned for better aesthetics */}
      <section id="over-ons" className="py-24 bg-white relative overflow-hidden">
        {/* Decorative Background Watermark - Adjusted to be less intrusive */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 opacity-[0.03] pointer-events-none select-none z-0">
          <span className="text-[20rem] font-serif font-bold text-slate-900 leading-none">1900</span>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Left Column: Headlines */}
            <div className="max-w-xl relative">
              <div className="flex items-center gap-4 mb-8">
                <span className="h-[2px] w-12 bg-sdg-gold"></span>
                <span className="text-sdg-gold font-bold uppercase tracking-widest text-sm">Onze Vereniging</span>
              </div>
              
              {/* Increased line height and fixed spacing to prevent overlaps */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                Al meer dan <br className="hidden md:block" />
                <span className="relative inline-block whitespace-nowrap mr-3">
                  <span className="relative z-10">125 jaar</span>
                  {/* Adjusted highlight position */}
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-sdg-gold/30 -z-0 -rotate-1 rounded-sm"></span>
                </span>
                <span className="inline-block">
                   een <span className="text-sdg-red italic">muzikaal begrip</span>
                </span>
              </h2>
            </div>

            {/* Right Column: Content Text */}
            <div className="space-y-10 pt-4">
              <div className="flex gap-6">
                <div className="shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-sdg-red shadow-sm border border-slate-100">
                    <Music className="w-6 h-6" />
                  </div>
                </div>
                <div>
                   <p className="text-xl text-slate-800 leading-relaxed font-medium">
                    Soli Deo Gloria (SDG) is al sinds 1900 verweven met Sint Jansklooster. Vanuit onze christelijke identiteit – 'Alleen aan God de Eer' – verzorgen we met ons fanfareorkest en de malletband muziek bij concerten, kerkdiensten en dorpsactiviteiten.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="shrink-0 mt-1">
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-sdg-gold shadow-sm border border-slate-100">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <p className="text-lg text-slate-600 leading-relaxed font-light">
                    We zijn er voor iedereen die muziek wil maken of beluisteren. Naast de gezamenlijke repetities bieden we de mogelijkheid om via de vereniging lessen te volgen bij een professionele docent. Zo blijven we ons muzikaal ontwikkelen en dragen we bij aan de gemeenschap.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Social Proof / Quotes Section - Added here to bridge the gap */}
          <Testimonials />

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