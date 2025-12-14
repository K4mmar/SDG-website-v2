import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Send, CheckCircle, Music, HelpCircle, AlertTriangle } from 'lucide-react';
import { getLidWordenPage, FAQ } from '../lib/wordpress';

// -----------------------------------------------------------------------------
// INSTRUCTIE VOOR WORDPRESS BEHEER:
// -----------------------------------------------------------------------------
// Deze pagina haalt de tekst op van de pagina met slug 'lid-worden'.
//
// FAQ Functionaliteit (Veelgestelde vragen):
// De code scant automatisch de inhoud van de pagina.
// 1. Elke "Koptekst" (H2, H3, of H4) wordt gezien als een nieuwe VRAAG.
// 2. Alle tekst/paragrafen onder die kop worden het ANTWOORD.
//
// Introductie:
// Alles wat je BOVEN de allereerste Koptekst zet, verschijnt bovenaan de pagina
// als introductietekst.
// -----------------------------------------------------------------------------

// CONFIGURATIE:
const FORM_ENDPOINT = "https://formspree.io/f/xjknjogr";

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl mb-4 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left focus:outline-none hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-800 font-serif text-lg" dangerouslySetInnerHTML={{ __html: question }}></span>
        {isOpen ? <ChevronUp className="text-sdg-red shrink-0 ml-4 w-5 h-5" /> : <ChevronDown className="text-slate-400 shrink-0 ml-4 w-5 h-5" />}
      </button>
      <div 
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-5 pt-0 prose prose-slate text-slate-600 max-w-none font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: answer }} />
      </div>
    </div>
  );
};

