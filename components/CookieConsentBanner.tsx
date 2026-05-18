import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { initGA } from '../hooks/usePageTracking';

// Een handmatige Cookie Consent component die niet geblokkeerd wordt 
// door standaard AdBlockers (wat vaak wel gebeurt bij react-cookie-consent)
// en waarbij we 100% controle hebben over Tailwind classes.
export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Lees direct beide cookies uit
    const newConsent = Cookies.get('AnalyticsConsentStatus');
    const oldConsent = Cookies.get('CookieConsent');
    const hasAnyConsent = newConsent !== undefined || oldConsent !== undefined;

    if (!hasAnyConsent) {
      setShowBanner(true);
    } else if (newConsent === 'true' || oldConsent === 'true') {
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
      id="site-preferences-banner"
      role="region" 
      aria-label="Privacy voorkeuren" 
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-[9999] flex flex-col md:flex-row items-center justify-between px-6 py-5 bg-slate-900 border-t border-slate-800 text-white shadow-2xl transition-all duration-300 transform translate-y-0"
    >
      <div className="text-sm md:text-base leading-relaxed max-w-4xl opacity-90 mb-4 md:mb-0 text-center md:text-left">
        Om te zien welke berichten en concerten populair zijn, meten we bezoekersaantallen anoniem via analytische middelen. Ga je hiermee akkoord?
      </div>
      <div className="flex flex-row items-center justify-center shrink-0 gap-3 w-full md:w-auto">
        <button
          onClick={handleDecline}
          className="flex-1 md:flex-none bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors border border-transparent hover:border-slate-500 cursor-pointer"
        >
          Liever niet
        </button>
        <button
          onClick={handleAccept}
          className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors shadow-lg shadow-emerald-900/20 cursor-pointer"
        >
          Akkoord
        </button>
      </div>
    </div>
  );
}
