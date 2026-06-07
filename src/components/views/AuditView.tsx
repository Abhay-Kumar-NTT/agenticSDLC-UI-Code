import { Filter, RefreshCw } from "lucide-react";
import { auditLogs } from '../../data';

export function AuditView() {
  return (
    <div className="p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Audit Logs</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Immutable record of all platform actions</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded text-xs font-medium hover:text-foreground transition-colors flex items-center gap-1.5">
            <Filter size={11} /> Filter
          </button>
          <button className="px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded text-xs font-medium hover:text-foreground transition-colors flex items-center gap-1.5">
            <RefreshCw size={11} /> Export
          </button>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {["Timestamp", "Actor", "Action", "Resource", "Outcome"].map(h => (
                <th key={h} className="text-left px-3 py-2.5 text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {auditLogs.map(log => (
              <tr key={log.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2.5 font-mono text-muted-foreground whitespace-nowrap">{log.time}</td>
                <td className="px-3 py-2.5 text-foreground">{log.user}</td>
                <td className="px-3 py-2.5"><span className="font-mono text-xs px-1.5 py-0.5 bg-muted rounded text-foreground">{log.action}</span></td>
                <td className="px-3 py-2.5 text-primary">{log.resource}</td>
                <td className="px-3 py-2.5">
                  <span className={`text-xs font-medium ${log.outcome === "success" ? "text-green-400" : log.outcome === "warning" ? "text-amber-400" : log.outcome === "info" ? "text-blue-400" : "text-muted-foreground"}`}>
                    ● {log.outcome}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
