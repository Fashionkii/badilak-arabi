'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const handler = require('../api/studio');
const root = path.join(__dirname, '../dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain' };
module.exports = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (['/admin', '/admin/studio', '/api/studio'].includes(url.pathname)) return handler(req, res);
  let rel;
  try { rel = decodeURIComponent(url.pathname); } catch { res.writeHead(400).end(); return; }
  let file = path.join(root, rel === '/' ? 'index.html' : rel);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(file) && !path.extname(file)) file += '.html';
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end('Not found'); return; }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
}).listen(Number(process.env.PORT || 4173), '0.0.0.0', () => console.log('Studio development server ready.'));
