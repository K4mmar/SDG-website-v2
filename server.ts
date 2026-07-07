import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import https from "https";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API route to proxy the calendar
  app.get("/api/calendar", (req, res) => {
    const calendarUrl = "https://calendar.google.com/calendar/ical/webmastersdgsintjansklooster@gmail.com/public/basic.ics";
    
    https.get(calendarUrl, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    }).on('error', (err) => {
      console.error("Calendar Proxy Error:", err);
      res.status(500).send("Proxy error");
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the dist folder
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
