
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPosts, Post } from '../lib/wordpress';
import { ChevronRight, Archive, Calendar, Search, ArrowLeft } from 'lucide-react';

const NewsArchive: React.FC = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | 'all' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const data = await getAllPosts();
      setAllPosts(data);
      
      // Extract unieke jaren
      const uniqueYears = Array.from(new Set(data.map(post => new Date(post.date).getFullYear()))).sort((a, b) => b - a);
      setYears(uniqueYears);
      
      // STAP: Zet de default op het nieuwste jaar (meestal het huidige jaar)
      if (uniqueYears.length > 0) {
        setSelectedYear(uniqueYears[0]);
      } else {
        setSelectedYear('all');
      }
      
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (selectedYear === 'all') {
      setFilteredPosts(allPosts);
    } else if (selectedYear !== null) {
      setFilteredPosts(allPosts.filter(post => new Date(post.date).getFullYear() === selectedYear));
    }
  }, [selectedYear, allPosts]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-28 pb-10">
        <div className="container mx-auto px-6">
          
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center text-slate-500 hover:text-sdg-red transition-colors text-sm font-bold uppercase tracking-wider mb-6"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 group-hover:bg-sdg-red/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Terug naar home
          </button>

          <div className="flex items-center gap-3 text-slate-500 mb-4 text-sm font-bold uppercase tracking-wide">
             <Archive className="w-4 h-4" />
             <span>Archief</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">Nieuwsoverzicht</h1>
          
          {/* Jaren Filter */}
          <div className="flex flex-wrap gap-2">
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedYear === year 
                  ? 'bg-sdg-red text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {year}
              </button>
            ))}
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                selectedYear === 'all' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Bekijk Alles
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        
        {loading ? (
          <div className="space-y-4 max-w-4xl">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
             <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
             <p className="text-slate-500">Geen berichten gevonden voor dit jaar.</p>
          </div>
        ) : (
          <div className="max-w-4xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {filteredPosts.map((post) => {
                 const date = new Date(post.date);
                 const dateStr = date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
                 
                 return (
                   <div 
                     key={post.id} 
                     onClick={() => navigate(`/nieuws/${post.slug}`, { state: { origin: 'archive' } })}
                     className="group p-6 hover:bg-slate-50 cursor-pointer transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center"
                   >
                      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium min-w-[140px] shrink-0">
                         <Calendar className="w-4 h-4" />
                         {dateStr}
                      </div>

                      <div className="flex-grow">
                         <h3 className="text-lg font-bold text-slate-800 group-hover:text-sdg-red transition-colors mb-1">
                           {post.title}
                         </h3>
                         <div 
                           className="text-slate-500 text-sm line-clamp-1 font-light"
                           dangerouslySetInnerHTML={{ __html: post.excerpt }} 
                         />
                      </div>

                      <div className="hidden md:block text-slate-300 group-hover:text-sdg-red transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                   </div>
                 );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsArchive;
