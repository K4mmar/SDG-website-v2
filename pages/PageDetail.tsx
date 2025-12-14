import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getPageBySlug, Page } from '../lib/wordpress';
import { ArrowLeft, Share2 } from 'lucide-react';

// Static content definitions provided by the user
const STATIC_CONTENT: Record<string, { title: string; content: string; image?: string }> = {
  'identiteit': {
    title: 'Identiteit',
    content: `
      <p class="lead">Soli Deo Gloria is Latijn voor “Alleen aan God de Eer”. We zijn op aarde om God te leren kennen en Hem te verheerlijken. Het gaat niet om ons maar om Hem.</p>
      
      <h3>De Bron</h3>
      <p>Het evangelie van Christus is de bron. Het is de unieke basis voor al ons doen en laten, ons leren en leven. Dat we alles afstemmen op die bron is bijzonder en toch ook heel gewoon. Dat delen we met elkaar door middel van onze muzikale gave. We geven het inhoud door het muziekrepertoire af te stemmen op die ene bron van ons bestaan.</p>
      
      <p>We zijn uniek. In ons doen en laten onvolmaakt. Alleen door Jezus Christus zijn we in staat het goede te doen.</p>
      
      <h3>Onze Naam</h3>
      <p>SOLI DEO GLORIA een rijke naam, passend bij een christelijke muziekvereniging. Al onze inspanningen zijn niet voor niets. Aan Hem brengen we onze dank voor alles wat Hij ons geeft.</p>

      <blockquote>
        <p><strong>Halleluja!</strong></p>
        <p>Loof God in zijn heilige woning,<br/>
        loof hem in zijn machtig gewelf,<br/>
        loof hem om zijn krachtige daden,<br/>
        loof hem om zijn oneindige grootheid.</p>

        <p>Loof hem met hoorngeschal,<br/>
        loof hem met harp en lier,<br/>
        loof hem met dans en tamboerijn,<br/>
        loof hem met snaren en fluit.</p>

        <p>Loof hem met klinkende bekkens,<br/>
        loof hem met slaande cimbalen.<br/>
        Alles wat adem heeft, loof de Heer.</p>

        <p>Halleluja!</p>
        <cite>Psalm 150 (NBV)</cite>
      </blockquote>
    `
  },
  'geschiedenis': {
    title: 'Geschiedenis',
    content: `
      <h3>De Oprichting (1900)</h3>
      <p>In het jaar 1900 vond er een bespreking plaats tussen het hoofd van onze dorpsschool en enkele vrienden en bekenden om tot oprichting van een muziekvereniging te komen. Onderwijzer van de Meij, die Sint Jansklooster verkoos boven het Friese dorpje Kollem, wist wel iets van blaasmuziek af. Vandaar die bespreking met een paar timmerlieden, een winkelier en enkele landbouwers en… niet zonder resultaat, want op 8 november werd ‘’Soli Deo Gloria’’ officieel opgericht.</p>
      
      <p>Het duurde niet zo lang tot er 7 mooie koperen instrumenten kwamen. Verpakt in een grote kist arriveerden ze bij Geert Leeuw aan de Kloosterweg. De eerste instrumentenleverancier was de firma Kessels uit Tilburg.</p>
      
      <h3>De Eerste Klanken</h3>
      <p>Daar men in de persoon van dhr. Van der Meij een dirigent zag, maar er geen grote trommelslager was, moest hij beide functies maar op zich nemen. We kunnen ons dat nu moeilijk voorstellen, maar het ging, want op 2e Pinksterdag van het jaar 1901 vond het eerste optreden plaats van het pas opgerichte S.D.G. Ik noem het maar optreden, want van een concert kon toen nog geen sprake zijn.</p>
      
      <p>Als eerste werk werd het koraal Psalm 42 gespeeld. Deze bekende melodie over het hijgend hert, momenteel bekend als moede hinde, werd door bijna de hele bevolking van het Land van Vollenhove met bewondering en ontroering aangehoord. In het verslag van een der oprichters staat: <em>‘’velen, die deze muziek hoorden, kregen tranen in de ogen en vroegen zich af hoe het mogelijk was, dat uit deze instrumenten zulke mooie muziek kon komen.’’</em></p>

      <h3>Groeien en Koninklijk Bezoek</h3>
      <p>Over de financiële toestand van de beginperiode weten we helaas heel weinig. Wel is bekend, dat er met een contributie van 5 cent per week werd begonnen. Er kwam steeds meer animo voor de vereniging, want omstreeks 1905 was S.D.G. al een korps, dat voor een groepsfoto in aanmerking kwam. Het telde toen 15 leden.</p>
      
      <p>In 1921 stond S.D.G. opgesteld aan de Veneweg in afwachting van de koningin, die het gemaal aan de Blokzijlerdijk officieel zou bezoeken. Toen de wagen met onze vorstin in het zicht kwam (in de wagen zaten de Koningin en haar echtgenote Prins Hendrik, en hun dochter Prinses Juliana), werd vol overgave het volkslied gespeeld, maar de koningin reed door en de muzikanten moesten zich haasten om op tijd bij het werkbezoek te kunnen zijn.</p>

      <h3>Oorlogsjaren en Wederopbouw</h3>
      <p>De eerste gang van S.D.G. naar het concours te Steenwijk vond in 1924 plaats. Na de angstige en spannende mobilisatietijd kwamen de donkere oorlogsjaren 1940-1945. In het jaar 1942 moest een document worden getekend van de Cultuurkamer van de Wehrmacht. Hierin stond, dat uitsluitend voor hen moest worden gewerkt. Hieraan werd geen gehoor gegeven. Een tweede brief volgde, waarin de bezetter de instrumenten opeiste. Zoals zovelen in die tijd ‘’doken’’ ook de instrumenten ‘’onder’’ en tot het voorjaar van 1945 verdween S.D.G. achter de schermen.</p>

      <p>De eerste avond na de bevrijding, waarop weer gemarcheerd werd, kwam Jurrie Weijs behouden terug uit Oostenrijk. Hij stond direct weer in de voorste gelederen als trommelslager.</p>

      <h3>Uniformen en de Toekomst</h3>
      <p>Nadat begin 1957 de Koninklijke goedkeuring voor onze vereniging verkregen was, werd in dat voorjaar een geheel nieuwe bezetting aangeschaft. Op 22 juni 1964 vond de symbolische overdracht plaats van het eerste uniform, waarbij burgemeester Krol opmerkte, dat kleren nu werkelijk de man maakten.</p>
      
      <p>Een echte crisis heeft S.D.G. gelukkig nooit gekend. Natuurlijk waren er ups en downs. We hopen, dat dit ook in de toekomst zo mag blijven. Deze band onderling als korps, maar ook tussen publiek en korps. Toch hopen we ook in de toekomst op uw meeleven en uw belangstelling voor onze vereniging te mogen rekenen.</p>
    `
  }
};

const PageDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Mapping object for specific frontend routes to WordPress slugs or Static Keys
  const SLUG_MAPPING: Record<string, string> = {
    'jeugd': 'jeugd-2',
    'over-ons': 'identiteit', // Default to Identity when clicking "Over ons"
    'over-sdg': 'identiteit',
    'identiteit': 'identiteit',
    'geschiedenis': 'geschiedenis',
    'privacy': 'privacy-policy-2'
  };

  useEffect(() => {
    async function loadPage() {
      let requestedSlug = slug;
      
      // If no slug param (e.g. top level route like /over-ons), extract from path
      if (!requestedSlug) {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        if (pathSegments.length > 0) {
            requestedSlug = pathSegments[pathSegments.length - 1];
        }
      }

      let actualSlug = requestedSlug || '';
      if (requestedSlug && SLUG_MAPPING[requestedSlug]) {
        actualSlug = SLUG_MAPPING[requestedSlug];
      }

      setLoading(true);

      // STRATEGY: Check Static Content First
      if (STATIC_CONTENT[actualSlug]) {
        setPage({
          id: actualSlug,
          slug: actualSlug,
          title: STATIC_CONTENT[actualSlug].title,
          content: STATIC_CONTENT[actualSlug].content,
          featuredImage: STATIC_CONTENT[actualSlug].image ? { node: { sourceUrl: STATIC_CONTENT[actualSlug].image! } } : undefined
        });
        setLoading(false);
        return;
      }

      // STRATEGY: Fallback to WordPress
      if (actualSlug) {
        const data = await getPageBySlug(actualSlug);
        setPage(data);
      }
      setLoading(false);
    }
    loadPage();
  }, [slug, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sdg-red"></div>
      </div>
    );
  }

  // Fallback
  if (!page || page.id === 'error-page') {
    return (
      <div className="min-h-screen pt-32 bg-slate-50">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 className="text-3xl font-serif font-bold mb-4 text-slate-800">Pagina niet gevonden</h1>
          <button onClick={() => navigate('/')} className="mt-8 text-sdg-red hover:underline font-bold uppercase tracking-wide">
            &larr; Terug naar home
          </button>
        </div>
      </div>
    );
  }

  const heroImage = page.featuredImage ? page.featuredImage.node.sourceUrl : 'https://picsum.photos/1920/1080?blur=2';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. Cinematic Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        {/* Background Image with Slow Zoom Effect */}
        <div className="absolute inset-0 z-0">
           <img 
            src={heroImage} 
            alt={page.title} 
            className="w-full h-full object-cover animate-[scale-in_20s_ease-out_forwards]"
            style={{ animationFillMode: 'forwards' }}
          />
          <style>{`
            @keyframes scale-in {
              0% { transform: scale(1); }
              100% { transform: scale(1.1); }
            }
          `}</style>
        </div>

        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/50 to-slate-900/90 z-10"></div>

        {/* Header Content */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6">
          <div className="max-w-4xl opacity-0 animate-[fade-up_1s_ease-out_0.5s_forwards]">
            {/* Kicker */}
            <div className="flex items-center justify-center gap-3 mb-6">
               <span className="h-[1px] w-8 bg-sdg-gold/80 inline-block"></span>
               <span className="text-sdg-gold font-sans font-semibold tracking-[0.2em] uppercase text-xs md:text-sm">
                 SDG Sint Jansklooster
               </span>
               <span className="h-[1px] w-8 bg-sdg-gold/80 inline-block"></span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-2xl leading-tight">
              {page.title}
            </h1>
          </div>
        </div>
      </div>

      {/* 2. Floating Content Card */}
      <div className="relative z-30 container mx-auto px-4 md:px-6 -mt-24 md:-mt-32 pb-20">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-5xl mx-auto">
          
          {/* Top Bar inside Card */}
          <div className="bg-white border-b border-gray-100 p-6 md:p-8 flex justify-between items-center sticky top-0 z-10 bg-opacity-95 backdrop-blur-sm">
            <button 
              onClick={() => navigate('/')} 
              className="group flex items-center text-slate-500 hover:text-sdg-red transition-colors text-sm font-bold uppercase tracking-wider"
            >
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-sdg-red/10 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Terug
            </button>
            <div className="hidden sm:block">
              <button className="text-slate-400 hover:text-sdg-gold transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-8 md:p-16">
            <div className="max-w-3xl mx-auto">
               <div 
                  className="prose prose-lg prose-slate hover:prose-a:text-sdg-red prose-img:rounded-2xl prose-img:shadow-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: page.content }} 
               />
               
               {/* Decorative Footer Symbol */}
               <div className="mt-20 flex justify-center opacity-30">
                 <div className="w-16 h-1 bg-sdg-red rounded-full"></div>
               </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PageDetail;