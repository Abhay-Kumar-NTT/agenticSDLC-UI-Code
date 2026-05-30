import { useState } from "react";
import {
  Activity, AlertCircle, CheckCircle2, XCircle, RefreshCw, Eye,
  Bot, Server, GitPullRequest, Layers, ArrowRight, TrendingUp,
  TrendingDown, Clock, AlertTriangle, Search, Filter, Radio
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

const metricsSeries = Array.from({ length: 24 }, (_, i) => ({
  t: `${String(i).padStart(2, "0")}:00`,
  latency: 120 + Math.round(Math.sin(i / 3) * 40 + Math.random() * 30),
  errors: parseFloat((0.3 + Math.abs(Math.sin(i / 4)) * 1.8 + (i === 9 ? 4.5 : 0)).toFixed(2)),
  throughput: 1800 + Math.round(Math.sin(i / 2) * 500 + Math.random() * 200),
  cpu: Math.round(30 + Math.sin(i / 3) * 20 + Math.random() * 15),
  memory: Math.round(55 + Math.sin(i / 5) * 12 + Math.random() * 8),
}));

const incidents = [
  {
    id: "INC-011", title: "Elevated error rate on /api/auth/refresh", severity: "P2", status: "investigating",
    opened: "42m ago", service: "Auth Service", rootCause: "Redis connection pool exhausted under concurrent token rotation load",
    linkedDeploy: "release/v2.4.1 → QA (14:31)",
    linkedPR: "PR #487 — feat: JWT refresh token rotation",
    linkedADR: "ADR-009: Token storage strategy",
    remediation: "1. Scale Redis cluster to 3 nodes\n2. Increase connection pool size from 10 → 50\n3. Add circuit breaker on Redis calls",
    confidence: 88,
  },
  {
    id: "INC-010", title: "Context graph query P95 exceeded 800ms SLO", severity: "P3", status: "resolved",
    opened: "4h ago", service: "Context Store", rootCause: "Missing index on artifact_lineage.created_at column",
    linkedDeploy: "v2.4.0 (May 24)",
    linkedPR: "PR #483 — docs: ADR-012",
    linkedADR: "ADR-010: Context graph store",
    remediation: "Added composite index on (artifact_type, created_at). Query time reduced from 820ms → 45ms.",
    confidence: 96,
  },
];

const logLines = [
  { t: "14:31:44.122", level: "ERROR", svc: "auth-service", msg: "RedisError: connect ETIMEDOUT 10.0.1.45:6379 — connection pool exhausted" },
  { t: "14:31:44.089", level: "WARN",  svc: "auth-service", msg: "Refresh token rotation slow: 2841ms (SLO: 500ms)" },
  { t: "14:31:43.901", level: "ERROR", svc: "auth-service", msg: "POST /api/auth/refresh → 500 Internal Server Error" },
  { t: "14:31:43.344", level: "INFO",  svc: "orchestrator", msg: "Workflow wf-sprint14-auth dispatched to agent-runner" },
  { t: "14:31:42.111", level: "INFO",  svc: "api-gateway",  msg: "POST /api/auth/refresh 200 OK 312ms" },
  { t: "14:31:41.888", level: "INFO",  svc: "api-gateway",  msg: "GET /api/workflows/sprint14 200 OK 48ms" },
  { t: "14:31:40.022", level: "WARN",  svc: "context-store", msg: "Slow query: SELECT * FROM artifact_lineage — 612ms" },
  { t: "14:31:39.544", level: "INFO",  svc: "github-svc",   msg: "PR #487 webhook received — running CI" },
];

const traceSpans = [
  { name: "POST /api/auth/refresh", duration: 2841, start: 0, service: "api-gateway", error: true },
  { name: "AuthController.refresh()", duration: 2839, start: 2, service: "auth-service", error: true },
  { name: "RefreshTokenService.rotate()", duration: 2835, start: 4, service: "auth-service", error: true },
  { name: "Redis.get(tokenKey)", duration: 2400, start: 10, service: "redis", error: true },
  { name: "Redis.del(tokenKey)", duration: 400, start: 350, service: "redis", error: false },
  { name: "DB.insert(refresh_token)", duration: 45, start: 760, service: "postgres", error: false },
  { name: "JwtService.sign()", duration: 3, start: 810, service: "auth-service", error: false },
];

const serviceHealth = [
  { name: "API Gateway", status: "healthy", p95: "48ms", rps: "234", errors: "0.1%" },
  { name: "Orchestration Engine", status: "healthy", p95: "112ms", rps: "18", errors: "0.2%" },
  { name: "Auth Service", status: "degraded", p95: "2841ms", rps: "42", errors: "4.8%" },
  { name: "Context Store", status: "healthy", p95: "92ms", rps: "180", errors: "0.0%" },
  { name: "GitHub Service", status: "healthy", p95: "340ms", rps: "6", errors: "0.3%" },
  { name: "Agent Runner", status: "healthy", p95: "4200ms", rps: "2", errors: "0.0%" },
];

export function ObservabilityView() {
  const [tab, setTab] = useState<"metrics" | "logs" | "traces" | "incidents" | "reliability">("metrics");
  const [logSearch, setLogSearch] = useState("");
  const [selectedIncident, setSelectedIncident] = useState<string | null>("INC-011");

  const incident = incidents.find(i => i.id === selectedIncident);

  const ChartTip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-popover border border-border rounded-lg p-2.5 text-xs shadow-xl">
        <div className="text-muted-foreground mb-1">{label}</div>
        {payload.map((p: any) => <div key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}</div>)}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-base font-semibold text-foreground">Observability Workspace</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Metrics · Logs · Traces · Incident analysis with AI root-cause</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[10px] text-red-400 border border-red-400/20 bg-red-400/10 px-2.5 py-1 rounded">
            <Radio size={9} className="animate-pulse" /> 1 active incident
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-green-400 border border-green-400/20 bg-green-400/10 px-2.5 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> 5/6 services healthy
          </span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded text-xs hover:text-foreground transition-colors">
            <RefreshCw size={11} /> Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 border-b border-border flex-shrink-0 pt-1">
        {[
          { id: "metrics", label: "Metrics", icon: Activity },
          { id: "logs", label: "Logs", icon: Server },
          { id: "traces", label: "Traces", icon: Layers },
          { id: "incidents", label: "Incidents", icon: AlertCircle },
          { id: "reliability", label: "Reliability", icon: TrendingUp },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <Icon size={11} />{t.label}
              {t.id === "incidents" && <span className="ml-0.5 px-1 bg-red-400/20 text-red-400 rounded text-[9px]">1</span>}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {/* Metrics */}
        {tab === "metrics" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {serviceHealth.map(s => (
                <div key={s.name} className={`bg-card border rounded-lg p-3 ${s.status === "degraded" ? "border-red-400/30" : "border-border"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-foreground">{s.name}</span>
                    <span className={`w-2 h-2 rounded-full ${s.status === "healthy" ? "bg-green-400" : "bg-red-400 animate-pulse"}`} />
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px]">
                    <div><div className="text-muted-foreground">P95</div><div className={`font-mono font-semibold ${s.status === "degraded" ? "text-red-400" : "text-foreground"}`}>{s.p95}</div></div>
                    <div><div className="text-muted-foreground">RPS</div><div className="font-mono font-semibold text-foreground">{s.rps}</div></div>
                    <div><div className="text-muted-foreground">Errors</div><div className={`font-mono font-semibold ${parseFloat(s.errors) > 1 ? "text-red-400" : "text-green-400"}`}>{s.errors}</div></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-xs font-semibold text-foreground mb-3">API Latency P95 (24h)</div>
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={metricsSeries}>
                    <defs><linearGradient id="obs-lat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" />
                    <XAxis dataKey="t" tick={{ fontSize: 9, fill: "#6b7598" }} axisLine={false} tickLine={false} interval={3} />
                    <YAxis tick={{ fontSize: 9, fill: "#6b7598" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Area type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={1.5} fill="url(#obs-lat)" name="Latency ms" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-xs font-semibold text-foreground mb-3">Error Rate % (24h)</div>
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={metricsSeries}>
                    <defs><linearGradient id="obs-err" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" />
                    <XAxis dataKey="t" tick={{ fontSize: 9, fill: "#6b7598" }} axisLine={false} tickLine={false} interval={3} />
                    <YAxis tick={{ fontSize: 9, fill: "#6b7598" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Area type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={1.5} fill="url(#obs-err)" name="Error %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Logs */}
        {tab === "logs" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-muted rounded px-2.5 py-1.5 flex-1 max-w-sm">
                <Search size={11} className="text-muted-foreground" />
                <input value={logSearch} onChange={e => setLogSearch(e.target.value)} placeholder="Filter logs…" className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-full" />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded text-xs hover:text-foreground transition-colors"><Filter size={11} /> Service</button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded text-xs hover:text-foreground transition-colors"><Filter size={11} /> Level</button>
              <span className="text-[10px] text-muted-foreground ml-auto">{logLines.length} lines · tail mode</span>
            </div>
            <div className="bg-[#0d0e11] border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                {logLines.filter(l => !logSearch || l.msg.toLowerCase().includes(logSearch.toLowerCase()) || l.svc.includes(logSearch)).map((log, i) => (
                  <div key={i} className={`flex items-start gap-3 px-4 py-1.5 font-mono text-[11px] border-b border-border/50 hover:bg-white/[0.03] ${log.level === "ERROR" ? "bg-red-400/[0.04]" : ""}`}>
                    <span className="text-muted-foreground flex-shrink-0 w-20">{log.t}</span>
                    <span className={`w-12 flex-shrink-0 font-bold ${log.level === "ERROR" ? "text-red-400" : log.level === "WARN" ? "text-amber-400" : "text-green-400"}`}>{log.level}</span>
                    <span className="text-blue-400 w-24 flex-shrink-0">[{log.svc}]</span>
                    <span className={log.level === "ERROR" ? "text-red-300" : log.level === "WARN" ? "text-amber-300" : "text-foreground"}>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Traces */}
        {tab === "traces" && (
          <div className="space-y-4">
            <div className="bg-card border border-red-400/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">Trace: POST /api/auth/refresh — 2841ms</div>
                  <div className="text-xs text-muted-foreground mt-0.5">14:31:44 · Trace ID: 7d3f2a9b1c48e05f</div>
                </div>
                <span className="px-2 py-0.5 rounded text-xs border bg-red-400/10 text-red-400 border-red-400/20">Error</span>
              </div>
              <div className="relative">
                {traceSpans.map((span, i) => {
                  const total = 2841;
                  const left = (span.start / total) * 100;
                  const width = Math.max((span.duration / total) * 100, 0.5);
                  const svcColors: Record<string, string> = { "api-gateway": "#3b82f6", "auth-service": "#6366f1", redis: span.error ? "#ef4444" : "#f59e0b", postgres: "#22c55e" };
                  const color = svcColors[span.service] ?? "#6b7598";
                  return (
                    <div key={i} className="flex items-center gap-3 py-1 text-xs">
                      <div className="w-52 flex-shrink-0 truncate text-foreground font-mono text-[10px]">{span.name}</div>
                      <div className="flex-1 relative h-5 bg-muted rounded">
                        <div className="absolute top-0.5 h-4 rounded" style={{ left: `${left}%`, width: `${width}%`, backgroundColor: color, opacity: 0.85 }} />
                      </div>
                      <div className="w-16 text-right text-[10px] font-mono" style={{ color }}>{span.duration}ms</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Incidents */}
        {tab === "incidents" && (
          <div className="flex gap-4">
            <div className="w-64 flex-shrink-0 space-y-2">
              {incidents.map(inc => (
                <div key={inc.id} onClick={() => setSelectedIncident(inc.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedIncident === inc.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-muted-foreground">{inc.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${inc.severity === "P2" ? "bg-red-400/10 text-red-400 border-red-400/20" : "bg-amber-400/10 text-amber-400 border-amber-400/20"}`}>{inc.severity}</span>
                  </div>
                  <div className="text-xs font-medium text-foreground leading-snug">{inc.title}</div>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                    <span className={`flex items-center gap-1 ${inc.status === "investigating" ? "text-red-400" : "text-green-400"}`}>
                      {inc.status === "investigating" ? <><Radio size={8} className="animate-pulse" /> Investigating</> : <><CheckCircle2 size={8} /> Resolved</>}
                    </span>
                    <span>· {inc.opened}</span>
                  </div>
                </div>
              ))}
            </div>
            {incident && (
              <div className="flex-1 bg-card border border-border rounded-lg p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">{incident.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${incident.severity === "P2" ? "bg-red-400/10 text-red-400 border-red-400/20" : "bg-amber-400/10 text-amber-400 border-amber-400/20"}`}>{incident.severity}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${incident.status === "investigating" ? "bg-red-400/10 text-red-400 border-red-400/20" : "bg-green-400/10 text-green-400 border-green-400/20"}`}>{incident.status}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{incident.title}</h3>
                    <div className="text-xs text-muted-foreground mt-0.5">{incident.service} · Opened {incident.opened}</div>
                  </div>
                </div>

                {/* AI Root Cause */}
                <div className="bg-blue-400/5 border border-blue-400/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot size={13} className="text-blue-400" />
                    <span className="text-xs font-semibold text-blue-400">AI Root Cause Analysis</span>
                    <span className="text-[10px] text-blue-400 ml-auto">{incident.confidence}% confidence</span>
                  </div>
                  <p className="text-xs text-foreground">{incident.rootCause}</p>
                </div>

                {/* Linked context */}
                <div className="grid grid-cols-3 gap-3 text-xs">
                  {[
                    { icon: <Clock size={11} />, label: "Linked Deploy", value: incident.linkedDeploy },
                    { icon: <GitPullRequest size={11} />, label: "Linked PR", value: incident.linkedPR },
                    { icon: <Layers size={11} />, label: "Linked ADR", value: incident.linkedADR },
                  ].map(ctx => (
                    <div key={ctx.label} className="bg-muted rounded-md p-2.5 cursor-pointer hover:bg-sidebar-accent transition-colors">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">{ctx.icon}<span className="text-[10px] font-medium">{ctx.label}</span></div>
                      <div className="text-foreground text-[10px] truncate">{ctx.value}</div>
                    </div>
                  ))}
                </div>

                {/* Remediation */}
                <div>
                  <div className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5"><ArrowRight size={11} className="text-primary" /> Suggested Remediation</div>
                  <div className="bg-muted rounded-lg p-3 font-mono text-[11px] text-foreground whitespace-pre-line">{incident.remediation}</div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button className="px-4 py-2 rounded text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Apply Remediation</button>
                  <button className="px-4 py-2 rounded text-xs font-medium bg-green-400/10 text-green-400 border border-green-400/20 hover:bg-green-400/20 transition-colors">Resolve</button>
                  <button className="px-4 py-2 rounded text-xs font-medium bg-muted text-muted-foreground border border-border hover:text-foreground transition-colors">Create Post-mortem</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reliability */}
        {tab === "reliability" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "SLO Compliance", value: "99.7%", target: "99.9%", ok: false },
                { label: "MTTR", value: "42m", target: "< 60m", ok: true },
                { label: "MTTD", value: "8m", target: "< 15m", ok: true },
                { label: "Error Budget Left", value: "71%", target: "per 30d", ok: true },
              ].map(m => (
                <div key={m.label} className={`bg-card border rounded-lg p-3 ${!m.ok ? "border-amber-400/20" : "border-border"}`}>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{m.label}</div>
                  <div className={`text-xl font-bold mt-1 ${m.ok ? "text-green-400" : "text-amber-400"}`}>{m.value}</div>
                  <div className="text-[10px] text-muted-foreground">{m.ok ? "✓" : "⚠"} Target: {m.target}</div>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">CPU & Memory — 24h</h4>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={metricsSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" />
                  <XAxis dataKey="t" tick={{ fontSize: 9, fill: "#6b7598" }} axisLine={false} tickLine={false} interval={3} />
                  <YAxis tick={{ fontSize: 9, fill: "#6b7598" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="CPU %" />
                  <Line type="monotone" dataKey="memory" stroke="#a855f7" strokeWidth={1.5} dot={false} name="Memory %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
