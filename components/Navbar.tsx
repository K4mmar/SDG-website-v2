
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Music, Heart, Recycle } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [groepenDropdownOpen, setGroepenDropdownOpen] = useState(false);
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false);
  const [mobileGroepenOpen, setMobileGroepenOpen] = useState(false);
  const [mobileCommunityOpen, setMobileCommunityOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Nieuwe logo URL via image proxy voor optimalisatie
  const logoUrl = "https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2026/01/Logo-2026.png&w=300&output=webp";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setGroepenDropdownOpen(false);
    setCommunityDropdownOpen(false);
  }, [location]);

  const isHeroPage = location.pathname === '/' || location.pathname.startsWith('/nieuws/');
  const showSolidNavbar = scrolled || !isHeroPage;

  // Aangepast naar korte URL's inclusief Klankjorum
  const groepenLinks = [
    { name: 'Fanfare', path: '/fanfare' },
    { name: 'Malletband', path: '/malletband' },
    { name: 'Klankjorum', path: '/klankjorum' },
  ];

  const communityLinks = [
    { name: 'Boek ons', path: '/boek-ons', icon: <Music size={16} /> },
    { name: 'Steun ons', path: '/steun-ons', icon: <Heart size={16} /> },
    { name: 'Doe mee', path: '/doe-mee', icon: <Recycle size={16} /> },
  ];

  // Speciale handler alleen voor hash-links (scrollen op home)
  const handleHashClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    if (location.pathname === '/') {
        const element = document.getElementById(targetId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
        navigate('/', { state: { scrollTo: targetId } });
    }
    setIsOpen(false);
  };

  return (
    <nav
      aria-label="Hoofdnavigatie"
      className={`fixed w-full z-50 transition-all duration-300 ${
        showSolidNavbar ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      } ${isOpen ? 'bg-white text-slate-900' : ''}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center gap-2 focus:outline-none hover:opacity-80 transition-opacity"
            aria-label="SDG Sint Jansklooster Home"
          >
            <img 
              src={logoUrl} 
              alt="SDG Logo" 
              className={`h-10 md:h-14 w-auto transition-all duration-300 ${
                showSolidNavbar || isOpen ? '' : 'brightness-0 invert'
              }`}
            />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center space-x-8">
            <a
                href="/#agenda"
                onClick={(e) => handleHashClick(e, 'agenda')}
                className={`text-sm font-bold uppercase tracking-wider hover:text-sdg-gold transition-colors bg-transparent border-none cursor-pointer ${
                  showSolidNavbar ? 'text-slate-800' : 'text-white/95'
                }`}
            >
                Agenda
            </a>

            <Link
                to="/jeugd"
                className={`text-sm font-bold uppercase tracking-wider hover:text-sdg-gold transition-colors ${
                  showSolidNavbar ? 'text-slate-800' : 'text-white/95'
                }`}
            >
                Opleiding
            </Link>

            {/* Groepen Dropdown */}
            <div 
              className="relative group h-full flex items-center"
              onMouseEnter={() => setGroepenDropdownOpen(true)}
              onMouseLeave={() => setGroepenDropdownOpen(false)}
            >
               <button
                 aria-expanded={groepenDropdownOpen}
                 aria-haspopup="true"
                 className={`flex items-center text-sm font-bold uppercase tracking-wider hover:text-sdg-gold transition-colors bg-transparent border-none cursor-pointer ${
                   showSolidNavbar ? 'text-slate-800' : 'text-white/95'
                 }`}
               >
                 Onze Groepen
                 <ChevronDown className="ml-1 w-4 h-4" />
               </button>
               
               <div 
                className={`absolute left-0 top-full pt-4 w-48 transition-all duration-200 origin-top-left ${groepenDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                role="menu"
               >
                 <div className="bg-white rounded-2xl shadow-xl py-3 border border-gray-100 overflow-hidden flex flex-col">
                   {groepenLinks.map((subLink) => (
                     <Link
                       key={subLink.name}
                       to={subLink.path}
                       role="menuitem"
                       className="block w-full text-left px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-sdg-red transition-colors"
                     >
                       {subLink.name}
                     </Link>
                   ))}
                 </div>
               </div>
            </div>

            {/* Steun & Boek Dropdown */}
            <div 
              className="relative group h-full flex items-center"
              onMouseEnter={() => setCommunityDropdownOpen(true)}
              onMouseLeave={() => setCommunityDropdownOpen(false)}
            >
               <button
                 aria-expanded={communityDropdownOpen}
                 aria-haspopup="true"
                 className={`flex items-center text-sm font-bold uppercase tracking-wider hover:text-sdg-gold transition-colors bg-transparent border-none cursor-pointer ${
                   showSolidNavbar ? 'text-slate-800' : 'text-white/95'
                 }`}
               >
                 Steun & Boek
                 <ChevronDown className="ml-1 w-4 h-4" />
               </button>
               
               <div 
                className={`absolute left-0 top-full pt-4 w-56 transition-all duration-200 origin-top-left ${communityDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                role="menu"
               >
                 <div className="bg-white rounded-2xl shadow-xl py-3 border border-gray-100 overflow-hidden flex flex-col">
                   {communityLinks.map((subLink) => (
                     <Link
                       key={subLink.name}
                       to={subLink.path}
                       role="menuitem"
                       className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-sdg-red transition-colors"
                     >
                       <span className="text-sdg-gold">{subLink.icon}</span>
                       {subLink.name}
                     </Link>
                   ))}
                   <div className="border-t border-gray-50 mt-2 pt-2 px-5 pb-2">
                      <a 
                        href="/#community"
                        onClick={(e) => handleHashClick(e, 'community')}
                        className="text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-sdg-red transition-colors block"
                      >
                        Bekijk overzicht
                      </a>
                   </div>
                 </div>
               </div>
            </div>

            <Link
                to="/over-ons"
                className={`text-sm font-bold uppercase tracking-wider hover:text-sdg-gold transition-colors ${
                  showSolidNavbar ? 'text-slate-800' : 'text-white/95'
                }`}
            >
                Over SDG
            </Link>

            <Link
              to="/lid-worden"
              className="bg-gradient-to-r from-sdg-gold to-amber-500 text-white px-7 py-3 rounded-full font-bold uppercase tracking-wide text-xs hover:shadow-xl hover:scale-105 transition-all shadow-lg shadow-sdg-gold/30"
            >
              Speel Mee
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Sluit menu" : "Open menu"}
            className={`lg:hidden p-2 ${showSolidNavbar || isOpen ? 'text-slate-900' : 'text-white'}`}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t h-screen overflow-y-auto pb-32" id="mobile-menu">
          <div className="flex flex-col py-6 px-6 space-y-2">
            <a
                href="/#agenda"
                onClick={(e) => handleHashClick(e, 'agenda')}
                className="text-lg font-bold text-slate-800 hover:text-sdg-red border-b border-gray-100 py-3 text-left block"
            >
                Agenda
            </a>
            <Link
                to="/jeugd"
                className="text-lg font-bold text-slate-800 hover:text-sdg-red border-b border-gray-100 py-3 text-left block"
            >
                Opleiding
            </Link>
            
            {/* Mobile Groepen */}
            <div className="border-b border-gray-100 py-3">
              <button 
                onClick={() => setMobileGroepenOpen(!mobileGroepenOpen)}
                className="flex w-full justify-between items-center text-lg font-bold text-slate-800 hover:text-sdg-red text-left"
              >
                Onze Groepen
                <ChevronDown className={`w-5 h-5 transition-transform ${mobileGroepenOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileGroepenOpen && (
                <div className="pl-4 mt-2 space-y-2 border-l-2 border-sdg-gold/30 ml-1 py-1 flex flex-col">
                  {groepenLinks.map((subLink) => (
                    <Link
                      key={subLink.name}
                      to={subLink.path}
                      className="block w-full text-left text-base font-medium text-slate-600 hover:text-sdg-red py-1"
                    >
                      {subLink.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Community */}
            <div className="border-b border-gray-100 py-3">
              <button 
                onClick={() => setMobileCommunityOpen(!mobileCommunityOpen)}
                className="flex w-full justify-between items-center text-lg font-bold text-slate-800 hover:text-sdg-red text-left"
              >
                Steun & Boek
                <ChevronDown className={`w-5 h-5 transition-transform ${mobileCommunityOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileCommunityOpen && (
                <div className="pl-4 mt-2 space-y-2 border-l-2 border-sdg-gold/30 ml-1 py-1 flex flex-col">
                  {communityLinks.map((subLink) => (
                    <Link
                      key={subLink.name}
                      to={subLink.path}
                      className="flex items-center gap-3 w-full text-left text-base font-medium text-slate-600 hover:text-sdg-red py-1"
                    >
                      <span className="text-sdg-gold">{subLink.icon}</span>
                      {subLink.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
                to="/over-ons"
                className="text-lg font-bold text-slate-800 hover:text-sdg-red border-b border-gray-100 py-3 text-left block"
            >
                Over SDG
            </Link>
            <Link
              to="/lid-worden"
              className="bg-gradient-to-r from-sdg-gold to-amber-500 text-white text-center py-4 rounded-xl font-bold uppercase tracking-widest mt-8 shadow-lg shadow-sdg-gold/20 block"
            >
              Speel Mee
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
