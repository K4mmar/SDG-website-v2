
import React, { useState, useRef, useEffect } from 'react';
import { 
  Music, Sparkles, Wind, Drum, 
  Users, CheckCircle, ArrowRight, Star, Play, Pause,
  Trophy, ChevronDown, ChevronUp, HelpCircle, ExternalLink, User
} from 'lucide-react';

// --- DATA CONFIGURATION ---

const TEAMS = [
  {
    id: 'slagwerk', 
    title: 'Malletband', 
    subtitle: 'Slagwerk', 
    description: 'Jij bent de motor van de band. Je houdt van ritme, actie en spektakel.',
    instruments: ['Drums', 'Marimba', 'Pauken', 'Xylofoon'],
    color: 'from-orange-400 to-red-500',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    icon: <Drum className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=800&auto=format&fit=crop',
    audioUrl: 'https://api.sdgsintjansklooster.nl/wp-content/Audio/bass-drum__phrase_mezzo-forte_sticks.mp3'
  },
  {
    id: 'koper',
    title: 'Koperblazers', 
    subtitle: 'Fanfare Orkest',
    description: 'Jij blaast iedereen omver! Van stoer en krachtig tot warm en zacht.',
    instruments: ['Trompet', 'Bugel', 'Trombone', 'Hoorn', 'Bas'],
    color: 'from-yellow-400 to-amber-600',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    icon: <Sparkles className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop',
    audioUrl: 'https://api.sdgsintjansklooster.nl/wp-content/Audio/trumpet_As3_phrase_mezzo-forte_tenuto.mp3'
  },
  {
    id: 'sax',
    title: 'Saxofoons',
    subtitle: 'Fanfare Orkest',
    description: 'Het populairste geluid dat overal bij past. Pop, jazz of klassiek.',
    instruments: ['Altsax', 'Tenorsax', 'Baritonsax'],
    color: 'from-blue-400 to-indigo-600',
    bg: 'bg-blue-50',
    text: 'text-indigo-600',
    icon: <Wind className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=800&auto=format&fit=crop',
    audioUrl: 'https://api.sdgsintjansklooster.nl/wp-content/Audio/saxophone_G3_phrase_mezzo-forte_nonlegato.mp3'
  }
];

const ROADMAP = [
  {
    step: 1,
    title: "Muziek Basis",
    age: "Groep 4/5",
    desc: "Samen met Blink kunstcollectief leer je spelenderwijs de basis: ritme, noten lezen en plezier maken met muziek.",
    icon: <Music className="w-5 h-5" />
  },
  {
    step: 2,
    title: "Instrument Kiezen",
    age: "Vanaf 8 jaar",
    desc: "Je kiest je favoriete instrument en krijgt les van gediplomeerde docenten. Je krijgt je eigen instrument in bruikleen van de vereniging.",
    icon: <Star className="w-5 h-5" />
  },
  {
    step: 3,
    title: "Het Grote Orkest",
    age: "Diploma A/B",
    desc: "Je bent klaar voor het 'echte' werk: de Fanfare of de Malletband. Concerten, optochten en levenslange vriendschappen.",
    icon: <Trophy className="w-5 h-5" />
  }
];

// --- COMPONENTS ---

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 text-left group hover:text-sdg-red transition-colors"
      >
        <span className="font-serif font-bold text-slate-700 text-lg">{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-sdg-gold" /> : <ChevronDown className="w-5 h-5 text-gray-300 group-hover:text-sdg-red" />}
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-slate-500 font-light leading-relaxed pr-8">{answer}</p>
      </div>
    </div>
  );
};

