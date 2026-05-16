import React from 'react';
import { Helmet } from 'react-helmet-async';
import SchemaOrg, { EventSchema, ArticleSchema } from './SchemaOrg';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  event?: EventSchema;
  article?: ArticleSchema;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "Muziekvereniging SDG Sint Jansklooster - Ontdek de muzikale passie!", 
  description = "Ontdek de muzikale passie en word lid van onze bruisende vereniging! Soli Deo Gloria (SDG) Sint Jansklooster verbindt door muziek, met onze fanfare, malletband en maestro's van de toekomst.",
  type = "website",
  event,
  article
}) => {
  return (
    <>
      <Helmet>
        {/* Primaire Meta Tags */}
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />

        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="Soli Deo Gloria Sint Jansklooster" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      
      {/* Gestructureerde data toevoegen voor SEO optimalisatie */}
      <SchemaOrg event={event} article={article} />
    </>
  );
};

export default SEO;
