import type { CSSProperties, ReactNode } from 'react';
import { Cloud, Code, Database, Server } from 'lucide-react';
import type { Content, ServiceSlug } from '@/content/types';
import { SectionHeading } from '@/components/layout/section-heading';

const ICONS: Record<ServiceSlug, ReactNode> = {
  frontend: <Code size={28} />,
  backend: <Server size={28} />,
  databases: <Database size={28} />,
  cloud: <Cloud size={28} />,
};

export function ServicesSection({ content }: { content: Content }) {
  const { ui, services } = content;
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="border-y border-line bg-bg-deep py-16 md:py-24"
    >
      <div className="container-page">
        <SectionHeading
          id="services-title"
          eyebrow={ui.sections.servicesEyebrow}
          title={ui.sections.services}
          intro={ui.sections.servicesIntro}
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <li
              key={service.slug}
              className="reveal lift card-glow rounded-lg border border-line p-6"
              style={{ '--i': index } as CSSProperties}
            >
              <span aria-hidden="true" className="text-accent">
                {ICONS[service.slug]}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{service.title}</h3>
              <p className="mt-2 text-sm text-muted">{service.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
