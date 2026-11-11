interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
}

export function SectionHeading({ id, eyebrow, title, intro }: SectionHeadingProps) {
  return (
    <header className="reveal mb-10 max-w-[70ch] md:mb-14">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 id={id} className="text-h2 font-bold tracking-tight text-ink">
        {title}
      </h2>
      {intro ? <p className="mt-3 text-lg text-muted">{intro}</p> : null}
    </header>
  );
}
