import type { Content } from '@/content/types';
import { otherLocale } from '@/content/get-content';
import { EVENTS } from '@/lib/analytics';
import { localePath, mailtoHref } from '@/lib/site';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { NameMark } from './name-mark';

export function SiteHeader({ content }: { content: Content }) {
  const { ui, locale, profile } = content;
  const target = otherLocale(locale);
  const links = [
    { href: '#about', label: ui.nav.about },
    { href: '#services', label: ui.nav.services },
    { href: '#projects', label: ui.nav.projects },
    { href: '#experience', label: ui.nav.experience },
    { href: '#skills', label: ui.nav.skills },
    { href: '#contact', label: ui.nav.contact },
  ] as const;

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        aria-hidden="true"
        className="header-fill absolute inset-0 border-b border-line bg-[var(--header-bg)] backdrop-blur-md"
      />
      <div className="container-page relative flex h-16 items-center gap-3 md:h-20 lg:gap-8">
        <a href={localePath(locale)} className="shrink-0 rounded-md">
          <NameMark name={profile.name} subtitle={profile.headline} />
        </a>
        <nav aria-label={ui.nav.label} className="ml-auto hidden min-w-0 overflow-x-auto lg:block">
          <ul className="flex gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative inline-flex min-h-11 items-center rounded-md px-3 text-xs font-semibold tracking-[0.08em] text-muted uppercase transition-colors after:absolute after:inset-x-3 after:bottom-2 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform hover:text-ink hover:after:scale-x-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-1 lg:ml-0">
          <LanguageToggle
            href={localePath(target)}
            targetLocale={target}
            label={ui.language.switchTo}
            short={ui.language.short}
          />
          <ThemeToggle toLightLabel={ui.theme.toLight} toDarkLabel={ui.theme.toDark} />
          <a
            href={mailtoHref(profile.email)}
            data-umami-event={EVENTS.email}
            className="ml-1 hidden min-h-11 items-center rounded-full border border-accent px-5 text-xs font-semibold tracking-[0.08em] text-accent uppercase transition-colors hover:bg-accent-strong hover:text-accent-contrast sm:inline-flex"
          >
            {ui.nav.hireMe}
          </a>
        </div>
      </div>
    </header>
  );
}
