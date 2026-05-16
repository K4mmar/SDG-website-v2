
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNewsPosts, Post } from '../lib/wordpress';
import { ArrowRight, Newspaper, RefreshCw, AlertCircle } from 'lucide-react';

const NewsGrid: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await getNewsPosts();
      
      // We tonen de laatste 6 berichten, ongeacht het jaartal
      setPosts(data.slice(0, 6));
    } catch (e) {
      console.error("SDG News Error:", e);
      setError("Het lukt niet om de berichten op te halen.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sdg-red mx-auto mb-4"></div>
        <p className="text-slate-400 text-sm">Nieuws ophalen...</p>
      </div>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Laatste Nieuws</h2>
          <p className="text-slate-500 text-lg font-light">Blijf op de hoogte van de laatste updates en evenementen.</p>
        </div>

        {(posts.length === 0 || error) ? (
          <div className="bg-slate-50 rounded-3xl border border-gray-200 p-12 text-center max-w-4xl mx-auto">
             <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-slate-700 mb-2">Geen berichten gevonden</h3>
             <button onClick={loadData} className="inline-flex items-center gap-2 px-8 py-3 bg-sdg-red text-white rounded-full font-bold hover:bg-red-800 transition-all shadow-lg mt-4">
                <RefreshCw className="w-4 h-4" /> Vernieuwen
             </button>
          </div>
        ) : (
          <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 snap-x snap-mandatory md:snap-none pb-8 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] after:content-[''] after:w-[1px] after:flex-shrink-0 md:after:hidden">
            {posts.map((post) => {
               const dateObj = new Date(post.date);
               const day = dateObj.getDate();
               const month = dateObj.toLocaleString('nl-NL', { month: 'short' });
               const imageUrl = post.featuredImage?.node.sourceUrl;

               return (
                <article 
                  key={post.id} 
                  onClick={() => navigate(`/nieuws/${post.slug}`)} 
                  className="group block h-full cursor-pointer w-[85vw] sm:w-[60vw] md:w-auto flex-shrink-0 snap-center sm:snap-start md:snap-align-none"
                >
                  <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col transform md:hover:-translate-y-1">
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-200">
                           <Newspaper className="w-16 h-16" />
                         </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex gap-4 mb-3">
                        <div className="text-center bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 shrink-0 h-fit">
                          <span className="block text-lg font-bold text-slate-900 leading-none">{day}</span>
                          <span className="block text-[10px] uppercase text-slate-400 font-bold">{month}</span>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-sdg-red transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </div>
                      <div 
                        className="text-slate-600 text-sm mb-4 line-clamp-3 font-light"
                        dangerouslySetInnerHTML={{ __html: post.excerpt }} 
                      />
                      <div className="mt-auto text-sdg-red text-xs font-bold uppercase tracking-wider">
                        Lees meer &rarr;
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsGrid;
