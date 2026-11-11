import { en } from './en';
import { es } from './es';
import { LOCALES, type Content, type Locale } from './types';

const CONTENT: Readonly<Record<Locale, Content>> = { en, es };

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getContent(locale: string): Content {
  if (!isLocale(locale)) {
    throw new Error(`Unknown locale "${locale}"`);
  }
  return CONTENT[locale];
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'es' : 'en';
}
