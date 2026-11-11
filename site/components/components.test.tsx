import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { en } from '@/content/en';
import { es } from '@/content/es';
import { EVENTS } from '@/lib/analytics';
import { mockMatchMedia } from '@/tests/setup';
import { ExperienceSection } from './experience/experience-section';
import { AboutSection } from './about/about-section';
import { ContactCtas } from './hero/contact-ctas';
import { Hero } from './hero/hero';
import { SiteFooter } from './layout/site-footer';
import { SiteHeader } from './layout/site-header';
import { ArchitectureDiagram } from './projects/architecture-diagram';
import { DIAGRAMS, edgePath } from './projects/diagram-specs';
import { ProjectsSection } from './projects/projects-section';
import { ServicesSection } from './services/services-section';
import { SkillsSection } from './skills/skills-section';
import { LanguageToggle } from './ui/language-toggle';
import { MotionObserver } from './ui/motion-observer';
import { ThemeToggle } from './ui/theme-toggle';

describe('Hero and contact CTAs', () => {
  it('shows the name, both hero actions and the stack row', () => {
    render(<Hero content={en} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Saúl HernándezFull Stack Developer',
    );
    expect(screen.getByRole('link', { name: /View my work/ })).toHaveAttribute('href', '#projects');
    expect(screen.getByRole('link', { name: /Contact me/ })).toHaveAttribute(
      'data-umami-event',
      EVENTS.email,
    );
    expect(screen.getByRole('list', { name: 'The stack I ship with' })).toHaveTextContent(
      'TypeScript',
    );
    expect(screen.getByText('Open to full stack roles')).toBeInTheDocument();
  });

  it('links the hero social icons and floats the stack around the portrait', () => {
    render(<Hero content={es} />);
    const social = within(screen.getByRole('list', { name: es.ui.footer.social }));
    expect(social.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      es.profile.githubUrl,
    );
    expect(social.getByRole('link', { name: 'Correo' })).toHaveAttribute(
      'href',
      'mailto:sahc1987@gmail.com',
    );
    expect(screen.getByRole('img', { name: es.ui.hero.photoAlt })).toHaveAttribute(
      'src',
      '/headshot.webp',
    );
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(
      expect.arrayContaining(['React', 'AWS']),
    );
  });

  it('links every contact CTA with its analytics event', () => {
    render(<ContactCtas content={en} />);
    const cv = screen.getByRole('link', { name: en.cv.label });
    expect(cv).toHaveAttribute('href', '/cv/CV_Saul_Hernandez_EN.pdf');
    expect(cv).toHaveAttribute('download');
    expect(cv).toHaveAttribute('data-umami-event', EVENTS.downloadCv);
    expect(screen.getByRole('link', { name: /Email/ })).toHaveAttribute(
      'href',
      'mailto:sahc1987@gmail.com',
    );
    const whatsapp = screen.getByRole('link', { name: /WhatsApp/ });
    expect(whatsapp).toHaveAttribute('href', 'https://wa.me/50366806151');
    expect(whatsapp).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
      'data-umami-event',
      EVENTS.linkedin,
    );
  });

  it('serves the Spanish CV on the Spanish page', () => {
    render(<ContactCtas content={es} />);
    expect(screen.getByRole('link', { name: es.cv.label })).toHaveAttribute(
      'href',
      '/cv/CV_Saul_Hernandez_ES.pdf',
    );
  });
});

