// Production API URL
const API_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_WORDPRESS_API_URL) 
  ? process.env.NEXT_PUBLIC_WORDPRESS_API_URL 
  : 'https://api.sdgsintjansklooster.nl/graphql';

// List of Proxies to try in order. 
// 1. Corsproxy.io (Fast, reliable)
// 2. AllOrigins (Good backup)
const PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url='
];

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
 * HELPER: Proxies an image URL through Weserv.
 * This ensures the image is served over valid HTTPS, fixes Mixed Content,
 * and optimizes the image for web (WebP).
 */
export function proxyImage(url?: string): string {
  if (!url) return '';
  // If it's already a data URL or already proxied, leave it
  if (url.startsWith('data:') || url.includes('images.weserv.nl')) return url;
  
  // Strip protocol (http:// or https://) to prevent double encoding issues
  const cleanUrl = url.replace(/^https?:\/\//, '');
  
  // Return proxied URL
  return `https://images.weserv.nl/?url=${cleanUrl}&output=webp&q=80`;
}

/**
 * HELPER: Sanitizes HTML content.
 * 1. Upgrades HTTP links to HTTPS.
 * 2. Rewrites <img> src attributes to use the Weserv proxy.
 * This guarantees no "Mixed Content" warnings appear in the browser.
 */
export function sanitizeContent(html: string): string {
  if (!html) return '';

  // 1. Basic Protocol Upgrade for links
  let clean = html.replace(/http:\/\/api\.sdgsintjansklooster\.nl/g, 'https://api.sdgsintjansklooster.nl')
                  .replace(/http:\/\/www\.sdgsintjansklooster\.nl/g, 'https://www.sdgsintjansklooster.nl');
  
  // 2. "Nuclear" Image Fix: Find all images pointing to our WP install and route them through Proxy
  // This Regex looks for src="..." containing the WP domain
  const domainPattern = 'api.sdgsintjansklooster.nl';
  const imgRegex = new RegExp(`src=["'](https?:\\/\\/${domainPattern}[^"']+)["']`, 'g');
  
  clean = clean.replace(imgRegex, (match, srcUrl) => {
      return `src="${proxyImage(srcUrl)}"`;
  });

  return clean;
}

/**
 * Robust fetch wrapper for GraphQL with Multi-Proxy Fallback
 */
async function fetchGraphQL(query: string, variables?: any) {
  const headers = { 'Content-Type': 'application/json' };
  const body = JSON.stringify({ query, variables });

  const parseResponse = async (res: Response) => {
    const text = await res.text();
    // Pre-clean the raw JSON text to avoid http strings
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

  // 1. Try Direct (Works on Desktop often)
  try {
    const res = await fetch(API_URL, { method: 'POST', headers, body });
    if (res.ok) return await parseResponse(res);
    throw new Error('Direct fetch failed');
  } catch (directError) {
    console.warn('Direct fetch failed, trying proxies...', directError);
  }

  // 2. Try Proxies in order (Fixes Mobile/SSL/CORS)
  for (const proxyBase of PROXIES) {
    try {
      // Encode API URL for the proxy
      const proxyUrl = `${proxyBase}${encodeURIComponent(API_URL)}`;
      const res = await fetch(proxyUrl, { method: 'POST', headers, body });
      
      if (res.ok) {
        return await parseResponse(res);
      }
    } catch (proxyError) {
      console.warn(`Proxy ${proxyBase} failed`, proxyError);
    }
  }

  console.error('All fetch attempts failed.');
  return null;
}

export async function getNewsPosts(): Promise<Post[]> {
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

    return filteredPosts.slice(0, 6);
  }
  return [];
}

export async function getAllPosts(): Promise<Post[]> {
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
  if (data?.posts?.nodes) return data.posts.nodes;
  return [];
}

export async function getLidWordenPage(): Promise<LidWordenPageData | null> {
  const query = `
    query GetLidWordenPage {
      page(id: "lid-worden", idType: URI) {
        title
        content(format: RENDERED)
        lidWordenFields {
          faq1 { vraag antwoord }
          faq2 { vraag antwoord }
          faq3 { vraag antwoord }
          faq4 { vraag antwoord }
          faq5 { vraag antwoord }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query);
  if (!data?.page) return null;

  const fields = data.page.lidWordenFields || {};
  const rawFaqs = [fields.faq1, fields.faq2, fields.faq3, fields.faq4, fields.faq5];
  
  const normalizedFaqs: FAQ[] = rawFaqs.filter((item: any) => 
    item && item.vraag && item.vraag.trim().length > 0
  );

  return {
    title: data.page.title,
    content: data.page.content,
    lidWordenFields: { faqs: normalizedFaqs }
  };
}

export async function getPostBySlug(slug: string) {
  const query = `
    query GetPostBySlug($id: ID!) {
      post(id: $id, idType: SLUG) {
        title
        date
        content(format: RENDERED)
        featuredImage { node { sourceUrl } }
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
          featuredImage { node { sourceUrl } }
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
        featuredImage { node { sourceUrl } }
      }
    }
  `;
  const data = await fetchGraphQL(query, { id: uri });
  if (!data || !data.page) return null;
  return data.page;
}