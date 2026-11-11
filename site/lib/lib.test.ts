import { describe, expect, it, vi } from 'vitest';
import { formatDateStamp, formatRange } from './format-date';
import { localePath, mailtoHref, whatsappHref } from './site';
import { THEME_INIT_SCRIPT, applyTheme, readTheme, subscribeTheme } from './theme';

describe('formatDateStamp', () => {
  it('formats year-month per locale', () => {
    expect(formatDateStamp('2020-10', 'en')).toBe('Oct 2020');
    expect(formatDateStamp('2020-10', 'es')).toMatch(/^oct 2020$/);
  });

  it('keeps a bare year as is', () => {
    expect(formatDateStamp('2023', 'en')).toBe('2023');
  });

  it('rejects invalid input', () => {
    expect(() => formatDateStamp('abc' as `${number}`, 'en')).toThrow('Invalid date stamp');
  });

  it('formats ranges with a present label', () => {
    expect(formatRange('2019-03', '2020-09', 'en', 'Present')).toBe('Mar 2019 – Sep 2020');
    expect(formatRange('2023', null, 'es', 'Presente')).toBe('2023 – Presente');
  });
});

describe('site helpers', () => {
  it('builds links', () => {
    expect(localePath('es')).toBe('/es/');
    expect(mailtoHref('a@b.co')).toBe('mailto:a@b.co');
    expect(whatsappHref('50300000000')).toBe('https://wa.me/50300000000');
  });
});

describe('theme', () => {
  it('defaults to dark and reads an explicit light choice', () => {
    expect(readTheme()).toBe('dark');
    document.documentElement.dataset.theme = 'light';
    expect(readTheme()).toBe('light');
  });

  it('applies, persists and notifies', () => {
    const onChange = vi.fn();
    const unsubscribe = subscribeTheme(onChange);
    applyTheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(onChange).toHaveBeenCalledOnce();
    unsubscribe();
    applyTheme('light');
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('still applies the theme when storage throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => applyTheme('dark')).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('init script restores a saved theme and ignores junk', () => {
    // Runs the exact inline string the browser executes before first paint.
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const runInit = new Function(THEME_INIT_SCRIPT) as () => void;
    localStorage.setItem('theme', 'dark');
    runInit();
    expect(document.documentElement.dataset.theme).toBe('dark');
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', '<script>');
    runInit();
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
});
