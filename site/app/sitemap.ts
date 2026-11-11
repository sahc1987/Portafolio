import type { MetadataRoute } from 'next';
import { LOCALES } from '@/content/types';
import { SITE_URL, localePath } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    LOCALES.map((locale) => [locale, `${SITE_URL}${localePath(locale)}`]),
  );
  return LOCALES.map((locale) => ({
    url: `${SITE_URL}${localePath(locale)}`,
    changeFrequency: 'monthly',
    priority: locale === 'en' ? 1 : 0.9,
    alternates: { languages },
  }));
}
