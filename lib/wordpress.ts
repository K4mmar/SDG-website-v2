// Production API URL
const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://api.sdgsintjansklooster.nl/graphql';

export interface Post {
  id: string;
  title: string;
  date: string;
  slug: string;
  excerpt: string;
  content?: string;
  categories?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string;
    };
  };
}

export interface Page {
  id: string;
  title: string;
  content: string;
  slug: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string;
    };
  };
}

export interface FAQ {
  vraag: string;
  antwoord: string;
}

export interface LidWordenPageData {
  title: string;
  content: string;
  lidWordenFields?: {
    faqs?: FAQ[];
  };
}

// Fallback Mock Data (Only used if API is completely unreachable or returns empty lists)
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Groot Voorjaarsconcert 2024',
    date: '2024-03-15T19:30:00',
    slug: 'voorjaarsconcert-2024',
    excerpt: '<p>Kom genieten van ons jaarlijkse voorjaarsconcert in het dorpshuis. Een avond vol prachtige blaasmuziek.</p>',
    categories: { nodes: [{ name: 'Agenda', slug: 'agenda' }] },
    featuredImage: { node: { sourceUrl: 'https://picsum.photos/800/600?random=1' } }
  },
  {
    id: '2',
    title: 'Succesvolle Jeugdwerkactie',
    date: '2024-02-10T10:00:00',
    slug: 'jeugdwerkactie-2024',
    excerpt: '<p>Onze jeugdleden hebben afgelopen zaterdag huis-aan-huis koeken verkocht. De opbrengst gaat naar nieuwe instrumenten.</p>',
    categories: { nodes: [{ name: 'Nieuws', slug: 'nieuws' }] },
    featuredImage: { node: { sourceUrl: 'https://picsum.photos/800/600?random=2' } }
  },
  {
    id: '3',
    title: 'Open Repetitie Avond',
    date: '2024-04-01T19:00:00',
    slug: 'open-repetitie',
    excerpt: '<p>Altijd al eens mee willen spelen? Kom langs op onze open repetitie avond en ervaar de sfeer.</p>',
    categories: { nodes: [{ name: 'Werving', slug: 'werving' }] },
    featuredImage: { node: { sourceUrl: 'https://picsum.photos/800/600?random=3' } }
  }
];

// MOCK_PAGES is now empty for specific pages to ensure we use the Real API.
const MOCK_PAGES: Record<string, Page> = {
  // We removed 'geschiedenis', 'identiteit', etc. so they are fetched from WordPress.
};

/**
 * Robust fetch wrapper for GraphQL
 */
async function fetchGraphQL(query: string, variables?: any) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();
    if (json.errors) {
      // Improved logging: Stringify the error object so it's readable in the console
      console.warn('GraphQL Query Error:', JSON.stringify(json.errors, null, 2));
      return null;
    }
    return json.data;
  } catch (error) {
    console.warn('API fetch failed, utilizing fallback data.', error);
    return null;
  }
}

export async function getNewsPosts(): Promise<Post[]> {
  const query = `
    query GetNews {
      posts(first: 6) {
        nodes {
          id
          title
          slug
          date
          excerpt
          featuredImage { node { sourceUrl } }
          categories { nodes { name } }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query);
  if (data?.posts?.nodes && data.posts.nodes.length > 0) {
    return data.posts.nodes;
  }
  return MOCK_POSTS;
}

export async function getLidWordenPage(): Promise<LidWordenPageData | null> {
  // Simplified query: Removed 'lidWordenFields' (ACF) to prevent schema errors if not configured.
  // The frontend component has built-in fallbacks for the FAQs.
  const query = `
    query GetLidWordenPage {
      page(id: "lid-worden", idType: URI) {
        title
        content(format: RENDERED)
      }
    }
  `;

  const data = await fetchGraphQL(query);
  return data?.page || null;
}

export async function getPostBySlug(slug: string) {
  const query = `
    query GetPostBySlug($id: ID!) {
      post(id: $id, idType: SLUG) {
        title
        date
        content(format: RENDERED)
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query, { id: slug });
  
  if (!data || !data.post) return { 
    title: 'Bericht niet gevonden', 
    date: new Date().toISOString(), 
    content: '<p>Dit bericht kon niet worden geladen uit de API.</p>',
    featuredImage: { node: { sourceUrl: 'https://picsum.photos/1200/600?random=error' } }
  };
  return data.post;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  // Improved Query: Search by slug (name) in all pages. 
  // This bypasses issues where the URI might differ (e.g. parent/child structure)
  const query = `
    query GetPageBySlug($slug: String) {
      pages(where: {name: $slug}) {
        nodes {
          id
          title
          slug
          content(format: RENDERED)
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  `;

  console.log(`Fetching page from API via slug search: ${slug}`);
  const data = await fetchGraphQL(query, { slug });
  
  // If found, return the first match
  if (data && data.pages && data.pages.nodes && data.pages.nodes.length > 0) {
    return data.pages.nodes[0];
  }
  
  // Fallback: If slug search failed, try exact URI match (in case slug != uri for some reason)
  return getPageByUriFallback(slug);
}

async function getPageByUriFallback(uri: string): Promise<Page | null> {
    const query = `
    query GetPageByUri($id: ID!) {
      page(id: $id, idType: URI) {
        id
        title
        slug
        content(format: RENDERED)
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  `;
  const data = await fetchGraphQL(query, { id: uri });
  
  if (!data || !data.page) {
      return {
      id: 'error-page',
      title: 'Pagina niet gevonden',
      slug: uri,
      content: `<p>De pagina met slug <strong>'${uri}'</strong> is niet gevonden in WordPress. <br/><br/>Controleer in WordPress of de 'slug' (URL-naam) van de pagina exact overeenkomt met de link (kleine letters).</p>`,
      featuredImage: { node: { sourceUrl: 'https://picsum.photos/1200/500?random=404' } }
    };
  }
  return data.page;
}