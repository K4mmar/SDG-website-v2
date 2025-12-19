import React from 'react';
import { Quote, MessageCircle, Coffee, Music, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuoteCard: React.FC<{ 
  text: string; 
  author: string; 
  role: string; 
  type: 'skill' | 'social' | 'youth'; 
}> = ({ text, author, role, type }) => {
  const icons = {
    skill: <Music className="w-5 h-5 text-sdg-gold" />,
    social: <Coffee className="w-5 h-5 text-sdg-gold" />,
    youth: <Heart className="w-5 h-5 text-sdg-gold" />
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 relative group hover:shadow-2xl transition-all duration-500 flex flex-col h-full shadow-sm">
      <div className="absolute -top-4 left-8 bg-slate-900 p-3 rounded-2xl shadow-lg text-white group-hover:bg-sdg-red transition-colors duration-300">
        <Quote size={20} className="fill-current" />
      </div>
      
      <div className="mb-6 mt-4">
        <div className="flex items-center gap-2 mb-4 opacity-60">
          {icons[type]}
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            {type === 'skill' ? 'Over het niveau' : type === 'social' ? 'Over de sfeer' : 'Voor de ouders'}
          </span>
        </div>
        <p className="text-slate-700 italic font-serif text-xl leading-relaxed">
          "{text}"
        </p>
      </div>

      <div className="mt-auto flex items-center gap-4 pt-6 border-t border-slate-50">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-sdg-gold/20 group-hover:text-sdg-gold transition-colors">
          {author[0]}
        </div>
        <div>
          <span className="block text-slate-900 font-bold text-sm uppercase tracking-wide">{author}</span>
          <span className="block text-sdg-red text-xs font-semibold">{role}</span>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-8">
      <div className="text-center mb-16">
        <span className="text-sdg-red font-bold uppercase tracking-widest text-xs mb-3 block">Twijfel je nog?</span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6">Hoor het van onze leden</h2>
        <p className="text-slate-500 max-w-2xl mx-auto font-light">
          We begrijpen dat de stap naar een nieuwe vereniging spannend kan zijn. 
          Daarom laten we graag onze leden aan het woord over hun ervaring bij SDG.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <QuoteCard 
          type="skill"
          text="Ik had al 10 jaar geen instrument aangeraakt en was bang dat ik het niveau niet aan zou kunnen. Niets was minder waar; de begeleiding is top en je groeit vanzelf mee."
          author="Jan-Willem"
          role="Herintreder (Trombone)"
        />
        <QuoteCard 
          type="social"
          text="Muziek maken bij SDG geeft me echt energie. De passie voor het vak en de manier waarop we samen naar een concert toewerken schept een sterke band. Je voelt je direct welkom."
          author="Gerda"
          role="Lid sinds 2018 (Saxofoon)"
        />
        <QuoteCard 
          type="youth"
          text="Onze dochter is begonnen met de algemene muziekopleiding. Het enthousiasme van de docenten werkt aanstekelijk. Ze leert niet alleen de basis, maar krijgt ook echt plezier in haar instrument."
          author="Moeder van Lisa"
          role="Ouder van jeugdlid"
        />
      </div>

      {/* Reassurance & CTA Box */}
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sdg-gold/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sdg-red/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-grow text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">Nog niet helemaal overtuigd?</h3>
            <p className="text-slate-300 font-light mb-0 leading-relaxed">
              Kom een keertje vrijblijvend sfeer proeven tijdens een repetitie of doe mee aan een proefles. 
              Geen verplichtingen, gewoon muziek beleven. <strong>De koffie staat altijd klaar!</strong>
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/lid-worden')}
              className="bg-sdg-gold text-slate-900 px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-white transition-all shadow-lg flex items-center gap-2 group"
            >
              <MessageCircle className="w-5 h-5" />
              Stel je vraag
            </button>
            <button 
              onClick={() => navigate('/jeugd')}
              className="border border-white/30 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-white/10 transition-all"
            >
              Proefles aanvragen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;