const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = parseInt(process.env.PORT, 10) || 5173;

// Resolve to dist/apps/web regardless of whether run from root or apps/web
const DIST_DIR = fs.existsSync(path.join(__dirname, 'dist', 'apps', 'web'))
  ? path.join(__dirname, 'dist', 'apps', 'web')
  : path.join(__dirname, 'apps', 'web', 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.txt': 'text/plain; charset=UTF-8',
  '.csv': 'text/csv; charset=UTF-8',
  '.zip': 'application/zip',
};

const server = http.createServer(async (req, res) => {
  // Strip query string
  const urlPath = req.url.split('?')[0];

  // Handle CORS Preflight
  if (req.method === 'OPTIONS' && urlPath.startsWith('/api/')) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // Handle /api/network-ip GET
  if (req.method === 'GET' && urlPath === '/api/network-ip') {
    let networkIp = '10.152.24.187';
    try {
      const interfaces = os.networkInterfaces();
      for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
          if (iface.family === 'IPv4' && !iface.internal) {
            networkIp = iface.address;
            break;
          }
        }
      }
    } catch (e) {}
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    return;
  }

  // Handle /api/contact POST
  if (req.method === 'POST' && urlPath === '/api/contact') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
      if (body.length > 1e6) req.connection.destroy();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const { name, email, subject, message } = data;

        if (!name || !email || !message) {
          res.writeHead(400, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify({ success: false, message: 'Name, email, and message are required.' }));
          return;
        }

        const newLead = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          name: name.trim(),
          email: email.trim(),
          subject: (subject || 'No Subject').trim(),
          message: message.trim(),
        };

        const leadsFile = path.join(__dirname, 'leads.json');
        let leads = [];
        if (fs.existsSync(leadsFile)) {
          try {
            leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8') || '[]');
          } catch (e) {
            leads = [];
          }
        }
        leads.unshift(newLead);
        fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2), 'utf8');

        // Dispatch Email directly to user inbox
        try {
          const emailPayload = JSON.stringify({
            name: newLead.name,
            email: newLead.email,
            _subject: `[QRHub Inquiry] ${newLead.subject} (from ${newLead.name})`,
            message: newLead.message,
            _cc: 'm.quddous7271@gmail.com',
            _template: 'table',
            _captcha: 'false',
          });

          const postReq = https.request('https://formsubmit.co/ajax/m.quddous7172@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Content-Length': Buffer.byteLength(emailPayload),
            },
          }, (postRes) => {
            let resData = '';
            postRes.on('data', chunk => resData += chunk);
            postRes.on('end', () => {
              console.log(`  📧 [Email Dispatched to m.quddous7172@gmail.com]: Status ${postRes.statusCode}`);
            });
          });
          postReq.on('error', (e) => console.log('  ⚠️ Email dispatch error:', e.message));
          postReq.write(emailPayload);
          postReq.end();
        } catch (mailErr) {
          console.log('  ⚠️ Email dispatch exception:', mailErr.message);
        }

        console.log(`\n==================================================`);
        console.log(`  📩 [NEW CONTACT FORM INQUIRY RECEIVED!]`);
        console.log(`  👤 From:    ${newLead.name} (${newLead.email})`);
        console.log(`  📌 Subject: ${newLead.subject}`);
        console.log(`  💬 Message: ${newLead.message}`);
        console.log(`  🕒 Time:    ${new Date().toLocaleString()}`);
        console.log(`  💾 Saved into leads.json (Total leads: ${leads.length})`);
        console.log(`  ✉️ Forwarded directly to: m.quddous7172@gmail.com`);
        console.log(`==================================================\n`);

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({
          success: true,
          message: 'Thank you! Your message has been received.',
          id: newLead.id,
        }));
      } catch (err) {
        console.error('Error handling contact submission:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({ success: false, message: 'Server error processing message.' }));
      }
    });
    return;
  }

  // Strip leading slashes to prevent Windows path.join absolute drive resolution
  const relativePath = decodeURIComponent(urlPath).replace(/^[/\\]+/, '');

  let targetFile = path.join(DIST_DIR, relativePath);
  if (relativePath.startsWith('uploads') && !fs.existsSync(targetFile)) {
    targetFile = path.join(__dirname, relativePath);
  }

  fs.stat(targetFile, (err, stats) => {
    if (!err && stats.isDirectory()) {
      targetFile = path.join(targetFile, 'index.html');
    }

    fs.readFile(targetFile, (readErr, data) => {
      if (!readErr) {
        const ext = path.extname(targetFile).toLowerCase();
        const mime = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, {
          'Content-Type': mime,
          'Cache-Control': 'no-cache',
        });
        res.end(data);
        console.log(`[200] ${req.method} ${req.url} -> ${path.basename(targetFile)} (${mime})`);
        return;
      }

      // If it looks like a static asset file that doesn't exist (e.g. .svg, .ico), 404
      const ext = path.extname(relativePath).toLowerCase();
      if (ext && ext !== '.html') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        console.log(`[404] ${req.method} ${req.url}`);
        return;
      }

      // SPA client-side routing fallback: serve index.html for page routes
      const indexHtml = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexHtml, (spaErr, indexData) => {
        if (spaErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error: index.html not found in ' + DIST_DIR);
          console.error(`[500] Missing index.html: ${indexHtml}`);
          return;
        }
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=UTF-8',
          'Cache-Control': 'no-cache',
        });
        res.end(indexData);
        console.log(`[200 SPA] ${req.method} ${req.url} -> index.html`);
      });
    });
  });
});

function start(portToTry) {
  server.listen(portToTry, () => {
    console.log(`\n==================================================`);
    console.log(`  🚀 QR SaaS Application is running locally!`);
    console.log(`  👉 URL:  http://localhost:${portToTry}`);
    console.log(`==================================================\n`);
    console.log(`Press Ctrl + C to stop the server.\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${portToTry} in use, trying port ${portToTry + 1}...`);
      start(portToTry + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

start(PORT);
