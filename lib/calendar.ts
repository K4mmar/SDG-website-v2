
import ICAL from 'ical.js';

const CALENDAR_URL = 'https://calendar.google.com/calendar/ical/webmaster@sdgsintjansklooster.nl/public/basic.ics';

/**
 * SDG Agenda Fetcher met Triple Fallback.
 */
async function fetchCalendarData(): Promise<string> {
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(CALENDAR_URL)}`,
    `https://corsproxy.io/?${encodeURIComponent(CALENDAR_URL)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(CALENDAR_URL)}`
  ];

  const fetchWithTimeout = async (url: string, timeout = 5000): Promise<string> => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      
      if (response.ok) {
        const text = await response.text();
        if (text.includes('BEGIN:VCALENDAR')) {
          console.log(`SDG-Agenda: Succesvol geladen via ${url.split('/')[2]}`);
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
    // Start alle proxy aanvragen tegelijk (in parallel)
    // Promise.any retourneert de eerste die succesvol afrondt.
    // Dit voorkomt dat je moet wachten op een trage server als een andere sneller is.
    const result = await Promise.any(proxies.map(url => fetchWithTimeout(url, 8000)));
    return result;
  } catch (error) {
    throw new Error('Geen enkele proxy kon de agenda laden. Controleer de internetverbinding of de URL.');
  }
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
}

let cachedEvents: CalendarEvent[] | null = null;
let cachedEventsPromise: Promise<CalendarEvent[]> | null = null;

export async function getUpcomingEvents(): Promise<CalendarEvent[]> {
  if (cachedEvents) return cachedEvents;
  if (cachedEventsPromise) return cachedEventsPromise;

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

        if (event.isRecurring()) {
          const iterator = event.iterator();
          let next;
          let count = 0;
          while ((next = iterator.next()) && count < 30) {
            count++;
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
                isRecurring: true
              });
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
              isRecurring: false
            });
          }
        }
      });

      cachedEvents = events.sort((a, b) => a.start.getTime() - b.start.getTime()).slice(0, 10);
      return cachedEvents;
    } catch (error) {
      console.error("SDG-Agenda Kritieke Fout:", error);
      cachedEvents = [];
      return cachedEvents;
    }
  })();
  
  return cachedEventsPromise;
}
