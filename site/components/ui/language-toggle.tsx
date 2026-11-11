'use client';

import type { MouseEvent } from 'react';
import type { Locale } from '@/content/types';
import { EVENTS } from '@/lib/analytics';

interface LanguageToggleProps {
  href: string;
  targetLocale: Locale;
  label: string;
  short: string;
}

/** Keeps the reader on the same section (#hash) when switching language. */
export function LanguageToggle({ href, targetLocale, label, short }: LanguageToggleProps) {
  function keepSection(event: MouseEvent<HTMLAnchorElement>) {
    const { hash } = window.location;
    if (hash) event.currentTarget.href = `${href}${hash}`;
  }

  return (
    <a
      href={href}
      hrefLang={targetLocale}
      lang={targetLocale}
      aria-label={label}
      data-umami-event={EVENTS.languageSwitch}
      onClick={keepSection}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-line px-3 font-mono text-mono-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
    >
      {short}
    </a>
  );
}
