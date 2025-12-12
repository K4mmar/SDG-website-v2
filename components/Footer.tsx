import React from 'react';
import { Music, Facebook, Instagram, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    navigate(path);
  }

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <button onClick={() => handleNav('/')} className="text-2xl font-bold flex items-center gap-2 mb-4 text-white">
              <Music className="w-8 h-8 text-sdg-gold" />
              <span>SDG</span>
            </button>
            <p className="text-slate-400 text-sm leading-relaxed">
              Christelijke Muziekvereniging Soli Deo Gloria Sint Jansklooster. 
              Samen muziek maken op hoog niveau in een gezellige sfeer.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Vereniging</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><button onClick={() => handleNav('/over-ons/geschiedenis')} className="hover:text-sdg-gold transition-colors text-left">Over ons</button></li>
              <li><button onClick={() => handleNav('/lid-worden')} className="hover:text-sdg-gold transition-colors text-left">Lid worden</button></li>
              <li><button onClick={() => handleNav('/vacatures')} className="hover:text-sdg-gold transition-colors text-left">Vacatures</button></li>
              <li><button onClick={() => handleNav('/sponsors')} className="hover:text-sdg-gold transition-colors text-left">Sponsors</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Contact</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 text-sdg-red" />
                <span>Dorpshuis Sint Jansklooster<br/>Monnikenweg 24</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0 text-sdg-red" />
                <a href="mailto:info@sdg-sintjansklooster.nl" className="hover:text-white">info@sdg-sintjansklooster.nl</a>
              </li>
            </ul>
          </div>

          {/* Social & Admin */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Volg ons</h4>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-sdg-red transition-colors text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-sdg-red transition-colors text-white">
                <Instagram size={20} />
              </a>
            </div>
            <div>
              <a 
                href="/wp-admin" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-slate-600 hover:text-slate-400 border border-slate-700 px-3 py-1 rounded inline-block"
              >
                Leden Login
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} SDG Sint Jansklooster. Alle rechten voorbehouden.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <button onClick={() => handleNav('/privacy')} className="hover:text-white">Privacyverklaring</button>
            <button onClick={() => handleNav('/cookies')} className="hover:text-white">Cookiebeleid</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;