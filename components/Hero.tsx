
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

  // Updated background image via weserv for optimization (using the new compressed source)
  const bgImage = "https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/DSC06776.jpg&output=webp&q=80&w=1600";

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
            <span className="text-sdg-gold font-sans font-semibold tracking-[0.2em] uppercase text-sm">
              Christelijke Muziekvereniging
            </span>
            <span className="h-[1px] w-8 bg-sdg-gold/60 inline-block"></span>
          </div>

          {/* 2. The Headline - Slightly smaller on mobile */}
          <h1 
            className={`font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 md:mb-8 tracking-tight leading-tight transition-all duration-1000 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Muziek maken
            {/* Space needed for mobile when BR is hidden to prevent "Muziek makendoe" */}
            <span className="inline md:hidden"> </span>
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-200 italic pr-2">
             doe je 
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sdg-gold to-yellow-200">
              samen.
            </span>
          </h1>

          {/* 3. Sub-headline - The "Elegant" Context line */}
          <div 
             className={`mb-8 md:mb-10 transition-all duration-1000 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-xl md:text-3xl font-serif italic text-gray-200">
              Het kloppend hart van <span className="font-bold not-italic text-white text-shadow-sm">Sint Jansklooster</span>
            </p>
          </div>

          {/* 4. Description - Hidden on small mobile screens to save space */}
          <p 
            className={`hidden sm:block text-lg md:text-xl text-gray-300 mb-10 md:mb-12 max-w-2xl mx-auto font-light leading-relaxed transition-all duration-1000 delay-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Van jong talent tot ervaren muzikant: bij SDG vind je passie, kwaliteit en een warm welkom.
          </p>
          
          {/* 5. Action Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center transition-all duration-1000 delay-900 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Primary Action: Speel Mee - Gold Gradient Style */}
            <button
              onClick={() => navigate('/lid-worden')}
              className="group relative w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-sdg-gold to-amber-500 text-white rounded-full font-bold overflow-hidden shadow-lg shadow-sdg-gold/30 transition-all hover:scale-105 hover:shadow-sdg-gold/50"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              <span className="relative flex items-center justify-center gap-2 font-sans tracking-wide">
                Speel Mee
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button
              onClick={scrollToAgenda}
              className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-white border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm font-sans tracking-wide"
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
          <div className="flex flex-wrap justify-center items-center relative text-xs md:text-base text-gray-300 font-medium tracking-wide uppercase font-sans">
             
             {/* Mobile optimized pillars list - Linked to Pages - Centered */}
             <div className="flex flex-wrap justify-center gap-3 md:gap-16 items-center">
               <button onClick={() => navigate('/fanfare')} className="hover:text-white transition-colors cursor-pointer whitespace-nowrap hover:underline decoration-sdg-gold underline-offset-4">
                 Fanfare
               </button>
               
               <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-sdg-red"></span>
               
               <button onClick={() => navigate('/malletband')} className="hover:text-white transition-colors cursor-pointer whitespace-nowrap hover:underline decoration-sdg-gold underline-offset-4">
                 Malletband
               </button>
               
               <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-sdg-red"></span>
               
               <button onClick={() => navigate('/jeugd')} className="hover:text-white transition-colors cursor-pointer whitespace-nowrap hover:underline decoration-sdg-gold underline-offset-4">
                 Opleiding
               </button>
             </div>

             {/* Arrow Icon - Positioned absolute right to not disturb centering */}
             <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 items-center gap-2 animate-bounce opacity-70">
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
