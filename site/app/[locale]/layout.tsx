import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { getContent, otherLocale } from '@/content/get-content';
import { LOCALES } from '@/content/types';
import { UMAMI_SCRIPT_URL } from '@/lib/analytics';
import { SITE_URL, UMAMI_WEBSITE_ID, localePath } from '@/lib/site';
import { THEME_INIT_SCRIPT } from '@/lib/theme';
import { MotionObserver } from '@/components/ui/motion-observer';
import { inter, jetbrainsMono } from '../fonts';
import '@/styles/globals.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const { locale } = await params;
  const { ui, profile } = getContent(locale);
  const path = localePath(getContent(locale).locale);
  const alternate = otherLocale(getContent(locale).locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: ui.metaTitle,
    description: ui.metaDescription,
    authors: [{ name: profile.name, url: SITE_URL }],
    alternates: {
      canonical: path,
      languages: { [alternate]: localePath(alternate), [locale]: path, 'x-default': '/en/' },
    },
    openGraph: {
      type: 'profile',
      url: path,
      title: ui.metaTitle,
      description: ui.metaDescription,
      siteName: profile.name,
      locale: locale === 'es' ? 'es_SV' : 'en_US',
      images: [{ url: `/og-${locale}.png`, width: 1200, height: 630, alt: ui.metaTitle }],
    },
    twitter: { card: 'summary_large_image' },
    icons: { icon: '/favicon.svg' },
  };
}

export const viewport: Viewport = {
  themeColor: '#0b0b0e',
  colorScheme: 'dark light',
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const { ui } = getContent(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Sets a saved theme before first paint; hashed into the CSP at build time. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {UMAMI_WEBSITE_ID ? (
          <script defer src={UMAMI_SCRIPT_URL} data-website-id={UMAMI_WEBSITE_ID} />
        ) : null}
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-accent-strong px-4 py-2 font-semibold text-accent-contrast focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {ui.skipToContent}
        </a>
        {children}
        <MotionObserver />
      </body>
    </html>
  );
}
