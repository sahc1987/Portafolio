import { GraduationCap } from 'lucide-react';
import type { Education } from '@/content/types';

export function EducationItem({ title, education }: { title: string; education: Education }) {
  return (
    <div className="reveal rounded-lg border border-accent/60 bg-accent-soft p-5" id="education">
      <h3 className="eyebrow mb-3 flex items-center gap-2 text-accent-soft-ink">
        <GraduationCap size={16} aria-hidden="true" />
        {title}
      </h3>
      <p className="font-semibold text-accent-soft-ink">{education.degree}</p>
      <p className="text-accent-soft-ink">{education.institution}</p>
      <p className="mt-1 font-mono text-mono-sm text-accent-soft-ink">
        {education.start} – {education.end}
      </p>
    </div>
  );
}
