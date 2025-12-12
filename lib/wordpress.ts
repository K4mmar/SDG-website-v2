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

// Fallback Mock Data (kept for robustness in case API is empty/down)
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

const MOCK_PAGES: Record<string, Page> = {
  'geschiedenis': {
    id: 'p1',
    slug: 'geschiedenis',
    title: 'Geschiedenis',
    content: `<h3>Een rijke historie</h3><p>Muziekvereniging SDG Sint Jansklooster kent een lange en rijke geschiedenis.</p>`,
    featuredImage: { node: { sourceUrl: 'https://picsum.photos/1200/500?random=10' } }
  },
  'identiteit': {
    id: 'p2',
    slug: 'identiteit',
    title: 'Identiteit',
    content: `<h3>Wie zijn wij?</h3><p>Soli Deo Gloria is een christelijke muziekvereniging.</p>`,
    featuredImage: { node: { sourceUrl: 'https://picsum.photos/1200/500?random=11' } }
  }
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
      console.error('GraphQL Errors:', json.errors);
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
  // Return API data if available, otherwise mock data
  if (data?.posts?.nodes && data.posts.nodes.length > 0) {
    return data.posts.nodes;
  }
  return MOCK_POSTS;
}

export async function getLidWordenPage(): Promise<LidWordenPageData | null> {
  const query = `
    query GetLidWordenPage {
      page(id: "lid-worden", idType: URI) {
        title
        content(format: RENDERED)
        lidWordenFields {
          faqs {
            vraag
            antwoord
          }
        }
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
  // We don't have a specific mock for every slug, so we return a generic one if API fails
  if (!data || !data.post) return { 
    title: 'Voorbeeld bericht', 
    date: new Date().toISOString(), 
    content: '<p>Dit bericht kon niet worden geladen of bestaat niet in de demo omgeving.</p>',
    featuredImage: { node: { sourceUrl: 'https://picsum.photos/1200/600?random=error' } }
  };
  return data.post;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const query = `
    query GetPageBySlug($id: ID!) {
      page(id: $id, idType: URI) {
        title
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
  
  if (!data || !data.page) {
    if (MOCK_PAGES[slug]) return MOCK_PAGES[slug];
    return {
      id: 'mock-page',
      title: slug.charAt(0).toUpperCase() + slug.slice(1),
      slug: slug,
      content: '<p>Inhoud kon niet geladen worden. Controleer de API verbinding.</p>',
      featuredImage: { node: { sourceUrl: 'https://picsum.photos/1200/500?random=99' } }
    };
  }
  return data.page;
}