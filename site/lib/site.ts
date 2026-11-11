import type { Locale } from '@/content/types';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saulhernandez.dev').replace(
  /\/$/,
  '',
);

export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? '';

export function localePath(locale: Locale): `/${Locale}/` {
  return `/${locale}/`;
}

export function mailtoHref(email: string): string {
  return `mailto:${email}`;
}

export function whatsappHref(number: string): string {
  return `https://wa.me/${number}`;
}
