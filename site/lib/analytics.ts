/** Umami event names. Stable identifiers: renaming one breaks historical reports. */
export const EVENTS = {
  downloadCv: 'cta-download-cv',
  email: 'cta-email',
  linkedin: 'cta-linkedin',
  whatsapp: 'cta-whatsapp',
  github: 'cta-github',
  projectDemo: 'project-demo',
  projectRepo: 'project-repo',
  caseStudyOpen: 'case-study-open',
  languageSwitch: 'language-switch',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

export const UMAMI_SCRIPT_URL = 'https://cloud.umami.is/script.js';
