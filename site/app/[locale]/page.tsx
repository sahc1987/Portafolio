import { getContent } from '@/content/get-content';
import { AboutSection } from '@/components/about/about-section';
import { ExperienceSection } from '@/components/experience/experience-section';
import { Hero } from '@/components/hero/hero';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { ServicesSection } from '@/components/services/services-section';
import { ProjectsSection } from '@/components/projects/projects-section';
import { SkillsSection } from '@/components/skills/skills-section';

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = getContent(locale);

  return (
    <>
      <SiteHeader content={content} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero content={content} />
        <AboutSection content={content} />
        <ServicesSection content={content} />
        <ProjectsSection content={content} />
        <ExperienceSection content={content} />
        <SkillsSection content={content} />
      </main>
      <SiteFooter content={content} />
    </>
  );
}
