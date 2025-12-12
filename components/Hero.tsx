import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const scrollToAgenda = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('agenda');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://picsum.photos/1920/1080?grayscale&blur=2"
          alt="Orchestra playing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sdg-red/90 to-slate-900/60 mix-blend-multiply"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white max-w-4xl">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-lg">
          Muziek maken in <br />
          <span className="text-sdg-gold">Sint Jansklooster</span> doe je samen.
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
          Van jong talent tot ervaren muzikant: bij SDG vind je passie, plezier en een warm welkom.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/lid-worden')}
            className="bg-white text-sdg-red px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl flex items-center justify-center gap-2 group"
          >
            Word Lid
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={scrollToAgenda}
            className="border-2 border-white/50 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm"
          >
            Bekijk Agenda
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;