describe('About', () => {
  it('shows the story, fact tiles and an info card without the phone number', () => {
    render(<AboutSection content={es} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Construyo software');
    expect(screen.getByText('Años en software')).toBeInTheDocument();
    expect(screen.getByText('7+')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Envíame un mensaje' })).toHaveAttribute(
      'href',
      'https://wa.me/50366806151',
    );
    expect(screen.getByRole('link', { name: es.cv.label })).toHaveAttribute('href', es.cv.path);
    expect(document.body).not.toHaveTextContent('6680');
  });
});

describe('Services', () => {
  it.each([en, es])('lists the four services in $locale', (content) => {
    render(<ServicesSection content={content} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      content.ui.sections.services,
    );
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(4);
    for (const service of content.services) {
      expect(screen.getByRole('heading', { level: 3, name: service.title })).toBeInTheDocument();
    }
  });
});

describe('Projects', () => {
  it('renders every project with its kind, diagram and links', () => {
    render(<ProjectsSection content={en} />);
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(4);

    const pool = within(screen.getByRole('article', { name: 'Complete Pool App' }));
    expect(pool.getByRole('link', { name: /Live demo/ })).toHaveAttribute(
      'href',
      'https://complete-pool-app.vercel.app',
    );
    expect(pool.getByRole('img', { name: /Architecture/ })).toBeInTheDocument();

    const central = within(screen.getByRole('article', { name: 'CentralDesk' }));
    expect(central.queryAllByRole('link')).toHaveLength(0);
    expect(central.getByText('Internal tool')).toBeInTheDocument();

    const hospital = within(screen.getByRole('article', { name: 'Hospital Management System' }));
    expect(hospital.getByText('Spring Boot learning project')).toHaveAttribute(
      'data-kind',
      'learning',
    );
  });

  it('opens a case study as a native disclosure', async () => {
    render(<ProjectsSection content={en} />);
    const article = within(screen.getByRole('article', { name: 'Ecommerce Platform' }));
    const toggle = article.getByText('Read case study');
    const details = toggle.closest('details')!;
    expect(details.open).toBe(false);
    await userEvent.click(toggle);
    expect(details.open).toBe(true);
    expect(article.getByText(/row-level locks/)).toBeVisible();
  });

  it('draws one path per edge and skips unknown nodes', () => {
    const { container } = render(<ArchitectureDiagram id="centraldesk" label="d" />);
    expect(container.querySelectorAll('path.draw')).toHaveLength(DIAGRAMS.centraldesk.edges.length);
    const [a, b] = DIAGRAMS['pool-app'].nodes;
    expect(edgePath(a!, b!)).toMatch(/^M\d+ \d+ C/);
  });
});

describe('Experience, skills and footer', () => {
  it('shows a dated timeline with present roles', () => {
    render(<ExperienceSection content={en} />);
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(5);
    expect(screen.getByText('Oct 2020 – Present')).toBeInTheDocument();
    expect(screen.getByText('Nov 2013 – Aug 2017')).toBeInTheDocument();
  });

  it('lists skills and education', () => {
    render(<SkillsSection content={es} />);
    expect(screen.getByRole('heading', { name: 'Bases de datos' })).toBeInTheDocument();
    expect(screen.getByText('Ingeniería de Sistemas Informáticos')).toBeInTheDocument();
    expect(screen.getByText('2008 – 2013')).toBeInTheDocument();
  });

  it('repeats the CTAs in the contact section', () => {
    render(<SiteFooter content={en} />);
    expect(screen.getByRole('heading', { name: "Let's work together" })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'data-umami-event',
      EVENTS.github,
    );
    const social = within(screen.getByRole('list', { name: 'Social links' }));
    expect(social.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      en.profile.linkedinUrl,
    );
  });
});

describe('Header', () => {
  it('has section links and points to the other language', () => {
    render(<SiteHeader content={en} />);
    const nav = within(screen.getByRole('navigation', { name: 'Sections' }));
    expect(nav.getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual([
      '#about',
      '#services',
      '#projects',
      '#experience',
      '#skills',
      '#contact',
    ]);
    expect(screen.getByRole('link', { name: 'Hire me' })).toHaveAttribute(
      'href',
      'mailto:sahc1987@gmail.com',
    );
    const lang = screen.getByRole('link', { name: 'ES, ver en español' });
    expect(lang).toHaveAttribute('href', '/es/');
    expect(lang).toHaveAttribute('hreflang', 'es');
  });
});

describe('LanguageToggle', () => {
  it('keeps the current section when switching', () => {
    window.location.hash = '#experience';
    render(<LanguageToggle href="/es/" targetLocale="es" label="Ver en español" short="ES" />);
    const link = screen.getByRole('link');
    link.addEventListener('click', (event) => event.preventDefault());
    link.click();
    expect(link.getAttribute('href')).toBe('/es/#experience');
    window.location.hash = '';
  });

  it('goes to the top when there is no section', () => {
    render(<LanguageToggle href="/en/" targetLocale="en" label="View in English" short="EN" />);
    const link = screen.getByRole('link');
    link.addEventListener('click', (event) => event.preventDefault());
    link.click();
    expect(link.getAttribute('href')).toBe('/en/');
  });
});

describe('ThemeToggle', () => {
  it('starts dark, switches to light and back', async () => {
    render(<ThemeToggle toLightLabel="Light" toDarkLabel="Dark" />);
    await userEvent.click(screen.getByRole('button', { name: 'Light' }));
    expect(document.documentElement.dataset.theme).toBe('light');
    await userEvent.click(screen.getByRole('button', { name: 'Dark' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});

describe('MotionObserver', () => {
  type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

  function installObserver() {
    const instance = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
      callback: null as Callback | null,
    };
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: Callback) {
          instance.callback = callback;
        }
        observe = instance.observe;
        unobserve = instance.unobserve;
        disconnect = instance.disconnect;
      },
    );
    return instance;
  }

  it('reveals elements as they enter the viewport', () => {
    vi.stubGlobal('CSS', { supports: () => false });
    const io = installObserver();
    const { unmount } = render(
      <>
        <div className="reveal" data-testid="a" />
        <MotionObserver />
      </>,
    );
    const target = screen.getByTestId('a');
    expect(document.documentElement).toHaveClass('io-reveal');
    expect(io.observe).toHaveBeenCalledWith(target);
    act(() =>
      io.callback!([
        { isIntersecting: false, target },
        { isIntersecting: true, target },
      ]),
    );
    expect(target).toHaveClass('is-visible');
    expect(io.unobserve).toHaveBeenCalledWith(target);
    unmount();
    expect(io.disconnect).toHaveBeenCalled();
    expect(document.documentElement).not.toHaveClass('io-reveal');
    vi.unstubAllGlobals();
  });

  it('does nothing with native scroll timelines or reduced motion', () => {
    const io = installObserver();
    vi.stubGlobal('CSS', { supports: () => true });
    render(<MotionObserver />);
    vi.stubGlobal('CSS', { supports: () => false });
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true });
    render(<MotionObserver />);
    expect(io.observe).not.toHaveBeenCalled();
    expect(document.documentElement).not.toHaveClass('io-reveal');
    vi.unstubAllGlobals();
    mockMatchMedia();
  });
});
