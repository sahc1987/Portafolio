import type { CSSProperties } from 'react';
import { HERO_CHIPS } from '@/content/shared';
import type { Content } from '@/content/types';

const CHIP_POSITIONS = [
  'top-[6%] right-0',
  'top-[26%] left-0',
  'bottom-[22%] left-[2%]',
  'bottom-[8%] right-[2%]',
] as const;

/** Headshot inside accent orbit rings, with the stack floating around it. */
export function HeroPortrait({ content }: { content: Content }) {
  const { ui } = content;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-[30rem]">
      <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 size-full">
        <circle
          cx="50"
          cy="50"
          r="49"
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.45"
          strokeWidth="0.3"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.35"
          strokeWidth="0.3"
          strokeDasharray="1.2 2.4"
        />
        <circle cx="86" cy="22" r="1.1" fill="var(--accent)" />
        <circle cx="12" cy="74" r="0.8" fill="var(--accent)" fillOpacity="0.7" />
      </svg>
      <div
        aria-hidden="true"
        className="absolute inset-[10%] rounded-full blur-2xl"
        style={{ background: 'radial-gradient(closest-side, var(--hero-glow), transparent)' }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized asset */}
      <img
        src="/headshot.webp"
        alt={ui.hero.photoAlt}
        width={480}
        height={480}
        fetchPriority="high"
        className="absolute inset-[13%] size-[74%] rounded-full object-cover shadow-[var(--shadow-hover)] ring-4 ring-accent"
      />
      <ul aria-label={ui.hero.stackLabel} className="absolute inset-0">
        {HERO_CHIPS.map((tech, i) => (
          <li
            key={tech}
            className={`float absolute rounded-md border border-line bg-surface/85 px-3 py-1.5 font-mono text-sm font-semibold text-ink backdrop-blur ${CHIP_POSITIONS[i]}`}
            style={{ '--i': i } as CSSProperties}
          >
            <span aria-hidden="true" className="mr-2 inline-block size-2 rounded-full bg-accent" />
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
}
