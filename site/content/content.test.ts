import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { en } from './en';
import { es } from './es';
import { getContent, isLocale, otherLocale } from './get-content';
import type { Content, Experience } from './types';

const locales: readonly Content[] = [en, es];
const slugs = (items: readonly { slug: string }[]) => items.map((item) => item.slug);

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

describe('locale parity', () => {
  it('has the same projects, experience and skill groups in the same order', () => {
    expect(slugs(es.projects)).toEqual(slugs(en.projects));
    expect(slugs(es.experience)).toEqual(slugs(en.experience));
    expect(slugs(es.skills)).toEqual(slugs(en.skills));
    expect(slugs(es.services)).toEqual(slugs(en.services));
    expect(es.ui.about.stats.map((stat) => stat.value)).toEqual(
      en.ui.about.stats.map((stat) => stat.value),
    );
  });

  it('keeps links, kinds, dates and stacks identical across locales', () => {
    en.projects.forEach((project, i) => {
      const other = es.projects[i]!;
      expect(other.kind).toBe(project.kind);
      expect(other.links).toEqual(project.links);
      expect(other.stack).toEqual(project.stack);
      expect(other.built).toHaveLength(project.built.length);
      expect(other.hardParts).toHaveLength(project.hardParts.length);
    });
    en.experience.forEach((job: Experience, i) => {
      const other: Experience = es.experience[i]!;
      expect([other.start, other.end]).toEqual([job.start, job.end]);
      expect(other.highlights).toHaveLength(job.highlights.length);
      expect(Boolean(other.location)).toBe(Boolean(job.location));
    });
    expect(es.profile.email).toBe(en.profile.email);
    expect([es.education.start, es.education.end]).toEqual([en.education.start, en.education.end]);
  });

  it.each(locales)('has no empty strings ($locale)', (content) => {
    for (const text of allStrings(content)) expect(text.trim()).not.toBe('');
  });
});

describe('honesty rules', () => {
  it.each(locales)('never links or shows internal tools ($locale)', (content) => {
    for (const project of content.projects.filter((p) => p.kind === 'internal')) {
      expect(project.links).toEqual({});
      expect(allStrings(project).join(' ')).not.toMatch(/https?:\/\/|weprintmiami/i);
    }
  });

  it.each(locales)('labels the Hospital App as a learning project ($locale)', (content) => {
    const hospital = content.projects.find((p) => p.slug === 'hospital-app');
    expect(hospital?.kind).toBe('learning');
    expect(content.ui.kinds.learning).toMatch(/Spring Boot/);
  });

  it.each(locales)('makes no percentage or certification claims ($locale)', (content) => {
    const text = allStrings(content).join(' ');
    expect(text).not.toMatch(/\d\s?%/);
    expect(text).not.toMatch(/certified|certificad/i);
  });

  it.each(locales)('never shows the phone number as text ($locale)', (content) => {
    const { whatsappNumber, ...rest } = content.profile;
    expect(whatsappNumber).toMatch(/^\d{11}$/);
    expect(allStrings(rest).join(' ')).not.toContain('6680');
  });
});

describe('dates', () => {
  it.each(locales)('are valid and ordered ($locale)', (content) => {
    for (const job of content.experience) {
      expect(job.start).toMatch(/^\d{4}(-(0[1-9]|1[0-2]))?$/);
      if (job.end !== null) {
        expect(job.end).toMatch(/^\d{4}(-(0[1-9]|1[0-2]))?$/);
        expect(job.end > job.start).toBe(true);
      }
    }
  });
});

describe('CV files', () => {
  it.each(locales)('exist and match the locale ($locale)', (content) => {
    expect(content.cv.locale).toBe(content.locale);
    expect(content.cv.path).toContain(`_${content.locale.toUpperCase()}.pdf`);
    expect(existsSync(path.join(__dirname, '..', 'public', content.cv.path))).toBe(true);
  });
});

describe('getContent', () => {
  it('returns the content for a known locale', () => {
    expect(getContent('es')).toBe(es);
    expect(isLocale('en')).toBe(true);
    expect(otherLocale('en')).toBe('es');
    expect(otherLocale('es')).toBe('en');
  });

  it('throws on an unknown locale', () => {
    expect(isLocale('fr')).toBe(false);
    expect(() => getContent('fr')).toThrow('Unknown locale "fr"');
  });
});
