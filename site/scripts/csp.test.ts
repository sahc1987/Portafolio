import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { buildCsp, injectCsp, inlineScriptHashes } from './csp.mjs';

const sha = (body: string) =>
  `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`;

describe('inlineScriptHashes', () => {
  it('hashes inline scripts and skips external and empty ones', () => {
    const html =
      '<script>a()</script><script src="/x.js"></script><script async src="/y.js"></script><script></script><script type="module">b()</script><script>a()</script>';
    expect(inlineScriptHashes(html)).toEqual([sha('a()'), sha('b()')]);
  });
});

describe('buildCsp', () => {
  it('is strict without analytics', () => {
    const csp = buildCsp(["'sha256-x'"]);
    expect(csp).toContain("script-src 'self' 'sha256-x'");
    expect(csp).toContain("connect-src 'self';");
    expect(csp).not.toContain('umami');
    expect(csp).not.toContain("'unsafe-inline' ;");
    expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/);
  });

  it('allows Umami only when analytics is on', () => {
    const csp = buildCsp([], { analytics: true });
    expect(csp).toMatch(/script-src 'self' https:\/\/cloud\.umami\.is/);
    expect(csp).toMatch(/connect-src 'self' https:\/\/cloud\.umami\.is/);
  });
});

describe('injectCsp', () => {
  it('puts the meta tag first in <head>', () => {
    const out = injectCsp('<html><head><meta charset="utf-8"><script>x()</script></head></html>');
    expect(out).toMatch(
      /^<html><head><meta http-equiv="Content-Security-Policy" content="[^"]+"\/><meta charset/,
    );
    expect(out).toContain(sha('x()'));
  });

  it('refuses to run twice or without a head', () => {
    const once = injectCsp('<html><head></head></html>');
    expect(() => injectCsp(once)).toThrow('already present');
    expect(() => injectCsp('<html><body></body></html>')).toThrow('No <head>');
  });
});
