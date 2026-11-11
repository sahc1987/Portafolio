/** "Saúl Hernández" with the last name in the accent color, plus a small subtitle. */
export function NameMark({ name, subtitle }: { name: string; subtitle?: string }) {
  const space = name.indexOf(' ');
  const first = space === -1 ? name : name.slice(0, space);
  const last = space === -1 ? '' : name.slice(space);
  return (
    <span className="block leading-tight">
      <span className="block text-lg font-bold tracking-tight text-ink md:text-xl">
        {first}
        <span className="text-accent">{last}</span>
      </span>
      {subtitle ? (
        <span className="block font-mono text-[0.6875rem] tracking-[0.08em] text-muted uppercase">
          {subtitle}
        </span>
      ) : null}
    </span>
  );
}
