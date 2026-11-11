import type { Content } from '@/content/types';
import { SectionHeading } from '@/components/layout/section-heading';
import { ProjectCard } from './project-card';

export function ProjectsSection({ content }: { content: Content }) {
  const { ui, projects } = content;
  return (
    <section id="projects" aria-labelledby="projects-title" className="py-16 md:py-28">
      <div className="container-page">
        <SectionHeading
          id="projects-title"
          eyebrow={ui.sections.projectsEyebrow}
          title={ui.sections.projects}
          intro={ui.sections.projectsIntro}
        />
        <div className="grid items-start gap-4 md:grid-cols-2 md:gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} ui={ui} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
