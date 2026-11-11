import type { ReactNode } from 'react';
import type { Content } from '@/content/types';
import { LINKS } from '@/content/shared';
import { EVENTS } from '@/lib/analytics';
import { GithubIcon, LinkedinIcon } from '@/components/ui/brand-icons';
import { ContactCtas } from '@/components/hero/contact-ctas';
import { NameMark } from './name-mark';

export function SiteFooter({ content }: { content: Content }) {
  const { ui, profile } = content;
  const quickLinks = [
    { href: '#about', label: ui.nav.about },
    { href: '#services', label: ui.nav.services },
    { href: '#projects', label: ui.nav.projects },
    { href: '#experience', label: ui.nav.experience },
    { href: '#skills', label: ui.nav.skills },
    { href: '#contact', label: ui.nav.contact },
  ] as const;

  return (
    <footer>
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="relative overflow-hidden border-t border-line bg-bg-deep py-16 text-center md:py-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(50% 80% at 50% 100%, var(--hero-glow), transparent 70%)',
          }}
        />
        <div className="container-page reveal relative">
          <p className="eyebrow mb-3">{ui.sections.contactEyebrow}</p>
          <h2 id="contact-title" className="text-h2 font-bold tracking-tight text-ink">
            {ui.sections.contact}
          </h2>
          <p className="mx-auto mt-3 max-w-[56ch] text-lg text-muted">{ui.sections.contactIntro}</p>
          <div className="mt-8 flex justify-center">
            <ContactCtas content={content} />
          </div>
        </div>
      </section>

      <div className="border-t border-line bg-bg">
        <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <NameMark name={profile.name} subtitle={profile.headline} />
            <p className="mt-4 max-w-[34ch] text-sm text-muted">{ui.footer.tagline}</p>
          </div>
          <nav aria-label={ui.footer.quickLinks}>
            <p className="eyebrow mb-4">{ui.footer.quickLinks}</p>
            <ul className="grid grid-cols-2 gap-x-6 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow mb-4">{ui.footer.follow}</p>
            <ul className="flex gap-2" aria-label={ui.footer.social}>
              <li>
                <SocialLink
                  href={profile.linkedinUrl}
                  label={ui.cta.linkedin}
                  event={EVENTS.linkedin}
                >
                  <LinkedinIcon size={18} />
                </SocialLink>
              </li>
              <li>
                <SocialLink href={profile.githubUrl} label={ui.cta.github} event={EVENTS.github}>
                  <GithubIcon size={18} />
                </SocialLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-line">
          <p className="container-page py-6 text-center text-sm text-muted">
            © {new Date().getFullYear()} {profile.name}. {ui.footer.builtWith}{' '}
            <a
              href={LINKS.portfolioRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-line underline-offset-4 hover:text-accent"
            >
              {ui.footer.source}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  event,
  children,
}: {
  href: string;
  label: string;
  event: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-umami-event={event}
      className="inline-flex size-11 items-center justify-center rounded-md border border-line text-ink transition-colors hover:border-accent hover:text-accent"
    >
      {children}
    </a>
  );
}
