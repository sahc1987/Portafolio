import type { Metadata } from 'next';
import Link from 'next/link';
import { THEME_INIT_SCRIPT } from '@/lib/theme';
import { inter, jetbrainsMono } from './fonts';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Page not found · Saúl Hernández',
  robots: { index: false },
  icons: { icon: '/favicon.svg' },
};

/** Exported as 404.html; CloudFront serves it for any 403/404 from S3. Bilingual on purpose. */
export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <main className="container-page grid min-h-screen content-center py-16">
          <p className="eyebrow mb-3">404</p>
          <h1 className="text-h2 font-bold tracking-tight text-ink">Page not found</h1>
          <p lang="es" className="mt-1 text-lg text-muted">
            Página no encontrada
          </p>
          <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/en/"
              className="inline-flex min-h-11 items-center font-semibold text-accent hover:text-accent-hover"
            >
              Go to the homepage
            </Link>
            <Link
              href="/es/"
              lang="es"
              className="inline-flex min-h-11 items-center font-semibold text-accent hover:text-accent-hover"
            >
              Ir al inicio
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
