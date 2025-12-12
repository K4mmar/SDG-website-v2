import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Heart, Recycle } from 'lucide-react';

const Card: React.FC<{ title: string; desc: string; icon: React.ReactNode; image: string; link: string; linkText: string }> = ({ title, desc, icon, image, link, linkText }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(link)}
      className="group relative overflow-hidden rounded-3xl shadow-lg bg-white hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col transform hover:-translate-y-1 cursor-pointer"
    >
      <div className="h-56 overflow-hidden relative">
        <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
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
            image="https://picsum.photos/600/400?random=20"
            link="/contact"
            linkText="Vraag aan"
          />
          <Card
            title="Steun ons"
            desc="Draag bij aan de toekomst van de muziek in Sint Jansklooster. Word 'Vriend van SDG' of sponsor onze vereniging."
            icon={<Heart />}
            image="https://picsum.photos/600/400?random=21"
            link="/steun-ons"
            linkText="Word vriend"
          />
          <Card
            title="Doe mee"
            desc="Vele handen maken licht werk. Bekijk het oud papier rooster of meld je aan als vrijwilliger bij onze evenementen."
            icon={<Recycle />}
            image="https://picsum.photos/600/400?random=22"
            link="/oud-papier"
            linkText="Bekijk rooster"
          />
        </div>
      </div>
    </section>
  );
};

export default Recruitment;