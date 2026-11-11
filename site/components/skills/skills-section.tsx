import type { CSSProperties } from 'react';
import type { Content } from '@/content/types';
import { SectionHeading } from '@/components/layout/section-heading';
import { EducationItem } from '@/components/education/education-item';

export function SkillsSection({ content }: { content: Content }) {
  const { ui, skills, education } = content;
  return (
    <section id="skills" aria-labelledby="skills-title" className="py-16 md:py-28">
      <div className="container-page">
        <SectionHeading
          id="skills-title"
          eyebrow={ui.sections.skillsEyebrow}
          title={ui.sections.skills}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, index) => (
            <div
              key={group.slug}
              className="reveal card-glow rounded-lg border border-line p-5"
              style={{ '--i': index % 3 } as CSSProperties}
            >
              <h3 className="eyebrow mb-3">{group.label}</h3>
              <ul className="flex flex-wrap gap-2 text-sm text-ink">
                {group.skills.map((skill) => (
                  <li key={skill} className="rounded-md border border-line bg-bg/60 px-3 py-1.5">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <EducationItem title={ui.sections.education} education={education} />
        </div>
      </div>
    </section>
  );
}
