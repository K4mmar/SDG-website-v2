import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, X, Info, CheckCircle2, Calendar, FileText, ArrowRight, ExternalLink } from 'lucide-react';

const STORAGE_KEY = 'sdg_wp_maintenance_dismissed';

export const SystemStatusBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      {!isDismissed && (
        <div 
          role="status" 
          aria-live="polite"
          className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 shadow-md relative z-50 border-b border-amber-600/40"
        >
          <div className="container mx-auto px-4 py-2.5 sm:py-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 font-bold text-[11px] uppercase tracking-wider shadow-xs">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Tijdelijke melding
                </span>
                <span className="text-white font-medium">
                  Wegens een serverbeveiligingsupdate (PHP/WordPress) zijn nieuwsartikelen tijdelijk offline.
                </span>
                <span className="text-amber-100 hidden md:inline">
                  Concertagenda, orkesten en contact zijn actueel.
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 mt-1 sm:mt-0">
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="inline-flex items-center gap-1 font-bold text-slate-900 bg-amber-200/90 hover:bg-white px-2.5 py-1 rounded-lg transition-colors text-xs shadow-xs"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Meer informatie</span>
                </button>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="p-1 rounded-lg text-white hover:text-slate-900 hover:bg-amber-400/80 transition-colors"
                  aria-label="Sluit melding"
                  title="Sluit melding"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RE-OPEN PILL IF DISMISSED (Subtle floating button on bottom left) */}
      {isDismissed && (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="fixed bottom-4 left-4 z-40 bg-slate-900/90 hover:bg-slate-900 text-amber-400 border border-amber-500/40 rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-sm flex items-center gap-1.5 transition-all hover:scale-105"
          title="Bekijk status van de website"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Status website</span>
        </button>
      )}

      {/* 3. TRANSPARENCY & DETAILS MODAL */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-slate-900 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block">
                    Onderhoud & Veiligheid
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                    Tijdelijke situatie website
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                aria-label="Sluiten"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                In verband met een recent bekend geworden beveiligingslek in PHP hebben we uit voorzorg onze externe WordPress-database tijdelijk afgeschermd. Hierdoor is een deel van de dynamische inhoud momenteel niet direct beschikbaar.
              </p>

              {/* Status List */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs uppercase tracking-wide">
                      Wat werkt gewoon?
                    </span>
                    <p className="text-xs text-slate-600">
                      De concert- en repetitieagenda (gekoppeld via Google Calendar), onze geledingen, jeugdopleiding, aanmeldformulieren en contactmogelijkheden functioneren volledig.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-200/60">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs uppercase tracking-wide">
                      Wat is tijdelijk beperkt?
                    </span>
                    <p className="text-xs text-slate-600">
                      Het dynamische nieuwsarchief en enkele losse artikelen die normaal uit WordPress worden ingeladen.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Onze technische beheerders werken hard aan een veilige en permanente oplossing. Zodra de onderhoudswerkzaamheden zijn afgerond, worden alle nieuwsberichten direct weer geactiveerd.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <a
                href="#agenda"
                onClick={() => setShowModal(false)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sdg-red hover:text-red-800 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Bekijk onze concertagenda</span>
              </a>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm"
              >
                Begrepen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SystemStatusBanner;
