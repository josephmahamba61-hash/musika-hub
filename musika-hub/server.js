const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

// Try to use express if available, otherwise fall back to a tiny static server
let serverStarted = false;
try {
  const express = require('express');
  const app = express();

  // Serve static files from project root
  app.use(express.static(path.join(__dirname)));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.get('/api/hello', (req, res) => {
    res.json({ message: 'Backend is running. AI integration coming soon!' });
  });

  app.listen(PORT, () => {
    console.log(`✅ Musika Hub server running at http://localhost:${PORT} (express)`);
  });
  serverStarted = true;
} catch (err) {
  // Express not available — use built-in http server
  const http = require('http');
  const mime = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml'
  };

  const server = http.createServer((req, res) => {
    try {
      let reqPath = decodeURIComponent(req.url.split('?')[0]);
      if (reqPath === '/') reqPath = '/index.html';
      const filePath = path.join(__dirname, reqPath.replace(/^\//, ''));
      if (!filePath.startsWith(__dirname)) {
        res.writeHead(400);
        return res.end('Bad request');
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('Not found');
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
        res.end(data);
      });
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error');
    }
  });

  server.listen(PORT, () => {
    console.log(`✅ Musika Hub static server running at http://localhost:${PORT} (no express)`);
  });
  serverStarted = true;
}

if (!serverStarted) {
  console.error('Failed to start server');
  process.exit(1);
}
