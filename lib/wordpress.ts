// Simulating environment variable
const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://demo.wpgraphql.com/graphql';

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

// Mock data fallback in case the API is not reachable or configured
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

const MOCK_SINGLE_POST = {
  title: 'Groot Voorjaarsconcert 2024',
  date: '2024-03-15T19:30:00',
  content: `
    <p><strong>Kom genieten van ons jaarlijkse voorjaarsconcert!</strong></p>
    <p>Op zaterdag 23 maart is het weer zover: het jaarlijkse concert van SDG Sint Jansklooster. Na maanden van repeteren laten het A-orkest, de jeugdopleiding en de slagwerkgroep van zich horen.</p>
    <h3>Wat kunt u verwachten?</h3>
    <p>Het programma is zeer divers, van klassieke ouvertures tot moderne popsongs. Er is voor ieder wat wils.</p>
    <ul>
      <li>Optreden van de 'Music Kids'</li>
      <li>Spectaculaire slagwerkshow</li>
      <li>Gastoptreden van lokale solisten</li>
    </ul>
    <p>Kaarten zijn aan de zaal verkrijgbaar of online te reserveren.</p>
  `,
  featuredImage: { node: { sourceUrl: 'https://picsum.photos/1200/600?random=1' } }
};

const MOCK_PAGES: Record<string, Page> = {
  'geschiedenis': {
    id: 'p1',
    slug: 'geschiedenis',
    title: 'Geschiedenis',
    content: `
      <h3>Een rijke historie</h3>
      <p>Muziekvereniging SDG Sint Jansklooster kent een lange en rijke geschiedenis. Opgericht in de naoorlogse jaren, is de vereniging uitgegroeid van een klein dorpsorkest tot een bloeiende vereniging die niet meer weg te denken is uit de regio.</p>
      <p>Door de jaren heen zijn er vele successen geboekt op concoursen en festivals. Maar het belangrijkste is altijd de verbinding gebleven die muziek brengt in ons dorp.</p>
    `,
    featuredImage: { node: { sourceUrl: 'https://picsum.photos/1200/500?random=10' } }
  },
  'identiteit': {
    id: 'p2',
    slug: 'identiteit',
    title: 'Identiteit',
    content: `
      <h3>Wie zijn wij?</h3>
      <p>Soli Deo Gloria is een christelijke muziekvereniging. Dit komt tot uiting in onze naam ('Alleen aan God de eer') en de manier waarop wij met elkaar omgaan. Respect, omzien naar elkaar en gezelligheid staan hoog in het vaandel.</p>
      <p>Wij zijn een open vereniging waar iedereen welkom is die muziek een warm hart toedraagt, ongeacht achtergrond of overtuiging.</p>
    `,
    featuredImage: { node: { sourceUrl: 'https://picsum.photos/1200/500?random=11' } }
  },
  'geledingen': {
    id: 'p3',
    slug: 'geledingen',
    title: 'Onze Geledingen',
    content: `
      <p>De vereniging bestaat uit meerdere onderdelen:</p>
      <ul>
        <li><strong>Fanfareorkest:</strong> Ons A-orkest dat uitkomt in de 3e divisie.</li>
        <li><strong>Slagwerkgroep:</strong> Een dynamische groep slagwerkers die zowel melodisch als ongestemd slagwerk bespeelt.</li>
        <li><strong>Jeugdorkest:</strong> De kweekvijver van onze vereniging.</li>
        <li><strong>Music Kids:</strong> Voor de allerjongsten om kennis te maken met muziek.</li>
      </ul>
    `,
    featuredImage: { node: { sourceUrl: 'https://picsum.photos/1200/500?random=12' } }
  },
  'organisatie': {
    id: 'p4',
    slug: 'organisatie',
    title: 'Organisatie & Bestuur',
    content: `
      <h3>Het Bestuur</h3>
      <p>De vereniging draait op vrijwilligers. Het dagelijks bestuur zorgt voor de algemene leiding.</p>
      <ul>
        <li>Voorzitter: [Naam]</li>
        <li>Secretaris: [Naam]</li>
        <li>Penningmeester: [Naam]</li>
      </ul>
      <h3>Commissies</h3>
      <p>Naast het bestuur zijn er diverse commissies actief voor o.a. jeugdwerk, concertorganisatie en muziekkeuze.</p>
    `,
    featuredImage: { node: { sourceUrl: 'https://picsum.photos/1200/500?random=13' } }
  },
  'repetities': {
    id: 'p5',
    slug: 'repetities',
    title: 'Repetities',
    content: `
      <h3>Kom eens luisteren!</h3>
      <p>Wij repeteren wekelijks in het dorpshuis van Sint Jansklooster.</p>
      <ul>
        <li><strong>Fanfareorkest:</strong> Dinsdagavond 19:30 - 21:45 uur</li>
        <li><strong>Slagwerkgroep:</strong> Donderdagavond 19:30 - 21:30 uur</li>
        <li><strong>Jeugdorkest:</strong> Dinsdagavond 18:30 - 19:15 uur</li>
      </ul>
      <p>Loop gerust eens binnen tijdens een repetitie om de sfeer te proeven.</p>
    `,
    featuredImage: { node: { sourceUrl: 'https://picsum.photos/1200/500?random=14' } }
  }
};

/**
 * Helper to fetch GraphQL data
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
      throw new Error('Failed to fetch GraphQL data');
    }
    return json.data;
  } catch (error) {
    console.warn('API fetch failed, returning mock data for demo purposes.', error);
    return null; // Signal to use mock data
  }
}

export async function getNewsPosts(): Promise<Post[]> {
  const query = `
    query GetNewsPosts {
      posts(first: 6) {
        nodes {
          id
          title
          date
          slug
          excerpt
          categories {
            nodes {
              name
              slug
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query);
  if (!data) return MOCK_POSTS;
  return data.posts.nodes;
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
  if (!data) return { ...MOCK_SINGLE_POST, title: `Mock Post: ${slug}` };
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
  
  if (!data) {
    // Return mock page if it exists in our mock dictionary
    if (MOCK_PAGES[slug]) {
      return MOCK_PAGES[slug];
    }
    // Fallback for unknown pages in demo mode
    return {
      id: 'mock-page',
      title: slug.charAt(0).toUpperCase() + slug.slice(1),
      slug: slug,
      content: '<p>Dit is een demo pagina. De content kan later via WordPress worden beheerd.</p>',
      featuredImage: { node: { sourceUrl: 'https://picsum.photos/1200/500?random=99' } }
    };
  }
  return data.page;
}