import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Saúl Hernández',
  robots: { index: false },
};

// Mirrors the CloudFront Function rule (top language starts with "es" → /es/), for local dev only.
const REDIRECT_SCRIPT =
  "(function(){var l=((navigator.languages&&navigator.languages[0])||navigator.language||'').toLowerCase();location.replace(l.indexOf('es')===0?'/es/':'/en/')})();";

export default function RootRedirectPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
      <p>
        <Link href="/en/">English</Link> · <Link href="/es/">Español</Link>
      </p>
    </>
  );
}
