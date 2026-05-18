import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { initGA } from '../hooks/usePageTracking';

// Een handmatige Cookie Consent component die niet geblokkeerd wordt 
// door standaard AdBlockers (wat vaak wel gebeurt bij react-cookie-consent)
// en waarbij we 100% controle hebben over Tailwind classes.
const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check of de nieuwe cookie (of de oude) al is gezet.
    const consent = Cookies.get('AnalyticsConsentStatus') || Cookies.get('CookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else if (consent === 'true') {
      // Als de gebruiker uit het verleden al geaccepteerd heeft, initialiseer direct
      initGA();
    }
  }, []);

  if (!showBanner) return null;

  const handleAccept = () => {
    Cookies.set('AnalyticsConsentStatus', 'true', { expires: 365, secure: true, sameSite: 'Lax' });
    setShowBanner(false);
    initGA();
  };

  const handleDecline = () => {
    Cookies.set('AnalyticsConsentStatus', 'false', { expires: 365, secure: true, sameSite: 'Lax' });
    setShowBanner(false);
  };

  return (
    <div 
      role="region" 
      aria-label="Cookie voorkeuren" 
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-[9999] flex flex-col md:flex-row items-center justify-between px-6 py-5 bg-slate-900 border-t border-slate-800 text-white shadow-2xl transition-all duration-300 transform translate-y-0"
    >
      <div className="text-sm md:text-base leading-relaxed max-w-4xl opacity-90 mb-4 md:mb-0 text-center md:text-left">
        Om te zien welke berichten en concerten het populairst zijn, gebruiken we analytische cookies. Mogen we jouw bezoek anoniem meten?
      </div>
      <div className="flex flex-row items-center justify-center shrink-0 gap-3 w-full md:w-auto">
        <button
          onClick={handleDecline}
          className="flex-1 md:flex-none bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors border-none cursor-pointer"
        >
          Weiger
        </button>
        <button
          onClick={handleAccept}
          className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors border-none shadow-sm cursor-pointer"
        >
          Accepteer
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
