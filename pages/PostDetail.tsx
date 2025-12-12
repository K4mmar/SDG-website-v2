import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostBySlug } from '../lib/wordpress';
import { ArrowLeft, Calendar, User } from 'lucide-react';

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPost() {
      if (slug) {
        const data = await getPostBySlug(slug);
        setPost(data);
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sdg-red"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 text-center container mx-auto px-6">
        <h1 className="text-2xl font-bold mb-4">Bericht niet gevonden</h1>
        <button onClick={() => navigate('/')} className="text-sdg-red hover:underline">Terug naar home</button>
      </div>
    );
  }

  const dateStr = new Date(post.date).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <article className="min-h-screen bg-white">
      {/* Header Image */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img 
          src={post.featuredImage?.node?.sourceUrl || 'https://picsum.photos/1200/600?blur=5'} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto">
             <button onClick={() => navigate('/')} className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-semibold transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Terug naar overzicht
            </button>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-md">
              {post.title}
            </h1>
            <div className="flex items-center text-white/90 text-sm md:text-base space-x-6">
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {dateStr}</span>
              <span className="flex items-center"><User className="w-4 h-4 mr-2" /> Bestuur SDG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div 
            className="prose prose-lg prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-sdg-red hover:prose-a:text-red-800 prose-img:rounded-xl shadow-none"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
          
          <div className="mt-16 pt-8 border-t border-gray-100 flex justify-center">
             <button 
              onClick={() => navigate('/lid-worden')}
              className="bg-sdg-red text-white px-8 py-3 rounded-full font-bold hover:bg-red-800 transition-colors shadow-lg"
             >
               Sluit je ook aan bij SDG!
             </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostDetail;