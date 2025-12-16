import React, { useState, useRef, useEffect } from 'react';
import { 
  Music, Sparkles, Wind, Drum, 
  MapPin, Wallet, GraduationCap, Users, 
  CheckCircle, ArrowRight, Star, Play, Pause,
  Trophy, User, ArrowDown
} from 'lucide-react';

// --- DATA CONFIGURATION ---

const TEAMS = [
  {
    id: 'slagwerk', // Matches select value
    title: 'Malletband', 
    subtitle: 'Slagwerk', 
    description: 'Jij bent de motor van de band. Je houdt van ritme, actie en spektakel.',
    instruments: ['Drums', 'Marimba', 'Pauken', 'Xylofoon'],
    color: 'from-orange-400 to-red-500',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    icon: <Drum className="w-8 h-8" />,
    // Updated image: Very stable Unsplash ID for Drums/Percussion
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
    title: "Music Kids",
    age: "Groep 4/5",
    desc: "Spelenderwijs noten leren lezen en kennismaken met ritme op de blokfluit of algemene muzikale vorming (AMV).",
    icon: <Music className="w-5 h-5" />
  },
  {
    step: 2,
    title: "Instrument Kiezen",
    age: "Vanaf 8 jaar",
    desc: "Je kiest je favoriete instrument (uit de groepen hierboven) en krijgt je eigen instrument in bruikleen.",
    icon: <Star className="w-5 h-5" />
  },
  {
    step: 3,
    title: "Het Grote Orkest",
    age: "Diploma A/B",
    desc: "Je bent klaar voor het 'echte' werk: de Fanfare of de Malletband. Concerten, optochten en gezelligheid.",
    icon: <Trophy className="w-5 h-5" />
  }
];

const PARENT_BENEFITS = [
  {
    icon: <Wallet className="w-6 h-6 text-green-600" />,
    title: "Gratis Instrument",
    desc: "Geen dure aanschaf: je krijgt een instrument van de vereniging in bruikleen."
  },
  {
    icon: <MapPin className="w-6 h-6 text-red-600" />,
    title: "Lessen Dichtbij",
    desc: "De lessen zijn gewoon hier in Sint Jansklooster (Dorpshuis of Kulturhus)."
  },
  {
    icon: <GraduationCap className="w-6 h-6 text-blue-600" />,
    title: "Erkende Kwaliteit",
    desc: "Je krijgt les van gediplomeerde docenten volgens officiële muziekexamens."
  }
];

