// ponytail: tiny static server for preview and E2E only, mirrors CloudFront routing (dir → index.html, else 404.html).
// No caching, ranges or compression; swap for a real server only if local perf testing ever matters.
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

const ROOT = path.resolve('out');
const PORT = Number(process.env.PORT ?? 4173);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
};

async function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0] ?? '/');
  let file = path.join(ROOT, decoded);
  if (!file.startsWith(ROOT)) return null;
  if (decoded.endsWith('/')) file = path.join(file, 'index.html');
  try {
    const info = await stat(file);
    return info.isFile() ? file : null;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const file = await resolveFile(req.url ?? '/');
  const target = file ?? path.join(ROOT, '404.html');
  res.writeHead(file ? 200 : 404, {
    'Content-Type': TYPES[path.extname(target)] ?? 'application/octet-stream',
  });
  createReadStream(target).pipe(res);
}).listen(PORT, () => console.log(`Serving ${ROOT} on http://localhost:${PORT}`));
