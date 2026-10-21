
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getPageBySlug, Page } from '../lib/wordpress';
import { ArrowLeft, ArrowRight, ShieldAlert, Calendar, Home } from 'lucide-react';
import SponsorGrid from '../components/SponsorGrid';
import ShareButton from '../components/ShareButton';
import WpContent from '../components/WpContent';

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
      <p>Als eerste werk werd het koraal Psalm 42 gespeeld. Deze bekende melodie over het hijgend hert, momenteel bekend als moede hinde, werd door bijna de hele bevolking van het Land van Vollenhove met bewondering en ontroering aangehoord.</p>
      <h3>Groeien en Koninklijk Bezoek</h3>
      <p>Over de financiële toestand van de beginperiode weten we helaas heel weinig. Wel is bekend, dat er met een contributie van 5 cent per week werd begonnen. Er kwam steeds meer animo voor de vereniging, want omstreeks 1905 was S.D.G. al een korps, dat voor een groepsfoto in aanmerking kwam. Het telde toen 15 leden.</p>
      <p>In 1921 stond S.D.G. opgesteld aan de Veneweg in afwachting van de koningin, die het gemaal aan de Blokzijlerdijk officieel zou bezoeken. Toen de wagen met onze vorstin in het zicht kwam, werd vol overgave het volkslied gespeeld.</p>
      <h3>Oorlogsjaren en Wederopbouw</h3>
      <p>De eerste gang van S.D.G. naar het concours te Steenwijk vond in 1924 plaats. Na de angstige en spannende mobilisatietijd kwamen de donkere oorlogsjaren 1940-1945. In het jaar 1942 dook het instrumentarium onder om inbeslagname door de bezetter te voorkomen. Direct na de bevrijding in 1945 klonk de muziek weer vrij door de straten.</p>
      <h3>Koninklijke Goedkeuring</h3>
      <p>Nadat begin 1957 de Koninklijke goedkeuring voor onze vereniging verkregen was, bloeide de vereniging verder op tot de veelzijdige en hechte vereniging die we vandaag de dag zijn.</p>
    `
  },
  'fanfare': {
    title: 'Fanfareorkest',
    content: `
      <p class="lead">Het fanfareorkest vormt het hart van CMV Soli Deo Gloria Sint Jansklooster. Een hechte groep muzikanten brengt met enthousiasme een breed en warm repertoire ten gehore.</p>
      <h3>Samenklank & Repertoire</h3>
      <p>De bezetting van onze fanfare bestaat uit bugels, trompetten, hoorns, trombones, baritons, euphoniums en bastuba's, aangevuld met een saxofoongroep (sopraan-, alt-, tenor- en baritonsaxofoon) en ritmisch slagwerk. Ons repertoire reikt van ingetogen koralen en koraalbewerkingen tot feestelijke concertwerken, marsen en eigentijdse popmuziek.</p>
      <h3>Muzikale Leiding & Repetities</h3>
      <p>Het orkest repeteert wekelijks op woensdagavond van 19:30 tot 21:30 uur in Sint Jansklooster. Naast de wekelijkse repetities verzorgen we optredens bij dorpsactiviteiten, kerkdiensten, concoursen en ons jaarlijkse jubileum- of najaarsconcert.</p>
      <p>Heb je interesse om mee te spelen of wil je na een pauze weer beginnen? Je bent van harte welkom om eens vrijblijvend de sfeer te komen proeven tijdens een repetitie!</p>
    `
  },
  'malletband': {
    title: 'De Malletband',
    content: `
      <p class="lead">De malletband van Soli Deo Gloria is een dynamische, energieke slagwerkgroep die melodisch én ritmisch van zich laat horen.</p>
      <h3>Melodisch & Ritmisch Slagwerk</h3>
      <p>Met moderne gestemde percussie-instrumenten zoals marimba's, xylofoons, vibrafoons en klokkenspelen, aangevuld met drumsets en veelzijdig bijslagwerk, brengt de malletband een eigentijdse en verrassende muzikale beleving. Het repertoire varieert van pop- en filmmuziek tot swingende ritmes en uitdagende slagwerkcomposities.</p>
      <h3>Repetities</h3>
      <p>De malletband repeteert wekelijks op maandagavond van 19:30 tot 21:30 uur in Sint Jansklooster. Lijkt het je leuk om melodisch of ritmisch slagwerk te spelen? Kom gerust eens binnenlopen of neem contact met ons op!</p>
    `
  },
  'klankjorum': {
    title: 'Klank & Jorum / Dweilorkest',
    content: `
      <p class="lead">Klank & Jorum is de vrolijke, feestelijke formatie van SDG. Overal waar gezelligheid en muziek samenkomen, zorgen wij voor een feestelijke sfeer!</p>
      <h3>Muziek & Gezelligheid</h3>
      <p>Met een enthousiaste bezetting van blazers en slagwerkers spelen we bekende meezingers, feestklassiekers en herkenbare hits. We treden regelmatig op tijdens dorpsfeesten, sportevenementen, markten en feestelijke serenades in Sint Jansklooster en de omliggende regio.</p>
    `
  },
  'steun-ons': {
    title: 'Steun SDG',
    content: `
      <p class="lead">Muziek verbindt ons dorp en brengt jong en oud samen. Dankzij de steun van onze betrokken dorpsgemeenschap kunnen we blijven investeren in kwalitatieve instrumenten, uniformen en muziekopleiding voor de jeugd.</p>
      <h3>Vrienden van SDG & Donateurs</h3>
      <p>Als donateur of 'Vriend van SDG' draagt u direct bij aan het behoud van de levendige muziekcultuur in Sint Jansklooster. Iedere bijdrage, groot of klein, wordt enorm gewaardeerd en zorgvuldig besteed.</p>
      <h3>Sponsormogelijkheden</h3>
      <p>Bent u ondernemer en wilt u onze vereniging sponsoren rondom concerten, optredens of evenementen? Neem gerust contact met ons op om de mogelijkheden te bespreken via info@sdgsintjansklooster.nl.</p>
    `
  },
  'boek-ons': {
    title: 'Boek SDG voor uw Gelegenheid',
    content: `
      <p class="lead">Zoekt u sfeervolle, feestelijke of plechtige muzikale omlijsting voor een dorpsactiviteit, jubileum, kerkdienst, opening of serenade?</p>
      <h3>Optredens op Maat</h3>
      <p>Onze geledingen (fanfareorkest, malletband of dweilorkest Klank & Jorum) kunnen inspelen op uw wensen. We denken graag mee over een passend repertoire en een geschikte bezetting voor uw evenement in Sint Jansklooster of de regio.</p>
      <p>Voor aanvragen en beschikbaarheid kunt u vrijblijvend contact opnemen met ons secretariaat via info@sdgsintjansklooster.nl of via ons contactformulier.</p>
    `
  },
  'doe-mee': {
    title: 'Doe Mee bij Soli Deo Gloria',
    content: `
      <p class="lead">Samen muziek maken geeft energie, ontspanning en hechte vriendschappen. Bij Soli Deo Gloria is er voor iedere muziekliefhebber een warm thuis.</p>
      <h3>Speel Mee in Onze Geledingen</h3>
      <p>Of je nu net begint met muzieklessen, na jaren weer je instrument wilt oppakken of al ervaren bent: we verwelkomen je graag in ons fanfareorkest, onze malletband, de jeugdopleiding of het dweilorkest. Onze repetitieruimte staat open voor jong en oud!</p>
    `
  },
  'privacy': {
    title: 'Privacybeleid',
    content: `
      <p class="lead">Christelijke Muziekvereniging Soli Deo Gloria Sint Jansklooster respecteert de privacy van haar leden, donateurs en websitebezoekers.</p>
      <h3>Gegevensverwerking</h3>
      <p>Persoonsgegevens die via onze website worden verstrekt (bijvoorbeeld via het contact- of aanmeldformulier) worden uitsluitend gebruikt voor de afhandeling van uw vraag of lidmaatschapsverzoek. Gegevens worden nooit zonder toestemming aan derden verstrekt.</p>
    `
  }
};

const PageDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const SLUG_MAPPING: Record<string, string> = {
    'jeugd': 'jeugd-2',
    'over-ons': 'identiteit',
    'over-sdg': 'identiteit',
    'identiteit': 'identiteit',
    'geschiedenis': 'geschiedenis',
    'privacy': 'privacy-policy-2',
    'steun-ons': 'steun-ons',
    'fanfare': 'fanfare', // Expliciete mapping voor zekerheid
    'malletband': 'malletband', // Expliciete mapping voor zekerheid
    'klankjorum': 'klankjorum'
  };

  useEffect(() => {
    async function loadPage() {
      let requestedSlug = slug;
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

  if (!page || page.id === 'error-page') {
    return (
      <div className="min-h-screen pt-36 pb-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <div className="bg-white rounded-3xl border border-amber-200 p-8 sm:p-12 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-5 shadow-xs">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
              Onderhoud WordPress-koppeling
            </span>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-3">
              Pagina tijdelijk niet beschikbaar
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Deze pagina wordt normaal gesproken ingeladen vanuit onze WordPress-omgeving. Vanwege een serverbeveiligingsupdate (rondom een bekend PHP-beveiligingslek) is deze inhoud tijdelijk niet bereikbaar.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-700 mb-8 text-left flex items-start gap-3">
              <Calendar className="w-5 h-5 text-sdg-red shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 mb-0.5">Op zoek naar repetities of concerten?</strong>
                <span>Onze concertagenda is live gekoppeld en volledig beschikbaar. Onze orkesten en opleidingen zijn gewoon actief.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button 
                onClick={handleBack} 
                className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Terug</span>
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="px-6 py-3 bg-slate-100 text-slate-800 rounded-full font-bold text-sm hover:bg-slate-200 transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Naar de homepage</span>
              </button>
              <a
                href="/#agenda"
                className="px-6 py-3 bg-sdg-red text-white rounded-full font-bold text-sm hover:bg-red-800 transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Bekijk agenda</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const heroImage = page.featuredImage ? page.featuredImage.node.sourceUrl : 'https://picsum.photos/1920/1080?blur=2';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
            src={heroImage} 
            alt={page.title} 
            className="w-full h-full object-cover animate-[scale-in_20s_ease-out_forwards]"
            style={{ animationFillMode: 'forwards' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/50 to-slate-900/90 z-10"></div>
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6">
          <div className="max-w-4xl opacity-0 animate-[fade-up_1s_ease-out_0.5s_forwards]">
            <div className="flex items-center justify-center gap-3 mb-6">
               <span className="h-[1px] w-8 bg-sdg-gold/80 inline-block"></span>
               <span className="text-sdg-gold font-sans font-semibold tracking-[0.2em] uppercase text-xs md:text-sm">
                 SDG Sint Jansklooster
               </span>
               <span className="h-[1px] w-8 bg-sdg-gold/80 inline-block"></span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-2xl leading-tight">
              {page.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="relative z-30 container mx-auto px-4 md:px-6 -mt-24 md:-mt-32 pb-20">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-5xl mx-auto">
          <div className="bg-white border-b border-gray-100 p-6 md:p-8 flex justify-between items-center sticky top-0 z-10 bg-opacity-95 backdrop-blur-sm">
            <button 
              onClick={handleBack} 
              className="group flex items-center text-slate-500 hover:text-sdg-red transition-colors text-sm font-bold uppercase tracking-wider"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 group-hover:bg-sdg-red/10 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Terug
            </button>
            <div className="hidden sm:block">
              <ShareButton title={page.title} />
            </div>
          </div>

          <div className="p-8 md:p-16">
            <div className="max-w-3xl mx-auto">
               <WpContent 
                  html={page.content}
                  className="prose prose-lg prose-slate hover:prose-a:text-sdg-red prose-img:rounded-2xl prose-img:shadow-lg max-w-none"
               />
               
               {(slug === 'boek-ons' || page.slug === 'boek-ons') && (
                 <div className="mt-16 text-center">
                    <button 
                      onClick={() => navigate('/lid-worden?subject=optreden')}
                      className="bg-sdg-red text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-red-800 transition-colors shadow-lg hover:shadow-sdg-red/20 inline-flex items-center gap-2"
                    >
                      Informeer naar de mogelijkheden <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
               )}

               {(slug === 'steun-ons' || page.slug === 'steun-ons') && (
                 <div className="mt-16 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                      onClick={() => navigate('/lid-worden?subject=donateur')}
                      className="bg-sdg-red text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-red-800 transition-colors shadow-lg hover:shadow-sdg-red/20 inline-flex items-center gap-2"
                    >
                      Word Vriend / Donateur <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => navigate('/lid-worden?subject=sponsor')}
                      className="bg-white border-2 border-sdg-red text-sdg-red px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-red-50 transition-colors inline-flex items-center gap-2"
                    >
                      Sponsor worden <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
               )}

               {(slug === 'doe-mee' || page.slug === 'doe-mee') && (
                 <div className="mt-16 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                      onClick={() => navigate('/lid-worden')}
                      className="bg-sdg-red text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-red-800 transition-colors shadow-lg hover:shadow-sdg-red/20 inline-flex items-center gap-2"
                    >
                      Kom sfeer proeven <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => navigate('/lid-worden?subject=vrijwilliger')}
                      className="bg-white border-2 border-sdg-red text-sdg-red px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-red-50 transition-colors inline-flex items-center gap-2"
                    >
                      Word vrijwilliger <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
               )}

               {/* Specifieke Sponsor Sectie als dit de steun-ons pagina is met warme titel */}
               {(slug === 'steun-ons' || page.slug === 'steun-ons') && (
                 <div className="mt-20 pt-10 border-t border-gray-100">
                    <SponsorGrid variant="full" title="Zij dragen onze vereniging een warm hart toe" />
                 </div>
               )}

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
        @keyframes scale-in {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default PageDetail;
