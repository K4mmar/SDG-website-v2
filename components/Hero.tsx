import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setIsLoaded(true);
  }, []);

  const scrollToAgenda = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('agenda');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const bgImage = "https://images.pubble.cloud/worker/webp/default/1440/590863/39aff116/content/2025/3/afda3c2b-3422-460c-bde8-49b484dc60b7";

  return (
    <div className="relative h-screen min-h-[600px] flex flex-col justify-center overflow-hidden bg-slate-900">
      {/* Background Image with refined Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="SDG Sint Jansklooster optreden"
          // Awwwards style: Minimal blur (depth of field feel), slightly zoomed for cinematic effect
          className={`w-full h-full object-cover transition-transform duration-[2000ms] ease-out ${isLoaded ? 'scale-105' : 'scale-100'} blur-[1px] brightness-[0.85]`}
        />
        {/* Cinematic Gradient Overlay: Darker at bottom for text readability, vignette on sides */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/50 to-slate-900/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-transparent to-slate-900/40"></div>
      </div>

      {/* Main Content Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex flex-col justify-center">
        <div className="max-w-5xl mx-auto text-center mt-16 md:mt-10">
          
          {/* 1. The "Kicker" - Hidden on mobile for cleaner look */}
          <div 
            className={`hidden md:flex items-center justify-center gap-3 mb-6 transition-all duration-1000 delay-100 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="h-[1px] w-8 bg-sdg-gold/60 inline-block"></span>
            <span className="text-sdg-gold font-semibold tracking-[0.2em] uppercase text-sm">
              Christelijke Muziekvereniging
            </span>
            <span className="h-[1px] w-8 bg-sdg-gold/60 inline-block"></span>
          </div>

          {/* 2. The Headline - Slightly smaller on mobile */}
          <h1 
            className={`text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-4 md:mb-6 tracking-tight leading-tight transition-all duration-1000 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Muziek maken
            {/* Space needed for mobile when BR is hidden to prevent "Muziek makendoe" */}
            <span className="inline md:hidden"> </span>
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-300">
             doe je 
            </span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sdg-gold to-white">
              samen.
            </span>
          </h1>

          {/* 3. Sub-headline - The "Elegant" Context line */}
          <div 
             className={`mb-6 md:mb-8 transition-all duration-1000 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-xl md:text-3xl font-serif italic text-gray-200">
              Het kloppend hart van <span className="font-sans font-bold not-italic text-white text-shadow-sm">Sint Jansklooster</span>
            </p>
          </div>

          {/* 4. Description - Hidden on small mobile screens to save space */}
          <p 
            className={`hidden sm:block text-lg md:text-xl text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto font-light leading-relaxed transition-all duration-1000 delay-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Van jong talent tot ervaren muzikant: bij SDG vind je passie, kwaliteit en een warm welkom.
          </p>
          
          {/* 5. Action Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center transition-all duration-1000 delay-900 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <button
              onClick={() => navigate('/lid-worden')}
              className="group relative w-full sm:w-auto px-8 py-3 md:py-4 bg-sdg-red text-white rounded-full font-bold overflow-hidden shadow-lg shadow-sdg-red/20 transition-all hover:scale-105 hover:shadow-sdg-red/40"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              <span className="relative flex items-center justify-center gap-2">
                Word Lid
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button
              onClick={scrollToAgenda}
              className="w-full sm:w-auto px-8 py-3 md:py-4 rounded-full font-bold text-white border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm"
            >
              Bekijk Agenda
            </button>
          </div>
        </div>
      </div>

      {/* 6. Bottom Bar / Social Proof (The Pillars) */}
      <div className={`relative z-10 border-t border-white/10 bg-black/40 md:bg-black/20 backdrop-blur-md mt-auto transition-all duration-1000 delay-[1200ms] ${
         isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 md:gap-6 text-xs md:text-base text-gray-300 font-medium tracking-wide uppercase">
             <div className="hidden md:block">
               <span className="text-sdg-gold mr-2">Est.</span> 19XX
             </div>
             
             {/* Mobile optimized pillars list */}
             <div className="flex flex-wrap justify-center gap-3 md:gap-16 items-center w-full md:w-auto">
               <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">Fanfare</span>
               <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-sdg-red"></span>
               <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">Malletband</span>
               <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-sdg-red"></span>
               <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">Jeugdopleidingen</span>
             </div>

             <div className="hidden md:flex items-center gap-2 animate-bounce opacity-70">
               <ArrowDown size={16} />
             </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .text-shadow-sm {
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default Hero;