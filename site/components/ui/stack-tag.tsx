export function StackTag({ label }: { label: string }) {
  return (
    <li className="rounded-sm bg-accent-soft px-2 py-0.5 font-mono text-mono-sm text-accent-soft-ink">
      {label}
    </li>
  );
}

export function StackList({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={label}>
      {items.map((item) => (
        <StackTag key={item} label={item} />
      ))}
    </ul>
  );
}
