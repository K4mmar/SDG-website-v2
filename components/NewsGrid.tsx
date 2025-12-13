import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNewsPosts, Post } from '../lib/wordpress';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';

const NewsGrid: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const data = await getNewsPosts();
      setPosts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sdg-red mx-auto"></div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Laatste Nieuws</h2>
            <p className="text-slate-500 text-lg font-light">Lees de laatste updates van onze vereniging.</p>
          </div>
          {posts.length > 0 && (
            <button 
                onClick={() => navigate('/nieuws')}
                className="hidden md:flex items-center text-sdg-red font-semibold hover:text-red-900 transition-colors border-b-2 border-transparent hover:border-sdg-red pb-1"
            >
                Bekijk nieuwsarchief <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="bg-slate-50 rounded-3xl border border-gray-200 p-12 text-center">
             <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-slate-700 mb-2">Geen nieuwsberichten</h3>
             <p className="text-slate-500">Er zijn momenteel geen nieuwsberichten beschikbaar of de verbinding met de server is verbroken.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {posts.map((post) => {
               const dateObj = new Date(post.date);
               const day = dateObj.getDate();
               const month = dateObj.toLocaleString('nl-NL', { month: 'short' });
               
               // Determine category badge
               const category = post.categories?.nodes[0]?.name || 'Nieuws';

               return (
                <article 
                  key={post.id} 
                  onClick={() => navigate(`/nieuws/${post.slug}`, { state: { origin: 'home' } })} 
                  className="group block h-full cursor-pointer"
                >
                  <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
                    {/* Image Area */}
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      {post.featuredImage ? (
                        <img 
                          src={post.featuredImage.node.sourceUrl} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                           <Calendar className="w-16 h-16 opacity-50" />
                         </div>
                      )}
                      <div className="absolute top-5 left-5">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide text-white shadow-sm bg-sdg-red">
                          {category}
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-start gap-5 mb-4">
                        {/* Date Box */}
                        <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl w-16 h-16 border border-slate-100 text-center shrink-0 shadow-inner group-hover:bg-slate-100 transition-colors">
                          <span className="text-xl font-bold text-slate-900 leading-none font-serif">{day}</span>
                          <span className="text-xs uppercase text-slate-500 font-semibold mt-1 leading-none">{month}</span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 group-hover:text-sdg-red transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                      </div>
                      
                      <div 
                        className="text-slate-600 mb-6 line-clamp-3 text-sm flex-grow font-light leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.excerpt }} 
                      />
                      
                      <div className="mt-auto pt-6 border-t border-gray-50 flex items-center text-sm font-bold text-sdg-red uppercase tracking-wider">
                        Lees bericht
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        
        {posts.length > 0 && (
            <div className="mt-12 text-center md:hidden">
            <button onClick={() => navigate('/nieuws')} className="btn-secondary inline-flex items-center text-sdg-red font-semibold">
                Bekijk nieuwsarchief <ArrowRight className="ml-2 w-4 h-4" />
            </button>
            </div>
        )}
      </div>
    </section>
  );
};

export default NewsGrid;