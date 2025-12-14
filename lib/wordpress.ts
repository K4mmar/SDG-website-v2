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
  debugInfo?: string; // Added for diagnostics
}

// HELPER: Proxies an image URL through Weserv.
const proxyImage = (url?: string) => {
  if (!url || typeof url !== 'string') return undefined;
  
  let cleanUrl = url.trim();
  
  // Reject local development URLs that might leak into production data
  if (cleanUrl.includes('localhost') || cleanUrl.includes('.local')) {
    return undefined;
  }

  // If already proxied or data, return as is
  if (cleanUrl.startsWith('data:') || cleanUrl.includes('images.weserv.nl')) return cleanUrl;
  
  // Ensure we have an absolute URL for the source
  if (cleanUrl.startsWith('/')) {
    cleanUrl = `https://api.sdgsintjansklooster.nl${cleanUrl}`;
  } else if (!cleanUrl.startsWith('http')) {
     // Handle cases where protocol might be missing
     cleanUrl = `https://${cleanUrl}`;
  }

  // Pass the FULL URL to Weserv to avoid protocol ambiguity. 
  // Weserv handles encoded full URLs perfectly.
  return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&output=webp&q=80`;
};

// HELPER: Fixes content strings (HTML)
const fixContentUrls = (html: string | undefined) => {
  if (!html) return '';
  
  // 1. Ensure all API references are HTTPS
  let clean = html.replace(/http:\/\/api\.sdgsintjansklooster\.nl/g, 'https://api.sdgsintjansklooster.nl');
  
  // 2. Remove 'srcset' and 'sizes' attributes.
  clean = clean.replace(/srcset=["'][^"']*["']/g, '');
  clean = clean.replace(/sizes=["'][^"']*["']/g, '');

  // 3. Proxy the src attributes
  const domainPattern = 'api.sdgsintjansklooster.nl';
  const imgRegex = new RegExp(`src=["'](https?:\\/\\/${domainPattern}[^"']+)["']`, 'g');
  clean = clean.replace(imgRegex, (match, srcUrl) => {
      const proxied = proxyImage(srcUrl);
      return proxied ? `src="${proxied}"` : match;
  });
  
  return clean;
};

// HELPER: Minify GraphQL Query to reduce URL length for GET requests
const minifyQuery = (query: string) => {
  return query.replace(/\s+/g, ' ').trim();
};

/**
 * ULTRA ROBUST FETCH STRATEGY
 * Attempts multiple methods to fetch data, prioritizing direct connection
 * and falling back to various proxies.
 */
async function fetchGraphQL(query: string, variables?: any) {
  const minifiedQuery = minifyQuery(query);
  const body = JSON.stringify({ query: minifiedQuery, variables });
  const errors: string[] = [];
  
  // CACHE BUSTING:
  // Add a unique timestamp to requests to force proxies/browsers to fetch fresh data.
  // This is critical for the "Lid worden" page updates to show up immediately.
  const t = Date.now();

  // --- STRATEGY 1: Direct POST ---
  // Ideal for modern browsers and servers with proper CORS.
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      cache: 'no-store', // Disable browser caching
    });
    if (res.ok) {
      const json = await res.json();
      if (!json.errors) return json.data;
      errors.push(`Direct POST GraphQL Error: ${json.errors[0]?.message}`);
    } else {
      // If 400, it might be a schema validation error (querying fields that don't exist)
      const text = await res.text();
      errors.push(`Direct POST Error: ${res.status} ${res.statusText} - ${text.substring(0, 100)}`);
    }
  } catch (e) {
    errors.push(`Direct POST Exception: ${e instanceof Error ? e.message : String(e)}`);
  }

  // --- STRATEGY 2: Direct GET ---
  // Avoids preflight OPTIONS requests in some cases.
  try {
    const urlParams = new URLSearchParams();
    urlParams.append('query', minifiedQuery);
    if (variables) urlParams.append('variables', JSON.stringify(variables));
    // Append cache buster
    urlParams.append('t', String(t));
    
    const getUrl = `${API_URL}?${urlParams.toString()}`;
    
    const res = await fetch(getUrl, { method: 'GET' });
    if (res.ok) {
        const json = await res.json();
        if (!json.errors) return json.data;
        errors.push(`Direct GET GraphQL Error: ${json.errors[0]?.message}`);
    } else {
        errors.push(`Direct GET Error: ${res.status} ${res.statusText}`);
    }
  } catch (e) {
    errors.push(`Direct GET Exception: ${e instanceof Error ? e.message : String(e)}`);
  }

  // --- STRATEGY 3: CorsProxy.io (POST) ---
  // High performance proxy.
  try {
    // Append cache buster to the destination URL so the proxy treats it as a new resource
    // (Most GraphQL servers ignore extra query params like ?t=...)
    const destUrl = `${API_URL}?t=${t}`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(destUrl)}`;
    
    const res = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    if (res.ok) {
      const json = await res.json();
      if (!json.errors) return json.data;
      errors.push(`CorsProxy POST GraphQL Error: ${json.errors[0]?.message}`);
    } else {
      errors.push(`CorsProxy POST Error: ${res.status} ${res.statusText}`);
    }
  } catch (e) {
    errors.push(`CorsProxy POST Exception: ${e instanceof Error ? e.message : String(e)}`);
  }

  // --- STRATEGY 4: CodeTabs (GET) ---
  // Reliable GET proxy.
  try {
    const urlParams = new URLSearchParams();
    urlParams.append('query', minifiedQuery);
    if (variables) urlParams.append('variables', JSON.stringify(variables));
    urlParams.append('t', String(t)); // Cache buster
    
    const targetUrl = `${API_URL}?${urlParams.toString()}`;
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`;
    
    const res = await fetch(proxyUrl, { method: 'GET' });
    if (res.ok) {
        const json = await res.json();
        if (!json.errors) return json.data;
        errors.push(`CodeTabs GET GraphQL Error: ${json.errors[0]?.message}`);
    } else {
        errors.push(`CodeTabs GET Error: ${res.status} ${res.statusText}`);
    }
  } catch (e) {
     errors.push(`CodeTabs GET Exception: ${e instanceof Error ? e.message : String(e)}`);
  }

  // --- STRATEGY 5: AllOrigins (JSON Wrapper) ---
  // Uses /get?url=... which returns a JSON with { contents: "..." }
  // This is often more reliable than /raw for certain content types/headers.
  try {
    const urlParams = new URLSearchParams();
    urlParams.append('query', minifiedQuery);
    if (variables) urlParams.append('variables', JSON.stringify(variables));
    urlParams.append('t', String(t)); // Cache buster
    
    const targetUrl = `${API_URL}?${urlParams.toString()}`;
    // Add cache buster to the proxy URL itself as well
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&rand=${t}`;
    
    const res = await fetch(proxyUrl, { method: 'GET' });
    if (res.ok) {
        const wrapper = await res.json();
        if (wrapper && wrapper.contents) {
            const json = JSON.parse(wrapper.contents);
            if (!json.errors) return json.data;
            errors.push(`AllOrigins JSON GraphQL Error: ${json.errors[0]?.message}`);
        } else {
            errors.push(`AllOrigins JSON Error: Empty contents`);
        }
    } else {
        errors.push(`AllOrigins JSON Error: ${res.status} ${res.statusText}`);
    }
  } catch (e) {
     errors.push(`AllOrigins JSON Exception: ${e instanceof Error ? e.message : String(e)}`);
  }

  // If we get here, all strategies failed.
  // Log all errors for debugging
  console.warn("All fetch strategies failed. Diagnostic info:", errors);
  throw new Error(`Unable to connect to content server (Strategies exhausted). Last error: ${errors[errors.length - 1]}`);
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

  try {
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
  } catch (error) {
      console.error("Failed to load news posts:", error);
      throw error; // Re-throw to let the component handle the error state
  }
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

  try {
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
  } catch (error) {
      console.error("Failed to load all posts:", error);
      return [];
  }
}

