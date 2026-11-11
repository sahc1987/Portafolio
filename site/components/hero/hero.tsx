import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import type { Content } from '@/content/types';
import { EVENTS } from '@/lib/analytics';
import { mailtoHref } from '@/lib/site';
import { GithubIcon, LinkedinIcon } from '@/components/ui/brand-icons';
import { HeroPortrait } from './hero-portrait';

function step(i: number): CSSProperties {
  return { '--i': i } as CSSProperties;
}

export function Hero({ content }: { content: Content }) {
  const { profile, ui } = content;
  const space = profile.name.indexOf(' ');

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-bg-deep pt-28 pb-16 md:pt-36 md:pb-24"
    >
      <HeroBackdrop />
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow hero-in mb-4" style={step(0)}>
            {ui.hero.greeting}
          </p>
          <h1
            id="hero-title"
            className="hero-in text-display font-bold tracking-tight text-ink"
            style={step(1)}
          >
            {profile.name.slice(0, space)}
            <span className="text-accent">{profile.name.slice(space)}</span>
            <span className="mt-2 block text-h2 font-semibold text-ink">{profile.headline}</span>
          </h1>
          <p className="hero-in mt-6 max-w-[58ch] text-lg text-muted" style={step(2)}>
            {profile.pitch}
          </p>
          <div className="hero-in mt-8 flex flex-col gap-3 sm:flex-row" style={step(3)}>
            <a
              href="#projects"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent-strong px-7 font-semibold text-accent-contrast transition-colors hover:bg-accent-strong-hover"
            >
              {ui.hero.viewWork}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a
              href={mailtoHref(profile.email)}
              data-umami-event={EVENTS.email}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-accent/60 px-7 font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <Mail size={18} aria-hidden="true" />
              {ui.hero.contactMe}
            </a>
          </div>
          <p
            className="hero-in mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink"
            style={step(4)}
          >
            <span className="relative flex size-2.5" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2.5 rounded-full bg-success" />
            </span>
            {ui.hero.status}
          </p>
          <ul className="hero-in mt-6 flex gap-3" aria-label={ui.footer.social} style={step(5)}>
            <li>
              <IconLink href={profile.githubUrl} label={ui.cta.github} event={EVENTS.github}>
                <GithubIcon size={20} />
              </IconLink>
            </li>
            <li>
              <IconLink href={profile.linkedinUrl} label={ui.cta.linkedin} event={EVENTS.linkedin}>
                <LinkedinIcon size={20} />
              </IconLink>
            </li>
            <li>
              <IconLink
                href={mailtoHref(profile.email)}
                label={ui.cta.email}
                event={EVENTS.email}
                external={false}
              >
                <Mail size={20} aria-hidden="true" />
              </IconLink>
            </li>
          </ul>
        </div>
        <div className="hero-in" style={step(3)}>
          <HeroPortrait content={content} />
        </div>
      </div>
    </section>
  );
}

function IconLink({
  href,
  label,
  event,
  external = true,
  children,
}: {
  href: string;
  label: string;
  event: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      data-umami-event={event}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="inline-flex size-11 items-center justify-center rounded-md border border-line bg-surface/60 text-ink transition-colors hover:border-accent hover:text-accent"
    >
      {children}
    </a>
  );
}

/** Accent glows and a faint grid; decorative only. */
function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(45% 55% at 78% 40%, var(--hero-glow), transparent 70%), radial-gradient(35% 35% at 0% 0%, var(--hero-glow), transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)] opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}
