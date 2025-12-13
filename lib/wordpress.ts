// Production API URL - Safe check for process.env to avoid browser crashes
const API_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_WORDPRESS_API_URL) 
  ? process.env.NEXT_PUBLIC_WORDPRESS_API_URL 
  : 'https://api.sdgsintjansklooster.nl/graphql';

// Fallback Proxy URL to resolve CORS/SSL issues on mobile devices
const PROXY_BASE = 'https://corsproxy.io/?';

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

/**
 * Robust fetch wrapper for GraphQL with Proxy Fallback
 */
async function fetchGraphQL(query: string, variables?: any) {
  const headers = { 'Content-Type': 'application/json' };
  const body = JSON.stringify({ query, variables });

  // Helper to parse response and sanitize HTTP links to HTTPS
  const parseResponse = async (res: Response) => {
    const text = await res.text();
    
    // MIXED CONTENT FIX:
    // Regex replace all instances of "http://api.sdgsintjansklooster.nl" with "https://..."
    // This ensures that even if the WP database returns http images, we use https.
    const cleanText = text.replace(/http:\/\/api\.sdgsintjansklooster\.nl/g, 'https://api.sdgsintjansklooster.nl');

    try {
      const json = JSON.parse(cleanText);
      if (json.errors) {
        console.warn('GraphQL Query Error:', JSON.stringify(json.errors, null, 2));
        return null;
      }
      return json.data;
    } catch (e) {
      console.error("Failed to parse WP response", e);
      return null;
    }
  };

  try {
    // Attempt 1: Direct Fetch
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body,
    });

    if (!res.ok) {
        throw new Error(`Direct fetch failed with status: ${res.status}`);
    }
    
    return await parseResponse(res);

  } catch (error) {
    console.warn('Direct API fetch failed. Retrying with CORS Proxy...', error);
    
    try {
        // Attempt 2: Fetch via Proxy (fixes Mobile/CORS/SSL issues)
        // We encode the API URL to pass it through the proxy correctly
        const proxyUrl = `${PROXY_BASE}${encodeURIComponent(API_URL)}`;
        
        const res = await fetch(proxyUrl, {
            method: 'POST',
            headers,
            body,
        });

        if (!res.ok) {
            throw new Error(`Proxy fetch failed with status: ${res.status}`);
        }

        return await parseResponse(res);

    } catch (proxyError) {
        console.error('All API fetch attempts failed.', proxyError);
        return null;
    }
  }
}

export async function getNewsPosts(): Promise<Post[]> {
  // Fetches recent posts and filters them client-side to strictly show only the last 12 months.
  // We fetch a bit more (12) to ensure we have enough after filtering.
  const query = `
    query GetRecentNews {
      posts(first: 12, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          date
          excerpt(format: RENDERED)
          featuredImage { node { sourceUrl } }
          categories { nodes { name } }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query);
  
  if (data?.posts?.nodes) {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const filteredPosts = data.posts.nodes.filter((post: Post) => {
      const postDate = new Date(post.date);
      return postDate >= oneYearAgo;
    });

    // Return max 6 of the filtered list
    return filteredPosts.slice(0, 6);
  }
  
  return [];
}

export async function getAllPosts(): Promise<Post[]> {
  // Fetches a larger set of posts for the archive page (e.g. 100).
  const query = `
    query GetAllNews {
      posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          date
          excerpt(format: RENDERED)
          featuredImage { node { sourceUrl } }
          categories { nodes { name } }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query);
  
  if (data?.posts?.nodes) {
    return data.posts.nodes;
  }
  
  return [];
}

export async function getLidWordenPage(): Promise<LidWordenPageData | null> {
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

  const fields = data.page.lidWordenFields || {};
  
  const rawFaqs = [
    fields.faq1, 
    fields.faq2, 
    fields.faq3, 
    fields.faq4, 
    fields.faq5
  ];

  const normalizedFaqs: FAQ[] = rawFaqs.filter((item: any) => 
    item && item.vraag && item.vraag.trim().length > 0
  );

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
  
  if (!data || !data.post) return null;
  return data.post;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
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

  const data = await fetchGraphQL(queryName, { slug });
  
  if (data && data.pages && data.pages.nodes && data.pages.nodes.length > 0) {
    return data.pages.nodes[0];
  }
  
  let page = await getPageByUriFallback(`/${slug}/`);
  
  if (!page || page.id === 'error-page') {
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
      return null;
  }
  return data.page;
}