const JoinUs: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [introContent, setIntroContent] = useState<string>('');
  const [fullRawContent, setFullRawContent] = useState<string>(''); // For debugging
  const [pageTitle, setPageTitle] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>(''); // For advanced debugging
  const [loading, setLoading] = useState(true);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // LINEAR PARSER:
  // Iterates through nodes linearly. 
  // - Before first header -> Intro
  // - Header found -> Start new Question
  // - Content after header -> Append to current Answer
  const parseContent = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const newFaqs: FAQ[] = [];
    let currentQuestion = '';
    let currentAnswer = '';
    let introHtml = '';
    let foundFirstHeader = false;

    // Helper to check if a node is a header
    const isHeaderTag = (tagName: string) => ['H2', 'H3', 'H4', 'H5'].includes(tagName.toUpperCase());

    // Iterate over all child nodes
    Array.from(tempDiv.childNodes).forEach((node) => {
      // Get HTML of the node (element) or text content (text node)
      let nodeContent = '';
      let tagName = '';

      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        tagName = el.tagName;
        nodeContent = el.outerHTML;
      } else if (node.nodeType === Node.TEXT_NODE) {
        // Skip empty text nodes (whitespace) usually found between blocks
        if (!node.textContent?.trim()) return;
        nodeContent = node.textContent || '';
      }

      if (isHeaderTag(tagName)) {
        // --- WE FOUND A HEADER ---
        
        // 1. Save previous question if exists
        if (currentQuestion) {
          newFaqs.push({ vraag: currentQuestion, antwoord: currentAnswer });
        }
        
        // 2. Start new question
        foundFirstHeader = true;
        currentQuestion = node.textContent || ''; // Header text is the question
        currentAnswer = ''; // Reset answer bucket
      } else {
        // --- WE FOUND CONTENT ---
        
        if (!foundFirstHeader) {
          // Still in introduction area
          introHtml += nodeContent;
        } else {
          // Belongs to the current question being built
          currentAnswer += nodeContent;
        }
      }
    });

    // Don't forget to push the very last question loop
    if (currentQuestion) {
      newFaqs.push({ vraag: currentQuestion, antwoord: currentAnswer || '<p><em>(Nog geen antwoord ingevuld)</em></p>' });
    }

    // Fallback: If no headers were found at all, treat everything as Intro
    if (!foundFirstHeader && !introHtml) {
        introHtml = html;
    }

    return { intro: introHtml, faqs: newFaqs };
  };

  useEffect(() => {
    async function loadPageData() {
      const data = await getLidWordenPage();
      if (data) {
        setPageTitle(data.title);
        if (data.debugInfo) setDebugInfo(data.debugInfo);
        
        if (data.content) {
            setFullRawContent(data.content);
            const { intro, faqs } = parseContent(data.content);
            setIntroContent(intro);
            setFaqs(faqs);
        }
      }
      setLoading(false);
    }
    loadPageData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (FORM_ENDPOINT.includes("PLAATS_JOUW_ID_HIER")) {
        alert("LET OP: De formulier endpoint is nog niet ingesteld in de code (JoinUs.tsx).");
        return;
    }

    setFormStatus('submitting');
    
    const myForm = e.currentTarget;
    const formData = new FormData(myForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setFormStatus('success');
        myForm.reset();
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error("Form error:", error);
      setFormStatus('error');
    }
  };

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
            Word lid van <span className="text-sdg-red italic">SDG</span>
          </h1>
          <div className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            {loading ? (
              <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
            ) : (
               introContent ? <div dangerouslySetInnerHTML={{ __html: introContent }} /> : 
               <p>Muziek maken is het leukste wat er is. Of je nu beginner bent of gevorderd, bij SDG ben je van harte welkom!</p>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* COLUMN 1: Inschrijfformulier */}
          <div className="lg:col-span-7 order-1">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sdg-red to-sdg-gold"></div>
              
              <div className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3">
                  <Music className="text-sdg-red w-8 h-8" />
                  Meld je direct aan
                </h2>
                <p className="text-slate-500 mt-2 font-light text-lg">
                  Vul onderstaand formulier in. We nemen zo snel mogelijk contact met je op.
                </p>
              </div>

              {formStatus === 'success' ? (
                <div className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center animate-fade-in">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-green-800 mb-4">Bedankt!</h3>
                  <p className="text-green-700 text-lg">
                    We hebben je gegevens ontvangen. Eén van onze bestuursleden neemt binnenkort contact met je op.
                  </p>
                  <button 
                    onClick={() => setFormStatus('idle')}
                    className="mt-8 text-sm font-bold uppercase tracking-wider text-green-700 hover:text-green-900 underline"
                  >
                    Nog een aanmelding versturen
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Form Fields (kept same as before) */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-bold uppercase tracking-wide text-slate-500 ml-1">Naam *</label>
                      <input type="text" id="name" name="name" required className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sdg-red focus:border-sdg-red outline-none transition-all bg-slate-50 focus:bg-white shadow-sm" placeholder="Voor- en achternaam" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-bold uppercase tracking-wide text-slate-500 ml-1">Telefoonnummer</label>
                      <input type="tel" id="phone" name="telefoon" className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sdg-red focus:border-sdg-red outline-none transition-all bg-slate-50 focus:bg-white shadow-sm" placeholder="06 12345678" />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label htmlFor="email" className="text-sm font-bold uppercase tracking-wide text-slate-500 ml-1">Emailadres *</label>
                     <input type="email" id="email" name="email" required className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sdg-red focus:border-sdg-red outline-none transition-all bg-slate-50 focus:bg-white shadow-sm" placeholder="jouw@email.nl" />
                  </div>

                  <div className="space-y-2">
                     <label htmlFor="instrument" className="text-sm font-bold uppercase tracking-wide text-slate-500 ml-1">Welk instrument?</label>
                     <input type="text" id="instrument" name="instrument" className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sdg-red focus:border-sdg-red outline-none transition-all bg-slate-50 focus:bg-white shadow-sm" placeholder="Bijv. Trompet, Slagwerk, of 'Geen idee'" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="remarks" className="text-sm font-bold uppercase tracking-wide text-slate-500 ml-1">Opmerkingen / Vragen</label>
                    <textarea id="remarks" name="opmerkingen" rows={4} className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sdg-red focus:border-sdg-red outline-none transition-all bg-slate-50 focus:bg-white shadow-sm resize-none" placeholder="Heb je ervaring? Wil je eerst een proefles? Laat het ons weten."></textarea>
                  </div>

                  {formStatus === 'error' && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
                        Er ging iets mis bij het versturen. Controleer je internetverbinding of probeer het later nog eens.
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={formStatus === 'submitting'}
                    className={`w-full bg-sdg-red text-white font-bold text-lg py-4 rounded-xl hover:bg-red-800 transition-all transform hover:-translate-y-1 shadow-lg shadow-sdg-red/20 flex items-center justify-center gap-3 ${formStatus === 'submitting' ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {formStatus === 'submitting' ? (
                        <>Versturen...</>
                    ) : (
                        <><Send className="w-5 h-5" /> Verstuur Aanmelding</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* COLUMN 2: FAQ */}
          <div className="lg:col-span-5 order-2 lg:sticky lg:top-28">
            <div className="mb-8 pl-2">
              <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="text-sdg-gold" />
                Veelgestelde vragen
              </h2>
              <p className="text-slate-500 mt-2 font-light">
                Alles wat je moet weten over lid worden.
              </p>
            </div>

            <div className="space-y-2">
              {loading ? (
                 <div className="space-y-4">
                   {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>)}
                 </div>
              ) : (
                faqs && faqs.length > 0 ? (
                  faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.vraag} answer={faq.antwoord} />
                  ))
                ) : (
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center text-slate-500 italic">
                    <p className="mb-2">Geen vragen gevonden.</p>
                    <p className="text-xs">Gebruik Koptekst (H2/H3/H4) voor vragen.</p>
                  </div>
                )
              )}
            </div>

            {/* DIAGNOSE BLOK (Alleen zichtbaar als er geen FAQs zijn en niet aan het laden) */}
            {!loading && faqs.length === 0 && (
                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-800 font-mono break-all">
                    <div className="flex items-center gap-2 font-bold mb-2 uppercase">
                        <AlertTriangle className="w-4 h-4" /> Diagnose Info
                    </div>
                    <p className="mb-2"><strong>Pagina Titel:</strong> {pageTitle}</p>
                    <p className="mb-2"><strong>Lengte inhoud:</strong> {fullRawContent.length} tekens</p>
                    
                    {/* ADDED DEBUG INFO DISPLAY */}
                    {debugInfo && (
                         <div className="mb-2 p-2 bg-yellow-100 rounded border border-yellow-200 whitespace-pre-wrap">
                            <strong>Systeem Log:</strong><br/>
                            {debugInfo}
                         </div>
                    )}

                    <p className="mb-1"><strong>Raw HTML (eerste 500 tekens):</strong></p>
                    <div className="bg-white p-2 border border-yellow-200 rounded h-32 overflow-y-auto">
                        {fullRawContent || "Geen inhoud."}
                    </div>
                </div>
            )}

            {/* Extra Info Box */}
            <div className="mt-10 bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-sdg-gold rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
               <h3 className="font-serif font-bold text-2xl mb-4 text-sdg-gold">Waarom SDG?</h3>
               <ul className="space-y-3 text-slate-300">
                 <li className="flex gap-3 items-center"><div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">✓</div> Gratis instrument in bruikleen</li>
                 <li className="flex gap-3 items-center"><div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">✓</div> Professionele dirigenten</li>
                 <li className="flex gap-3 items-center"><div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">✓</div> Gezellige activiteiten</li>
               </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JoinUs;