import React from 'react';

// --- SUB-COMPONENTEN ---

const HeroBlock: React.FC<{ title: string; image: string | null }> = ({ title, image }) => (
  <div className="relative rounded-[2rem] overflow-hidden mb-12 h-80 md:h-[400px] shadow-2xl group">
    {image ? (
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" 
      />
    ) : (
      <div className="absolute inset-0 bg-slate-800" />
    )}
    {/* Cinematic Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-8 md:p-12">
      <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight drop-shadow-lg max-w-2xl">
        {title}
      </h2>
    </div>
  </div>
);

const CTABlock: React.FC<{ content: string }> = ({ content }) => (
  <div className="bg-gradient-to-br from-sdg-red to-red-900 rounded-[2rem] p-8 md:p-12 mb-12 text-white shadow-xl relative overflow-hidden group">
    {/* Decorative element */}
    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
      <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 0 L100 50 L50 100 L0 50 Z" />
      </svg>
    </div>
    
    <div className="relative z-10">
      <div 
        className="prose prose-invert prose-lg max-w-none 
                   prose-p:leading-relaxed prose-strong:text-sdg-gold
                   prose-headings:font-serif prose-headings:mb-4"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </div>
  </div>
);

const TextBlock: React.FC<{ content: string }> = ({ content }) => (
  <div className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-12 mb-12 shadow-sm">
    <div 
      className="prose prose-slate max-w-none prose-p:font-light prose-p:leading-relaxed"
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  </div>
);

// --- MAIN BLOCK MANAGER ---

interface ACFBlock {
  id: string;
  type: string;
  data: {
    title: string;
    image: string | null;
    content: string;
  };
}

const BlockManager: React.FC<{ blocks: ACFBlock[] }> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="mt-12 space-y-4 animate-fade-in">
      {blocks.map((block) => {
        switch (block.type) {
          case 'hero':
            return <HeroBlock key={block.id} title={block.data.title} image={block.data.image} />;
          case 'cta':
            return <CTABlock key={block.id} content={block.data.content} />;
          case 'text':
            return <TextBlock key={block.id} content={block.data.content} />;
          default:
            console.warn(`BlockManager: Onbekend bloktype '${block.type}' voor ID ${block.id}`);
            return null;
        }
      })}
    </div>
  );
};

export default BlockManager;