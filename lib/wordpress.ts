// Volledig veilige detectie van de API URL zonder afhankelijkheid van process
const getApiUrl = (): string => {
  try {
    // Check global scope directly for env vars
    const env = (window as any).process?.env || (typeof process !== 'undefined' ? process.env : {});
    if (env?.NEXT_PUBLIC_WORDPRESS_API_URL) {
      return env.NEXT_PUBLIC_WORDPRESS_API_URL;
    }
  } catch (e) {
    console.warn("WordPress API URL detection warning:", e);
  }
  return 'https://api.sdgsintjansklooster.nl/graphql';
};

const API_URL = getApiUrl();

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
  debugInfo?: string;
}

const proxyImage = (url?: string) => {
  if (!url || typeof url !== 'string') return undefined;
  let cleanUrl = url.trim();
  if (cleanUrl.includes('localhost') || cleanUrl.includes('.local')) return undefined;
  if (cleanUrl.startsWith('data:') || cleanUrl.includes('images.weserv.nl')) return cleanUrl;
  if (cleanUrl.startsWith('/')) {
    cleanUrl = `https://api.sdgsintjansklooster.nl${cleanUrl}`;
  } else if (!cleanUrl.startsWith('http')) {
     cleanUrl = `https://${cleanUrl}`;
  }
  return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&output=webp&q=80`;
};

const fixContentUrls = (html: string | undefined) => {
  if (!html) return '';
  let clean = html.replace(/http:\/\/api\.sdgsintjansklooster\.nl/g, 'https://api.sdgsintjansklooster.nl');
  clean = clean.replace(/srcset=["'][^"']*["']/g, '');
  clean = clean.replace(/sizes=["'][^"']*["']/g, '');
  const domainPattern = 'api.sdgsintjansklooster.nl';
  const imgRegex = new RegExp(`src=["'](https?:\\/\\/${domainPattern}[^"']+)["']`, 'g');
  clean = clean.replace(imgRegex, (match, srcUrl) => {
      const proxied = proxyImage(srcUrl);
      return proxied ? `src="${proxied}"` : match;
  });
  return clean;
};

const minifyQuery = (query: string) => query.replace(/\s+/g, ' ').trim();

async function fetchGraphQL(query: string, variables?: any) {
  const minifiedQuery = minifyQuery(query);
  const body = JSON.stringify({ query: minifiedQuery, variables });
  const t = Date.now();

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    if (res.ok) {
      const json = await res.json();
      if (!json.errors) return json.data;
    }
  } catch (e) {
    console.warn("GraphQL POST failed, trying GET fallback...");
  }

  // Fallback GET
  try {
    const urlParams = new URLSearchParams();
    urlParams.append('query', minifiedQuery);
    if (variables) urlParams.append('variables', JSON.stringify(variables));
    urlParams.append('t', String(t));
    const res = await fetch(`${API_URL}?${urlParams.toString()}`, { method: 'GET' });
    if (res.ok) {
        const json = await res.json();
        if (!json.errors) return json.data;
    }
  } catch (e) {}

  return null;
}

export async function getNewsPosts(): Promise<Post[]> {
  const query = `query GetRecentNews { posts(first: 6, where: { orderby: { field: DATE, order: DESC } }) { nodes { id title slug date excerpt(format: RENDERED) featuredImage { node { sourceUrl } } categories { nodes { name } } } } }`;
  const data = await fetchGraphQL(query);
  return data?.posts?.nodes?.map((post: Post) => ({
    ...post,
    excerpt: fixContentUrls(post.excerpt) || '',
    featuredImage: post.featuredImage ? { node: { sourceUrl: proxyImage(post.featuredImage.node.sourceUrl) || '' } } : undefined
  })) || [];
}

export async function getAllPosts(): Promise<Post[]> {
  const query = `query GetAllNews { posts(first: 50, where: { orderby: { field: DATE, order: DESC } }) { nodes { id title slug date excerpt(format: RENDERED) featuredImage { node { sourceUrl } } categories { nodes { name } } } } }`;
  const data = await fetchGraphQL(query);
  return data?.posts?.nodes?.map((post: Post) => ({
    ...post,
    excerpt: fixContentUrls(post.excerpt) || '',
    featuredImage: post.featuredImage ? { node: { sourceUrl: proxyImage(post.featuredImage.node.sourceUrl) || '' } } : undefined
  })) || [];
}

export async function getLidWordenPage(): Promise<LidWordenPageData | null> {
  const query = `query GetAllPagesForLidWorden { pages(first: 100) { nodes { id title slug content(format: RENDERED) } } }`;
  const data = await fetchGraphQL(query);
  const pages = data?.pages?.nodes || [];
  let match = pages.find((p: any) => p.slug === 'lid-worden') || pages.find((p: any) => p.title.toLowerCase().includes('lid worden'));
  if (match) {
      return { title: match.title, content: fixContentUrls(match.content) };
  }
  return null;
}

export async function getPostBySlug(slug: string) {
  const query = `query GetPostBySlug($id: ID!) { post(id: $id, idType: SLUG) { title date content(format: RENDERED) featuredImage { node { sourceUrl } } } }`;
  const data = await fetchGraphQL(query, { id: slug });
  if (!data || !data.post) return null;
  return {
    ...data.post,
    content: fixContentUrls(data.post.content),
    featuredImage: data.post.featuredImage ? { node: { sourceUrl: proxyImage(data.post.featuredImage.node.sourceUrl) } } : undefined
  };
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const query = `query GetPageByName($slug: String) { pages(where: {name: $slug}) { nodes { id title slug content(format: RENDERED) featuredImage { node { sourceUrl } } } } }`;
  const data = await fetchGraphQL(query, { slug });
  const pageData = data?.pages?.nodes?.[0];
  if (pageData) {
    return {
      ...pageData,
      content: fixContentUrls(pageData.content) || '',
      featuredImage: pageData.featuredImage ? { node: { sourceUrl: proxyImage(pageData.featuredImage.node.sourceUrl) || '' } } : undefined
    };
  }
  return null;
}

export async function getRecruitmentPagesImages(): Promise<Record<string, string | undefined>> {
  const query = `query GetRecruitmentImages { pages(where: {nameIn: ["boek-ons", "steun-ons", "doe-mee"]}) { nodes { slug featuredImage { node { sourceUrl } } } } }`;
  const data = await fetchGraphQL(query);
  const resultMap: Record<string, string | undefined> = {};
  data?.pages?.nodes?.forEach((page: any) => {
    if (page.slug && page.featuredImage?.node?.sourceUrl) {
      resultMap[page.slug] = proxyImage(page.featuredImage.node.sourceUrl);
    }
  });
  return resultMap;
}