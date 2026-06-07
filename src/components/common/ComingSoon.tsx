interface ComingSoonProps {
  title: string;
  icon: React.ElementType;
}

export function ComingSoon({ title, icon: Icon }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 text-center">
      <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
        <Icon size={24} className="text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-base font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">This workspace is part of the full platform rollout.</p>
      </div>
      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
        Request Early Access
      </button>
    </div>
  );
}
