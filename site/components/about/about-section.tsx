import type { ReactNode } from 'react';
import { CalendarCheck, Download, Globe, Mail, MapPin, MessageCircle } from 'lucide-react';
import type { Content } from '@/content/types';
import { EVENTS } from '@/lib/analytics';
import { mailtoHref, whatsappHref } from '@/lib/site';

export function AboutSection({ content }: { content: Content }) {
  const { ui, profile, cv } = content;
  const { about } = ui;

  return (
    <section id="about" aria-labelledby="about-title" className="py-16 md:py-24">
      <div className="container-page grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div className="reveal">
          <p className="eyebrow mb-3">{about.eyebrow}</p>
          <h2 id="about-title" className="max-w-[22ch] text-h2 font-bold tracking-tight text-ink">
            {about.title}
          </h2>
          <div className="mt-5 max-w-[65ch] space-y-4 text-muted">
            {about.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="mt-8 grid max-w-[34rem] grid-cols-3 gap-3">
            {about.stats.map((stat) => (
              <li
                key={stat.label}
                className="card-glow rounded-lg border border-line p-4 text-center"
              >
                <p className="text-3xl font-bold text-accent">{stat.value}</p>
                <p className="mt-1 text-xs leading-snug text-muted">{stat.label}</p>
              </li>
            ))}
          </ul>
          <a
            href={cv.path}
            download
            data-umami-event={EVENTS.downloadCv}
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-accent-strong px-6 font-semibold text-accent-contrast transition-colors hover:bg-accent-strong-hover"
          >
            {cv.label}
            <Download size={18} aria-hidden="true" />
          </a>
        </div>

        <ul className="reveal card-glow divide-y divide-line rounded-lg border border-line p-2 md:p-4">
          <InfoRow icon={<MapPin size={22} />} label={about.info.location}>
            {profile.location}
          </InfoRow>
          <InfoRow icon={<Mail size={22} />} label={about.info.email}>
            <a
              href={mailtoHref(profile.email)}
              data-umami-event={EVENTS.email}
              className="break-all underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent"
            >
              {profile.email}
            </a>
          </InfoRow>
          <InfoRow icon={<MessageCircle size={22} />} label={about.info.whatsapp}>
            <a
              href={whatsappHref(profile.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event={EVENTS.whatsapp}
              className="underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent"
            >
              {about.info.whatsappValue}
            </a>
          </InfoRow>
          <InfoRow icon={<Globe size={22} />} label={about.info.languages}>
            {about.info.languagesValue}
          </InfoRow>
          <InfoRow icon={<CalendarCheck size={22} />} label={about.info.availability}>
            {about.info.availabilityValue}
          </InfoRow>
        </ul>
      </div>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <li className="flex items-start gap-4 px-3 py-4">
      <span aria-hidden="true" className="mt-0.5 text-accent">
        {icon}
      </span>
      <div className="min-w-0 text-sm">
        <p className="font-semibold text-ink">{label}</p>
        <p className="text-muted">{children}</p>
      </div>
    </li>
  );
}
