import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNewsPosts, Post } from '../lib/wordpress';
import { Calendar, ArrowRight } from 'lucide-react';

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
    <section id="agenda" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Laatste Nieuws & Agenda</h2>
            <p className="text-slate-500 mt-2">Blijf op de hoogte van onze activiteiten.</p>
          </div>
          <button 
            onClick={() => navigate('/nieuws')}
            className="hidden md:flex items-center text-sdg-red font-semibold hover:text-red-900 transition-colors"
          >
            Bekijk alles <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
             const dateObj = new Date(post.date);
             const day = dateObj.getDate();
             const month = dateObj.toLocaleString('nl-NL', { month: 'short' });
             
             // Determine category badge
             const category = post.categories?.nodes[0]?.name || 'Algemeen';
             const isAgenda = category.toLowerCase() === 'agenda';

             return (
              <article 
                key={post.id} 
                onClick={() => navigate(`/nieuws/${post.slug}`)} 
                className="group block h-full cursor-pointer"
              >
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  {/* Image Area */}
                  <div className="relative h-56 overflow-hidden bg-gray-200">
                    {post.featuredImage ? (
                      <img 
                        src={post.featuredImage.node.sourceUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                         <Calendar className="w-12 h-12" />
                       </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white ${isAgenda ? 'bg-sdg-gold' : 'bg-sdg-red'}`}>
                        {category}
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start gap-4 mb-3">
                      {/* Date Box */}
                      <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-2 w-14 border border-slate-100 text-center shrink-0">
                        <span className="text-xl font-bold text-slate-900 leading-none">{day}</span>
                        <span className="text-xs uppercase text-slate-500 font-semibold">{month}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-sdg-red transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                    
                    <div 
                      className="text-slate-600 mb-4 line-clamp-3 text-sm flex-grow"
                      dangerouslySetInnerHTML={{ __html: post.excerpt }} 
                    />
                    
                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center text-sm font-semibold text-sdg-red">
                      Lees meer
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        
        <div className="mt-8 text-center md:hidden">
           <button onClick={() => navigate('/nieuws')} className="btn-secondary inline-flex items-center text-sdg-red font-semibold">
            Bekijk alles <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsGrid;