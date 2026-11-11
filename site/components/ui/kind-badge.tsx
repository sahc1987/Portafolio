import type { ProjectKind } from '@/content/types';

export function KindBadge({ kind, label }: { kind: ProjectKind; label: string }) {
  const tone =
    kind === 'learning'
      ? 'bg-warning-soft text-warning-ink'
      : 'bg-surface text-muted border border-line';
  return (
    <span
      data-kind={kind}
      className={`inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-mono-sm ${tone}`}
    >
      {label}
    </span>
  );
}
