import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPageBySlug, Page } from '../lib/wordpress';
import { ArrowLeft } from 'lucide-react';

const PageDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPage() {
      if (slug) {
        setLoading(true);
        // We try to fetch using the slug directly. 
        // Note: If your WP page is nested (e.g. parent "Over ons"), 
        // you might need to ensure the slug in WordPress matches or pass the full URI.
        const data = await getPageBySlug(slug);
        setPage(data);
        setLoading(false);
      }
    }
    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sdg-red"></div>
      </div>
    );
  }

  // If page is null or has the error-page ID (from our fallback logic)
  if (!page || page.id === 'error-page') {
    return (
      <div className="min-h-screen pt-32 bg-slate-50">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 className="text-3xl font-bold mb-4 text-slate-800">{page?.title || 'Pagina niet gevonden'}</h1>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200" dangerouslySetInnerHTML={{ __html: page?.content || '' }} />
          <button onClick={() => navigate('/')} className="mt-8 text-sdg-red hover:underline font-semibold">
            &larr; Terug naar home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Image - Using a slightly smaller height than PostDetail */}
      <div className="relative h-[40vh] min-h-[300px]">
        <img 
          src={page.featuredImage?.node?.sourceUrl || 'https://picsum.photos/1920/800?blur=2'} 
          alt={page.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md text-center px-4">
              {page.title}
            </h1>
        </div>
      </div>

      {/* Breadcrumb / Back Link */}
      <div className="bg-slate-50 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
            <button onClick={() => navigate('/')} className="inline-flex items-center text-slate-500 hover:text-sdg-red text-sm font-semibold transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Home / Over ons
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div 
            className="prose prose-lg prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-sdg-red hover:prose-a:text-red-800 prose-img:rounded-xl shadow-none max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }} 
          />
        </div>
      </div>
    </div>
  );
};

export default PageDetail;