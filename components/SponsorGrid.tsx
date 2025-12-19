
import React from 'react';

interface Sponsor {
  name: string;
  imageUrl: string;
}

const SPONSORS: Sponsor[] = [
  { name: 'Boeve', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fboeve.png&output=webp&q=80' },
  { name: 'Weijs ICT', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fweijs-ict.png&output=webp&q=80' },
  { name: 'Wapen van Utrecht', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fwapen-van-utrecht.png&output=webp&q=80' },
  { name: 'VOF J. Driesen', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fvof-j.-driesen.jpg&output=webp&q=80' },
  { name: 'Vinke', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fvinke.png&output=webp&q=80' },
  { name: 'Verkoopplaats', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fverkoopplaats.png&output=webp&q=80' },
  { name: 'Van Beek', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fvan-beek.png&output=webp&q=80' },
  { name: 'V.D. Linde', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fv.d.-linde.png&output=webp&q=80' },
  { name: 'Team 2', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fteam-2.png&output=webp&q=80' },
  { name: 'Syntech', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fsyntech.png&output=webp&q=80' },
  { name: 'Ruach', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fruach.jpg&output=webp&q=80' },
  { name: 'Rook Pijpleiding', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Frook-pijpleiding.jpg&output=webp&q=80' },
  { name: 'Rook Bouw', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Frook-bouw.jpg&output=webp&q=80' },
  { name: 'RM', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Frm.png&output=webp&q=80' },
  { name: 'Rabobank', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Frabobank.jpg&output=webp&q=80' },
  { name: 'R en S', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fr-en-s.png&output=webp&q=80' },
  { name: 'Procal', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fprocal.png&output=webp&q=80' },
  { name: 'Oldenijens', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Foldenijens.jpg&output=webp&q=80' },
  { name: 'Lok', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Flok.png&output=webp&q=80' },
  { name: 'Laveno', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Flaveno.jpg&output=webp&q=80' },
  { name: 'Jac de Olde', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fjac.-de-olde.png&output=webp&q=80' },
  { name: 'Hubo', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fhubo.png&output=webp&q=80' },
  { name: 'Hansman', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fhansman.jpg&output=webp&q=80' },
  { name: 'G. Smit', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fg.-smit.jpg&output=webp&q=80' },
  { name: 'Expert', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fexpert.png&output=webp&q=80' },
  { name: 'Drogt', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fdrogt.jpg&output=webp&q=80' },
  { name: 'D. van Dalen', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fd.-van-dalen.png&output=webp&q=80' },
  { name: 'Coop', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fcoop.png&output=webp&q=80' },
  { name: 'A. de Jonge', imageUrl: 'https://images.weserv.nl/?url=https%3A%2F%2Fapi.sdgsintjansklooster.nl%2Fwp-content%2Fuploads%2F2021%2F08%2Fa.-de-jonge.png&output=webp&q=80' },
];

interface SponsorGridProps {
  variant?: 'monochrome' | 'full';
  title?: string;
}

const SponsorGrid: React.FC<SponsorGridProps> = ({ variant = 'full', title }) => {
  return (
    <div className={`w-full py-16 ${variant === 'monochrome' ? 'bg-white' : 'bg-slate-50'}`}>
      <div className="container mx-auto px-6">
        {title && (
          <div className="text-center mb-12">
            <h3 className="text-2xl font-serif font-bold text-slate-900">{title}</h3>
            <div className="w-12 h-1 bg-sdg-gold mx-auto mt-4 rounded-full opacity-50"></div>
          </div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {SPONSORS.map((sponsor) => (
            <div 
              key={sponsor.name}
              className="w-full flex items-center justify-center p-4 h-24 grayscale-container"
            >
              <img 
                src={sponsor.imageUrl} 
                alt={sponsor.name}
                title={sponsor.name}
                loading="lazy"
                className={`max-w-full max-h-full object-contain transition-all duration-500 hover:scale-110 ${
                  variant === 'monochrome' 
                    ? 'filter grayscale opacity-40 hover:grayscale-0 hover:opacity-100' 
                    : 'filter hover:brightness-110'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorGrid;
