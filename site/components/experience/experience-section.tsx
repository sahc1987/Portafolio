import type { Content, Experience, Locale } from '@/content/types';
import { formatRange } from '@/lib/format-date';
import { SectionHeading } from '@/components/layout/section-heading';
import { StackList } from '@/components/ui/stack-tag';

export function ExperienceSection({ content }: { content: Content }) {
  const { ui, experience, locale } = content;
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="border-y border-line bg-surface py-16 md:py-28"
    >
      <div className="container-page">
        <SectionHeading
          id="experience-title"
          eyebrow={ui.sections.experienceEyebrow}
          title={ui.sections.experience}
        />
        <div className="relative">
          <div
            aria-hidden="true"
            className="timeline-line absolute top-2 bottom-2 left-[5px] w-px bg-accent md:left-[11.5rem]"
          />
          <ol className="space-y-10 md:space-y-14">
            {experience.map((item) => (
              <TimelineItem
                key={item.slug}
                item={item}
                locale={locale}
                presentLabel={ui.present}
                stackLabel={ui.caseStudy.stack}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

interface TimelineItemProps {
  item: Experience;
  locale: Locale;
  presentLabel: string;
  stackLabel: string;
}

function TimelineItem({ item, locale, presentLabel, stackLabel }: TimelineItemProps) {
  const isCurrent = item.end === null;
  return (
    <li className="reveal relative grid gap-2 pl-8 md:grid-cols-[11.5rem_1fr] md:gap-10 md:pl-0">
      <span
        aria-hidden="true"
        className={`absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-accent md:left-[calc(11.5rem-5px)] ${isCurrent ? 'bg-accent' : 'bg-surface'}`}
      />
      <p className="font-mono text-mono-sm text-muted md:pt-0.5 md:pr-6 md:text-right">
        {formatRange(item.start, item.end, locale, presentLabel)}
      </p>
      <div className="md:pl-6">
        <h3 className="text-h3 font-semibold text-ink">{item.role}</h3>
        <p className="mb-3 font-medium text-accent">
          {item.company}
          {item.location ? (
            <span className="font-normal text-muted"> · {item.location}</span>
          ) : null}
        </p>
        <ul className="mb-4 list-disc space-y-1.5 pl-5 text-ink marker:text-accent">
          {item.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <StackList items={item.stack} label={`${stackLabel}: ${item.company}`} />
      </div>
    </li>
  );
}
