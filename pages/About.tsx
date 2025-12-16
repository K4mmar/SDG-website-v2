import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Music, Heart, BookOpen, Users, Star, 
  Clock, Award, Calendar, ChevronDown, ArrowRight 
} from 'lucide-react';

// --- DATA: IDENTITY CARDS (BENTO GRID) ---
const IDENTITY_CARDS = [
  {
    id: 'samen',
    title: 'Muziek & Dorp',
    subtitle: 'Samen Spelen',
    desc: 'Wij zijn een relatief kleine vereniging waar het plezier van samen spelen voorop staat. Je hoort ons jaarlijks tijdens sfeervolle dorpsmomenten zoals de Kerstnacht en de opening van de Kloostermarkt.',
    icon: <Music className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop',
    colSpan: 'md:col-span-2',
    theme: 'red'
  },
  {
    id: 'geloof',
    title: 'Soli Deo Gloria',
    subtitle: 'Onze Identiteit',
    desc: 'Alleen aan God de Eer. Onze christelijke basis is de bron van waaruit we musiceren en met elkaar omgaan.',
    icon: <BookOpen className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800&auto=format&fit=crop',
    colSpan: 'md:col-span-1',
    theme: 'gold'
  },
  {
    id: 'toekomst',
    title: 'Investeren in Jeugd',
    subtitle: 'De Toekomst',
    desc: 'De jeugd heeft de toekomst. We maken muziekles toegankelijk door de opleiding te subsidiëren. Daarnaast betrekken we onze leerlingen direct bij leuke activiteiten, zodat ze zich snel thuis voelen binnen de vereniging.',
    icon: <Star className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800&auto=format&fit=crop',
    colSpan: 'md:col-span-3',
    theme: 'dark'
  }
];

// --- DATA: HISTORY TIMELINE ---
const TIMELINE_EVENTS = [
  {
    year: '1900',
    title: 'De Oprichting',
    subtitle: 'Het prille begin',
    desc: 'Op 8 november wordt "Soli Deo Gloria" opgericht door meester Van der Meij. De eerste 7 instrumenten arriveren in een grote kist bij Geert Leeuw aan de Kloosterweg.',
    image: 'https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/1.-1905_met_oprichter_en_dirigent_van_der_mey.jpg&output=webp&q=80&w=600'
  },
  {
    year: '1921',
    title: 'Koninklijk Bezoek',
    subtitle: 'Oranje Boven',
    desc: 'Koningin Wilhelmina bezoekt het gemaal. SDG speelt het Wilhelmus, maar de koets rijdt snel door. De muzikanten moesten rennen om het werkbezoek nog te halen!',
    image: null
  },
  {
    year: '1960',
    title: 'Groei & Bloei',
    subtitle: '60 Jaar Jubileum',
    desc: 'Het korps groeit gestaag. Viering van het 60-jarig jubileum met een grootse optocht door het dorp. De vereniging is niet meer weg te denken uit het dorpsleven.',
    image: 'https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/2.-1960_60_jarig_jubileum.jpg&output=webp&q=80&w=600'
  },
  {
    year: '1974',
    title: 'Concours Successen',
    subtitle: 'Muzikale hoogtepunten',
    desc: 'SDG laat van zich horen op diverse concoursen in de regio, zoals hier in Wezep. De muzikale kwaliteit neemt toe en de prijzenkast raakt voller.',
    image: 'https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/4.-1974_concours_wezep.jpg&output=webp&q=80&w=600'
  },
  {
    year: '1985',
    title: 'Show & Majorettes',
    subtitle: 'Bloemencorso',
    desc: 'De vereniging breidt uit en moderniseert. De majorettes en showelementen worden een vast onderdeel van de optredens tijdens het Bloemencorso.',
    image: 'https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/6.-1985_bloemencorso_sint_jansklooster_majorettes.jpg&output=webp&q=80&w=600'
  },
  {
    year: '2025',
    title: 'Koninklijke Erepenning',
    subtitle: '125 Jaar SDG',
    desc: 'De bekroning op 125 jaar muziek. We ontvingen de Koninklijke Erepenning als symbool voor respect en waardering. Een mijlpaal voor de hele gemeenschap.',
    image: 'https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/IMG_1473.jpg&output=webp&q=80&w=600'
  }
];

// --- COMPONENTS ---

const ScrollFadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      
      {/* 1. HERO SECTION */}
      <div className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/DSC06776.jpg&output=webp&q=80&w=1600" 
            alt="SDG Groepsfoto" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
           <span className="block text-sdg-gold font-bold uppercase tracking-[0.3em] mb-4 text-sm animate-fade-in">
             Over ons
           </span>
           <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight animate-fade-in-up">
             Meer dan een <span className="italic text-sdg-gold">vereniging</span>.
           </h1>
           <p className="text-xl md:text-2xl font-light text-slate-200 max-w-2xl mx-auto animate-fade-in-up delay-200">
             Een plek waar muziek, geloof en vriendschap samenkomen. Al sinds 1900.
           </p>
           
           <div className="mt-12 animate-bounce">
             <ChevronDown className="w-8 h-8 mx-auto text-white/50" />
           </div>
        </div>
      </div>

      {/* 2. IDENTITY (BENTO GRID) - THE "NOW" */}
      <section className="py-24 px-6 container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Ons DNA</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Waar we voor staan en waarom we doen wat we doen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {IDENTITY_CARDS.map((card, index) => (
            <ScrollFadeIn key={card.id} delay={index * 100}>
              <div className={`${card.colSpan} group relative h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer`}>
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-75 group-hover:brightness-50"
                  />
                  <div className={`absolute inset-0 opacity-60 mix-blend-multiply transition-opacity duration-300 ${
                    card.theme === 'red' ? 'bg-sdg-red' : 
                    card.theme === 'gold' ? 'bg-yellow-600' : 
                    card.theme === 'blue' ? 'bg-blue-900' : 'bg-slate-900'
                  }`}></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="mb-4 bg-white/20 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center border border-white/30">
                      {card.icon}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white/80 mb-1 block">{card.subtitle}</span>
                    <h3 className="text-2xl font-serif font-bold mb-3">{card.title}</h3>
                    <p className="text-slate-200 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 max-w-sm">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* 3. JUBILEE (PARALLAX) - THE "BUZZ" */}
      <section className="relative py-32 bg-slate-900 overflow-hidden">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 opacity-30 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: 'url("https://api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/DSC06763-scaled.png")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-sdg-gold/20 text-sdg-gold rounded-full border border-sdg-gold/30 mb-6 font-bold text-xs uppercase tracking-widest">
               <Award className="w-4 h-4" /> 125 Jaar Jubileum
             </div>
             <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-none">
               Een jaar vol <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-sdg-gold to-yellow-200">Hoogtepunten</span>
             </h2>
             
             {/* EVENTS LIST */}
             <div className="space-y-5 mb-8 mt-8">
               
               {/* Event 1 */}
               <div className="flex gap-4 items-start group">
                  <div className="w-14 shrink-0 pt-1 text-right border-r-2 border-sdg-gold/30 pr-4">
                     <span className="block font-bold text-sdg-gold text-lg leading-none">08</span>
                     <span className="block text-xs uppercase text-slate-500 font-bold">mrt</span>
                  </div>
                  <div>
                     <h4 className="font-bold text-white text-lg group-hover:text-sdg-gold transition-colors">Maestro Concert</h4>
                     <p className="text-slate-400 text-sm font-light">Dorpshuis Sint Janskamp</p>
                  </div>
               </div>

               {/* Event 2 */}
               <div className="flex gap-4 items-start group">
                  <div className="w-14 shrink-0 pt-1 text-right border-r-2 border-sdg-gold/30 pr-4">
                     <span className="block font-bold text-sdg-gold text-lg leading-none">12</span>
                     <span className="block text-xs uppercase text-slate-500 font-bold">apr</span>
                  </div>
                  <div>
                     <h4 className="font-bold text-white text-lg group-hover:text-sdg-gold transition-colors">Zingen naar Pasen</h4>
                     <p className="text-slate-400 text-sm font-light">Johanneskerk</p>
                  </div>
               </div>

               {/* Event 3 */}
               <div className="flex gap-4 items-start group">
                  <div className="w-14 shrink-0 pt-1 text-right border-r-2 border-sdg-gold/30 pr-4">
                     <span className="block font-bold text-sdg-gold text-lg leading-none">28</span>
                     <span className="block text-xs uppercase text-slate-500 font-bold">jun</span>
                  </div>
                  <div>
                     <h4 className="font-bold text-white text-lg group-hover:text-sdg-gold transition-colors">Taptoe</h4>
                     <p className="text-slate-400 text-sm font-light">Voetbalveld VHK</p>
                  </div>
               </div>

               {/* Event 4 */}
               <div className="flex gap-4 items-start group">
                  <div className="w-14 shrink-0 pt-1 text-right border-r-2 border-sdg-gold/30 pr-4">
                     <span className="block font-bold text-sdg-gold text-lg leading-none">08</span>
                     <span className="block text-xs uppercase text-slate-500 font-bold">nov</span>
                  </div>
                  <div>
                     <h4 className="font-bold text-white text-lg group-hover:text-sdg-gold transition-colors">Groots Jubileumconcert</h4>
                     <p className="text-slate-400 text-sm font-light">De afsluiting van ons feestjaar</p>
                  </div>
               </div>

             </div>

             <button 
                onClick={() => navigate('/jubileumjaar')}
                className="group flex items-center gap-3 text-white font-bold uppercase tracking-wide border-b-2 border-sdg-gold pb-1 hover:text-sdg-gold transition-colors mt-8"
             >
               Bekijk het jubileumjaar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>

          <div className="md:w-1/2 grid grid-cols-2 gap-4">
             <div className="space-y-4 mt-8">
               <img 
                 src="https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/DSC06992.jpg&output=webp&q=80&w=600" 
                 className="rounded-2xl shadow-2xl w-full h-auto object-contain transform hover:scale-105 transition-transform duration-500" 
                 alt="Concert" 
               />
               <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center">
                 <span className="block text-4xl font-bold text-white mb-1">125</span>
                 <span className="text-xs uppercase text-slate-400 font-bold tracking-widest">Jaar Muziek</span>
               </div>
             </div>
             <div className="space-y-4">
               <div className="bg-sdg-gold p-6 rounded-2xl text-center shadow-lg shadow-sdg-gold/20">
                 <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-900" />
                 <span className="block text-slate-900 font-bold text-sm">Taptoe 2025</span>
               </div>
               <img 
                 src="https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/SDG-s1-1.jpg&output=webp&q=80&w=600" 
                 className="rounded-2xl shadow-2xl w-full h-auto object-contain transform hover:scale-105 transition-transform duration-500" 
                 alt="Publiek" 
               />
             </div>
          </div>
        </div>
      </section>

      {/* 4. HISTORY (TIMELINE) - PROFESSIONALIZED */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl">
           <div className="text-center mb-24">
              <span className="text-sdg-red font-bold uppercase tracking-widest text-sm mb-2 block">Tijdlijn</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Onze Geschiedenis</h2>
              <p className="mt-4 text-slate-500 font-light">Van de oprichting in 1900 tot het koninklijke heden.</p>
           </div>

           <div className="relative">
              {/* Vertical Line - Dashed for lighter feel */}
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-gray-200 -translate-x-1/2"></div>

              {TIMELINE_EVENTS.map((event, index) => (
                <ScrollFadeIn key={index}>
                  <div className={`relative flex flex-col md:flex-row gap-12 mb-20 ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}>
                    
                    {/* Date Bubble (Center) */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-0 w-12 h-12 bg-white border border-gray-100 rounded-full z-10 flex items-center justify-center shadow-md group">
                       <div className="w-3 h-3 bg-sdg-red rounded-full ring-4 ring-red-50 group-hover:ring-red-100 transition-all"></div>
                    </div>

                    {/* Content Half */}
                    <div className="md:w-1/2 pl-20 md:pl-0 md:px-16 pt-1">
                       <div className={`relative flex flex-col ${index % 2 === 0 ? 'md:items-start md:text-left' : 'md:items-end md:text-right'}`}>
                          
                          {/* Year Label - Large & Serif */}
                          <span className="text-5xl font-serif font-bold text-slate-100 absolute -top-10 -z-10 select-none">
                            {event.year}
                          </span>
                          <span className="text-sdg-red font-bold text-sm tracking-widest uppercase mb-1">{event.year}</span>
                          
                          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-1">{event.title}</h3>
                          <span className="text-xs font-bold uppercase text-slate-400 mb-4 block">{event.subtitle}</span>
                          
                          <p className="text-slate-600 leading-relaxed font-light mb-6 max-w-md">
                            {event.desc}
                          </p>
                          
                          {event.image && (
                            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 w-full max-w-md aspect-[4/3] group cursor-pointer">
                              <img 
                                src={event.image} 
                                alt={event.title} 
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105" 
                              />
                            </div>
                          )}
                       </div>
                    </div>

                    {/* Empty Half for structure */}
                    <div className="md:w-1/2"></div>
                  </div>
                </ScrollFadeIn>
              ))}
           </div>
           
           {/* Final CTA */}
           <div className="text-center mt-24">
             <div className="w-16 h-1 bg-sdg-gold/30 mx-auto mb-8 rounded-full"></div>
             <p className="text-slate-500 mb-8 italic font-serif text-2xl">"De toekomst schrijven we samen."</p>
             <button 
               onClick={() => navigate('/lid-worden')}
               className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-sdg-red transition-all hover:-translate-y-1"
             >
               Word lid van SDG
             </button>
           </div>
        </div>
      </section>

    </div>
  );
};

export default About;