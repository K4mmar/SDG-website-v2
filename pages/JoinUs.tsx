import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Send, CheckCircle, Music, HelpCircle, Star, UserPlus, Sparkles, Loader2 } from 'lucide-react';
import { getLidWordenPage, FAQ } from '../lib/wordpress';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

const FORM_ENDPOINT = "https://formspree.io/f/xjknjogr";

const FAQItem: React.FC<{ id: string; question: string; answer: string }> = ({ id, question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl mb-4 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`faq-content-${id}`}
        className="w-full flex justify-between items-center p-5 text-left focus:outline-none hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-800 font-serif text-lg" dangerouslySetInnerHTML={{ __html: question }}></span>
        {isOpen ? <ChevronUp className="text-sdg-red shrink-0 ml-4 w-5 h-5" /> : <ChevronDown className="text-slate-400 shrink-0 ml-4 w-5 h-5" />}
      </button>
      <div 
        id={`faq-content-${id}`}
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-5 pt-0 prose prose-slate text-slate-600 max-w-none font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: answer }} />
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
      // Create instance inside handler as per best practices for injected keys
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `De gebruiker vraagt om advies voor het kiezen van een instrument bij muziekvereniging SDG Sint Jansklooster. 
                   De vereniging heeft een Fanfare (koperblazers zoals trompet, bugel, trombone, bas en saxofoons) en een Malletband (slagwerk, marimba, drums).
                   Geef een kort, enthousiast en persoonlijk advies in het Nederlands van maximaal 60 woorden op basis van deze input: "${input}". 
                   Sluit af met een aanmoediging om contact op te nemen voor een proefles.`,
      });
      setAdvice(response.text || 'Oeps, de adviseur is even de maat kwijt. Probeer het later nog eens!');
    } catch (error) {
      console.error('Gemini API Error:', error);
      setAdvice('De adviseur is even niet bereikbaar. Probeer het straks nog eens.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-sdg-gold/20 relative overflow-hidden mb-8">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="w-12 h-12 text-sdg-gold" />
      </div>
      <h3 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Sparkles className="text-sdg-gold w-5 h-5" /> Muzikale Keuzehulp
      </h3>
      <p className="text-sm text-slate-500 mb-6 font-light">
        Twijfel je welk instrument bij je past? Vertel wat over je karakter of muzieksmaak en onze AI-adviseur helpt je op weg!
      </p>
      <div className="space-y-4">
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Bijv: 'Ik hou van stevige ritmes en ben graag fysiek bezig' of 'Ik hou van warme, zachte klanken'..."
          className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-sdg-gold transition-all resize-none"
          rows={3}
        />
        <button 
          onClick={getAdvice}
          disabled={loading || !input.trim()}
          className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-sdg-gold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Krijg Advies'}
        </button>
      </div>
      {advice && (
        <div className="mt-6 p-4 bg-sdg-gold/5 border border-sdg-gold/10 rounded-xl animate-fade-in">
          <p className="text-slate-700 text-sm italic leading-relaxed">"{advice}"</p>
        </div>
      )}
    </div>
  );
};