const Education: React.FC = () => {
  const [activeTeamId, setActiveTeamId] = useState<string>(''); 
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false); 
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const formRef = useRef<HTMLDivElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
    };
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToVideo = () => {
      videoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTeamSelect = (teamId: string) => {
    setActiveTeamId(teamId);
    scrollToForm();
  };

  const toggleAudio = async (id: string, audioUrl: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if (playingAudio === id) {
      setPlayingAudio(null);
    } else {
      if (audioUrl) {
        setPlayingAudio(id);
        try {
          const audio = new Audio(audioUrl);
          audioPlayerRef.current = audio;
          audio.volume = 0.6;
          audio.onended = () => { setPlayingAudio(null); audioPlayerRef.current = null; };
          await audio.play();
        } catch (err) {
          setPlayingAudio(null);
          audioPlayerRef.current = null;
        }
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => { setFormStatus('success'); }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen md:h-[85vh] md:min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/7M8A8099.jpg&output=webp&q=80&w=1600" 
            alt="Muziek maken met plezier bij SDG" 
            className="w-full h-full object-cover object-center brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-32 pb-16 md:pt-20 md:pb-0">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-sdg-gold text-slate-900 px-4 py-1.5 rounded-full font-bold text-sm uppercase tracking-wider mb-4 md:mb-6">
              <Star className="w-4 h-4 fill-current" /> Ontdek je talent
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
              Word de nieuwe <span className="text-transparent bg-clip-text bg-gradient-to-r from-sdg-gold to-yellow-200">muzikale held</span> van ons dorp.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed font-light">
              In samenwerking met <strong>Blink kunstcollectief</strong> bieden wij een complete muziekopleiding aan. 
              Het instrument? Dat krijg je van ons in bruikleen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToForm}
                className="px-8 py-4 bg-sdg-red text-white rounded-full font-bold text-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-sdg-red/30 flex items-center justify-center gap-2 group"
              >
                Meld je aan voor 3 proeflessen 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={scrollToVideo}
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" /> Bekijk de video
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VIDEO SECTION */}
      <section ref={videoRef} className="py-24 bg-slate-950 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-sdg-red/30 to-sdg-gold/30 blur-[120px] rounded-full mix-blend-screen"></div>
         </div>

         <div className="container mx-auto px-6 relative z-10">
             <div className="text-center mb-12">
                 <span className="text-sdg-gold font-bold uppercase tracking-[0.2em] text-xs mb-3 block animate-fade-in">Sfeerimpressie</span>
                 <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">Beleef de Muziek</h2>
                 <p className="text-slate-400 font-light max-w-xl mx-auto">Krijg een uniek inkijkje bij onze vereniging. Van repetitie tot concert.</p>
             </div>
             
             <div className="max-w-5xl mx-auto">
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black group cursor-pointer">
                    {!showVideo ? (
                        <div onClick={() => setShowVideo(true)} className="absolute inset-0 w-full h-full">
                           <img src="https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1600" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700 scale-105 group-hover:scale-100" alt="Video thumbnail" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="relative">
                                 <div className="absolute inset-0 bg-white/30 rounded-full animate-ping opacity-75"></div>
                                 <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform duration-500">
                                     <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-current ml-1" />
                                 </div>
                              </div>
                           </div>
                        </div>
                    ) : (
                        <video autoPlay controls className="w-full h-full object-cover animate-fade-in">
                           <source src="https://api.sdgsintjansklooster.nl/wp-content/Video/250128v02%20SDG%20Ledenwerving.mp4" type="video/mp4" />
                        </video>
                    )}
                </div>
             </div>
         </div>
      </section>

      {/* 3. THE ROADMAP (Jeugd) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sdg-red font-bold uppercase tracking-widest text-sm mb-2 block">Jouw carrière</span>
            <h2 className="text-4xl font-serif font-bold text-slate-900">Jouw Muzikale Reis</h2>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-8 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
            <div className="md:hidden absolute left-8 top-0 bottom-0 w-1 bg-gray-100 z-0"></div>
            <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative z-10">
              {ROADMAP.map((step, idx) => (
                <div key={idx} className="flex md:flex-col items-start md:items-center gap-6 md:gap-0 group">
                  <div className="shrink-0 relative">
                    <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-sdg-red relative md:mb-6 z-10 group-hover:scale-110 transition-transform duration-300">
                       <div className="relative bg-slate-50 w-full h-full rounded-full flex items-center justify-center border border-gray-100">
                          {step.icon}
                       </div>
                       <div className="absolute -top-3 -right-3 w-8 h-8 bg-sdg-red text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white">
                         {step.step}
                       </div>
                    </div>
                  </div>
                  <div className="pt-2 md:text-center">
                    <h3 className="font-bold text-lg text-slate-900 mb-1">{step.title}</h3>
                    <span className="text-xs font-bold uppercase text-sdg-gold tracking-wide mb-3 block">{step.age}</span>
                    <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. BLINK PARTNERSHIP SECTION */}
      <section className="py-20 bg-slate-50 border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-10">
            <div className="shrink-0">
               <div className="w-48 h-48 bg-slate-100 rounded-2xl flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all border border-slate-200 overflow-hidden">
                  <img src="https://primary.jwwb.nl/public/z/m/z/temp-dwdycauhvbxtjfeptcjq/logo-blink-high.png" alt="Blink Kunstcollectief" className="max-w-full h-auto object-contain" />
               </div>
            </div>
            <div className="flex-grow">
               <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">Samenwerking met Blink</h3>
               <p className="text-slate-600 mb-6 font-light leading-relaxed">
                  SDG werkt nauw samen met <strong>Blink kunstcollectief</strong> voor het muziekonderwijs. Blink is dé plek in de regio voor professionele kunst- en cultuureducatie. Door onze krachten te bundelen, garanderen we lessen van het hoogste niveau door gediplomeerde vakdocenten.
               </p>
               <a 
                href="https://www.blinkkunstcollectief.nl/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sdg-red font-bold hover:underline"
               >
                 Bezoek website van Blink <ExternalLink className="w-4 h-4" />
               </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VOLWASSENEN & HERINTREDERS (Nieuwe sectie) */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div>
                <span className="text-sdg-gold font-bold uppercase tracking-[0.2em] text-xs mb-3 block">Ook voor volwassenen</span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6">Herintreders & Starters</h2>
                <div className="space-y-6 text-slate-600 font-light leading-relaxed">
                  <p>
                    Heb je vroeger een instrument gespeeld en begint het weer te kriebelen? Of heb je altijd al muziek willen maken maar is het er nooit van gekomen?
                  </p>
                  <p>
                    Bij SDG hoef je geen auditie te doen. Plezier staat voorop. We kijken samen wat je niveau is en hoe je het beste kunt instromen. Voor herintreders bieden we opfriscursussen aan en beginners kunnen les krijgen via onze docenten.
                  </p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-sdg-red" />
                      <span>Geen auditie, wel kwaliteit</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-sdg-red" />
                      <span>Instrument van de vereniging</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-sdg-red" />
                      <span>Gezellige 'derde helft'</span>
                    </li>
                  </ul>
                  <div className="pt-4">
                     <a href="/lid-worden" className="inline-flex items-center gap-2 text-slate-900 font-bold border-b-2 border-sdg-gold pb-1 hover:text-sdg-gold transition-colors">
                       Neem contact op voor een kennismaking <ArrowRight className="w-4 h-4" />
                     </a>
                  </div>
                </div>
             </div>
             <div className="relative">
                <div className="absolute -inset-4 bg-sdg-gold/10 rounded-[2.5rem] rotate-3"></div>
                <img 
                  src="https://images.unsplash.com/photo-1543788327-1b072049fa02?q=80&w=800&auto=format&fit=crop" 
                  alt="Volwassenen muziekles" 
                  className="relative rounded-[2rem] shadow-2xl w-full h-auto object-cover"
                />
             </div>
           </div>
        </div>
      </section>

      {/* 6. THE TEAMS */}
      <section id="teams" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Wat past bij jou?</h2>
            <p className="text-slate-600 text-lg">Kies de groep die jou het meest aanspreekt.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {TEAMS.map((team) => {
              const isPlaying = playingAudio === team.id;
              return (
                <div key={team.id} className="group relative rounded-3xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full hover:-translate-y-2 border border-gray-100">
                  <div className="h-60 overflow-hidden relative shrink-0">
                     <img src={team.image} alt={team.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     <div className={`absolute inset-0 bg-gradient-to-t ${team.color} opacity-60 mix-blend-multiply`}></div>
                     <button onClick={(e) => toggleAudio(team.id, team.audioUrl, e)} className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40 hover:bg-white hover:text-sdg-red transition-all shadow-lg z-20">
                       {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                     </button>
                     <div className="absolute bottom-4 left-4 right-4 text-white z-20">
                        <div className={`inline-flex p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg ${team.text} mb-3`}>{team.icon}</div>
                        <h3 className="text-2xl font-bold font-serif">{team.title}</h3>
                     </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <p className="text-slate-700 mb-6 leading-relaxed">{team.description}</p>
                    <div className={`p-5 rounded-2xl ${team.bg} mb-6`}>
                      <p className={`font-bold text-sm uppercase mb-3 ${team.text}`}>Instrumenten:</p>
                      <div className="flex flex-wrap gap-2">
                        {team.instruments.map(inst => (
                          <span key={inst} className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-slate-700 shadow-sm border border-slate-100">{inst}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-auto">
                      <button onClick={() => handleTeamSelect(team.id)} className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-md ${activeTeamId === team.id ? 'bg-slate-800 text-white ring-4 ring-slate-200' : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-sdg-red hover:text-sdg-red'}`}>
                        {activeTeamId === team.id ? 'Geselecteerd ✓' : 'Kies deze groep'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION (Verplaatst van JoinUs) */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
           <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-sdg-gold" /> Veelgestelde vragen
           </h3>
           <div className="bg-slate-50 rounded-3xl p-8 md:p-10 border border-gray-100">
              <FAQItem 
                question="Wat kost het lidmaatschap?" 
                answer="De contributie is afhankelijk van leeftijd en lesvorm. We hanteren zeer schappelijke tarieven omdat we muziek toegankelijk willen houden. Neem contact op voor een actueel overzicht." 
              />
              <FAQItem 
                question="Wanneer zijn de repetities?" 
                answer="De Fanfare repeteert op vrijdagavond, de Malletband op dinsdagavond. Je bent altijd welkom om vrijblijvend te komen luisteren." 
              />
              <FAQItem 
                question="Moet ik auditie doen?" 
                answer="Nee! Bij ons staat plezier voorop. We kijken samen welk niveau je hebt en hoe je het beste kunt instromen." 
              />
              <FAQItem 
                question="Moet ik zelf een instrument kopen?" 
                answer="Nee, in de meeste gevallen krijg je een instrument van de vereniging in bruikleen zolang je lid bent en/of lessen volgt." 
              />
           </div>
        </div>
      </section>

      {/* 8. CONVERSION FORM */}
      <section ref={formRef} id="proefles-form" className="py-24 bg-slate-900 relative overflow-hidden text-white">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden">
            <div className="grid md:grid-cols-5 h-full">
              <div className="md:col-span-2 bg-slate-950/50 p-10 flex flex-col justify-center">
                  <h3 className="text-3xl font-serif font-bold mb-4 text-white">Meld je aan!</h3>
                  <p className="text-slate-300 mb-8 font-light">Doe mee aan 3 proeflessen en ontdek welk instrument bij jou past.</p>
                  <ul className="space-y-4 text-sm text-slate-200">
                    <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-sdg-gold" /><span>Lessen via Blink</span></li>
                    <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-sdg-gold" /><span>3 Gratis Proeflessen</span></li>
                    <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-sdg-gold" /><span>Gratis instrument</span></li>
                  </ul>
              </div>
              <div className="md:col-span-3 p-10 md:p-12 bg-white text-slate-900">
                {formStatus === 'success' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in py-10">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"><CheckCircle className="w-10 h-10" /></div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">Aanvraag Verstuurd!</h4>
                    <p className="text-slate-600">We nemen zo snel mogelijk contact op om een afspraak te maken.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Naam Ouder / Verzorger</label>
                      <input type="text" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-sdg-red" placeholder="Jouw naam" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Naam Kind</label>
                        <input type="text" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" placeholder="Naam kind" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Leeftijd</label>
                        <input type="number" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" placeholder="Leeftijd" />
                      </div>
                    </div>
                    <button type="submit" disabled={formStatus === 'submitting'} className="w-full bg-sdg-red text-white font-bold text-lg py-4 rounded-xl hover:bg-red-800 transition-all shadow-lg transform hover:-translate-y-1">
                      {formStatus === 'submitting' ? 'Versturen...' : 'Vraag Proefles Aan'}
                    </button>
                    <p className="text-xs text-center text-slate-400 mt-4">
                      Liever eerst even bellen of ben je ouder dan 18? <a href="/lid-worden" className="underline hover:text-sdg-red">Gebruik het algemene contactformulier</a>.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Education;
