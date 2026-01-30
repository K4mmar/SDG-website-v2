
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Heart, Recycle, ArrowRight } from 'lucide-react';
import { getRecruitmentPagesImages } from '../lib/wordpress';

const Card: React.FC<{ 
    title: string; 
    desc: string; 
    icon: React.ReactNode; 
    image?: string; 
    fallback: string; 
    link: string; 
    linkText: string 
}> = ({ title, desc, icon, image, fallback, link, linkText }) => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(image || fallback);

  useEffect(() => {
    setCurrentImage(image || fallback);
  }, [image, fallback]);

  const handleImageError = () => {
    if (currentImage !== fallback) {
      setCurrentImage(fallback);
    }
  };

  return (
    <div 
      onClick={() => navigate(link)}
      className="group relative overflow-hidden rounded-[2.5rem] bg-white hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] transition-all duration-500 border border-gray-100 h-full flex flex-col transform hover:-translate-y-3 cursor-pointer shadow-sm"
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sdg-gold to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"></div>
      
      <div className="h-64 overflow-hidden relative">
        <img 
          src={currentImage} 
          alt={title} 
          onError={handleImageError}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
        
        {/* Floating Badge Icon */}
        <div className="absolute top-6 right-6 z-20">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl text-sdg-red transform group-hover:rotate-12 transition-transform duration-500 border border-white/50">
                {React.cloneElement(icon as React.ReactElement<any>, { size: 24 })}
            </div>
        </div>
      </div>

      <div className="p-10 flex flex-col flex-grow relative">
        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4 group-hover:text-sdg-red transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 mb-8 flex-grow leading-relaxed font-light text-base">
          {desc}
        </p>
        <div className="flex items-center gap-2 text-sdg-red font-bold uppercase tracking-wider text-xs group-hover:gap-4 transition-all">
          <span>{linkText}</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
};

const Recruitment: React.FC = () => {
  const FALLBACKS = {
    'boek-ons': 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=800&auto=format&fit=crop',
    'steun-ons': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=800&auto=format&fit=crop',
    'doe-mee': 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=800&auto=format&fit=crop',
  };

  const [wpImages, setWpImages] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    async function loadImages() {
      const images = await getRecruitmentPagesImages();
      setWpImages(images);
    }
    loadImages();
  }, []);

  return (
    <section id="community" className="py-32 bg-[#fcfcfc] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-gray-200 to-transparent"></div>
      
      <div className="absolute -bottom-20 -left-20 opacity-[0.03] pointer-events-none select-none z-0">
        <span className="text-[25rem] font-serif font-bold text-slate-900 leading-none tracking-tighter">SDG</span>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
             <span className="h-px w-8 bg-sdg-red/30"></span>
             <span className="text-sdg-red font-bold uppercase tracking-[0.3em] text-xs">Community</span>
             <span className="h-px w-8 bg-sdg-red/30"></span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6">SDG in het Dorp</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            Wij zijn geworteld in Sint Jansklooster. Samen maken we het dorp levendig, muzikaal en verbonden.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 lg:gap-14">
          <Card
            title="Boek ons"
            desc="Van intieme serenades tot feestelijke jubilea: wij voegen een gouden muzikale rand toe aan uw bijzondere momenten in het dorp."
            icon={<Music />}
            image={wpImages['boek-ons']}
            fallback={FALLBACKS['boek-ons']}
            link="/boek-ons"
            linkText="Regel een optreden"
          />
          <Card
            title="Steun ons"
            desc="Dankzij onze Vrienden en sponsors kunnen we blijven investeren in kwalitatieve instrumenten en onze unieke dorpscultuur."
            icon={<Heart />}
            image={wpImages['steun-ons']}
            fallback={FALLBACKS['steun-ons']}
            link="/steun-ons"
            linkText="Word ook Vriend"
          />
          <Card
            title="Doe mee"
            desc="Onze vereniging draait op passie en inzet. Help mee bij evenementen of draag je steentje bij aan de gemeenschap."
            icon={<Recycle />}
            image={wpImages['doe-mee']}
            fallback={FALLBACKS['doe-mee']}
            link="/doe-mee"
            linkText="Bekijk mogelijkheden"
          />
        </div>

        {/* Bottom Decorative Line */}
        <div className="mt-24 flex justify-center">
            <div className="flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-sdg-gold"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-sdg-gold/60"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-sdg-gold/30"></div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Recruitment;
