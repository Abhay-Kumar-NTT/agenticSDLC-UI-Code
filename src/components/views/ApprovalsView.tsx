import { useState, useCallback } from "react";
import { AlertTriangle, Clock, ThumbsUp, ThumbsDown, ArrowRight } from "lucide-react";
import { approvals } from '../../data';
import { Status } from '../../types';
import { StatusBadge, RiskBadge } from '../common';

export function ApprovalsView() {
  const [items, setItems] = useState(approvals);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const act = useCallback((id: string, action: "approve" | "reject" | "escalate") => {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, status: action === "approve" ? "completed" : action === "reject" ? "failed" : "blocked" as Status }
        : item
    ));
  }, []);

  const filtered = filterStatus === "All" ? items : items.filter(i => {
    if (filterStatus === "Pending") return i.status === "pending";
    if (filterStatus === "Blocked") return i.status === "blocked";
    if (filterStatus === "Resolved") return ["completed", "failed"].includes(i.status);
    return true;
  });

  const pending = items.filter(i => i.status === "pending").length;
  const overdue = items.filter(i => i.sla === "OVERDUE").length;

  return (
    <div className="p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Approval Workflows</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Human governance layer for critical AI actions</p>
        </div>
        <div className="flex items-center gap-3">
          {overdue > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-400/10 border border-red-400/20 rounded text-xs text-red-400 font-medium">
              <AlertTriangle size={11} /> {overdue} overdue approval{overdue > 1 ? "s" : ""}
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded text-xs text-amber-400 font-medium">
            <Clock size={11} /> {pending} pending
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {["All", "Pending", "Blocked", "Resolved"].map(f => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${filterStatus === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {["Item", "Workflow", "Agent", "Risk", "Approver", "Status", "SLA", "Actions"].map(h => (
                <th key={h} className="text-left px-3 py-2.5 text-muted-foreground font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-3 py-3 max-w-xs">
                  <div className="font-medium text-foreground truncate">{item.item}</div>
                </td>
                <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{item.workflow}</td>
                <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{item.agent}</td>
                <td className="px-3 py-3"><RiskBadge risk={item.risk} /></td>
                <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{item.approver}</td>
                <td className="px-3 py-3"><StatusBadge status={item.status} /></td>
                <td className="px-3 py-3">
                  <span className={`font-mono text-xs ${item.sla === "OVERDUE" ? "text-red-400 font-bold" : "text-muted-foreground"}`}>
                    {item.sla}
                  </span>
                </td>
                <td className="px-3 py-3">
                  {item.status === "pending" || item.status === "blocked" ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => act(item.id, "approve")}
                        className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-xs font-medium hover:bg-green-500/20 transition-colors flex items-center gap-1"
                      >
                        <ThumbsUp size={10} /> Approve
                      </button>
                      <button
                        onClick={() => act(item.id, "reject")}
                        className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-xs font-medium hover:bg-red-500/20 transition-colors flex items-center gap-1"
                      >
                        <ThumbsDown size={10} /> Reject
                      </button>
                      <button
                        onClick={() => act(item.id, "escalate")}
                        className="px-2 py-1 bg-muted text-muted-foreground border border-border rounded text-xs font-medium hover:text-foreground transition-colors flex items-center gap-1"
                      >
                        <ArrowRight size={10} /> Escalate
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {item.status === "completed" ? "✓ Approved" : item.status === "failed" ? "✗ Rejected" : "—"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
