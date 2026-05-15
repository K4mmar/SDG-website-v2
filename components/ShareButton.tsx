import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url, className = "" }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text || `Bekijk dit bericht van SDG Sint Jansklooster: ${title}`,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button 
        onClick={handleShare}
        className="text-slate-400 hover:text-sdg-gold transition-all duration-300 flex items-center gap-2 group"
        title="Deel deze pagina"
      >
        {copied ? (
          <Check className="w-5 h-5 text-green-500 animate-in zoom-in duration-300" />
        ) : (
          <Share2 className="w-5 h-5 group-hover:scale-110" />
        )}
      </button>
      
      {copied && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 duration-300 z-50">
          Link gekopieerd!
        </div>
      )}
    </div>
  );
};

export default ShareButton;
