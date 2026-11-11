import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.className = '';
});

/** jsdom has no matchMedia; tests override `matches` per case. */
export function mockMatchMedia(matches: Record<string, boolean> = {}) {
  const listeners = new Set<() => void>();
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: matches[query] ?? false,
      media: query,
      addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
    }),
  });
  return { fire: () => listeners.forEach((listener) => listener()) };
}

mockMatchMedia();
