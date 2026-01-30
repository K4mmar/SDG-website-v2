
import React, { useState } from 'react';
import { Send, CheckCircle, ChevronDown, Mail, Phone, MapPin } from 'lucide-react';

const FORM_ENDPOINT = "https://formspree.io/f/xjknjogr";

const JoinUs: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

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
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-6">
        
        <div className="max-w-4xl mx-auto">
          {/* Simple Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Contact & Aanmelden</h1>
            <p className="text-slate-600 text-lg font-light max-w-2xl mx-auto">
              Heb je een vraag, wil je lid worden of wil je je aanmelden als vrijwilliger? 
              Vul het formulier in en we nemen zo snel mogelijk contact met je op.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Contact Info Sidebar */}
            <div className="hidden lg:block lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-slate-900 mb-4">Contactgegevens</h3>
                <ul className="space-y-4 text-sm text-slate-600">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-sdg-red shrink-0" />
                    <span>Dorpshuis Sint Jansklooster<br/>Monnikenweg 24</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-sdg-red shrink-0" />
                    <a href="mailto:info@sdg-sintjansklooster.nl" className="hover:text-sdg-gold transition-colors">info@sdg-sintjansklooster.nl</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-10">
                
                {formStatus === 'success' ? (
                  <div className="bg-green-50 rounded-2xl p-8 text-center animate-fade-in border border-green-100 py-16">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 mb-2">Bedankt!</h3>
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
                          className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-sdg-gold/20 outline-none appearance-none transition-all"
                        >
                          <option>Ik wil lid worden / sfeer proeven</option>
                          <option>Ik wil een proefles aanvragen (Jeugd)</option>
                          <option>Ik wil vrijwilliger worden</option>
                          <option>Ik heb een algemene vraag</option>
                          <option>Ik wil Vriend / Donateur worden</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Opmerking / Vraag</label>
                      <textarea name="bericht" rows={4} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-sdg-gold/20 outline-none transition-all resize-none" placeholder="Vertel kort wat je zoekt of wat je vraag is..."></textarea>
                    </div>

                    <div className="pt-2">
                      <button type="submit" disabled={formStatus === 'submitting'} className="w-full bg-sdg-red text-white font-bold text-lg py-4 rounded-xl hover:bg-red-800 transition-all shadow-lg hover:shadow-sdg-red/20 flex items-center justify-center gap-2">
                        {formStatus === 'submitting' ? 'Versturen...' : <><Send className="w-5 h-5" /> Verstuur Bericht</>}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;
