import type { ReactNode } from 'react';
import type { EventName } from '@/lib/analytics';

interface CtaButtonProps {
  href: string;
  event: EventName;
  icon: ReactNode;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  external?: boolean;
  download?: boolean;
  ariaLabel?: string;
}

const VARIANTS = {
  primary:
    'bg-accent-strong text-accent-contrast hover:bg-accent-strong-hover border-transparent font-semibold',
  secondary: 'bg-bg text-ink border-line hover:border-accent hover:text-accent font-medium',
} as const;

export function CtaButton({
  href,
  event,
  icon,
  children,
  variant = 'secondary',
  external = false,
  download = false,
  ariaLabel,
}: CtaButtonProps) {
  return (
    <a
      href={href}
      data-umami-event={event}
      aria-label={ariaLabel}
      download={download || undefined}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors ${VARIANTS[variant]}`}
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}
