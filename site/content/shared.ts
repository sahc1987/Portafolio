import type { Profile } from './types';

/** Language-neutral facts reused by both locales. */
export const CONTACT = {
  email: 'sahc1987@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/saul-hernandez-dev',
  githubUrl: 'https://github.com/sahc1987',
  whatsappNumber: '50366806151',
} as const satisfies Pick<Profile, 'email' | 'linkedinUrl' | 'githubUrl' | 'whatsappNumber'>;

export const LINKS = {
  poolDemo: 'https://complete-pool-app.vercel.app',
  poolRepo: 'https://github.com/sahc1987/CompletePoolApp',
  ecommerceRepo: 'https://github.com/sahc1987/Ecommerce',
  hospitalRepo: 'https://github.com/sahc1987/Hospital-App',
  portfolioRepo: 'https://github.com/sahc1987/portfolio',
} as const;

/** Floating chips around the hero portrait (stands in for "trusted by" logos, which I won't fake). */
export const HERO_CHIPS = ['React', 'Node.js', 'TypeScript', 'AWS'] as const;

export const STACKS = {
  pool: [
    'Next.js 14',
    'React 18',
    'TypeScript',
    'Prisma',
    'PostgreSQL (Supabase)',
    'NextAuth',
    'Tailwind CSS',
    'Expo / React Native',
    'Stripe',
    'Zod',
  ],
  ecommerce: [
    'Node.js',
    'Express',
    'React 18',
    'TypeScript',
    'Redux Toolkit',
    'PostgreSQL',
    'Redis',
    'Stripe',
    'React Native',
    'Docker',
  ],
  centraldesk: ['React', 'Node.js', 'Express', 'REST API', 'Stripe webhooks', 'Carrier APIs'],
  hospital: [
    'Java 21',
    'Spring Boot 3.5',
    'Spring Security',
    'React 18',
    'TypeScript',
    'PostgreSQL 16',
    'Redis 7',
    'Flyway',
    'Docker',
  ],
} as const;
