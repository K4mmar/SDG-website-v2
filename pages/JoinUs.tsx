import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Send } from 'lucide-react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 text-left focus:outline-none"
      >
        <span className="text-lg font-medium text-slate-800">{question}</span>
        {isOpen ? <ChevronUp className="text-sdg-red" /> : <ChevronDown className="text-slate-400" />}
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}
      >
        <p className="text-slate-600">{answer}</p>
      </div>
    </div>
  );
};

const JoinUs: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Word lid van SDG</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Ontdek je talent, maak nieuwe vrienden en beleef onvergetelijke momenten op het podium.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Left Column: Info & FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Veelgestelde vragen</h2>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
              <FAQItem 
                question="Moet ik zelf een instrument hebben?" 
                answer="Nee, dat is niet nodig! De vereniging stelt instrumenten in bruikleen beschikbaar aan leden. We zorgen ook voor onderhoud." 
              />
              <FAQItem 
                question="Hoeveel bedraagt de contributie?" 
                answer="De contributie verschilt per onderdeel (orkest, slagwerk, leerling). Voor jeugdleden hanteren we een gereduceerd tarief. Neem contact op voor de actuele prijzen." 
              />
              <FAQItem 
                question="Kan ik eerst een proefles nemen?" 
                answer="Zeker! Je bent van harte welkom om een paar keer vrijblijvend mee te kijken of mee te spelen tijdens een repetitie." 
              />
               <FAQItem 
                question="Vanaf welke leeftijd kan ik beginnen?" 
                answer="Bij onze Music Kids groep kunnen kinderen vanaf groep 4 van de basisschool al spelenderwijs kennis maken met muziek." 
              />
            </div>

            <div className="bg-sdg-red/5 p-8 rounded-2xl border border-sdg-red/10">
              <h3 className="font-bold text-sdg-red text-xl mb-2">Repetitietijden</h3>
              <ul className="space-y-2 text-slate-700">
                <li><strong>Fanfareorkest:</strong> Dinsdag 19:30 - 21:45</li>
                <li><strong>Slagwerkgroep:</strong> Donderdag 19:30 - 21:30</li>
                <li><strong>Jeugdorkest:</strong> Dinsdag 18:30 - 19:15</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div>
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border-t-4 border-sdg-red">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Meld je aan of vraag info</h2>
              <p className="text-slate-500 mb-8">Vul het formulier in en we nemen zo snel mogelijk contact met je op.</p>

              <form 
                name="contact" 
                method="POST" 
                data-netlify="true"
                onSubmit={(e) => e.preventDefault()} // Prevent actual submit in demo
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Naam</label>
                    <input type="text" id="name" name="name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sdg-red focus:border-transparent outline-none transition-all" placeholder="Jouw naam" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input type="email" id="email" name="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sdg-red focus:border-transparent outline-none transition-all" placeholder="jouw@email.nl" required />
                  </div>
                </div>

                <div>
                   <label htmlFor="interest" className="block text-sm font-medium text-slate-700 mb-2">Ik heb interesse in</label>
                   <select id="interest" name="interest" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sdg-red focus:border-transparent outline-none transition-all bg-white">
                     <option value="fanfare">Fanfareorkest</option>
                     <option value="slagwerk">Slagwerkgroep</option>
                     <option value="jeugd">Jeugdopleiding</option>
                     <option value="anders">Anders / Algemene vraag</option>
                   </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Bericht</label>
                  <textarea id="message" name="message" rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sdg-red focus:border-transparent outline-none transition-all" placeholder="Stel je vraag of vertel iets over je muzikale ervaring..."></textarea>
                </div>

                <button type="submit" className="w-full bg-sdg-red text-white font-bold py-4 rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Versturen
                </button>
                <p className="text-xs text-center text-slate-400 mt-4">
                  Door dit formulier te versturen ga je akkoord met onze privacyverklaring.
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