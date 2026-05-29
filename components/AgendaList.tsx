
import React, { useEffect, useState } from 'react';
import { getUpcomingEvents, CalendarEvent } from '../lib/calendar';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { MapPin, Clock, CalendarDays, ExternalLink, Calendar, Loader2, ChevronDown, ChevronUp, AlignLeft, CalendarPlus, Share2, Paperclip, FileText } from 'lucide-react';
import ShareButton from './ShareButton';

// Hulpfunctie om tekst met URL's om te zetten naar React nodes met aanklikbare links
const renderDescriptionWithLinks = (text: string) => {
  if (!text) return null;

  // Regex om URL's te vinden (http/https)
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Split de tekst op basis van de regex. 
  // De capture group () in de split zorgt dat de URL zelf ook in de array komt.
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a 
          key={index} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sdg-red hover:underline break-all"
          onClick={(e) => e.stopPropagation()} // Voorkom dat de accordion togglet als je op een link klikt
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

const AttachmentItem: React.FC<{ att: CalendarAttachment }> = ({ att }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [retryThumbnail, setRetryThumbnail] = useState(false);

  let isImage = att.type?.startsWith('image') || (att.url && att.url.match(/\.(jpeg|jpg|gif|png|webp)$/i));
  let imageUrl = att.url;

  const driveMatch = att.url ? att.url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) : null;
  if (driveMatch && driveMatch[1]) {
    isImage = true; // Try to load Drive files as images/thumbnails first
    // Default to the uc view, if it fails, we fall back to thumbnail in the onError handler
    imageUrl = retryThumbnail 
      ? `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w800`
      : `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }

  // Large image card view
  if (isImage && !imageFailed) {
    return (
      <a 
        href={att.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="group relative block w-full md:w-72 rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all shrink-0 bg-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-[4/3] w-full bg-slate-200 overflow-hidden relative flex items-center justify-center">
          <img 
            src={imageUrl} 
            alt={att.filename || 'Bijlage'} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-10 bg-white" 
            onError={(e) => {
              if (driveMatch && !retryThumbnail) {
                setRetryThumbnail(true); // Try thumbnail URL before fully giving up
              } else {
                setImageFailed(true); // Fallback to list view
              }
            }}
          />
          {/* Loading placeholder underneath the image */}
          <Loader2 className="w-6 h-6 text-slate-400 animate-spin absolute" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-between pt-16 z-20">
          <p className="text-sm font-bold text-white truncate pr-4 drop-shadow-sm">{att.filename?.replace(/\.[^/.]+$/, "") || 'Bijlage'}</p>
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <ExternalLink className="w-4 h-4 text-white" />
          </div>
        </div>
      </a>
    );
  }

  // Compact document list item view (Fallback)
  return (
    <a 
      href={att.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl p-3 transition-colors max-w-sm w-full md:w-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-sdg-red" />
      </div>
      <div className="flex-grow min-w-0 pr-2">
        <p className="text-sm font-bold text-slate-900 truncate">
          {att.filename?.replace(/\.[^/.]+$/, "") || 'Bijlage'}
        </p>
        <p className="text-xs text-slate-500 uppercase tracking-widest truncate">
          {att.type?.split('/')[1] || 'Bestand'}
        </p>
      </div>
      <ExternalLink className="w-4 h-4 text-slate-400 shrink-0 ml-auto" />
    </a>
  );
};

const AgendaItem: React.FC<{ event: CalendarEvent }> = ({ event }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasContent = (!!event.description && event.description.trim().length > 0) || (event.attachments && event.attachments.length > 0);

  // Helper om een Google Calendar link te genereren
  const getGoogleCalendarLink = (event: CalendarEvent) => {
    const formatGDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const start = formatGDate(event.start);
    const end = formatGDate(event.end || new Date(event.start.getTime() + 2 * 60 * 60 * 1000));
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || '');
    const location = encodeURIComponent(event.location || '');

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  // Helper om snel een link uit de beschrijving te halen voor de "Meer info" knop (zoals in de vorige versie)
  const extractLink = (text?: string) => {
    if (!text) return null;
    const match = text.match(/(https?:\/\/[^\s]+)/);
    return match ? match[0] : null;
  };

  const primaryLink = extractLink(event.description);
  const isHtml = (text: string) => /<[a-z][\s\S]*>/i.test(text);

  return (
    <div 
      className={`group bg-white rounded-3xl border border-gray-100 transition-all duration-300 flex flex-col overflow-hidden ${isOpen ? 'shadow-md ring-1 ring-gray-200' : 'shadow-sm hover:shadow-xl'}`}
    >
      <div 
        className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center cursor-pointer"
        onClick={() => hasContent && setIsOpen(!isOpen)}
      >
        {/* Date Box */}
        <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-4 w-20 h-20 md:w-24 md:h-24 border border-slate-100 shrink-0 shadow-inner group-hover:bg-sdg-red group-hover:text-white transition-colors duration-300">
          <span className="text-2xl md:text-3xl font-bold leading-none font-serif">
            {format(event.start, 'd', { locale: nl })}
          </span>
          <span className="text-xs md:text-sm uppercase font-bold mt-1 opacity-80">
            {format(event.start, 'MMM', { locale: nl })}
          </span>
        </div>

        {/* Info */}
        <div className="flex-grow min-w-0">
          <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 mb-2 group-hover:text-sdg-red transition-colors">
            {event.title}
          </h3>
          
          <div className="flex flex-wrap gap-4 text-slate-500 text-sm md:text-base font-medium">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sdg-gold" />
              {event.allDay ? (
                <span>Hele dag</span>
              ) : (
                <span>
                  {format(event.start, 'HH:mm', { locale: nl })}
                  {event.end && ` - ${format(event.end, 'HH:mm', { locale: nl })}`}
                </span>
              )}
            </div>
            
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sdg-gold" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions / Toggles */}
        <div className="mt-2 md:mt-0 w-full md:w-auto flex items-center justify-end gap-3">
          {/* Calendar & Share Mobile Actions */}
          <div className="flex items-center gap-3">
            <a 
              href={getGoogleCalendarLink(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:text-sdg-red hover:bg-slate-100 transition-all"
              title="Voeg toe aan agenda"
              onClick={(e) => e.stopPropagation()}
            >
              <CalendarPlus className="w-5 h-5" />
            </a>
            <div onClick={(e) => e.stopPropagation()} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:text-sdg-gold hover:bg-slate-100 transition-all">
              <ShareButton 
                title={event.title} 
                text={`Ga je mee naar ${event.title} van SDG Sint Jansklooster op ${format(event.start, 'd MMMM', { locale: nl })}?`}
              />
            </div>
          </div>

          {/* Als er een link is, tonen we de 'snelle' knop ook nog, tenzij open */}
          {primaryLink && !isOpen && (
             <a 
               href={primaryLink} 
               target="_blank" 
               rel="noopener noreferrer"
               className="hidden md:flex items-center justify-center gap-2 bg-slate-100 hover:bg-sdg-red text-slate-700 hover:text-white px-5 py-2.5 rounded-full font-bold text-xs transition-all whitespace-nowrap"
               onClick={(e) => e.stopPropagation()}
             >
               Link <ExternalLink className="w-3 h-3" />
             </a>
          )}

          {hasContent && (
             <button 
               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-sdg-red text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}
               aria-label={isOpen ? "Sluit details" : "Toon details"}
             >
               {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
             </button>
          )}
        </div>
      </div>

      {/* Expandable Description Area */}
      {hasContent && (
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="px-6 md:px-8 pb-8 pt-0 pl-[calc(1.5rem+80px)] md:pl-[calc(2rem+96px)]">
             <div className="border-t border-gray-100 pt-4">
                <div className="flex items-start gap-4 text-slate-600 text-lg leading-relaxed">
                   <AlignLeft className="w-6 h-6 mt-1 text-sdg-gold shrink-0" />
                   <div className="flex-grow">
                     <div className="prose prose-slate lg:prose-lg max-w-none text-slate-700 
                       prose-p:text-slate-600 prose-p:leading-relaxed 
                       prose-strong:text-slate-900 prose-strong:font-bold 
                       prose-a:text-sdg-red hover:prose-a:underline
                       prose-table:border-collapse prose-td:p-2 prose-tr:border-b prose-tr:border-slate-100">
                        {event.description && (
                          isHtml(event.description) ? (
                            <div className="overflow-x-auto w-full" dangerouslySetInnerHTML={{ __html: event.description }} />
                          ) : (
                            <div className="whitespace-pre-wrap font-normal">
                              {renderDescriptionWithLinks(event.description)}
                            </div>
                          )
                        )}
                     </div>

                     {event.attachments && event.attachments.length > 0 && (
                        <div className="mt-6 flex flex-col gap-3">
                           <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Bijlagen</h4>
                           <div className="flex flex-wrap gap-4">
                             {event.attachments.map((att, i) => (
                               <AttachmentItem key={i} att={att} />
                             ))}
                           </div>
                        </div>
                     )}
                     
                     <div className="mt-8 flex flex-wrap gap-4">
                        <a 
                          href={getGoogleCalendarLink(event)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-sdg-red text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-red-800 transition-colors shadow-lg hover:shadow-sdg-red/20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CalendarPlus className="w-4 h-4" /> In agenda opslaan
                        </a>
                     </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AgendaList: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [longLoading, setLongLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Set a timeout to show a "taking longer than usual" message after 3 seconds
    const timer = setTimeout(() => {
      if (isMounted && loading) setLongLoading(true);
    }, 3000);

    async function loadEvents() {
      const data = await getUpcomingEvents();
      if (isMounted) {
        setEvents(data);
        setLoading(false);
      }
    }
    loadEvents();

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <section id="agenda" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center md:text-left">
          <span className="text-sdg-red font-bold uppercase tracking-widest text-sm mb-2 block">Verwacht</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Agenda</h2>
          <p className="text-slate-600 mt-4 max-w-2xl text-lg font-light">
            Bekijk waar we binnenkort te horen en te zien zijn.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-200 text-center flex flex-col items-center justify-center min-h-[300px]">
             <div className="relative mb-6">
                <Calendar className="w-16 h-16 text-slate-200" />
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                  <Loader2 className="w-8 h-8 text-sdg-red animate-spin" />
                </div>
             </div>
             
             <h3 className="text-xl font-bold text-slate-700 mb-2">Agenda ophalen...</h3>
             <p className="text-slate-500 max-w-md mx-auto">
               Even geduld, we halen de laatste activiteiten op uit de Google Agenda van SDG.
             </p>
             
             {/* Show this message only if it takes longer than 3 seconds */}
             <div className={`mt-4 px-4 py-2 bg-yellow-50 text-yellow-700 text-sm rounded-lg border border-yellow-100 transition-opacity duration-500 ${longLoading ? 'opacity-100' : 'opacity-0'}`}>
                Dit duurt iets langer dan normaal. We maken verbinding...
             </div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-gray-200 text-center">
             <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
             <p className="text-slate-500 text-lg">Er zijn momenteel geen publieke optredens gepland.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map((event) => (
              <AgendaItem key={event.uid} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AgendaList;
