import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
}

export function KpiCard({ label, value, sub, icon: Icon, trend, trendUp }: KpiCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
        <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
          <Icon size={15} className="text-muted-foreground" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-semibold text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? "text-green-400" : "text-red-400"}`}>
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </div>
      )}
    </div>
  );
}
