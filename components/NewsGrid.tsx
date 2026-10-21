
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNewsPosts, Post } from '../lib/wordpress';
import { ArrowRight, Newspaper, RefreshCw, AlertCircle, MoveRight } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import WpContent from './WpContent';

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
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {(posts.length === 0 || error) ? (
          <div className="bg-slate-50 rounded-3xl border border-gray-200 p-12 text-center max-w-4xl mx-auto">
             <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-slate-700 mb-2">Geen berichten gevonden</h3>
             <button onClick={loadData} className="inline-flex items-center gap-2 px-8 py-3 bg-sdg-red text-white rounded-full font-bold hover:bg-red-800 transition-all shadow-lg mt-4">
                <RefreshCw className="w-4 h-4" /> Vernieuwen
             </button>
          </div>
        ) : (
          <NewsScroller posts={posts} navigate={navigate} />
        )}
      </div>
    </section>
  );
};

const NewsScroller: React.FC<{ posts: Post[], navigate: any }> = ({ posts, navigate }) => {
  const [showHint, setShowHint] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollXProgress } = useScroll({
    container: scrollRef
  });

  const scaleX = useSpring(scrollXProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (scrollRef.current) {
      const savedScroll = sessionStorage.getItem('sdg_news_scroll');
      if (savedScroll) {
        scrollRef.current.scrollLeft = parseInt(savedScroll, 10);
      }
    }
  }, [posts]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      
      if (showHint && scrollLeft > 20) {
        setShowHint(false);
      }

      const index = Math.round(scrollLeft / (scrollWidth / posts.length));
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };

  return (
    <>
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Laatste Nieuws</h2>
          <p className="text-slate-500 text-lg font-light">Blijf op de hoogte van de laatste updates en evenementen.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: showHint ? 1 : 0 }}
          className="md:hidden flex items-center gap-2 text-sdg-red font-bold text-xs uppercase tracking-widest bg-red-50 px-4 py-2 rounded-full border border-red-100"
        >
          <span>Swipe voor meer</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <MoveRight className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>

      <div className="relative">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 snap-x snap-mandatory md:snap-none pb-12 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] after:content-[''] after:w-[24px] after:flex-shrink-0 md:after:hidden"
        >
          {posts.map((post, index) => {
            const dateObj = new Date(post.date);
            const day = dateObj.getDate();
            const month = dateObj.toLocaleString('nl-NL', { month: 'short' });
            const imageUrl = post.featuredImage?.node.sourceUrl;

            return (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                onClick={() => {
                  sessionStorage.setItem('sdg_news_scroll', scrollRef.current?.scrollLeft?.toString() || '0');
                  navigate(`/nieuws/${post.slug}`, { state: { canGoBack: true } });
                }} 
                className="group block h-full cursor-pointer w-[82vw] sm:w-[60vw] md:w-auto flex-shrink-0 snap-center sm:snap-start md:snap-align-none"
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
                    <div className="absolute top-4 left-4">
                      <div className="text-center bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-2xl border border-white/20 shadow-xl">
                        <span className="block text-xl font-bold text-slate-900 leading-none">{day}</span>
                        <span className="block text-[10px] uppercase text-slate-500 font-bold tracking-wider">{month}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-7 flex flex-col flex-grow">
                    <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-sdg-red transition-colors line-clamp-2 mb-3 leading-snug">
                      {post.title}
                    </h3>
                    <WpContent 
                      html={post.excerpt}
                      className="text-slate-600 text-sm mb-6 line-clamp-3 font-light leading-relaxed prose-sm"
                    />
                    <div className="mt-auto flex items-center gap-2 text-sdg-red text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                      Lees meer <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
        
        <div className="md:hidden mt-4 px-2">
           <div className="h-1 bg-slate-100 rounded-full overflow-hidden relative">
             <motion.div 
               className="absolute top-0 left-0 h-full bg-sdg-red"
               style={{ 
                 width: '100%',
                 scaleX,
                 originX: 0
               }}
             />
           </div>
           
           <div className="flex justify-center gap-2 mt-4">
             {posts.map((_, i) => (
               <motion.div 
                key={i} 
                animate={{ 
                  width: activeIndex === i ? 24 : 6,
                  backgroundColor: activeIndex === i ? '#C52026' : '#E2E8F0' 
                }}
                className="h-1.5 rounded-full" 
               />
             ))}
           </div>
        </div>
      </div>
    </>
  );
};

export default NewsGrid;
