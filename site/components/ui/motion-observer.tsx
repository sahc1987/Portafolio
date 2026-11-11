'use client';

import { useEffect } from 'react';

const FALLBACK_CLASS = 'io-reveal';

/**
 * Fallback for browsers without CSS scroll-driven animations.
 * Elements are only hidden after this runs, so content stays visible if JS fails.
 */
export function MotionObserver() {
  useEffect(() => {
    const hasScrollTimeline =
      typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hasScrollTimeline || reducedMotion || !('IntersectionObserver' in window)) return;

    const root = document.documentElement;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    root.classList.add(FALLBACK_CLASS);

    return () => {
      observer.disconnect();
      root.classList.remove(FALLBACK_CLASS);
    };
  }, []);

  return null;
}
