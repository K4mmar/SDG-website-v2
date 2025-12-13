// Production API URL
const API_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_WORDPRESS_API_URL) 
  ? process.env.NEXT_PUBLIC_WORDPRESS_API_URL 
  : 'https://api.sdgsintjansklooster.nl/graphql';

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

// HELPER: Proxies an image URL through Weserv.
const proxyImage = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith('data:') || url.includes('images.weserv.nl')) return url;
  const cleanUrl = url.replace(/^https?:\/\//, '');
  return `https://images.weserv.nl/?url=${cleanUrl}&output=webp&q=80`;
};

// HELPER: Fixes content strings (HTML)
const fixContentUrls = (html: string | undefined) => {
  if (!html) return '';
  let clean = html.replace(/http:\/\/api\.sdgsintjansklooster\.nl/g, 'https://api.sdgsintjansklooster.nl');
  const domainPattern = 'api.sdgsintjansklooster.nl';
  const imgRegex = new RegExp(`src=["'](https?:\\/\\/${domainPattern}[^"']+)["']`, 'g');
  clean = clean.replace(imgRegex, (match, srcUrl) => {
      return `src="${proxyImage(srcUrl)}"`;
  });
  return clean;
};

/**
 * ULTRA ROBUST FETCH STRATEGY
 * Mobile devices are extremely strict about CORS and SSL chains.
 * We attempt 3 distinct strategies to get the data.
 */
async function fetchGraphQL(query: string, variables?: any) {
  const body = JSON.stringify({ query, variables });

  // STRATEGY 1: Standard POST (Best for computers)
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      // Removed 'next' property as it is specific to Next.js and causes type errors in standard React
    });

    if (res.ok) {
      const json = await res.json();
      if (!json.errors) return json.data;
    }
  } catch (error) {
    console.warn('Strategy 1 (POST) failed, trying fallback...', error);
  }

  // STRATEGY 2: "Simple" GET Request (The Mobile Fix)
  // By removing custom headers (like Content-Type), we trigger a "Simple Request".
  // Mobile browsers SKIP the Preflight (OPTIONS) check for Simple Requests.
  try {
    const urlParams = new URLSearchParams();
    urlParams.append('query', query);
    if (variables) urlParams.append('variables', JSON.stringify(variables));

    const getUrl = `${API_URL}?${urlParams.toString()}`;
    
    const res = await fetch(getUrl, {
        method: 'GET',
        // CRITICAL: NO HEADERS HERE. Adding headers triggers Preflight.
    });

    if (res.ok) {
        const json = await res.json();
        if (!json.errors) return json.data;
    }
  } catch (error) {
    console.warn('Strategy 2 (GET) failed, trying proxy...', error);
  }

  // STRATEGY 3: Proxy (The "Nuclear Option")
  // If direct connection is totally blocked, route through a neutral third party.
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(API_URL)}`;
    const res = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      cache: 'no-store'
    });

    if (res.ok) {
      const json = await res.json();
      if (!json.errors) return json.data;
    }
  } catch (error) {
    console.error('All fetch strategies failed:', error);
    // Throw error so UI can show it
    throw new Error(error instanceof Error ? error.message : 'Unknown Network Error');
  }

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

    return filteredPosts.slice(0, 6).map((post: Post) => ({
      ...post,
      excerpt: fixContentUrls(post.excerpt) || '',
      featuredImage: post.featuredImage ? {
        node: {
          ...post.featuredImage.node,
          sourceUrl: proxyImage(post.featuredImage.node.sourceUrl) || ''
        }
      } : undefined
    }));
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
  if (data?.posts?.nodes) {
    return data.posts.nodes.map((post: Post) => ({
      ...post,
      excerpt: fixContentUrls(post.excerpt) || '',
      featuredImage: post.featuredImage ? {
        node: {
          ...post.featuredImage.node,
          sourceUrl: proxyImage(post.featuredImage.node.sourceUrl) || ''
        }
      } : undefined
    }));
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
    content: fixContentUrls(data.page.content) || '',
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

  const post = data.post;
  return {
    ...post,
    content: fixContentUrls(post.content),
    featuredImage: post.featuredImage ? {
      node: {
        ...post.featuredImage.node,
        sourceUrl: proxyImage(post.featuredImage.node.sourceUrl)
      }
    } : undefined
  };
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
  let pageData = null;

  if (data && data.pages && data.pages.nodes && data.pages.nodes.length > 0) {
    pageData = data.pages.nodes[0];
  } else {
    let fallback = await getPageByUriFallback(`/${slug}/`);
    if (!fallback || fallback.id === 'error-page') {
        fallback = await getPageByUriFallback(slug);
    }
    pageData = fallback;
  }

  if (pageData) {
    return {
      ...pageData,
      content: fixContentUrls(pageData.content) || '',
      featuredImage: pageData.featuredImage ? {
        node: {
          ...pageData.featuredImage.node,
          sourceUrl: proxyImage(pageData.featuredImage.node.sourceUrl) || ''
        }
      } : undefined
    };
  }
  return null;
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