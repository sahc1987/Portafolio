// Post-build: adds a hash-based CSP <meta> to every exported HTML page.
// Usage: node scripts/csp-hashes.mjs <out-dir>
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { injectCsp } from './csp.mjs';

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

const outDir = process.argv[2];
if (!outDir) {
  console.error('Usage: node scripts/csp-hashes.mjs <out-dir>');
  process.exit(1);
}

const analytics = Boolean(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID);
const files = await htmlFiles(outDir);
for (const file of files) {
  const html = await readFile(file, 'utf8');
  await writeFile(file, injectCsp(html, { analytics }));
}
console.log(`CSP added to ${files.length} HTML files (analytics: ${analytics ? 'on' : 'off'})`);
