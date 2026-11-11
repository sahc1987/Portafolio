'use client';

import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { applyTheme, readTheme, subscribeTheme } from '@/lib/theme';

interface ThemeToggleProps {
  toLightLabel: string;
  toDarkLabel: string;
}

export function ThemeToggle({ toLightLabel, toDarkLabel }: ThemeToggleProps) {
  // Dark is the default, so the server render matches most first paints.
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => 'dark' as const);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => applyTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? toLightLabel : toDarkLabel}
      className="inline-flex size-11 items-center justify-center rounded-md text-muted transition-colors hover:text-accent"
    >
      {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
    </button>
  );
}
