import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostBySlug } from '../lib/wordpress';
import { getUpcomingEvents, CalendarEvent } from '../lib/calendar';
import { ArrowLeft, Calendar, Tag, Share2, Clock, ChevronRight, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      if (slug) {
        // Load post data
        const postData = await getPostBySlug(slug);
        setPost(postData);
        
        // Load calendar data independently (non-blocking for UI if possible, but kept simple here)
        const calendarData = await getUpcomingEvents();
        setEvents(calendarData.slice(0, 3)); // Keep only the first 3 events
        
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sdg-red"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 text-center container mx-auto px-6">
        <h1 className="text-3xl font-serif font-bold mb-4">Bericht niet gevonden</h1>
        <button onClick={() => navigate('/')} className="text-sdg-red hover:underline">Terug naar home</button>
      </div>
    );
  }

  const dateObj = new Date(post.date);
  const dateStr = dateObj.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

  return (
    <article className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. Header Image */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <img 
          src={post.featuredImage?.node?.sourceUrl || 'https://picsum.photos/1200/600?blur=5'} 
          alt={post.title} 
          className="w-full h-full object-cover transform scale-105"
        />
        <div className="absolute inset-0 bg-slate-900/60"></div>
        
        {/* Breadcrumb Overlay */}
        <div className="absolute top-28 left-0 w-full px-6">
           <div className="container mx-auto">
             <button onClick={() => navigate('/nieuws')} className="inline-flex items-center text-white/80 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
               <ChevronRight className="w-4 h-4 rotate-180 mr-2" /> Nieuwsarchief
             </button>
           </div>
        </div>
      </div>

      {/* 2. Main Content Layout - Overlapping Header */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 -mt-32 pb-20">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Article Card */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden">
              
              {/* Meta Header */}
              <div className="p-8 md:p-12 border-b border-gray-100">
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-sdg-red/10 text-sdg-red px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
                    <Tag className="w-3 h-3 mr-2" /> Nieuws
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
                    <Calendar className="w-3 h-3 mr-2" /> {dateStr}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight mb-6">
                  {post.title}
                </h1>

                {/* Author / Share Bar */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                        <img src="https://ui-avatars.com/api/?name=SDG&background=8B0000&color=fff" alt="SDG" />
                     </div>
                     <div>
                       <p className="text-sm font-bold text-slate-800">Bestuur SDG</p>
                       <p className="text-xs text-slate-500">Gepubliceerd om {timeStr}</p>
                     </div>
                   </div>
                   <button className="text-slate-400 hover:text-sdg-gold transition-colors p-2">
                     <Share2 className="w-5 h-5" />
                   </button>
                </div>
              </div>

              {/* Prose Content */}
              <div className="p-8 md:p-12 pt-8">
                <div 
                  className="prose prose-lg prose-slate hover:prose-a:text-sdg-red prose-img:rounded-xl prose-img:shadow-md max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />
              </div>

              {/* Footer CTA */}
              <div className="bg-slate-50 p-8 md:p-12 text-center border-t border-gray-100">
                 <h4 className="font-serif text-2xl font-bold mb-2">Wil je niets missen?</h4>
                 <p className="text-slate-600 mb-6 font-light">Volg ons op social media of kom eens kijken bij een repetitie.</p>
                 <button 
                  onClick={() => navigate('/lid-worden')}
                  className="inline-block bg-white border border-gray-200 text-sdg-red px-8 py-3 rounded-full font-bold hover:bg-sdg-red hover:text-white transition-all shadow-sm hover:shadow-md"
                 >
                   Word Lid van SDG
                 </button>
              </div>

            </div>
          </div>

          {/* Sidebar (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-4 space-y-6 mt-10 lg:mt-0">
             
             {/* Sticky Widget */}
             <div className="sticky top-28 space-y-6">
                
                {/* Agenda Widget */}
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                    <h3 className="font-serif font-bold text-xl text-slate-900">Binnenkort</h3>
                    <button onClick={() => navigate('/#agenda')} className="text-xs font-bold uppercase text-sdg-red hover:underline tracking-wider">
                       Alles
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                     {events.length > 0 ? (
                       events.map((event) => (
                         <div 
                           key={event.uid} 
                           onClick={() => navigate('/#agenda')}
                           className="flex gap-4 items-start group cursor-pointer hover:bg-slate-50 p-2 rounded-xl -mx-2 transition-colors"
                         >
                           {/* Mini Date Badge */}
                           <div className="flex flex-col items-center justify-center bg-slate-50 group-hover:bg-white rounded-xl w-14 h-14 border border-slate-100 shrink-0 shadow-sm transition-colors">
                             <span className="text-lg font-bold text-sdg-red leading-none font-serif">
                               {format(event.start, 'd')}
                             </span>
                             <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5 leading-none">
                               {format(event.start, 'MMM', { locale: nl })}
                             </span>
                           </div>
                           
                           {/* Info */}
                           <div className="min-w-0">
                             <h4 className="font-bold text-sm text-slate-800 leading-snug group-hover:text-sdg-red transition-colors truncate w-full">
                               {event.title}
                             </h4>
                             <div className="text-xs text-slate-500 mt-1 flex flex-col gap-0.5">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {format(event.start, 'HH:mm')}
                                </span>
                                {event.location && (
                                  <span className="flex items-center gap-1 truncate">
                                    <MapPin className="w-3 h-3" />
                                    {event.location}
                                  </span>
                                )}
                             </div>
                           </div>
                         </div>
                       ))
                     ) : (
                       <p className="text-sm text-slate-500 italic">Geen komende activiteiten gevonden.</p>
                     )}
                  </div>
                </div>

                {/* Recruitment Widget */}
                <div className="bg-sdg-dark text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-sdg-red rounded-full blur-3xl opacity-20"></div>
                   <h3 className="font-serif font-bold text-2xl mb-2 relative z-10">Speel mee!</h3>
                   <p className="text-slate-300 text-sm mb-6 relative z-10">Zoek je een gezellige vereniging? Kom sfeer proeven.</p>
                   <button 
                    onClick={() => navigate('/lid-worden')}
                    className="w-full bg-sdg-gold text-slate-900 py-3 rounded-xl font-bold text-sm hover:bg-white transition-colors relative z-10"
                   >
                     Meld je aan
                   </button>
                </div>

             </div>
          </div>

        </div>
      </div>
    </article>
  );
};

export default PostDetail;