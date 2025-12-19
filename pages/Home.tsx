
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Recruitment from '../components/Recruitment';
import NewsGrid from '../components/NewsGrid';
import AgendaList from '../components/AgendaList';
import Testimonials from '../components/Testimonials';
import SponsorGrid from '../components/SponsorGrid';
import { Crown, CheckCircle, ArrowRight } from 'lucide-react';

const HISTORY_IMAGES = [
  "https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/1.-1905_met_oprichter_en_dirigent_van_der_mey.jpg&output=webp&q=80&w=800",
  "https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/2.-1960_60_jarig_jubileum.jpg&output=webp&q=80&w=800",
  "https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/3.-1970_70_jarig_jubileum.jpg&output=webp&q=80&w=800",
  "https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/4.-1974_concours_wezep.jpg&output=webp&q=80&w=800",
  "https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/5.-1985_bloemencorso_sint_jansklooster_fanfare.jpg&output=webp&q=80&w=800",
  "https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/6.-1985_bloemencorso_sint_jansklooster_majorettes.jpg&output=webp&q=80&w=800"
];

const Home: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HISTORY_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Hero />
      
      <section id="over-ons" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 opacity-[0.03] pointer-events-none select-none z-0">
          <span className="text-[20rem] font-serif font-bold text-slate-900 leading-none">1900</span>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="max-w-xl relative">
              <div className="flex items-center gap-4 mb-6">
                <span className="h-[2px] w-12 bg-sdg-gold"></span>
                <span className="text-sdg-gold font-bold uppercase tracking-widest text-sm">Onze Vereniging</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                Al meer dan <br className="hidden md:block" />
                <span className="relative inline-block whitespace-nowrap mr-3">
                  <span className="relative z-10">125 jaar</span>
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-sdg-gold/30 -z-0 -rotate-1 rounded-sm"></span>
                </span>
                <span className="inline-block">
                   een <span className="text-sdg-red italic">muzikaal begrip</span>
                </span>
              </h2>
              
              <div className="mt-8 hidden lg:block relative h-64 w-full rounded-2xl shadow-lg border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500 overflow-hidden bg-slate-100">
                 {HISTORY_IMAGES.map((img, index) => (
                   <img 
                     key={img}
                     src={img} 
                     alt={`Historie SDG ${index + 1}`} 
                     className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
                       index === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                     }`}
                   />
                 ))}
                 <div className="absolute inset-0 bg-amber-900/10 mix-blend-multiply pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="relative group rounded-2xl p-5 bg-gradient-to-br from-amber-50 to-white border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300 flex gap-4 items-center">
                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sdg-gold to-yellow-600 text-white flex items-center justify-center shadow-md shrink-0">
                    <Crown className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="font-serif font-bold text-lg text-slate-900">Koninklijke Erepenning</h3>
                    <p className="text-slate-600 text-sm leading-tight">
                      Bekroond in 2025 voor onze maatschappelijke verdiensten.
                    </p>
                 </div>
              </div>

              <div className="space-y-4">
                 <h3 className="font-bold text-xl text-slate-900 mb-2">Wie is SDG?</h3>
                 <div className="flex gap-4 items-start">
                    <CheckCircle className="w-6 h-6 text-sdg-red shrink-0 mt-0.5" />
                    <div>
                       <strong className="block text-slate-900">Soli Deo Gloria: Alleen aan God de Eer</strong>
                       <p className="text-slate-600 text-sm">Onze christelijke identiteit is de bron van waaruit we met passie muziek maken en met elkaar omgaan.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <CheckCircle className="w-6 h-6 text-sdg-red shrink-0 mt-0.5" />
                    <div>
                       <strong className="block text-slate-900">Het muzikale hart van Sint Jansklooster</strong>
                       <p className="text-slate-600 text-sm">Wij verbinden het dorp tijdens belangrijke momenten, van sfeervolle kerstnachten tot feestelijke dorpsmomenten en tradities.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <CheckCircle className="w-6 h-6 text-sdg-red shrink-0 mt-0.5" />
                    <div>
                       <strong className="block text-slate-900">Investeren in de toekomst</strong>
                       <p className="text-slate-600 text-sm">Door onze jeugdopleiding te stimuleren en te subsidiëren, bouwen we samen aan een vitale vereniging voor jong en oud.</p>
                    </div>
                 </div>
              </div>

              <div className="pt-2">
                 <button 
                   onClick={() => navigate('/over-ons')}
                   className="group flex items-center text-sdg-red font-bold uppercase tracking-wider hover:text-red-900 transition-colors"
                 >
                    Ontdek onze volledige identiteit <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 border-y border-slate-100">
         <div className="container mx-auto px-6">
            <Testimonials />
         </div>
      </section>

      <AgendaList />
      <NewsGrid />
      <Recruitment />
      
      {/* Sponsor Banner op Home met vriendelijke titel */}
      <SponsorGrid variant="monochrome" title="Samen voor SDG: Onze Sponsoren" />

      <div id="contact"></div>
    </>
  );
};

export default Home;
