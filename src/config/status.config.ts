// Status configuration for badges and visual indicators
import { Status } from '../types';

export const statusConfig: Record<Status, { label: string; color: string; dot: string }> = {
  running:   { label: "Running",   color: "text-blue-400 bg-blue-400/10 border-blue-400/20",   dot: "bg-blue-400" },
  completed: { label: "Completed", color: "text-green-400 bg-green-400/10 border-green-400/20", dot: "bg-green-400" },
  failed:    { label: "Failed",    color: "text-red-400 bg-red-400/10 border-red-400/20",       dot: "bg-red-400" },
  waiting:   { label: "Waiting",   color: "text-slate-400 bg-slate-400/10 border-slate-400/20", dot: "bg-slate-400" },
  blocked:   { label: "Blocked",   color: "text-amber-400 bg-amber-400/10 border-amber-400/20", dot: "bg-amber-400" },
  retrying:  { label: "Retrying",  color: "text-purple-400 bg-purple-400/10 border-purple-400/20", dot: "bg-purple-400" },
  pending:   { label: "Pending",   color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", dot: "bg-yellow-400" },
};

export const nodeColorByType: Record<string, string> = {
  strategic: "#3b82f6",
  engineering: "#22c55e",
  governance: "#f59e0b",
  operational: "#a855f7",
  Strategic: "#6366f1",
  Analysis: "#8b5cf6",
  Architecture: "#f59e0b",
  Development: "#22c55e",
  QA: "#a855f7",
  Reviews: "#ec4899",
  Operations: "#3b82f6",
  Observability: "#ef4444"
};

export const statusFillByStatus: Record<Status, string> = {
  completed: "#22c55e",
  running: "#3b82f6",
  waiting: "#374151",
  failed: "#ef4444",
  blocked: "#f59e0b",
  retrying: "#a855f7",
  pending: "#6b7598"
};
