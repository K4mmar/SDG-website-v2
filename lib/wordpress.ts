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
      posts(first: 20) {
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
    // Filter out posts older than 1 year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const recentPosts = data.posts.nodes.filter((post: Post) => {
      const postDate = new Date(post.date);
      return postDate >= oneYearAgo;
    });

    // Return max 6 most recent valid posts
    return recentPosts.slice(0, 6);
  }
  return MOCK_POSTS;
}

export async function getLidWordenPage(): Promise<LidWordenPageData | null> {
  // Updated query to fetch individual group fields (faq1...faq5) instead of a repeater.
  // We fetch a few extra slots (up to 5) to be future-proof.
  const query = `
    query GetLidWordenPage {
      page(id: "lid-worden", idType: URI) {
        title
        content(format: RENDERED)
        lidWordenFields {
          faq1 {
            vraag
            antwoord
          }
          faq2 {
            vraag
            antwoord
          }
          faq3 {
            vraag
            antwoord
          }
          faq4 {
            vraag
            antwoord
          }
          faq5 {
            vraag
            antwoord
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query);
  
  if (!data?.page) return null;

  // Normalization Logic:
  // 1. Extract the raw field group
  const fields = data.page.lidWordenFields || {};
  
  // 2. Map individual objects into a single array
  const rawFaqs = [
    fields.faq1, 
    fields.faq2, 
    fields.faq3, 
    fields.faq4, 
    fields.faq5
  ];

  // 3. Filter out nulls or items where the question is empty
  const normalizedFaqs: FAQ[] = rawFaqs.filter((item: any) => 
    item && item.vraag && item.vraag.trim().length > 0
  );

  // 4. Return the clean shape that the UI expects (an array of FAQs)
  return {
    title: data.page.title,
    content: data.page.content,
    lidWordenFields: {
      faqs: normalizedFaqs
    }
  };
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
  // 1. Try to find by NAME (Slug) first
  const queryName = `
    query GetPageByName($slug: String) {
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
  const data = await fetchGraphQL(queryName, { slug });
  
  if (data && data.pages && data.pages.nodes && data.pages.nodes.length > 0) {
    return data.pages.nodes[0];
  }
  
  // 2. If name search failed, try URI with leading/trailing slashes (common WPGraphQL issue)
  console.log(`Slug fetch failed, trying URI fallback for: /${slug}/`);
  let page = await getPageByUriFallback(`/${slug}/`);
  
  // 3. If that failed, try just the slug as URI
  if (!page || page.id === 'error-page') {
      console.log(`URI fetch failed, trying simple URI for: ${slug}`);
      page = await getPageByUriFallback(slug);
  }

  return page;
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
      // Return null here to indicate failure to the caller logic, so it can try the next method
      // OR return the error object if it's the final attempt. 
      // For the helper, we just return null if not found.
      return null;
  }
  return data.page;
}