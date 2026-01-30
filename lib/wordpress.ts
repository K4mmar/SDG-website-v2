
const BASE_DOMAIN = 'https://api.sdgsintjansklooster.nl';
const GRAPHQL_URL = `${BASE_DOMAIN}/graphql`;
const PROXY_URL = 'https://api.allorigins.win/raw?url=';

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

export interface RecruitmentData {
  image?: string;
  description?: string;
}

async function fetchFromWP(url: string, isGraphQL: boolean = false, query?: string) {
  const targetUrl = isGraphQL ? GRAPHQL_URL : url;
  const options: RequestInit = isGraphQL ? {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  } : { method: 'GET' };

  try {
    const directResponse = await fetch(targetUrl, options);
    if (directResponse.ok) return await directResponse.json();
    throw new Error('CORS');
  } catch (e) {
    const finalUrl = `${PROXY_URL}${encodeURIComponent(targetUrl)}`;
    const proxyResponse = await fetch(finalUrl, options);
    if (!proxyResponse.ok) throw new Error(`Status: ${proxyResponse.status}`);
    return await proxyResponse.json();
  }
}

const proxyImage = (url?: string) => {
  if (!url) return undefined;
  let cleanUrl = url.trim();
  if (cleanUrl.startsWith('/')) cleanUrl = `${BASE_DOMAIN}${cleanUrl}`;
  return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&output=webp&q=80`;
};

const fixContentUrls = (html: string | undefined) => {
  if (!html) return '';
  let clean = html.replace(/http:\/\/api\.sdgsintjansklooster\.nl/g, 'https://api.sdgsintjansklooster.nl');
  const domainPattern = 'api.sdgsintjansklooster.nl';
  const imgRegex = new RegExp(`src=["'](https?:\\/\\/${domainPattern}[^"']+)["']`, 'g');
  return clean.replace(imgRegex, (match, srcUrl) => {
      const proxied = proxyImage(srcUrl);
      return proxied ? `src="${proxied}"` : match;
  });
};

// Hulpfunctie om HTML te strippen en in te korten voor de kaarten
const processExcerpt = (html: string): string | undefined => {
  if (!html) return undefined;
  // Verwijder alle HTML tags
  const plainText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Als de tekst leeg is, return undefined zodat fallback wordt gebruikt
  if (!plainText) return undefined;

  // Maximaal aantal karakters (bijv. 160) om de grid netjes te houden
  if (plainText.length > 160) {
    return plainText.substring(0, 160).trim() + '...';
  }
  return plainText;
};

export async function getNewsPosts(): Promise<Post[]> {
  const query = `
    query GetRecentNews {
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          date
          excerpt(format: RENDERED)
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  `;
  try {
    const result = await fetchFromWP('', true, query);
    const nodes = result?.data?.posts?.nodes || [];
    return nodes.map((post: any) => ({
      ...post,
      excerpt: fixContentUrls(post.excerpt),
      featuredImage: post.featuredImage ? { node: { sourceUrl: proxyImage(post.featuredImage.node.sourceUrl) || '' } } : undefined
    }));
  } catch (e) {
    const restUrl = `${BASE_DOMAIN}/wp-json/wp/v2/posts?_embed&per_page=20`;
    const posts = await fetchFromWP(restUrl);
    return posts.map((p: any) => ({
      id: p.id.toString(),
      title: p.title.rendered,
      slug: p.slug,
      date: p.date,
      excerpt: p.excerpt.rendered,
      featuredImage: p._embedded?.['wp:featuredmedia']?.[0]?.source_url 
        ? { node: { sourceUrl: proxyImage(p._embedded['wp:featuredmedia'][0].source_url) } }
        : undefined
    }));
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const restUrl = `${BASE_DOMAIN}/wp-json/wp/v2/posts?per_page=100`;
  try {
    const posts = await fetchFromWP(restUrl);
    return posts.map((p: any) => ({
      id: p.id.toString(),
      title: p.title.rendered,
      slug: p.slug,
      date: p.date,
      excerpt: p.excerpt.rendered
    }));
  } catch (e) { return []; }
}

export async function getPostBySlug(slug: string) {
  const restUrl = `${BASE_DOMAIN}/wp-json/wp/v2/posts?slug=${slug}&_embed`;
  try {
    const posts = await fetchFromWP(restUrl);
    if (!posts || posts.length === 0) return null;
    const p = posts[0];
    return {
      title: p.title.rendered,
      date: p.date,
      content: fixContentUrls(p.content.rendered),
      featuredImage: p._embedded?.['wp:featuredmedia']?.[0]?.source_url 
        ? { node: { sourceUrl: proxyImage(p._embedded['wp:featuredmedia'][0].source_url) } }
        : undefined
    };
  } catch (e) { return null; }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const restUrl = `${BASE_DOMAIN}/wp-json/wp/v2/pages?slug=${slug}&_embed`;
  try {
    const pages = await fetchFromWP(restUrl);
    if (!pages || pages.length === 0) return null;
    const p = pages[0];
    return {
      id: p.id.toString(),
      title: p.title.rendered,
      slug: p.slug,
      content: fixContentUrls(p.content.rendered),
      featuredImage: p._embedded?.['wp:featuredmedia']?.[0]?.source_url 
        ? { node: { sourceUrl: proxyImage(p._embedded['wp:featuredmedia'][0].source_url) } }
        : undefined
    };
  } catch (e) { return null; }
}

export async function getRecruitmentData(): Promise<Record<string, RecruitmentData>> {
  const slugs = ['boek-ons', 'steun-ons', 'doe-mee'];
  const results: Record<string, RecruitmentData> = {};

  try {
    // Probeer eerst via GraphQL voor de drie specifieke slugs.
    // We halen 'content' op omdat 'excerpt' bij pagina's vaak leeg is.
    const query = `
      query GetRecruitmentData {
        pages(where: { nameIn: ["boek-ons", "steun-ons", "doe-mee"] }) {
          nodes {
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
    const data = await fetchFromWP('', true, query);
    const pages = data?.data?.pages?.nodes || [];
    
    pages.forEach((page: any) => {
      results[page.slug] = {
        image: page.featuredImage?.node?.sourceUrl 
          ? proxyImage(page.featuredImage.node.sourceUrl) 
          : undefined,
        description: processExcerpt(page.content)
      };
    });

    // Fallback: Als GraphQL iets mist, probeer per stuk via REST
    for (const slug of slugs) {
      if (!results[slug]) {
        const page = await getPageBySlug(slug);
        if (page) {
          results[slug] = {
            image: page.featuredImage?.node?.sourceUrl,
            description: processExcerpt(page.content)
          };
        }
      }
    }
  } catch (e) {
    console.error("SDG-Master: Fout bij ophalen recruitment data:", e);
  }

  return results;
}
