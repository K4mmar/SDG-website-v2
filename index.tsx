import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("SDG App: Initialiseren van index.tsx...");

const startApp = () => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error("SDG App: Fout - Root element #root niet gevonden in de DOM.");
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("SDG App: React render succesvol aangeroepen.");
  } catch (error) {
    console.error("SDG App: Kritieke fout tijdens de eerste render:", error);
    
    rootElement.innerHTML = `
      <div style="padding: 40px; color: #8B0000; font-family: sans-serif; text-align: center;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Er is een fout opgetreden</h1>
        <p style="color: #666; margin-bottom: 24px;">De applicatie kon niet worden gestart.</p>
        <pre style="background: #f4f4f4; padding: 15px; border-radius: 8px; font-size: 12px; text-align: left; overflow: auto; max-width: 600px; margin: 0 auto;">${error instanceof Error ? error.stack || error.message : String(error)}</pre>
        <button onclick="location.reload()" style="margin-top: 24px; padding: 12px 24px; background: #8B0000; color: white; border: none; border-radius: 30px; cursor: pointer; font-weight: bold;">Pagina herladen</button>
      </div>
    `;
  }
};

// Start de app zodra het script geladen is
startApp();