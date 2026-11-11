import type { DateStamp, Locale } from '@/content/types';

const INTL_LOCALE: Readonly<Record<Locale, string>> = { en: 'en-US', es: 'es-SV' };

/** "2020-10" → "Oct 2020" / "oct 2020"; "2023" stays "2023". */
export function formatDateStamp(stamp: DateStamp, locale: Locale): string {
  const [year, month] = stamp.split('-').map(Number);
  if (year === undefined || Number.isNaN(year)) {
    throw new Error(`Invalid date stamp "${stamp}"`);
  }
  if (month === undefined) {
    return String(year);
  }
  // UTC noon avoids the date shifting a month in negative-offset time zones.
  const date = new Date(Date.UTC(year, month - 1, 15, 12));
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
    .format(date)
    .replace('.', '');
}

export function formatRange(
  start: DateStamp,
  end: DateStamp | null,
  locale: Locale,
  presentLabel: string,
): string {
  const endLabel = end === null ? presentLabel : formatDateStamp(end, locale);
  return `${formatDateStamp(start, locale)} – ${endLabel}`;
}
