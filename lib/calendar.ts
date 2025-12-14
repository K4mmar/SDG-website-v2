import ICAL from 'ical.js';

const CALENDAR_URL = 'https://calendar.google.com/calendar/ical/webmaster@sdgsintjansklooster.nl/public/basic.ics';

export interface CalendarEvent {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  isRecurring?: boolean;
}

// Helper to simulate Promise.any behavior since it might not be available in the TS target
function promiseAny<T>(promises: Promise<T>[]): Promise<T> {
  return new Promise((resolve, reject) => {
    let errors: any[] = [];
    let pending = promises.length;

    if (pending === 0) {
      reject(new Error("No promises passed"));
      return;
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(
        (value) => {
          resolve(value);
        },
        (error) => {
          errors[index] = error;
          pending--;
          if (pending === 0) {
            reject(new Error(`All promises rejected: ${errors.map(e => String(e)).join(', ')}`));
          }
        }
      );
    });
  });
}

/**
 * Robust fetch strategy for the ICS file using PARALLEL proxies.
 * Instead of waiting for one to fail before trying the next, we race them.
 * The first one to return 200 OK wins.
 */
async function fetchICS(url: string): Promise<string> {
  // CACHE STRATEGY: 
  // Instead of Date.now() (which forces a new fetch every ms), 
  // we round to the nearest 10 minutes. This allows proxies to cache the result 
  // for a short time, making subsequent loads instant for other users.
  const cacheWindow = 600000; // 10 minutes in ms
  const timestamp = Math.floor(Date.now() / cacheWindow); 
  const urlWithCache = `${url}?t=${timestamp}`;

  // Define the proxy strategies
  const strategies = [
    // 1. CorsProxy.io (Usually fast)
    {
      name: 'CorsProxy',
      url: `https://corsproxy.io/?${encodeURIComponent(urlWithCache)}`
    },
    // 2. AllOrigins (Reliable backup)
    {
      name: 'AllOrigins',
      url: `https://api.allorigins.win/raw?url=${encodeURIComponent(urlWithCache)}`
    },
    // 3. CodeTabs (Fallback)
    {
      name: 'CodeTabs',
      url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(urlWithCache)}`
    }
  ];

  // Map strategies to fetch promises
  const promises = strategies.map(async (strategy) => {
    try {
      const res = await fetch(strategy.url);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const text = await res.text();
      if (!text.includes('BEGIN:VCALENDAR')) throw new Error('Invalid ICS data');
      return text;
    } catch (e) {
      // Re-throw so our polyfill knows this specific one failed
      throw new Error(`${strategy.name} failed: ${e}`);
    }
  });

  try {
    // Promise.any waits for the FIRST successful promise.
    // using custom implementation to avoid TS lib issues
    return await promiseAny(promises);
  } catch (error) {
    console.error("All calendar proxies failed.", error);
    throw new Error("Kan agenda niet ophalen via beschikbare verbindingen.");
  }
}

export async function getUpcomingEvents(): Promise<CalendarEvent[]> {
  try {
    const icsData = await fetchICS(CALENDAR_URL);
    
    // Parse the ICS data
    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');

    const now = new Date();
    // Reset 'now' to start of today to ensure we don't miss events happening later today
    now.setHours(0, 0, 0, 0);

    const futureLimit = new Date();
    futureLimit.setFullYear(now.getFullYear() + 1); // Fetch 1 year ahead

    const events: CalendarEvent[] = [];

    vevents.forEach((vevent) => {
      const event = new ICAL.Event(vevent);
      const summary = event.summary;
      const description = event.description;
      const location = event.location;
      
      if (!event.startDate) return;

      const allDay = event.startDate.isDate; 

      if (event.isRecurring()) {
        // Handle Recurring Events
        const iterator = event.iterator();
        let next;
        
        // Safety limit to prevent infinite loops in bad ICS data
        let loopCount = 0;
        const maxLoops = 500;

        while ((next = iterator.next()) && loopCount < maxLoops) {
          loopCount++;
          
          const start = next.toJSDate();
          
          // If this specific occurrence starts after our limit, stop checking this event
          if (start > futureLimit) break;

          // Calculate End Date for this occurrence
          let end = start;
          if (event.duration) {
             end = new Date(start.getTime() + (event.duration.toSeconds() * 1000));
          } else if (event.endDate) {
             const originalDuration = event.endDate.toJSDate().getTime() - event.startDate.toJSDate().getTime();
             end = new Date(start.getTime() + originalDuration);
          }

          // If the event ends in the future (or today), add it
          if (end >= now) {
             events.push({
               uid: `${event.uid}-${start.toISOString()}`, // Unique ID for React Key
               title: summary,
               description,
               location,
               start,
               end,
               allDay,
               isRecurring: true
             });
          }
        }

      } else {
        // Handle Single (Non-Recurring) Events
        const start = event.startDate.toJSDate();
        const end = event.endDate ? event.endDate.toJSDate() : start;
        
        if (end >= now && start <= futureLimit) {
            events.push({
                uid: event.uid,
                title: summary,
                description,
                location,
                start,
                end,
                allDay,
                isRecurring: false
            });
        }
      }
    });

    // Sort by start date and limit to 10 items
    return events
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 10);

  } catch (error) {
    console.error('Error fetching/parsing calendar:', error);
    return [];
  }
}