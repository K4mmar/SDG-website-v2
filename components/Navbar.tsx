import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    setDropdownOpen(false);
  }, [location]);

  const overOnsLinks = [
    { name: 'Geschiedenis', path: '/over-ons/geschiedenis' },
    { name: 'Identiteit', path: '/over-ons/identiteit' },
    { name: 'Geledingen', path: '/over-ons/geledingen' },
    { name: 'Organisatie', path: '/over-ons/organisatie' },
    { name: 'Repetities', path: '/over-ons/repetities' },
  ];

  const handleNavClick = (e: React.MouseEvent | null, path: string) => {
    if (e) e.preventDefault();
    
    // If it's a hash link meant for the homepage
    if (path.startsWith('/#')) {
      const targetId = path.replace('/#', '');

      if (location.pathname === '/') {
        // If already on home, just scroll
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // If not on home, navigate to home and pass the target ID in state
        navigate('/', { state: { scrollTo: targetId } });
      }
      setIsOpen(false); // Close mobile menu if open
      setDropdownOpen(false);
    } else {
        // Standard navigation
        navigate(path);
        setIsOpen(false);
        setDropdownOpen(false);
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      } ${isOpen ? 'bg-white text-slate-900' : ''}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick(null, '/')} 
            className="flex items-center gap-2 focus:outline-none"
          >
            <img 
              src={logoUrl} 
              alt="SDG Logo" 
              className={`h-10 md:h-14 w-auto transition-all duration-300 ${
                // Apply a filter to make the logo white when on dark background (not scrolled and menu closed)
                // Assumes the original logo is dark/colored. brightness(0) invert(1) turns it white.
                scrolled || isOpen ? '' : 'brightness-0 invert'
              }`}
            />
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavClick(null, '/')}
              className={`text-sm font-semibold uppercase tracking-wider hover:text-sdg-gold transition-colors ${
                scrolled ? 'text-slate-700' : 'text-white/90'
              }`}
            >
              Home
            </button>

            {/* Over ons Dropdown */}
            <div 
              className="relative group h-full flex items-center"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
               <button
                 className={`flex items-center text-sm font-semibold uppercase tracking-wider hover:text-sdg-gold transition-colors bg-transparent border-none cursor-pointer ${
                   scrolled ? 'text-slate-700' : 'text-white/90'
                 }`}
                 onClick={(e) => handleNavClick(e, '/#over-ons')}
               >
                 Over ons
                 <ChevronDown className="ml-1 w-4 h-4" />
               </button>
               
               {/* Dropdown Menu */}
               <div className={`absolute left-0 top-full pt-2 w-48 transition-all duration-200 origin-top-left ${dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 <div className="bg-white rounded-md shadow-xl py-2 border border-gray-100">
                   {overOnsLinks.map((subLink) => (
                     <button
                       key={subLink.name}
                       onClick={() => handleNavClick(null, subLink.path)}
                       className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-sdg-red transition-colors"
                     >
                       {subLink.name}
                     </button>
                   ))}
                 </div>
               </div>
            </div>

            <button
                onClick={(e) => handleNavClick(e, '/#agenda')}
                className={`text-sm font-semibold uppercase tracking-wider hover:text-sdg-gold transition-colors bg-transparent border-none cursor-pointer ${
                  scrolled ? 'text-slate-700' : 'text-white/90'
                }`}
            >
                Agenda
            </button>
            <button
                onClick={(e) => handleNavClick(e, '/#contact')}
                className={`text-sm font-semibold uppercase tracking-wider hover:text-sdg-gold transition-colors bg-transparent border-none cursor-pointer ${
                  scrolled ? 'text-slate-700' : 'text-white/90'
                }`}
            >
                Contact
            </button>
            
            <button
              onClick={() => handleNavClick(null, '/lid-worden')}
              className="bg-sdg-red text-white px-6 py-2 rounded-full font-semibold hover:bg-red-800 transition-transform transform hover:scale-105 shadow-lg"
            >
              Lid Worden
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 ${scrolled || isOpen ? 'text-slate-900' : 'text-white'}`}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t h-screen overflow-y-auto pb-20">
          <div className="flex flex-col py-4 px-6 space-y-4">
            <button
              onClick={() => handleNavClick(null, '/')}
              className="text-lg font-medium text-slate-700 hover:text-sdg-red border-b border-gray-100 pb-2 text-left"
            >
              Home
            </button>
            
            {/* Mobile "Over ons" Accordion */}
            <div className="border-b border-gray-100 pb-2">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex w-full justify-between items-center text-lg font-medium text-slate-700 hover:text-sdg-red text-left"
              >
                Over ons
                <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="pl-4 mt-2 space-y-2 border-l-2 border-slate-100 ml-1">
                  {overOnsLinks.map((subLink) => (
                    <button
                      key={subLink.name}
                      onClick={() => handleNavClick(null, subLink.path)}
                      className="block w-full text-left text-base text-slate-600 hover:text-sdg-red"
                    >
                      {subLink.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
                onClick={(e) => handleNavClick(e, '/#agenda')}
                className="text-lg font-medium text-slate-700 hover:text-sdg-red border-b border-gray-100 pb-2 text-left"
            >
                Agenda
            </button>
            <button
                onClick={(e) => handleNavClick(e, '/#contact')}
                className="text-lg font-medium text-slate-700 hover:text-sdg-red border-b border-gray-100 pb-2 text-left"
            >
                Contact
            </button>

            <button
              onClick={() => handleNavClick(null, '/lid-worden')}
              className="bg-sdg-red text-white text-center py-3 rounded-md font-bold mt-4"
            >
              Word Lid!
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;