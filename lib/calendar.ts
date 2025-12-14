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

/**
 * Robust fetch strategy for the ICS file using multiple proxies.
 * Mobile networks and browser security settings often block simple CORS requests.
 */
async function fetchICS(url: string): Promise<string> {
  const urlWithCache = `${url}?nocache=${Date.now()}`;
  let lastError;

  // STRATEGY 1: CorsProxy.io
  // Usually the fastest. Note: Requires encoded URL.
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(urlWithCache)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) return await res.text();
    lastError = `CorsProxy failed: ${res.status} ${res.statusText}`;
  } catch (e) {
    lastError = `CorsProxy error: ${e}`;
  }

  // STRATEGY 2: AllOrigins
  // Very reliable backup.
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlWithCache)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) return await res.text();
    lastError = `AllOrigins failed: ${res.status} ${res.statusText}`;
  } catch (e) {
    lastError = `AllOrigins error: ${e}`;
  }

  // STRATEGY 3: CodeTabs
  // Another fallback.
  try {
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(urlWithCache)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) return await res.text();
    lastError = `CodeTabs failed: ${res.status} ${res.statusText}`;
  } catch (e) {
    lastError = `CodeTabs error: ${e}`;
  }

  throw new Error(`Unable to fetch calendar data. All proxies failed. Last error: ${lastError}`);
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