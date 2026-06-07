export function RiskBadge({ risk }: { risk: string }) {
  const cfg: Record<string, string> = {
    Low: "text-green-400 bg-green-400/10 border-green-400/20",
    Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    High: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    Critical: "text-red-400 bg-red-400/10 border-red-400/20",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${cfg[risk] ?? cfg.Medium}`}>
      {risk}
    </span>
  );
}
