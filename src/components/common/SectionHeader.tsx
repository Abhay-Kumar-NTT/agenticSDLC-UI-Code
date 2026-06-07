interface SectionHeaderProps {
  title: string;
  sub?: string;
  children?: React.ReactNode;
}

export function SectionHeader({ title, sub, children }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  );
}
