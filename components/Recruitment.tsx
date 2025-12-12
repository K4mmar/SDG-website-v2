import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music2, Drum, Users } from 'lucide-react';

const Card: React.FC<{ title: string; desc: string; icon: React.ReactNode; image: string }> = ({ title, desc, icon, image }) => {
  const navigate = useNavigate();
  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-lg bg-white hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
      <div className="h-48 overflow-hidden relative">
        <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <div className="text-white p-3 bg-sdg-red rounded-lg shadow-md absolute top-4 right-4">
            {icon}
          </div>
        </div>
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-sdg-red transition-colors">{title}</h3>
        <p className="text-slate-600 mb-6 flex-grow leading-relaxed">{desc}</p>
        <button 
          onClick={() => navigate('/lid-worden')} 
          className="inline-block text-sdg-red font-semibold hover:underline mt-auto text-left"
        >
          Lees meer &rarr;
        </button>
      </div>
    </div>
  );
};

const Recruitment: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sdg-red font-bold uppercase tracking-widest text-sm">Doe mee</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2">Speel je mee?</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Of je nu net begint of al jaren speelt, er is altijd een plek voor jou binnen onze vereniging.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card
            title="Jeugdopleiding"
            desc="Start je muzikale reis bij ons! Professionele lessen en samenspel in het jeugdorkest voor de allerjongsten."
            icon={<Music2 />}
            image="https://picsum.photos/600/400?random=10"
          />
          <Card
            title="Slagwerkgroep"
            desc="Ritme, show en spektakel. Onze slagwerkgroep combineert techniek met entertainment op hoog niveau."
            icon={<Drum />}
            image="https://picsum.photos/600/400?random=11"
          />
          <Card
            title="Fanfareorkest"
            desc="Het hart van de vereniging. Samen mooie concerten geven en deelnemen aan concoursen in een gezellige sfeer."
            icon={<Users />}
            image="https://picsum.photos/600/400?random=12"
          />
        </div>
      </div>
    </section>
  );
};

export default Recruitment;