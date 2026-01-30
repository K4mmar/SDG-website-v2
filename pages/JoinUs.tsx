
import React, { useState } from 'react';
import { 
  CheckCircle, Music, Send, Sparkles, 
  ChevronDown, ChevronUp, User, Star, HelpCircle, Loader2 
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const FORM_ENDPOINT = "https://formspree.io/f/xjknjogr";

// --- COMPONENTS ---

const FeaturePoint: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div className="flex gap-4 items-start">
    <div className="w-10 h-10 rounded-full bg-sdg-gold/10 flex items-center justify-center shrink-0 mt-1">
      <CheckCircle className="w-5 h-5 text-sdg-gold" />
    </div>
    <div>
      <h4 className="font-bold text-slate-900 text-lg">{title}</h4>
      <p className="text-slate-500 font-light leading-relaxed">{desc}</p>
    </div>
  </div>
);

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

const MusicalAdvisor: React.FC = () => {
  const [input, setInput] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const getAdvice = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setAdvice('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `De gebruiker twijfelt over welk instrument bij hem/haar past bij muziekvereniging SDG. 
                   Opties: Fanfare (trompet, bugel, sax, etc.) of Malletband (slagwerk).
                   Geef kort, vriendelijk advies (max 40 woorden) op basis van: "${input}".`,
      });
      setAdvice(response.text || 'Geen zorgen, kom gewoon eens proberen!');
    } catch (error) {
      console.error('Gemini API Error:', error);
      setAdvice('Kom gerust eens langs op de repetitie, dan kijken we samen!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 opacity-5">
        <Sparkles className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <h4 className="font-serif font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sdg-gold" /> Twijfel je over het instrument?
        </h4>
        <p className="text-xs text-slate-500 mb-4">Vertel kort wat je leuk vindt (bijv. "Ik hou van ritme" of "Ik wil een warme klank"), onze AI helpt je.</p>
        
        <div className="flex gap-2 mb-4">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Jouw voorkeur..."
            className="flex-grow px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-sdg-gold outline-none"
          />
          <button 
            onClick={getAdvice}
            disabled={loading || !input.trim()}
            className="bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-sdg-red transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check'}
          </button>
        </div>
        
        {advice && (
          <div className="bg-sdg-gold/10 p-3 rounded-lg border border-sdg-gold/20 animate-fade-in">
            <p className="text-slate-800 text-xs italic">"{advice}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

const JoinUs: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [intent, setIntent] = useState<'open' | 'youth' | 'adult'>('open');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    const myForm = e.currentTarget;
    const formData = new FormData(myForm);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) { setFormStatus('success'); myForm.reset(); } 
      else { setFormStatus('idle'); alert("Er ging iets mis. Probeer het later nog eens."); }
    } catch (error) { setFormStatus('idle'); alert("Er ging iets mis."); }
  };

  return (
    <div className="bg-white min-h-screen pt-20">
      
      {/* 1. HERO: Clean & Welcoming */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-slate-50">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-white border border-gray-200 text-sdg-red text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
              Lid worden van SDG
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-8 leading-tight">
              Maak muziek <br/>
              <span className="italic text-slate-500">met elkaar.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
              Of je nu beginner bent of gevorderd, jong of oud: bij ons vind je een warm welkom, 
              goede begeleiding en bovenal veel plezier.
            </p>
            <button 
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-sdg-red text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-red-800 transition-all shadow-lg hover:shadow-sdg-red/30 hover:-translate-y-1"
            >
              Kom kennismaken
            </button>
          </div>
        </div>
        
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-sdg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sdg-red/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* 2. SEGMENTATION: Clear Paths */}
      <section className="py-20 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Path: Youth */}
            <div className="group cursor-pointer" onClick={() => { setIntent('youth'); document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                Voor de Jeugd
              </h3>
              <p className="text-slate-500 font-light leading-relaxed mb-6">
                Samen met Blink Kunstcollectief bieden we een complete opleiding. 
                Inclusief gratis instrument en gediplomeerde docenten. 
                Spelenderwijs leren in een veilige omgeving.
              </p>
              <span className="text-blue-600 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                Bekijk jeugdopleiding <ChevronDown className="w-4 h-4" />
              </span>
            </div>

            {/* Path: Adults */}
            <div className="group cursor-pointer" onClick={() => { setIntent('adult'); document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                Volwassenen & Herintreders
              </h3>
              <p className="text-slate-500 font-light leading-relaxed mb-6">
                Heb je vroeger gespeeld? Of wil je het leren? 
                Bij ons hoef je geen auditie te doen. 
                Kom sfeer proeven tijdens een repetitie en ontdek of het klikt.
              </p>
              <span className="text-amber-600 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                Lees meer voor volwassenen <ChevronDown className="w-4 h-4" />
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CONVERSION SECTION: Low Threshold */}
      <section id="contact-form" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
            
            {/* Left: Persuasion & FAQ */}
            <div className="lg:col-span-5 space-y-12">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Waarom SDG?</h2>
                <div className="space-y-6">
                  <FeaturePoint 
                    title="Gratis Instrument" 
                    desc="Je hoeft geen dure investering te doen. Je krijgt een instrument in bruikleen." 
                  />
                  <FeaturePoint 
                    title="Professionele Les" 
                    desc="Kwaliteit staat voorop. Onze docenten zijn conservatorium geschoold." 
                  />
                  <FeaturePoint 
                    title="Gezellige Sfeer" 
                    desc="Na de repetitie blijven we vaak hangen. We zijn een hechte club." 
                  />
                </div>
              </div>

              {/* Collapsed FAQ */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-sdg-gold" /> Veelgestelde vragen
                </h3>
                <div className="border-t border-gray-100">
                  <FAQItem 
                    question="Wat kost het lidmaatschap?" 
                    answer="De contributie is afhankelijk van leeftijd en lesvorm. We hanteren zeer schappelijke tarieven omdat we muziek toegankelijk willen houden. Vul het formulier in voor een actueel overzicht." 
                  />
                  <FAQItem 
                    question="Wanneer zijn de repetities?" 
                    answer="De Fanfare repeteert op vrijdagavond, de Malletband op dinsdagavond. Je bent altijd welkom om vrijblijvend te komen luisteren." 
                  />
                  <FAQItem 
                    question="Moet ik auditie doen?" 
                    answer="Nee! Bij ons staat plezier voorop. We kijken samen welk niveau je hebt en hoe je het beste kunt instromen." 
                  />
                </div>
              </div>
            </div>

            {/* Right: The Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 relative">
                
                {/* Form Header */}
                <div className="mb-8">
                  <span className="text-sdg-red font-bold uppercase tracking-widest text-xs mb-2 block">Contact</span>
                  <h2 className="text-3xl font-serif font-bold text-slate-900">Laten we kennismaken</h2>
                  <p className="text-slate-500 font-light mt-2">
                    Vul dit formulier in. Geen verplichtingen, we nemen gewoon even contact op om je vragen te beantwoorden of een afspraak te maken.
                  </p>
                </div>

                {formStatus === 'success' ? (
                  <div className="bg-green-50 rounded-2xl p-8 text-center animate-fade-in border border-green-100">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">Bedankt!</h3>
                    <p className="text-green-700">We hebben je bericht ontvangen. We bellen of mailen je snel terug.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Naam</label>
                        <input name="naam" required className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-sdg-gold/20 outline-none transition-all" placeholder="Je naam" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Telefoonnummer</label>
                        <input name="telefoon" type="tel" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-sdg-gold/20 outline-none transition-all" placeholder="06 12345678" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Emailadres</label>
                       <input name="email" type="email" required className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-sdg-gold/20 outline-none transition-all" placeholder="jouw@email.nl" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Waar gaat het over?</label>
                      <div className="relative">
                        <select 
                          name="onderwerp" 
                          defaultValue={intent === 'youth' ? "Jeugdopleiding / Proefles" : intent === 'adult' ? "Lid worden / Sfeer proeven" : "Algemene vraag"}
                          className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-sdg-gold/20 outline-none appearance-none transition-all"
                        >
                          <option>Ik wil een proefles aanvragen (Jeugd)</option>
                          <option>Ik wil sfeer proeven / meespelen (Volwassene)</option>
                          <option>Ik heb een algemene vraag</option>
                          <option>Ik wil Vriend / Donateur worden</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Opmerking / Vraag</label>
                      <textarea name="bericht" rows={3} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-sdg-gold/20 outline-none transition-all resize-none" placeholder="Vertel kort wat je zoekt of wat je vraag is..."></textarea>
                    </div>

                    <div className="pt-2">
                      <button type="submit" disabled={formStatus === 'submitting'} className="w-full bg-sdg-red text-white font-bold text-lg py-4 rounded-xl hover:bg-red-800 transition-all shadow-lg hover:shadow-sdg-red/20 flex items-center justify-center gap-2">
                        {formStatus === 'submitting' ? 'Versturen...' : <><Send className="w-5 h-5" /> Verstuur Bericht</>}
                      </button>
                      <p className="text-center text-xs text-slate-400 mt-4">Je zit nergens aan vast. We nemen gewoon contact op.</p>
                    </div>
                  </form>
                )}

                {/* AI Assistant docked in the form area for context */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                   <MusicalAdvisor />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default JoinUs;
