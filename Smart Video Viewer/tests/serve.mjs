import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(process.argv[2] || '.');
const mime = { '.html': 'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.mp4':'video/mp4', '.png':'image/png' };
http.createServer((req,res) => {
  let filename;
  try { filename = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname)); } catch { res.writeHead(400).end(); return; }
  if (!filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  let stat; try { stat = fs.statSync(filename); if (!stat.isFile()) throw Error(); } catch { res.writeHead(404).end(); return; }
  const headers = { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream', 'Accept-Ranges':'bytes', 'Cache-Control':'no-store' };
  const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  let start = 0, end = stat.size - 1;
  if (range) { start = Number(range[1]); end = range[2] ? Math.min(Number(range[2]), end) : end; }
  if (start > end) { res.writeHead(416, {'Content-Range': `bytes */${stat.size}`}).end(); return; }
  if (range) headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
  headers['Content-Length'] = end - start + 1; res.writeHead(range ? 206 : 200, headers);
  if (req.method === 'HEAD') res.end(); else fs.createReadStream(filename, {start,end}).pipe(res);
}).listen(8766, '127.0.0.1', () => console.log('Local test fixture ready on 127.0.0.1:8766'));
