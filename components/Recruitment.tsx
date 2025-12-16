import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Heart, Recycle } from 'lucide-react';
import { getRecruitmentPagesImages } from '../lib/wordpress';

// Explicitly typed Card component with robust fallback handling
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
  // Start with WP image if available, else fallback
  const [currentImage, setCurrentImage] = useState(image || fallback);

  // Sync state with props: if image prop changes (e.g. loads from API), update currentImage
  // If image is undefined, revert to fallback
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
      className="group relative overflow-hidden rounded-3xl shadow-lg bg-white hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col transform hover:-translate-y-1 cursor-pointer"
    >
      <div className="h-56 overflow-hidden relative">
        <img 
          src={currentImage} 
          alt={title} 
          onError={handleImageError}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <div className="text-white p-3 bg-sdg-red rounded-xl shadow-md absolute top-4 right-4 group-hover:bg-white group-hover:text-sdg-red transition-colors">
            {icon}
          </div>
        </div>
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-serif font-bold text-slate-800 mb-3 group-hover:text-sdg-red transition-colors">{title}</h3>
        <p className="text-slate-600 mb-6 flex-grow leading-relaxed font-light">{desc}</p>
        <span className="inline-block text-sdg-red font-semibold hover:text-red-800 mt-auto text-left tracking-wide group-hover:translate-x-1 transition-transform">
          {linkText} &rarr;
        </span>
      </div>
    </div>
  );
};

const Recruitment: React.FC = () => {
  // FALLBACK IMAGES (Passende stockfoto's van Unsplash)
  const FALLBACKS = {
    'boek-ons': 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=800&auto=format&fit=crop', // Music/Band Celebration
    'steun-ons': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=800&auto=format&fit=crop', // Community/Crowd/Support
    'doe-mee': 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=800&auto=format&fit=crop', // Group/Teamwork
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
    <section className="py-24 bg-slate-50 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sdg-red font-bold uppercase tracking-widest text-sm font-sans mb-2 block">Verbonden</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">SDG in het Dorp</h2>
          <p className="text-slate-600 mt-6 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Wij zijn meer dan alleen een muziekvereniging. Wij zijn onderdeel van de gemeenschap. 
            Van feestelijke serenades tot maatschappelijke inzet.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card
            title="Boek ons"
            desc="Iets te vieren? Een jubileum, opening of verjaardag is niet compleet zonder een muzikale hulde. Vraag een serenade aan."
            icon={<Music />}
            image={wpImages['boek-ons']}
            fallback={FALLBACKS['boek-ons']}
            link="/boek-ons"
            linkText="Vraag aan"
          />
          <Card
            title="Steun ons"
            desc="Draag bij aan de toekomst van de muziek in Sint Jansklooster. Word 'Vriend van SDG' of sponsor onze vereniging."
            icon={<Heart />}
            image={wpImages['steun-ons']}
            fallback={FALLBACKS['steun-ons']}
            link="/steun-ons"
            linkText="Word vriend"
          />
          <Card
            title="Doe mee"
            desc="Vele handen maken licht werk. Bekijk het oud papier rooster of meld je aan als vrijwilliger bij onze evenementen."
            icon={<Recycle />}
            image={wpImages['doe-mee']}
            fallback={FALLBACKS['doe-mee']}
            link="/doe-mee"
            linkText="Meld je aan"
          />
        </div>
      </div>
    </section>
  );
};

export default Recruitment;