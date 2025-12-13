import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getPostBySlug } from '../lib/wordpress';
import { getUpcomingEvents, CalendarEvent } from '../lib/calendar';
import { ArrowLeft, Calendar, Tag, Share2, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine back button destination and label
  const origin = location.state?.origin;
  const backDestination = origin === 'archive' ? '/nieuws' : '/';
  const backLabel = origin === 'archive' ? 'Terug naar archief' : 'Terug naar home';

  useEffect(() => {
    async function loadData() {
      if (slug) {
        // Load post data
        const postData = await getPostBySlug(slug);
        setPost(postData);
        
        // Load calendar data
        const calendarData = await getUpcomingEvents();
        setEvents(calendarData.slice(0, 3)); 
        
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. Cinematic Hero Section (Background) */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={post.featuredImage?.node?.sourceUrl || 'https://picsum.photos/1200/600?blur=5'} 
            alt={post.title} 
            className="w-full h-full object-cover animate-[scale-in_20s_ease-out_forwards]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/60 to-slate-900/90 z-10"></div>
        
        {/* Title Overlay in Hero */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6">
           <div className="max-w-4xl opacity-0 animate-[fade-up_1s_ease-out_0.5s_forwards]">
             <div className="flex items-center justify-center gap-3 mb-6">
                <span className="bg-sdg-red/90 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                   Nieuws
                </span>
             </div>
             <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-2xl leading-tight">
               {post.title}
             </h1>
           </div>
        </div>
      </div>

      {/* 2. Floating Content Card */}
      <div className="relative z-30 container mx-auto px-4 md:px-6 -mt-24 md:-mt-32 pb-20">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-6xl mx-auto">
            
            {/* Sticky Header Bar with Back Button */}
            <div className="bg-white border-b border-gray-100 p-6 md:p-8 flex justify-between items-center sticky top-0 z-40 bg-opacity-95 backdrop-blur-sm">
                <button 
                onClick={() => navigate(backDestination)} 
                className="group flex items-center text-slate-500 hover:text-sdg-red transition-colors text-sm font-bold uppercase tracking-wider"
                >
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-sdg-red/10 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                {backLabel}
                </button>
                <div className="hidden sm:block">
                <button className="text-slate-400 hover:text-sdg-gold transition-colors">
                    <Share2 className="w-5 h-5" />
                </button>
                </div>
            </div>

            {/* Grid Layout inside the Card */}
            <div className="grid lg:grid-cols-12 gap-0 lg:divide-x divide-gray-100">
                
                {/* Main Content Column */}
                <div className="lg:col-span-8 p-8 md:p-12">
                    
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-slate-500 text-sm font-medium mb-8 pb-8 border-b border-gray-50">
                        <div className="flex items-center gap-2">
                             <Calendar className="w-4 h-4 text-sdg-gold" />
                             {dateStr}
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-sdg-gold" />
                            {timeStr}
                        </div>
                    </div>

                    <div 
                        className="prose prose-lg prose-slate hover:prose-a:text-sdg-red prose-img:rounded-xl prose-img:shadow-md max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }} 
                    />

                    {/* Footer CTA in Content */}
                    <div className="mt-16 bg-slate-50 p-8 rounded-2xl text-center">
                        <h4 className="font-serif text-2xl font-bold mb-2 text-slate-800">Wil je niets missen?</h4>
                        <p className="text-slate-600 mb-6 font-light">Kom eens kijken bij een repetitie.</p>
                        <button 
                        onClick={() => navigate('/lid-worden')}
                        className="inline-block bg-sdg-red text-white px-8 py-3 rounded-full font-bold hover:bg-red-800 transition-all shadow-md hover:shadow-lg"
                        >
                        Word Lid van SDG
                        </button>
                    </div>
                </div>

                {/* Sidebar Column (Desktop) */}
                <div className="hidden lg:block lg:col-span-4 bg-gray-50/50 p-8 md:p-10">
                    <div className="sticky top-28 space-y-8">
                        
                        {/* Agenda Widget */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                                <h3 className="font-serif font-bold text-lg text-slate-900">Binnenkort</h3>
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
                                    <div className="flex flex-col items-center justify-center bg-slate-50 group-hover:bg-white rounded-xl w-12 h-12 border border-slate-100 shrink-0 shadow-sm transition-colors">
                                        <span className="text-base font-bold text-sdg-red leading-none font-serif">
                                        {format(event.start, 'd')}
                                        </span>
                                        <span className="text-[9px] uppercase font-bold text-slate-400 mt-0.5 leading-none">
                                        {format(event.start, 'MMM', { locale: nl })}
                                        </span>
                                    </div>
                                    
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-xs text-slate-800 leading-snug group-hover:text-sdg-red transition-colors truncate w-full">
                                        {event.title}
                                        </h4>
                                        <div className="text-[10px] text-slate-500 mt-1 flex flex-col gap-0.5">
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
                                <p className="text-xs text-slate-500 italic">Geen komende activiteiten.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PostDetail;