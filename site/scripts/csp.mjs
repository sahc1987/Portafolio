import { createHash } from 'node:crypto';

// ponytail: regex, not an HTML parser. Fine for Next's generated markup; use a parser if hand-written HTML with "</script>" in strings ever lands in out/.
const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi;

const UMAMI_SCRIPT_ORIGIN = 'https://cloud.umami.is';
// Umami Cloud's collector; verify against network requests after enabling analytics.
const UMAMI_CONNECT_ORIGINS = ['https://cloud.umami.is', 'https://api-gateway.umami.dev'];

/** sha256 source expressions for every non-empty inline script in an HTML document. */
export function inlineScriptHashes(html) {
  const hashes = new Set();
  for (const match of html.matchAll(INLINE_SCRIPT)) {
    const body = match[1] ?? '';
    if (body.length === 0) continue;
    hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
  }
  return [...hashes];
}

export function buildCsp(hashes, { analytics = false } = {}) {
  const scriptSrc = ["'self'", ...hashes, ...(analytics ? [UMAMI_SCRIPT_ORIGIN] : [])];
  const connectSrc = ["'self'", ...(analytics ? UMAMI_CONNECT_ORIGINS : [])];
  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src ${connectSrc.join(' ')}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}

/** Inserts the CSP meta tag as the first element of <head>, before any script runs. */
export function injectCsp(html, options) {
  if (html.includes('http-equiv="Content-Security-Policy"')) {
    throw new Error('CSP meta tag already present');
  }
  const csp = buildCsp(inlineScriptHashes(html), options);
  const tag = `<meta http-equiv="Content-Security-Policy" content="${csp}"/>`;
  const headOpen = /<head[^>]*>/i.exec(html);
  if (!headOpen) throw new Error('No <head> element found');
  const at = headOpen.index + headOpen[0].length;
  return html.slice(0, at) + tag + html.slice(at);
}
