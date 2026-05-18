import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { initGA } from '../hooks/usePageTracking';

const CookieConsentBanner: React.FC = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accepteer"
      declineButtonText="Weiger"
      enableDeclineButton
      cookieName="CookieConsent"
      onAccept={() => {
        // Initialiseer GA4 en registreer direct de huidige pageview
        initGA();
      }}
      containerClasses="flex flex-col md:flex-row items-center justify-between px-6 py-4 md:py-3 bg-slate-900 border-t border-slate-800 text-white z-[9999] transition-transform duration-300 shadow-2xl fixed bottom-0 left-0 right-0 !flex"
      contentClasses="text-sm md:text-base mb-4 md:mb-0 leading-relaxed max-w-4xl opacity-90"
      buttonClasses="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2 md:py-2.5 rounded-lg text-sm md:text-base transition-colors mx-2 cursor-pointer border-none shadow-sm h-auto w-auto"
      declineButtonClasses="bg-slate-700 hover:bg-slate-600 text-white font-bold px-4 py-2 md:py-2.5 rounded-lg text-sm md:text-base transition-colors mt-2 md:mt-0 opacity-80 cursor-pointer border-none h-auto w-auto"
      buttonWrapperClasses="flex flex-col md:flex-row items-center justify-center shrink-0"
    >
      Om te zien welke berichten en concerten het populairst zijn, gebruiken we analytische cookies. Mogen we jouw bezoek anoniem meten?
    </CookieConsent>
  );
};

export default CookieConsentBanner;
