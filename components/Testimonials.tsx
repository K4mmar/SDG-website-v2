import React from 'react';
import { Quote } from 'lucide-react';

const QuoteCard: React.FC<{ text: string; author: string; role: string }> = ({ text, author, role }) => (
  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative group hover:shadow-lg transition-shadow duration-300">
    <div className="absolute -top-4 left-6 bg-white p-2 rounded-full shadow-sm text-sdg-gold border border-slate-50">
      <Quote size={20} className="fill-current" />
    </div>
    <p className="text-slate-600 italic mb-4 mt-2 font-serif text-lg leading-relaxed">"{text}"</p>
    <div>
      <span className="block text-slate-900 font-bold text-sm uppercase tracking-wide">{author}</span>
      <span className="block text-sdg-red text-xs font-semibold">{role}</span>
    </div>
  </div>
);

const Testimonials: React.FC = () => {
  return (
    <div className="mt-16 border-t border-slate-100 pt-16">
      <div className="grid md:grid-cols-3 gap-6">
        <QuoteCard 
          text="Het voelt als een tweede familie. Na de repetitie blijven we vaak nog even hangen. Het gaat om de muziek, maar net zoveel om de mensen."
          author="Jan"
          role="Slagwerker"
        />
        <QuoteCard 
          text="Als ik het korps door het dorp hoor gaan, krijg ik kippenvel. Het hoort echt bij Sint Jansklooster. Prachtig dat dit traditie blijft."
          author="Anneke"
          role="Inwoner"
        />
        <QuoteCard 
          text="Ik vond het best spannend in het begin, maar iedereen hielp me. Nu vind ik optredens het allerleukste om te doen!"
          author="Lisa (14)"
          role="Leerling"
        />
      </div>
    </div>
  );
};

export default Testimonials;