import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

interface CfRequest {
  uri: string;
  headers: Record<string, { value: string }>;
}
interface CfResponse {
  statusCode: number;
  headers: Record<string, { value: string }>;
}

const { handler, pickLocale } = createRequire(__filename)('../functions/viewer-request.js') as {
  handler: (event: { request: CfRequest }) => CfRequest | CfResponse;
  pickLocale: (value: string) => 'en' | 'es';
};

function run(uri: string, headers: Record<string, string> = {}) {
  const request: CfRequest = {
    uri,
    headers: Object.fromEntries(
      Object.entries({ host: 'saulhernandez.dev', ...headers }).map(([k, v]) => [k, { value: v }]),
    ),
  };
  return handler({ request });
}

describe('pickLocale', () => {
  it.each([
    ['es-SV,es;q=0.9,en;q=0.8', 'es'],
    ['ES', 'es'],
    ['en-US,es;q=0.9', 'en'],
    ['fr-FR', 'en'],
    ['', 'en'],
  ])('%s → %s', (header, expected) => {
    expect(pickLocale(header)).toBe(expected);
  });
});

describe('viewer request', () => {
  it('redirects / by language', () => {
    expect(run('/', { 'accept-language': 'es-SV,es;q=0.9' })).toMatchObject({
      statusCode: 302,
      headers: { location: { value: '/es/' }, 'cache-control': { value: 'no-store' } },
    });
    expect(run('/')).toMatchObject({ statusCode: 302, headers: { location: { value: '/en/' } } });
  });

  it('sends www to the apex', () => {
    expect(run('/es/', { host: 'www.saulhernandez.dev' })).toMatchObject({
      statusCode: 301,
      headers: { location: { value: 'https://saulhernandez.dev/es/' } },
    });
  });

  it('serves index.html for directories and adds missing slashes', () => {
    expect(run('/en/')).toMatchObject({ uri: '/en/index.html' });
    expect(run('/en')).toMatchObject({ statusCode: 301, headers: { location: { value: '/en/' } } });
  });

  it('passes files through untouched', () => {
    expect(run('/cv/CV_Saul_Hernandez_EN.pdf')).toMatchObject({
      uri: '/cv/CV_Saul_Hernandez_EN.pdf',
    });
    expect(run('/_next/static/chunks/a.js')).toMatchObject({ uri: '/_next/static/chunks/a.js' });
  });
});
