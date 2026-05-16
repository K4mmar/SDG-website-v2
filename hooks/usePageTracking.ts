import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import Cookies from 'js-cookie';

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
let isInitialized = false;

export const initGA = () => {
  // Controleer of de gebruiker akkoord is gegaan met cookies (door react-cookie-consent)
  const consent = Cookies.get('CookieConsent');
  if (consent === 'true' && MEASUREMENT_ID && !isInitialized) {
    ReactGA.initialize(MEASUREMENT_ID);
    isInitialized = true;
    // Pst: registreer meteen een eerste hit als dit vanuit de banner gebeurt
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });
  }
};

export const usePageTracking = () => {
  const location = useLocation();
  const [initChecked, setInitChecked] = useState(false);

  useEffect(() => {
    // Probeer op te starten bij eerste render / re-render in geval cookie lokaal al gezet is
    initGA();
    setInitChecked(true);
  }, []);

  useEffect(() => {
    if (initChecked && isInitialized) {
      // Registreer een pageview bij elke routewijziging als GA is ingeschakeld
      ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
    }
  }, [location, initChecked]);
};

// Hulpscript voor event tracking (bijv. lid worden)
export const trackEvent = (category: string, action: string, label?: string) => {
  if (isInitialized) {
    ReactGA.event({
      category,
      action,
      label,
    });
  }
};
