import type { CSSProperties, ReactNode } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import type { Project, UiStrings } from '@/content/types';
import { EVENTS } from '@/lib/analytics';
import { GithubIcon } from '@/components/ui/brand-icons';
import { KindBadge } from '@/components/ui/kind-badge';
import { StackList } from '@/components/ui/stack-tag';
import { ArchitectureDiagram } from './architecture-diagram';

interface ProjectCardProps {
  project: Project;
  ui: UiStrings;
  index: number;
}

export function ProjectCard({ project, ui, index }: ProjectCardProps) {
  const headingId = `project-${project.slug}`;
  const { demo, repo } = project.links;

  return (
    <article
      aria-labelledby={headingId}
      data-project={project.slug}
      className="reveal lift flex flex-col overflow-hidden rounded-lg border border-line bg-surface"
      style={{ '--i': index % 2 } as CSSProperties}
    >
      <div className="border-b border-line bg-bg-deep p-4 md:p-6">
        <ArchitectureDiagram id={project.diagram} label={project.diagramLabel} />
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-7">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <KindBadge kind={project.kind} label={ui.kinds[project.kind]} />
        </div>
        <h3 id={headingId} className="mb-2 text-h3 font-semibold text-ink">
          {project.title}
        </h3>
        <p className="mb-3 text-muted">{project.summary}</p>
        <p className="font-mono text-mono-sm text-accent">
          <span className="sr-only">{ui.caseStudy.stack}: </span>
          {project.stack.slice(0, 4).join(' / ')}
        </p>

        {project.note ? <p className="mt-4 text-sm text-muted italic">{project.note}</p> : null}

        {demo || repo ? (
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {demo ? (
              <ProjectLink href={demo} event={EVENTS.projectDemo} title={project.title}>
                <ExternalLink size={16} aria-hidden="true" />
                {ui.caseStudy.demo}
              </ProjectLink>
            ) : null}
            {repo ? (
              <ProjectLink href={repo} event={EVENTS.projectRepo} title={project.title}>
                <GithubIcon size={16} />
                {ui.caseStudy.repo}
              </ProjectLink>
            ) : null}
          </div>
        ) : null}

        <details className="group mt-5 border-t border-line pt-4">
          <summary
            data-umami-event={EVENTS.caseStudyOpen}
            data-umami-event-project={project.slug}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md font-medium text-accent hover:text-accent-hover"
          >
            {ui.caseStudy.open}
            <ChevronDown
              size={18}
              aria-hidden="true"
              className="transition-transform group-open:rotate-180 motion-reduce:transition-none"
            />
          </summary>
          <div className="mt-3 space-y-5 text-[0.9375rem]">
            <CaseBlock title={ui.caseStudy.problem}>
              <p>{project.problem}</p>
            </CaseBlock>
            <CaseBlock title={ui.caseStudy.built}>
              <BulletList items={project.built} />
            </CaseBlock>
            <CaseBlock title={ui.caseStudy.hardParts}>
              <BulletList items={project.hardParts} />
            </CaseBlock>
            <CaseBlock title={ui.caseStudy.stack}>
              <StackList items={project.stack} label={`${ui.caseStudy.stack}: ${project.title}`} />
            </CaseBlock>
          </div>
        </details>
      </div>
    </article>
  );
}

function ProjectLink({
  href,
  event,
  title,
  children,
}: {
  href: string;
  event: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-umami-event={event}
      data-umami-event-project={title}
      className="inline-flex min-h-11 items-center gap-1.5 font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
    >
      {children}
    </a>
  );
}

function CaseBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="eyebrow mb-1.5">{title}</h4>
      <div className="text-ink">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-accent">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