const Education: React.FC = () => {
  // State
  const [activeTeamId, setActiveTeamId] = useState<string>(''); // For form pre-fill
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false); // New state for video overlay
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Refs
  const formRef = useRef<HTMLDivElement>(null);
  const teamsRef = useRef<HTMLDivElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
    };
  }, []);

  // Actions
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
    e.stopPropagation(); // Prevent card click
    
    // Reset any previous playing state first
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }

    if (playingAudio === id) {
      // Just stop if clicking the same one
      setPlayingAudio(null);
    } else {
      // Start new
      if (audioUrl) {
        setPlayingAudio(id);
        
        try {
          const audio = new Audio(audioUrl);
          audioPlayerRef.current = audio;
          audio.volume = 0.6;
          
          audio.onended = () => {
            setPlayingAudio(null);
            audioPlayerRef.current = null;
          };

          audio.onerror = () => {
             console.error("Failed to load audio from", audioUrl);
             setPlayingAudio(null);
             audioPlayerRef.current = null;
             alert("Kon het audiofragment niet afspelen.");
          };

          await audio.play();
        } catch (err) {
          console.error("Playback failed:", err);
          setPlayingAudio(null);
          audioPlayerRef.current = null;
        }
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* 1. HERO SECTION */}
      {/* 
         Mobile optimization:
         - min-h-screen: Ensures it fills the screen on mobile, allowing scrolling if content is tall.
         - md:h-[85vh]: Fixed height on desktop for clean look.
         - pt-32 pb-16: Extra padding on mobile to clear the navbar and ensure bottom buttons aren't cut off.
      */}
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
            
            {/* Reduced text size on mobile (text-4xl) to prevent overflowing */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
              Maak jij straks de muziek in <span className="text-transparent bg-clip-text bg-gradient-to-r from-sdg-gold to-yellow-200">Sint Jansklooster?</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed font-light">
              Of je nu van stoere ritmes houdt of prachtige melodieën: bij SDG leer je het. 
              En het instrument? <strong>Dat krijg je van ons in bruikleen.</strong>
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

      {/* 2. VIDEO SECTION - CINEMATIC & PROFESSIONAL */}
      <section ref={videoRef} className="py-24 bg-slate-950 relative overflow-hidden">
         {/* Ambient Background Glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-sdg-red/30 to-sdg-gold/30 blur-[120px] rounded-full mix-blend-screen"></div>
         </div>

         <div className="container mx-auto px-6 relative z-10">
             <div className="text-center mb-12">
                 <span className="text-sdg-gold font-bold uppercase tracking-[0.2em] text-xs mb-3 block animate-fade-in">Sfeerimpressie</span>
                 <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
                    Beleef de Muziek
                 </h2>
                 <p className="text-slate-400 font-light max-w-xl mx-auto">
                    Krijg een uniek inkijkje bij onze vereniging. Van repetitie tot concert.
                 </p>
             </div>
             
             <div className="max-w-5xl mx-auto">
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black group cursor-pointer">
                    
                    {!showVideo ? (
                        /* VIDEO COVER STATE */
                        <div onClick={() => setShowVideo(true)} className="absolute inset-0 w-full h-full">
                           <img 
                             src="https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1600&auto=format&fit=crop" 
                             className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700 scale-105 group-hover:scale-100"
                             alt="Video thumbnail"
                           />
                           
                           {/* Centered Play Button with Pulse Effect */}
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="relative">
                                 {/* Pulse Ring */}
                                 <div className="absolute inset-0 bg-white/30 rounded-full animate-ping opacity-75"></div>
                                 {/* Button */}
                                 <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 shadow-[0_0_40px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500 group-hover:bg-white/20">
                                     <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-current ml-1" />
                                 </div>
                              </div>
                           </div>
                           
                           <div className="absolute bottom-8 left-0 right-0 text-center">
                              <p className="text-white/90 text-sm font-bold tracking-widest uppercase">Start de video</p>
                           </div>
                        </div>
                    ) : (
                        /* ACTIVE VIDEO STATE */
                        <video 
                           autoPlay 
                           controls 
                           className="w-full h-full object-cover animate-fade-in"
                        >
                           <source src="https://api.sdgsintjansklooster.nl/wp-content/Video/250128v02%20SDG%20Ledenwerving.mp4" type="video/mp4" />
                           Je browser ondersteunt geen video.
                        </video>
                    )}
                </div>
             </div>
         </div>
      </section>

      {/* 3. THE ROADMAP (Responsive Timeline) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sdg-red font-bold uppercase tracking-widest text-sm mb-2 block">Jouw carrière</span>
            <h2 className="text-4xl font-serif font-bold text-slate-900">Jouw Muzikale Reis</h2>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* CONNECTOR LINE LAYER */}
            
            {/* Desktop Line: Horizontal across the top (behind circles) */}
            <div className="hidden md:block absolute top-8 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
            
            {/* Mobile Line: Vertical down the left side */}
            <div className="md:hidden absolute left-8 top-0 bottom-0 w-1 bg-gray-100 z-0"></div>

            <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative z-10">
              {ROADMAP.map((step, idx) => (
                <div key={idx} className="flex md:flex-col items-start md:items-center gap-6 md:gap-0 group">
                  
                  {/* ICON CIRCLE */}
                  <div className="shrink-0 relative">
                    <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-sdg-red relative md:mb-6 z-10 group-hover:scale-110 transition-transform duration-300">
                       <div className="absolute inset-0 bg-sdg-gold/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <div className="relative bg-slate-50 w-full h-full rounded-full flex items-center justify-center border border-gray-100">
                          {step.icon}
                       </div>
                       {/* Step Number Badge */}
                       <div className="absolute -top-3 -right-3 w-8 h-8 bg-sdg-red text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm">
                         {step.step}
                       </div>
                    </div>
                  </div>

                  {/* CONTENT */}
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

      {/* 4. THE TEAMS (Interactive Instrument Chooser) */}
      <section ref={teamsRef} id="teams" className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Wat past bij jou?</h2>
            <p className="text-slate-600 text-lg">
              Klik op een groep om te zien welke instrumenten erbij horen. Heb je je keuze gemaakt? 
              Klik dan op "Kies deze groep" om je direct aan te melden.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {TEAMS.map((team) => {
              const isPlaying = playingAudio === team.id;

              return (
                <div 
                  key={team.id}
                  className="group relative rounded-3xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full hover:-translate-y-2 border border-gray-100"
                >
                  {/* Header Image Area */}
                  <div className="h-60 overflow-hidden relative shrink-0">
                     <img 
                       src={team.image} 
                       alt={team.title}
                       // Added robust fallback handler to fix broken images
                       onError={(e) => {
                         const target = e.target as HTMLImageElement;
                         target.onerror = null; 
                         target.src = "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=800&auto=format&fit=crop";
                       }}
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                     />
                     <div className={`absolute inset-0 bg-gradient-to-t ${team.color} opacity-60 mix-blend-multiply`}></div>
                     
                     {/* Audio Play Button */}
                     <button 
                       onClick={(e) => toggleAudio(team.id, team.audioUrl, e)}
                       className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40 hover:bg-white hover:text-sdg-red transition-all shadow-lg z-20 group-hover:scale-110"
                       aria-label={isPlaying ? "Pauzeer" : "Beluister voorbeeld"}
                     >
                       {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                     </button>
                     
                     {/* Sound Wave Animation (Active) */}
                     {isPlaying && (
                       <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 backdrop-blur-[2px]">
                         <div className="flex gap-1 h-12 items-center">
                           {[1,2,3,4,5].map(i => (
                             <div key={i} className="w-2 bg-white rounded-full animate-[bounce_1s_infinite]" style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 60 + 20}%` }}></div>
                           ))}
                         </div>
                       </div>
                     )}

                     <div className="absolute bottom-4 left-4 right-4 text-white z-20">
                        <div className={`inline-flex p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg ${team.text} mb-3`}>
                          {team.icon}
                        </div>
                        <h3 className="text-2xl font-bold font-serif shadow-black drop-shadow-md">{team.title}</h3>
                     </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-grow">
                    <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-3">{team.subtitle}</p>
                    <p className="text-slate-700 mb-6 leading-relaxed">
                      {team.description}
                    </p>
                    
                    <div className={`p-5 rounded-2xl ${team.bg} mb-6`}>
                      <p className={`font-bold text-sm uppercase mb-3 ${team.text}`}>Instrumenten:</p>
                      <div className="flex flex-wrap gap-2">
                        {team.instruments.map(inst => (
                          <span key={inst} className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-slate-700 shadow-sm border border-slate-100">
                            {inst}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <button 
                        onClick={() => handleTeamSelect(team.id)}
                        className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-md ${
                           activeTeamId === team.id 
                           ? 'bg-slate-800 text-white ring-4 ring-slate-200' 
                           : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-sdg-red hover:text-sdg-red'
                        }`}
                      >
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

      {/* 5. PARENT ZONE */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
           {/* Changed from lg:grid-cols-4 to lg:grid-cols-3 to center the 3 items nicely */}
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PARENT_BENEFITS.map((benefit, idx) => (
                <div key={idx} className="flex flex-col items-start p-6 bg-slate-50 rounded-2xl shadow-sm h-full border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                  <div className="mb-4 p-3 bg-white rounded-xl shadow-sm">
                    {benefit.icon}
                  </div>
                  <h4 className="font-bold text-lg text-slate-900 mb-2">{benefit.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
           </div>
           
           {/* Social Proof Quote */}
           <div className="mt-20 text-center max-w-3xl mx-auto relative">
              <div className="inline-block relative">
                 <span className="text-8xl text-sdg-gold/20 absolute -top-12 -left-12 font-serif select-none">"</span>
                 <p className="text-xl md:text-2xl font-serif italic text-slate-700 relative z-10 leading-loose">
                   Ik dacht dat trompet spelen heel moeilijk was, maar ik kon na één les al geluid maken! Nu speel ik samen met mijn vriendjes in het orkest.
                 </p>
                 <span className="text-8xl text-sdg-gold/20 absolute -bottom-16 -right-12 font-serif leading-none select-none">"</span>
              </div>
              <div className="mt-8 flex items-center justify-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                    <User className="w-6 h-6" />
                 </div>
                 <div className="text-left">
                    <p className="font-bold text-slate-900 uppercase tracking-wide text-xs">Thijs</p>
                    <p className="text-slate-500 text-xs">9 jaar, Trompet</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 6. CONVERSION FORM */}
      <section ref={formRef} id="proefles-form" className="py-24 bg-slate-900 relative overflow-hidden text-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sdg-red/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sdg-gold/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden">
            <div className="grid md:grid-cols-5 h-full">
              
              {/* Left Side: Text */}
              <div className="md:col-span-2 bg-slate-950/50 p-10 flex flex-col justify-center relative">
                <div className="relative z-10">
                  <h3 className="text-3xl font-serif font-bold mb-4 text-white">Meld je aan!</h3>
                  <p className="text-slate-300 mb-8 font-light">
                    Weet je het nog niet precies? Geeft niks! In de proefles mag je alles proberen.
                  </p>
                  <ul className="space-y-4 text-sm text-slate-200">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-sdg-gold" />
                      <span>3 Gratis Proeflessen</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-sdg-gold" />
                      <span>Geen verplichtingen</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-sdg-gold" />
                      <span>Gratis instrument</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="md:col-span-3 p-10 md:p-12 bg-white text-slate-900">
                {formStatus === 'success' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in py-10">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">Aanvraag Verstuurd!</h4>
                    <p className="text-slate-600">
                      Superleuk! We nemen zo snel mogelijk contact op met je ouders om een afspraak te maken.
                    </p>
                    <button 
                      onClick={() => setFormStatus('idle')} 
                      className="mt-8 text-sm font-bold text-slate-500 hover:text-slate-800 underline"
                    >
                      Nog iemand aanmelden
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1">Naam Ouder / Verzorger</label>
                      <input type="text" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-sdg-red focus:border-sdg-red outline-none transition-all" placeholder="Jouw naam" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1">Naam Kind</label>
                        <input type="text" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-sdg-red focus:border-sdg-red outline-none transition-all" placeholder="Naam kind" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1">Leeftijd</label>
                        <input type="number" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-sdg-red focus:border-sdg-red outline-none transition-all" placeholder="Bijv. 9" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1">Telefoonnummer / Email</label>
                      <input type="text" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-sdg-red focus:border-sdg-red outline-none transition-all" placeholder="Zodat we u kunnen bereiken" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1">Voorkeur</label>
                      <div className="relative">
                        <select 
                          value={activeTeamId}
                          onChange={(e) => setActiveTeamId(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-sdg-red focus:border-sdg-red outline-none transition-all appearance-none cursor-pointer text-slate-700"
                        >
                          <option value="">Nog geen idee (Ik wil alles proberen)</option>
                          <option value="slagwerk">Malletband (Slagwerk)</option>
                          <option value="koper">Koperblazers</option>
                          <option value="sax">Saxofoons</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ArrowDown className="w-4 h-4" />
                        </div>
                      </div>
                      {activeTeamId && (
                        <p className="text-xs text-green-600 font-bold mt-2 ml-1 animate-pulse">
                          ✓ {TEAMS.find(t => t.id === activeTeamId)?.title} geselecteerd
                        </p>
                      )}
                    </div>

                    <button 
                      type="submit" 
                      disabled={formStatus === 'submitting'}
                      className="w-full bg-sdg-red text-white font-bold text-lg py-4 rounded-xl hover:bg-red-800 transition-all shadow-lg hover:shadow-sdg-red/20 transform hover:-translate-y-1"
                    >
                      {formStatus === 'submitting' ? 'Versturen...' : 'Vraag Proefles Aan'}
                    </button>
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