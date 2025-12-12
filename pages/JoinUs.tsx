import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Send } from 'lucide-react';
import { getLidWordenPage, FAQ } from '../lib/wordpress';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 text-left focus:outline-none hover:text-sdg-red transition-colors"
      >
        <span className="text-lg font-medium text-slate-800">{question}</span>
        {isOpen ? <ChevronUp className="text-sdg-red shrink-0 ml-4" /> : <ChevronDown className="text-slate-400 shrink-0 ml-4" />}
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'}`}
      >
        <div className="prose prose-slate text-slate-600" dangerouslySetInnerHTML={{ __html: answer }} />
      </div>
    </div>
  );
};

// Fallback FAQs if API returns nothing or no ACF fields
const FALLBACK_FAQS: FAQ[] = [
  { vraag: "Moet ik zelf een instrument hebben?", antwoord: "Nee, dat is niet nodig! De vereniging stelt instrumenten in bruikleen beschikbaar aan leden." },
  { vraag: "Hoeveel bedraagt de contributie?", antwoord: "De contributie verschilt per onderdeel. Neem contact op voor actuele prijzen." },
  { vraag: "Kan ik eerst een proefles nemen?", antwoord: "Zeker! Je bent van harte welkom om vrijblijvend mee te kijken of mee te spelen." },
];

const JoinUs: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPageData() {
      const data = await getLidWordenPage();
      if (data) {
        setContent(data.content);
        if (data.lidWordenFields?.faqs) {
          setFaqs(data.lidWordenFields.faqs);
        } else {
          setFaqs(FALLBACK_FAQS);
        }
      } else {
        setFaqs(FALLBACK_FAQS);
      }
      setLoading(false);
    }
    loadPageData();
  }, []);

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Word lid van SDG</h1>
          <div className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {loading ? (
              <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
            ) : (
               <div dangerouslySetInnerHTML={{ __html: content }} />
            )}
            {!content && !loading && (
              <p>Ontdek je talent, maak nieuwe vrienden en beleef onvergetelijke momenten op het podium.</p>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left Column: FAQ */}
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Veelgestelde vragen</h2>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
              {loading ? (
                 <div className="space-y-4">
                   {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>)}
                 </div>
              ) : (
                faqs.map((faq, index) => (
                  <FAQItem key={index} question={faq.vraag} answer={faq.antwoord} />
                ))
              )}
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border-l-4 border-sdg-red">
              <h3 className="font-bold text-sdg-red text-xl mb-4">Repetitietijden</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="font-semibold">Fanfareorkest</span>
                  <span>Dinsdag 19:30 - 21:45</span>
                </li>
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="font-semibold">Slagwerkgroep</span>
                  <span>Donderdag 19:30 - 21:30</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold">Jeugdorkest</span>
                  <span>Dinsdag 18:30 - 19:15</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Netlify Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Meld je aan</h2>
              <p className="text-slate-500 mb-8">Vul het formulier in en we nemen contact met je op.</p>

              <form 
                name="aanmelden" 
                method="POST" 
                data-netlify="true"
                className="space-y-6"
              >
                {/* Hidden input for Netlify form handling */}
                <input type="hidden" name="form-name" value="aanmelden" />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Naam</label>
                    <input type="text" id="name" name="name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sdg-red focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white" placeholder="Jouw naam" required />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Telefoonnummer</label>
                    <input type="tel" id="phone" name="phone" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sdg-red focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white" placeholder="06 12345678" />
                  </div>
                </div>

                <div>
                   <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                   <input type="email" id="email" name="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sdg-red focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white" placeholder="jouw@email.nl" required />
                </div>

                <div>
                   <label htmlFor="instrument" className="block text-sm font-medium text-slate-700 mb-2">Instrument / Interesse</label>
                   <select id="instrument" name="instrument" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sdg-red focus:border-transparent outline-none transition-all bg-white">
                     <option value="" disabled selected>Maak een keuze...</option>
                     <option value="fanfare">Fanfareorkest (blaasinstrument)</option>
                     <option value="slagwerk">Slagwerkgroep</option>
                     <option value="jeugd">Jeugdopleiding / Music Kids</option>
                     <option value="geen_idee">Ik weet het nog niet / Algemeen</option>
                   </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Bericht</label>
                  <textarea id="message" name="message" rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sdg-red focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white" placeholder="Stel je vraag of vertel iets over je ervaring..."></textarea>
                </div>

                <button type="submit" className="w-full bg-sdg-red text-white font-bold py-4 rounded-lg hover:bg-red-800 transition-transform transform hover:scale-[1.01] flex items-center justify-center gap-2 shadow-md">
                  <Send className="w-5 h-5" />
                  Versturen
                </button>
                <p className="text-xs text-center text-slate-400 mt-4">
                  Er wordt vertrouwelijk omgegaan met je gegevens.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JoinUs;