#!/usr/bin/env node
/**
 * Lille statisk server for build/ – så index.html og images/ kan åbnes over
 * http i stedet for file:// (billederne indlæses relativt).
 *
 *   node scripts/serve.js [port]      standard: 5180
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', 'build');
const PORT = Number(process.argv[2] || process.env.PORT || 5180);

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.txt': 'text/plain; charset=utf-8', '.csv': 'text/csv; charset=utf-8',
  '.cypher': 'text/plain; charset=utf-8', '.map': 'application/json',
};

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = path.join(ROOT, url === '/' ? 'index.html' : url);
  // Hold os inde i build/
  if (!path.resolve(file).startsWith(path.resolve(ROOT))) {
    res.writeHead(403).end('forbudt'); return;
  }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { 'content-type': 'text/plain' }).end('ikke fundet: ' + url); return; }
    res.writeHead(200, {
      'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-cache',
    });
    res.end(buf);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Filsofografen kører på http://127.0.0.1:${PORT}/`);
  console.log(`(serverer ${ROOT})`);
});
