import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Music, Heart, BookOpen, Users, Star, 
  Clock, Award, Calendar, ChevronDown, ArrowRight,
  HeartHandshake, Sparkles
} from 'lucide-react';
import SEO from '../components/SEO';

// --- DATA: DNA PILLARS (DE KRACHT VAN SDG) ---
const DNA_PILLARS = [
  {
    id: 'bron-en-toewijding',
    title: 'Onze Bron en Toewijding',
    kicker: 'Geloof, bezieling en ontmoeting',
    desc: 'Met het evangelie van Jezus Christus als onze bron musiceren we tot eer van God. We zijn een warme en toegankelijke vereniging waar saamhorigheid en betrokkenheid centraal staan. Hier voelen muzikanten van alle leeftijden zich thuis.',
    icon: Sparkles,
    iconColor: 'text-sdg-red',
    badgeBg: 'bg-red-50 border-red-100'
  },
  {
    id: 'veelzijdig-repertoire',
    title: 'Veelzijdig in Klank en Repertoire',
    kicker: 'Fanfare, malletband en dweilorkest',
    desc: 'Binnen onze fanfare, malletband en dweilorkest mag ieder lid zijn of haar muzikale gaven inzetten. Ons brede repertoire reikt van ingetogen koralen en koraalbewerkingen tot feestelijke marsen en hedendaagse (pop)muziek.',
    icon: Music,
    iconColor: 'text-amber-700',
    badgeBg: 'bg-amber-50 border-amber-100'
  },
  {
    id: 'verbindend-in-het-dorp',
    title: 'Verbindend in het Dorp',
    kicker: 'Zichtbaar in Sint Jansklooster en de regio',
    desc: 'Als herkenbare en verbindende kracht in Sint Jansklooster en de regio zetten we onze muzikale gaven in voor kerkelijke, maatschappelijke en feestelijke momenten. Je hoort ons onder meer tijdens de kerstnacht, de Kloostermarkt, Sinterklaas, serenades en concerten.',
    icon: HeartHandshake,
    iconColor: 'text-slate-800',
    badgeBg: 'bg-slate-100 border-slate-200'
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
    desc: 'Het korps groeit gestag. Viering van het 60-jarig jubileum met een grootse optocht door het dorp. De vereniging is niet meer weg te denken uit het dorpsleven.',
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
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [hash]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      <SEO 
        title="Ons DNA & Over Ons - CMV Soli Deo Gloria Sint Jansklooster" 
        description="Ontdek het DNA van Soli Deo Gloria Sint Jansklooster. Verbonden door muziek, met onze fanfare, malletband en dweilorkest met hart voor het dorp."
      />
      
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

      {/* 2. ONS DNA (KRACHT, PASSIE & GEMEENSCHAP) */}
      <section id="dna" className="py-20 md:py-28 px-6 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          {/* Header Structuur conform richtlijnen */}
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            {/* 1. Subtiele pre-title */}
            <span className="text-sdg-red font-semibold uppercase tracking-widest text-xs md:text-sm mb-3 block">
              Ons DNA
            </span>
            
            {/* 2. Krachtige headline (h2) die muziek, geloof en verbinding samenbrengt */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
              Muziek maken tot eer van God, verbonden met ons dorp
            </h2>
            
            {/* 3. Korte leadtekst (circa 2 zinnen) */}
            <p className="mt-5 text-slate-600 text-base md:text-lg leading-relaxed">
              Soli Deo Gloria is een actieve muziekvereniging die mensen en generaties samenbrengt door het plezier van samen musiceren. Vanuit ons christelijk geloof spelen we tot eer van God en dragen we met enthousiasme bij aan het dorpsleven in Sint Jansklooster.
            </p>
          </div>

          {/* Drie kaarten */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {DNA_PILLARS.map((pillar, index) => {
              const IconComponent = pillar.icon;
              return (
                <ScrollFadeIn key={pillar.id} delay={index * 120}>
                  <article className="h-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-start">
                    {/* Icoon */}
                    <div className="mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${pillar.badgeBg} ${pillar.iconColor} shadow-xs`}>
                        <IconComponent className="w-7 h-7" strokeWidth={1.8} />
                      </div>
                    </div>

                    {/* Titel */}
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 mb-1.5">
                      {pillar.title}
                    </h3>
                    
                    {/* Thema */}
                    <p className="text-xs font-semibold text-sdg-red mb-3 tracking-wide">
                      {pillar.kicker}
                    </p>

                    {/* Beschrijving */}
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                      {pillar.desc}
                    </p>
                  </article>
                </ScrollFadeIn>
              );
            })}
          </div>
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
      <section id="geschiedenis" className="py-24 bg-white overflow-hidden">
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