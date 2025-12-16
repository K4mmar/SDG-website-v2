import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Recruitment from '../components/Recruitment';
import NewsGrid from '../components/NewsGrid';
import AgendaList from '../components/AgendaList';
import Testimonials from '../components/Testimonials';
import { Music, Users, Crown } from 'lucide-react';

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
              
              {/* New: Erepenning Highlight Card for Left Column Mobile / Desktop layout balance */}
              <div className="mt-8 hidden lg:block">
                 <img 
                   src="https://images.unsplash.com/photo-1576615278774-7b611d51a954?q=80&w=800&auto=format&fit=crop" 
                   alt="Sfeerbeeld muziek" 
                   className="rounded-2xl shadow-lg border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500 opacity-90"
                 />
              </div>
            </div>

            {/* Right Column: Content Text */}
            <div className="space-y-8 pt-4">
              
              {/* FEATURED: Erepenning Badge */}
              <div className="relative group rounded-2xl p-6 bg-gradient-to-br from-amber-50 to-white border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-sdg-gold rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
                 <div className="flex gap-5 relative z-10">
                    <div className="shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sdg-gold to-yellow-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Crown className="w-7 h-7" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-900 mb-2">Koninklijke Erepenning</h3>
                      <p className="text-slate-700 leading-relaxed text-base">
                        In 2025 is aan SDG de <strong>Koninklijke Erepenning</strong> toegekend. Een onderscheiding van de Koning, die symbool staat voor het respect en de waardering voor de verdiensten van de vereniging.
                      </p>
                    </div>
                 </div>
              </div>

              <div className="flex gap-6 pl-2">
                <div className="shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-sdg-red shadow-sm border border-slate-100">
                    <Music className="w-6 h-6" />
                  </div>
                </div>
                <div>
                   <p className="text-lg text-slate-800 leading-relaxed font-medium">
                    Soli Deo Gloria (SDG) is al sinds 1900 verweven met Sint Jansklooster. Vanuit onze christelijke identiteit – 'Alleen aan God de Eer' – verzorgen we met ons fanfareorkest en de malletband muziek bij concerten, kerkdiensten en dorpsactiviteiten.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 pl-2">
                <div className="shrink-0 mt-1">
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <p className="text-base text-slate-600 leading-relaxed font-light">
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