const TargetGroupCard: React.FC<{ 
  title: string; 
  subtitle: string; 
  description: string; 
  icon: React.ReactNode; 
  primary: boolean; 
  onClick: () => void 
}> = ({ title, subtitle, description, icon, primary, onClick }) => (
  <div 
    onClick={onClick}
    className={`group relative p-8 rounded-3xl transition-all duration-300 cursor-pointer border hover:-translate-y-1 h-full flex flex-col ${
      primary 
        ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700 shadow-xl' 
        : 'bg-white text-slate-800 border-gray-100 shadow-lg hover:shadow-xl hover:border-sdg-red/20'
    }`}
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${
      primary ? 'bg-sdg-gold text-slate-900' : 'bg-slate-50 text-sdg-red border border-slate-100'
    }`}>
      {icon}
    </div>
    <h3 className={`text-2xl font-serif font-bold mb-1 ${primary ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
    <p className={`text-sm font-bold uppercase tracking-wider mb-4 ${primary ? 'text-sdg-gold' : 'text-sdg-red'}`}>{subtitle}</p>
    <p className={`leading-relaxed mb-6 font-light ${primary ? 'text-slate-300' : 'text-slate-600'}`}>
      {description}
    </p>
    <div className="mt-auto flex items-center font-bold text-sm uppercase tracking-wide gap-2">
      Meld je aan <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
    </div>
  </div>
);

const JoinUs: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [introContent, setIntroContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [prefillOpmerking, setPrefillOpmerking] = useState('');
  const navigate = useNavigate();

  const scrollToForm = (type: string) => {
    const formElement = document.getElementById('signup-form');
    if (formElement) {
      if (type === 'adult') {
        setPrefillOpmerking("Ik ben een ervaren muzikant / herintreder en wil graag eens sfeer proeven.");
      } else {
        setPrefillOpmerking("Ik wil graag informatie over muziekles voor beginners/jeugd via Blink kunstcollectief.");
      }
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const parseContent = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const newFaqs: FAQ[] = [];
    let currentQuestion = '';
    let currentAnswer = '';
    let introHtml = '';
    let foundFirstHeader = false;
    const isHeaderTag = (tagName: string) => ['H2', 'H3', 'H4', 'H5'].includes(tagName.toUpperCase());
    
    Array.from(tempDiv.childNodes).forEach((node) => {
      let nodeContent = '';
      let tagName = '';
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        tagName = el.tagName;
        nodeContent = el.outerHTML;
      } else if (node.nodeType === Node.TEXT_NODE) {
        if (!node.textContent?.trim()) return;
        nodeContent = node.textContent || '';
      }

      if (isHeaderTag(tagName)) {
        if (currentQuestion) {
          newFaqs.push({ vraag: currentQuestion, antwoord: currentAnswer });
        }
        foundFirstHeader = true;
        currentQuestion = node.textContent || '';
        currentAnswer = '';
      } else {
        if (!foundFirstHeader) {
          introHtml += nodeContent;
        } else {
          currentAnswer += nodeContent;
        }
      }
    });

    if (currentQuestion) {
      newFaqs.push({ vraag: currentQuestion, antwoord: currentAnswer || '<p><em>(Nog geen antwoord)</em></p>' });
    }
    
    return { intro: introHtml || html, faqs: newFaqs };
  };

  useEffect(() => {
    async function loadPageData() {
      try {
        const data = await getLidWordenPage();
        if (data && data.content) {
            const { intro, faqs } = parseContent(data.content);
            setIntroContent(intro);
            setFaqs(faqs);
        }
      } catch (err) {
        console.error('Error loading page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPageData();
  }, []);

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
      if (response.ok) { setFormStatus('success'); myForm.reset(); } else { setFormStatus('error'); }
    } catch (error) { setFormStatus('error'); }
  };

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
            Word lid van <span className="text-sdg-red italic">SDG</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
             Muziek maken is voor alle leeftijden. Of je nu je eerste noot blaast of al jaren ervaring hebt: 
             er is altijd een plek voor jou.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16 max-w-5xl mx-auto">
          <TargetGroupCard 
            title="Starten met Muziek"
            subtitle="Opleiding & Jeugd"
            description="Wil jij of je kind een instrument leren bespelen? In samenwerking met Blink kunstcollectief bieden we een professionele leerlijn aan. Gratis instrument in bruikleen en les van vakdocenten."
            icon={<Star className="w-8 h-8" />}
            primary={false}
            onClick={() => scrollToForm('youth')}
          />
          <TargetGroupCard 
            title="Ervaren Muzikant"
            subtitle="Volwassenen & Herintreders"
            description="Heb je vroeger gespeeld en kriebelt het weer? Of zoek je een nieuwe uitdaging? Kom vrijblijvend sfeer proeven tijdens een repetitie. Je hoeft geen auditie te doen, plezier staat voorop."
            icon={<UserPlus className="w-8 h-8" />}
            primary={true}
            onClick={() => scrollToForm('adult')}
          />
        </div>
        
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start" id="signup-form">
          <div className="lg:col-span-7 order-1">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sdg-red to-sdg-gold"></div>
              <div className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3">
                  <Music className="text-sdg-red w-8 h-8" /> Meld je direct aan
                </h2>
                <p className="text-slate-500 mt-2 font-light text-lg">Vul het formulier in. We nemen contact op om te kijken wat bij je past.</p>
              </div>
              {formStatus === 'success' ? (
                <div className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center animate-fade-in">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><CheckCircle size={40} /></div>
                  <h3 className="text-3xl font-serif font-bold text-green-800 mb-4">Bedankt!</h3>
                  <p className="text-green-700 text-lg">We hebben je bericht ontvangen. Eén van onze bestuursleden neemt binnenkort contact met je op.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-bold uppercase tracking-wide text-slate-500 ml-1">Naam *</label>
                      <input type="text" id="name" name="name" required className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none transition-all bg-slate-50 focus:bg-white shadow-sm" placeholder="Voor- en achternaam" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-bold uppercase tracking-wide text-slate-500 ml-1">Telefoonnummer</label>
                      <input type="tel" id="phone" name="telefoon" className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none transition-all bg-slate-50 focus:bg-white shadow-sm" placeholder="06 12345678" />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label htmlFor="email" className="text-sm font-bold uppercase tracking-wide text-slate-500 ml-1">Emailadres *</label>
                     <input type="email" id="email" name="email" required className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none transition-all bg-slate-50 focus:bg-white shadow-sm" placeholder="jouw@email.nl" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="remarks" className="text-sm font-bold uppercase tracking-wide text-slate-500 ml-1">Opmerkingen / Vragen</label>
                    <textarea id="remarks" name="opmerkingen" rows={4} defaultValue={prefillOpmerking} className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none transition-all bg-slate-50 focus:bg-white shadow-sm resize-none" placeholder="Vertel iets over je ervaring of je vraag."></textarea>
                  </div>
                  <button type="submit" disabled={formStatus === 'submitting'} className="w-full bg-sdg-red text-white font-bold text-lg py-4 rounded-xl hover:bg-red-800 transition-all transform hover:-translate-y-1 shadow-lg shadow-sdg-red/20 flex items-center justify-center gap-3">
                    {formStatus === 'submitting' ? <>Versturen...</> : <><Send className="w-5 h-5" /> Verstuur Aanmelding</>}
                  </button>
                </form>
              )}
            </div>
            
            {!loading && introContent && (
              <div className="mt-12 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm prose prose-slate max-w-none">
                 <div dangerouslySetInnerHTML={{ __html: introContent }} />
              </div>
            )}
          </div>
          <div className="lg:col-span-5 order-2 lg:sticky lg:top-28">
            <MusicalAdvisor />
            
            <div className="mb-8 pl-2">
              <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-2"><HelpCircle className="text-sdg-gold" />Veelgestelde vragen</h2>
              <p className="text-slate-500 mt-2 font-light">Alles wat je moet weten over contributie, instrumenten en lessen.</p>
            </div>
            <div className="space-y-2">
              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>)}
                </div>
              ) : (
                faqs.map((faq, index) => <FAQItem key={index} id={`faq-${index}`} question={faq.vraag} answer={faq.antwoord} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;