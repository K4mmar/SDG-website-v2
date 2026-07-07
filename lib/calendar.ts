
import ICAL from 'ical.js';

const CALENDAR_URL = 'https://calendar.google.com/calendar/ical/webmastersdgsintjansklooster@gmail.com/public/basic.ics';

/**
 * SDG Agenda Fetcher
 */
async function fetchCalendarData(): Promise<string> {
  const targetUrl = '/api/calendar'; // Handles CORS via Netlify _redirects or local Express proxy
  
  const fetchWithTimeout = async (url: string, timeout = 10000): Promise<string> => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      
      if (response.ok) {
        const text = await response.text();
        if (text.includes('BEGIN:VCALENDAR')) {
          return text;
        }
      }
      throw new Error(`Ongeldige data of fout via ${url}`);
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  };

  try {
    const result = await fetchWithTimeout(targetUrl, 5000);
    
    // Save backup to localStorage
    try {
      localStorage.setItem('sdg_agenda_backup', result);
      localStorage.setItem('sdg_agenda_backup_time', Date.now().toString());
    } catch (e) {
      // Ignore quota exceeded errors
    }
    
    return result;
  } catch (error) {
    // Fallback to localStorage if fetch fails
    try {
      const backup = localStorage.getItem('sdg_agenda_backup');
      if (backup && backup.includes('BEGIN:VCALENDAR')) {
        console.warn('Gebruikmakend van offline/cache backup voor agenda');
        return backup;
      }
    } catch (e) {
      // Ignore localStorage errors
    }
    
    throw new Error('De agenda URL (Google Calendar) is onbereikbaar of bestaat niet meer (404). Controleer of de kalender nog openbaar is.');
  }
}

export interface CalendarAttachment {
  url: string;
  filename?: string;
  type?: string;
}

export interface CalendarEvent {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  isRecurring?: boolean;
  attachments?: CalendarAttachment[];
}

let cachedEvents: CalendarEvent[] | null = null;
let cachedEventsPromise: Promise<CalendarEvent[]> | null = null;
let lastFetchTime = 0;

export async function getUpcomingEvents(): Promise<CalendarEvent[]> {
  const CACHE_TTL = 5 * 60 * 1000; // 5 minuten
  const nowTime = Date.now();

  if (cachedEvents && (nowTime - lastFetchTime < CACHE_TTL)) {
    return cachedEvents;
  }
  
  if (cachedEventsPromise) {
    return cachedEventsPromise;
  }

  cachedEventsPromise = (async () => {
    try {
      const icsData = await fetchCalendarData();
      const jcalData = ICAL.parse(icsData);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents('vevent');
      
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const futureLimit = new Date();
      futureLimit.setFullYear(now.getFullYear() + 1);

      const events: CalendarEvent[] = [];

      vevents.forEach((vevent) => {
        const event = new ICAL.Event(vevent);
        if (!event.startDate) return;

        const summary = event.summary;
        const description = event.description;
        const location = event.location;
        const allDay = event.startDate.isDate;

        const attachProps = vevent.getAllProperties('attach');
        const attachments: CalendarAttachment[] = attachProps.map((prop: any) => {
          const url = prop.getFirstValue();
          if (!url || typeof url !== 'string') return null;
          return {
            url,
            filename: prop.getParameter('filename') || 'Bijlage',
            type: prop.getParameter('fmttype') || 'unknown'
          };
        }).filter(Boolean);

        if (event.isRecurring()) {
          const iterator = event.iterator();
          let next;
          let addedCount = 0;
          let safetyLimit = 0;
          while ((next = iterator.next()) && addedCount < 30 && safetyLimit < 50000) {
            safetyLimit++;
            const start = next.toJSDate();
            if (start > futureLimit) break;
            
            let end = start;
            if (event.duration) {
              end = new Date(start.getTime() + (event.duration.toSeconds() * 1000));
            } else if (event.endDate) {
              const duration = event.endDate.toJSDate().getTime() - event.startDate.toJSDate().getTime();
              end = new Date(start.getTime() + duration);
            }

            if (end >= now) {
              events.push({
                uid: `${event.uid}-${start.toISOString()}`,
                title: summary,
                description,
                location,
                start,
                end,
                allDay,
                isRecurring: true,
                attachments
              });
              addedCount++;
            }
          }
        } else {
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
              isRecurring: false,
              attachments
            });
          }
        }
      });

      cachedEvents = events.sort((a, b) => a.start.getTime() - b.start.getTime()).slice(0, 20);
      lastFetchTime = Date.now();
      cachedEventsPromise = null;
      return cachedEvents;
    } catch (error) {
      console.error("SDG-Agenda Kritieke Fout:", error);
      cachedEventsPromise = null;
      throw error;
    }
  })();
  
  return cachedEventsPromise;
}