export async function getLidWordenPage(): Promise<LidWordenPageData | null> {
  // REVISED STRATEGY: 
  // Instead of guessing the slug/ID, fetch all pages and filter in JS.
  // This is much more reliable against slug mismatches (e.g. /lid-worden vs /lid-worden-2).
  const query = `
    query GetAllPagesForLidWorden {
      pages(first: 100) {
        nodes {
          id
          title
          slug
          content(format: RENDERED)
        }
      }
    }
  `;

  let debugLog: string[] = [];

  try {
    const data = await fetchGraphQL(query);
    const pages = data?.pages?.nodes || [];
    debugLog.push(`Fetched ${pages.length} pages.`);
    debugLog.push(`Slugs found: ${pages.map((p:any) => p.slug).join(', ')}`);

    // Priority 1: Exact slug match
    let match = pages.find((p: any) => p.slug === 'lid-worden');

    // Priority 2: Fuzzy title match
    if (!match) {
        match = pages.find((p: any) => p.title.toLowerCase().includes('lid worden'));
    }

    // Priority 3: Fuzzy slug match
    if (!match) {
         match = pages.find((p: any) => p.slug.includes('lid-worden') || p.slug.includes('aanmelden'));
    }

    if (match) {
        return {
            title: match.title,
            content: fixContentUrls(match.content),
            debugInfo: debugLog.join('\n')
        };
    } else {
        // Return a dummy object with debug info so the frontend can show what went wrong
         return {
            title: "Error: Page Not Found",
            content: "",
            debugInfo: `COULD NOT FIND PAGE. \n${debugLog.join('\n')}`
        };
    }

  } catch (e) {
      console.error("Failed to fetch Lid Worden page via list:", e);
      return {
          title: "Connection Error",
          content: "",
          debugInfo: `Fetch error: ${e instanceof Error ? e.message : String(e)}`
      };
  }
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

  try {
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
  } catch (error) {
      console.warn(`Failed to load post ${slug}:`, error);
      return null;
  }
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

  try {
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
  } catch (error) {
      console.warn(`Failed to load page ${slug}:`, error);
      return null;
  }
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
  try {
    const data = await fetchGraphQL(query, { id: uri });
    if (!data || !data.page) return null;
    return data.page;
  } catch (e) {
      return null;
  }
}

/**
 * Fetch featured images for the recruitment cards.
 * Returns a map of slug -> imageUrl.
 * Uses 'nameIn' which finds pages by slug regardless of their hierarchy/path.
 */
export async function getRecruitmentPagesImages(): Promise<Record<string, string | undefined>> {
  const query = `
    query GetRecruitmentImages {
      pages(where: {nameIn: ["boek-ons", "steun-ons", "doe-mee"]}) {
        nodes {
          slug
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
    const data = await fetchGraphQL(query);
    const resultMap: Record<string, string | undefined> = {};
    
    if (data?.pages?.nodes) {
      data.pages.nodes.forEach((page: any) => {
        if (page.slug && page.featuredImage?.node?.sourceUrl) {
          resultMap[page.slug] = proxyImage(page.featuredImage.node.sourceUrl);
        }
      });
    }

    return resultMap;
  } catch (e) {
    console.warn("Failed to fetch recruitment images", e);
    return {};
  }
}