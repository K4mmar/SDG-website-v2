import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Dropdown states
  const [groepenDropdownOpen, setGroepenDropdownOpen] = useState(false);
  
  // Mobile accordion states
  const [mobileGroepenOpen, setMobileGroepenOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Proxy URL for the logo to ensure HTTPS and optimization
  const logoUrl = "https://images.weserv.nl/?url=api.sdgsintjansklooster.nl/wp-content/uploads/2012/07/SDG-logo-nieuw-web.png&w=300&output=webp";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setGroepenDropdownOpen(false);
  }, [location]);

  // Determine navbar style
  const isHeroPage = location.pathname === '/' || location.pathname.startsWith('/nieuws/') || location.pathname.startsWith('/groepen/') || location.pathname.startsWith('/over-ons/');
  const showSolidNavbar = scrolled || !isHeroPage;

  // Navigation Data
  const groepenLinks = [
    { name: 'Fanfare', path: '/groepen/fanfare' },
    { name: 'Malletband', path: '/groepen/malletband' },
  ];

  const handleNavClick = (e: React.MouseEvent | null, path: string) => {
    if (e) e.preventDefault();
    
    if (path.startsWith('/#')) {
      const targetId = path.replace('/#', '');
      if (location.pathname === '/') {
        const element = document.getElementById(targetId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/', { state: { scrollTo: targetId } });
      }
    } else {
        navigate(path);
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        showSolidNavbar ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      } ${isOpen ? 'bg-white text-slate-900' : ''}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* 1. LOGO (Acts as Home button) */}
          <button 
            onClick={() => handleNavClick(null, '/')} 
            className="flex items-center gap-2 focus:outline-none hover:opacity-80 transition-opacity"
            aria-label="Ga naar home"
          >
            <img 
              src={logoUrl} 
              alt="SDG Logo" 
              className={`h-10 md:h-14 w-auto transition-all duration-300 ${
                showSolidNavbar || isOpen ? '' : 'brightness-0 invert'
              }`}
            />
          </button>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center space-x-8">
            
            {/* Agenda */}
            <button
                onClick={(e) => handleNavClick(e, '/#agenda')}
                className={`text-sm font-bold uppercase tracking-wider hover:text-sdg-gold transition-colors bg-transparent border-none cursor-pointer ${
                  showSolidNavbar ? 'text-slate-800' : 'text-white/95'
                }`}
            >
                Agenda
            </button>

            {/* Jeugd */}
            <button
                onClick={(e) => handleNavClick(e, '/jeugd')}
                className={`text-sm font-bold uppercase tracking-wider hover:text-sdg-gold transition-colors bg-transparent border-none cursor-pointer ${
                  showSolidNavbar ? 'text-slate-800' : 'text-white/95'
                }`}
            >
                Jeugd
            </button>

            {/* Onze Groepen Dropdown */}
            <div 
              className="relative group h-full flex items-center"
              onMouseEnter={() => setGroepenDropdownOpen(true)}
              onMouseLeave={() => setGroepenDropdownOpen(false)}
            >
               <button
                 className={`flex items-center text-sm font-bold uppercase tracking-wider hover:text-sdg-gold transition-colors bg-transparent border-none cursor-pointer ${
                   showSolidNavbar ? 'text-slate-800' : 'text-white/95'
                 }`}
                 onClick={() => setGroepenDropdownOpen(!groepenDropdownOpen)}
               >
                 Onze Groepen
                 <ChevronDown className="ml-1 w-4 h-4" />
               </button>
               
               <div className={`absolute left-0 top-full pt-4 w-48 transition-all duration-200 origin-top-left ${groepenDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 <div className="bg-white rounded-2xl shadow-xl py-3 border border-gray-100 overflow-hidden">
                   {groepenLinks.map((subLink) => (
                     <button
                       key={subLink.name}
                       onClick={() => handleNavClick(null, subLink.path)}
                       className="block w-full text-left px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-sdg-red transition-colors"
                     >
                       {subLink.name}
                     </button>
                   ))}
                 </div>
               </div>
            </div>

            {/* Over SDG Link */}
            <button
                onClick={(e) => handleNavClick(e, '/over-ons')}
                className={`text-sm font-bold uppercase tracking-wider hover:text-sdg-gold transition-colors bg-transparent border-none cursor-pointer ${
                  showSolidNavbar ? 'text-slate-800' : 'text-white/95'
                }`}
            >
                Over SDG
            </button>

            {/* CTA Button: Kom Spelen */}
            <button
              onClick={() => handleNavClick(null, '/lid-worden')}
              className="bg-sdg-red text-white px-7 py-3 rounded-full font-bold uppercase tracking-wide text-xs hover:bg-red-800 transition-all transform hover:scale-105 shadow-lg shadow-sdg-red/30"
            >
              Kom Spelen!
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 ${showSolidNavbar || isOpen ? 'text-slate-900' : 'text-white'}`}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t h-screen overflow-y-auto pb-32">
          <div className="flex flex-col py-6 px-6 space-y-2">
            
            <button
                onClick={(e) => handleNavClick(e, '/#agenda')}
                className="text-lg font-bold text-slate-800 hover:text-sdg-red border-b border-gray-100 py-3 text-left"
            >
                Agenda
            </button>

            <button
                onClick={(e) => handleNavClick(e, '/jeugd')}
                className="text-lg font-bold text-slate-800 hover:text-sdg-red border-b border-gray-100 py-3 text-left"
            >
                Jeugd
            </button>

            {/* Mobile Groepen Accordion */}
            <div className="border-b border-gray-100 py-3">
              <button 
                onClick={() => setMobileGroepenOpen(!mobileGroepenOpen)}
                className="flex w-full justify-between items-center text-lg font-bold text-slate-800 hover:text-sdg-red text-left"
              >
                Onze Groepen
                <ChevronDown className={`w-5 h-5 transition-transform ${mobileGroepenOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileGroepenOpen && (
                <div className="pl-4 mt-2 space-y-2 border-l-2 border-sdg-gold/30 ml-1 py-1">
                  {groepenLinks.map((subLink) => (
                    <button
                      key={subLink.name}
                      onClick={() => handleNavClick(null, subLink.path)}
                      className="block w-full text-left text-base font-medium text-slate-600 hover:text-sdg-red py-1"
                    >
                      {subLink.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
                onClick={(e) => handleNavClick(e, '/over-ons')}
                className="text-lg font-bold text-slate-800 hover:text-sdg-red border-b border-gray-100 py-3 text-left"
            >
                Over SDG
            </button>

            <button
              onClick={() => handleNavClick(null, '/lid-worden')}
              className="bg-sdg-red text-white text-center py-4 rounded-xl font-bold uppercase tracking-widest mt-8 shadow-lg shadow-sdg-red/20"
            >
              Kom Spelen!
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;