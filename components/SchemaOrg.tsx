import React from 'react';
import { Helmet } from 'react-helmet-async';

export type EventSchema = {
  name: string;
  startDate: string;
  endDate?: string;
  locationName: string;
  locationAddress?: string;
  description?: string;
  image?: string;
  url?: string;
};

export type ArticleSchema = {
  headline: string;
  image?: string[];
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  description?: string;
};

export interface SchemaOrgProps {
  event?: EventSchema;
  article?: ArticleSchema;
}

export const SchemaOrg: React.FC<SchemaOrgProps> = ({ event, article }) => {
  // Standaard MusicGroup / Organization Schema voor SDG Sint Jansklooster
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": "SDG Sint Jansklooster",
    "url": "https://sdgsintjansklooster.nl",
    "logo": "https://api.sdgsintjansklooster.nl/wp-content/uploads/2025/12/logo-placeholder.png", // Aan te passen naar het definitieve logo
    "description": "Christelijke Muziekvereniging Soli Deo Gloria. Al meer dan 125 jaar het muzikale hart van Sint Jansklooster. Ontdek onze fanfare, malletband en muziekopleiding.",
    "foundingLocation": {
      "@type": "Place",
      "name": "Sint Jansklooster"
    },
    // Optioneel kunnen we hier later social media links aan toevoegen
    "sameAs": [
      // "https://www.facebook.com/sdg.sintjansklooster",
      // "https://www.instagram.com/sdgsintjansklooster",
    ]
  };

  const schemaData: any[] = [organizationSchema];

  // Dynamisch Event Schema toevoegen
  if (event) {
    schemaData.push({
      "@context": "https://schema.org",
      "@type": "Event",
      "name": event.name,
      "startDate": event.startDate,
      "endDate": event.endDate || event.startDate,
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "location": {
        "@type": "Place",
        "name": event.locationName,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": event.locationAddress || "",
          "addressLocality": "Sint Jansklooster",
          "addressCountry": "NL"
        }
      },
      "image": event.image ? [event.image] : [],
      "description": event.description || "Concert of evenement van SDG Sint Jansklooster",
      "performer": {
        "@type": "MusicGroup",
        "name": "SDG Sint Jansklooster"
      },
      "url": event.url
    });
  }

  // Dynamisch Article/News Schema toevoegen
  if (article) {
    schemaData.push({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.headline,
      "image": article.image || [],
      "datePublished": article.datePublished,
      "dateModified": article.dateModified || article.datePublished,
      "author": [{
        "@type": "Organization",
        "name": article.authorName || "SDG Sint Jansklooster"
      }],
      "publisher": {
        "@type": "Organization",
        "name": "SDG Sint Jansklooster"
      },
      "description": article.description
    });
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default SchemaOrg;
