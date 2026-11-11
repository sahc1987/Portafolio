export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];

export type ProjectKind = 'client' | 'internal' | 'personal' | 'learning';
export type DiagramId = 'pool-app' | 'ecommerce' | 'centraldesk' | 'hospital-app';

/** ISO year-month ("2020-10"), or a bare year ("2023") when the month isn't on the CV. */
export type DateStamp = `${number}-${number}` | `${number}`;

export interface Profile {
  readonly name: string;
  readonly headline: string;
  readonly pitch: string;
  readonly location: string;
  readonly availability: string;
  readonly email: string;
  readonly linkedinUrl: string;
  readonly githubUrl: string;
  /** Digits only, with country code, used for wa.me links. */
  readonly whatsappNumber: string;
}

export interface ProjectLinks {
  readonly demo?: string;
  readonly repo?: string;
}

export interface Project {
  readonly slug: string;
  readonly title: string;
  readonly kind: ProjectKind;
  readonly summary: string;
  readonly problem: string;
  readonly built: readonly string[];
  readonly hardParts: readonly string[];
  readonly stack: readonly string[];
  readonly links: ProjectLinks;
  readonly diagram: DiagramId;
  /** Text alternative for the architecture diagram. */
  readonly diagramLabel: string;
  readonly note?: string;
}

export interface Experience {
  readonly slug: string;
  readonly company: string;
  readonly role: string;
  readonly location?: string;
  readonly start: DateStamp;
  readonly end: DateStamp | null;
  readonly highlights: readonly string[];
  readonly stack: readonly string[];
}

export interface SkillGroup {
  readonly slug: string;
  readonly label: string;
  readonly skills: readonly string[];
}

export interface Education {
  readonly institution: string;
  readonly degree: string;
  readonly start: string;
  readonly end: string;
}

export type ServiceSlug = 'frontend' | 'backend' | 'databases' | 'cloud';

export interface Service {
  readonly slug: ServiceSlug;
  readonly title: string;
  readonly description: string;
}

/** A fact already stated on the CV, shown as a tile. Never a percentage or a client count. */
export interface Stat {
  readonly value: string;
  readonly label: string;
}

export interface CvFile {
  readonly locale: Locale;
  readonly path: `/cv/${string}.pdf`;
  readonly label: string;
}

export interface UiStrings {
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly skipToContent: string;
  readonly nav: {
    readonly label: string;
    readonly about: string;
    readonly services: string;
    readonly hireMe: string;
    readonly projects: string;
    readonly experience: string;
    readonly skills: string;
    readonly contact: string;
  };
  readonly sections: {
    readonly servicesEyebrow: string;
    readonly services: string;
    readonly servicesIntro: string;
    readonly projectsEyebrow: string;
    readonly projects: string;
    readonly projectsIntro: string;
    readonly experienceEyebrow: string;
    readonly experience: string;
    readonly skillsEyebrow: string;
    readonly skills: string;
    readonly education: string;
    readonly contactEyebrow: string;
    readonly contact: string;
    readonly contactIntro: string;
  };
  readonly cta: {
    readonly downloadCv: string;
    readonly email: string;
    readonly linkedin: string;
    readonly whatsapp: string;
    readonly github: string;
  };
  readonly kinds: Readonly<Record<ProjectKind, string>>;
  readonly caseStudy: {
    readonly open: string;
    readonly problem: string;
    readonly built: string;
    readonly hardParts: string;
    readonly stack: string;
    readonly demo: string;
    readonly repo: string;
  };
  readonly hero: {
    readonly greeting: string;
    readonly viewWork: string;
    readonly contactMe: string;
    readonly status: string;
    readonly photoAlt: string;
    readonly stackLabel: string;
  };
  readonly about: {
    readonly eyebrow: string;
    readonly title: string;
    readonly body: readonly string[];
    readonly stats: readonly Stat[];
    readonly info: {
      readonly location: string;
      readonly email: string;
      readonly whatsapp: string;
      readonly whatsappValue: string;
      readonly languages: string;
      readonly languagesValue: string;
      readonly availability: string;
      readonly availabilityValue: string;
    };
  };
  readonly present: string;
  readonly theme: { readonly toLight: string; readonly toDark: string };
  readonly language: { readonly switchTo: string; readonly short: string };
  readonly footer: {
    readonly tagline: string;
    readonly quickLinks: string;
    readonly follow: string;
    readonly builtWith: string;
    readonly source: string;
    readonly social: string;
  };
}

export interface Content {
  readonly locale: Locale;
  readonly profile: Profile;
  readonly projects: readonly Project[];
  readonly experience: readonly Experience[];
  readonly services: readonly Service[];
  readonly skills: readonly SkillGroup[];
  readonly education: Education;
  readonly cv: CvFile;
  readonly ui: UiStrings;
}
