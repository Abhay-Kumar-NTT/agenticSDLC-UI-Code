import { useState } from "react";
import {
  Rocket, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Play,
  Pause, RotateCcw, Eye, ChevronRight, Clock, Activity, Server,
  GitBranch, Package, Shield, TrendingUp, ArrowRight, Bot, Info
} from "lucide-react";

type EnvId = "dev" | "qa" | "staging" | "production";

const environments: Record<EnvId, { label: string; color: string; status: string; version: string; lastDeploy: string; health: number; url: string; replicas: number }> = {
  dev: { label: "Development", color: "#6366f1", status: "healthy", version: "main@a3f9b12", lastDeploy: "5m ago", health: 100, url: "dev.agenticsdlc.internal", replicas: 1 },
  qa: { label: "QA", color: "#f59e0b", status: "deploying", version: "release/v2.4.1", lastDeploy: "now", health: 82, url: "qa.agenticsdlc.internal", replicas: 2 },
  staging: { label: "Staging", color: "#3b82f6", status: "healthy", version: "release/v2.4.1-rc.2", lastDeploy: "1h ago", health: 100, url: "staging.agenticsdlc.io", replicas: 3 },
  production: { label: "Production", color: "#22c55e", status: "healthy", version: "v2.4.0", lastDeploy: "2d ago", health: 99.8, url: "agenticsdlc.io", replicas: 6 },
};

const deployLogs: Record<EnvId, string[]> = {
  dev: [
    "[08:12:01] ✓ Build image agenticsdlc-core:main-a3f9b12",
    "[08:12:18] ✓ Push to ECR registry",
    "[08:12:22] ✓ kubectl apply -f k8s/dev/",
    "[08:12:24] ✓ Rollout complete — 1/1 pods running",
    "[08:12:24] ✓ Health check passed",
  ],
  qa: [
    "[14:31:00] → Starting deployment to QA",
    "[14:31:01] ✓ Image: agenticsdlc-core:release-v2.4.1",
    "[14:31:04] ✓ Draining existing pods (0/2)",
    "[14:31:12] → Rolling update in progress (1/2 pods running)…",
  ],
  staging: [
    "[13:01:00] ✓ Blue-green swap: staging-green → staging-blue",
    "[13:01:04] ✓ Traffic shifted: 100% → new pods",
    "[13:01:08] ✓ Smoke tests passed (12/12)",
    "[13:01:09] ✓ Health checks passing — 3/3 pods healthy",
    "[13:01:10] ✓ Deployment complete — v2.4.1-rc.2",
  ],
  production: [
    "[May 24 09:05:22] ✓ Canary: 5% traffic shifted",
    "[May 24 09:15:41] ✓ Canary: 25% traffic — error rate nominal",
    "[May 24 09:30:18] ✓ Full rollout: 100% traffic — v2.4.0",
    "[May 24 09:30:25] ✓ Deployment verified — all health checks passing",
  ],
};

const deployHistory = [
  { id: "d1", version: "v2.4.0", env: "production", status: "success", date: "May 24", duration: "28m", by: "DevOps Agent (AI)" },
  { id: "d2", version: "v2.4.1-rc.2", env: "staging", status: "success", date: "May 26 13:00", duration: "9m", by: "DevOps Agent (AI)" },
  { id: "d3", version: "v2.4.1", env: "qa", status: "running", date: "May 26 14:31", duration: "—", by: "DevOps Agent (AI)" },
  { id: "d4", version: "v2.3.9", env: "production", status: "rolled-back", date: "May 22", duration: "failed", by: "Emma Torres" },
  { id: "d5", version: "v2.3.8", env: "production", status: "success", date: "May 20", duration: "31m", by: "DevOps Agent (AI)" },
];

export function DeploymentView() {
  const [activeEnv, setActiveEnv] = useState<EnvId>("staging");
  const [confirmDeploy, setConfirmDeploy] = useState(false);
  const [confirmRollback, setConfirmRollback] = useState(false);
  const env = environments[activeEnv];
  const logs = deployLogs[activeEnv];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-base font-semibold text-foreground">Deployment Center</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Manage deployments, rollbacks, and release pipelines</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-blue-400 flex items-center gap-1.5 border border-blue-400/20 bg-blue-400/10 px-2.5 py-1 rounded">
            <RefreshCw size={10} className="animate-spin" /> QA deploy in progress
          </span>
        </div>
      </div>

      {/* Environment tabs */}
      <div className="px-6 pt-4 flex gap-3 border-b border-border pb-0 flex-shrink-0">
        {(Object.entries(environments) as [EnvId, typeof environments.dev][]).map(([id, e]) => (
          <button key={id} onClick={() => setActiveEnv(id)}
            className={`flex flex-col items-start gap-1 px-4 py-2.5 rounded-t-lg border border-b-0 transition-colors ${activeEnv === id ? "bg-card border-border border-b-card -mb-px z-10" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: e.status === "deploying" ? "#f59e0b" : "#22c55e" }} />
              <span className={`text-xs font-medium ${activeEnv === id ? "text-foreground" : ""}`}>{e.label}</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">{e.version}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Env status card */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{env.label} Environment</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="font-mono">{env.url}</span>
                  <span>·</span>
                  <span>{env.replicas} replica{env.replicas !== 1 ? "s" : ""}</span>
                  <span>·</span>
                  <span>Last deploy: {env.lastDeploy}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border ${env.status === "healthy" ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-blue-400/10 text-blue-400 border-blue-400/20 animate-pulse"}`}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: env.status === "healthy" ? "#22c55e" : "#3b82f6" }} />
                  {env.status}
                </span>
              </div>
            </div>

            {/* Health bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Service health</span>
                <span className={env.health >= 99 ? "text-green-400" : "text-amber-400"}>{env.health}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${env.health}%`, backgroundColor: env.health >= 99 ? "#22c55e" : "#f59e0b" }} />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Version", value: env.version, mono: true },
                { label: "Replicas", value: String(env.replicas) },
                { label: "Health", value: `${env.health}%` },
                { label: "Uptime", value: activeEnv === "production" ? "99.97%" : "100%" },
              ].map(m => (
                <div key={m.label} className="bg-muted rounded-md p-2.5 text-center">
                  <div className="text-[10px] text-muted-foreground">{m.label}</div>
                  <div className={`text-xs font-semibold text-foreground mt-0.5 ${m.mono ? "font-mono text-[10px]" : ""}`}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              {activeEnv !== "production" && (
                <button onClick={() => setConfirmDeploy(true)} className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Rocket size={12} /> Deploy to {env.label}
                </button>
              )}
              {activeEnv === "production" && (
                <button onClick={() => setConfirmDeploy(true)} className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
                  <Rocket size={12} /> Promote to Production
                </button>
              )}
              <button onClick={() => setConfirmRollback(true)} className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-medium bg-muted text-muted-foreground border border-border hover:text-foreground transition-colors">
                <RotateCcw size={12} /> Rollback
              </button>
              {env.status === "deploying" && (
                <button className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-medium bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition-colors">
                  <Pause size={12} /> Pause Rollout
                </button>
              )}
              <button className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-medium bg-muted text-muted-foreground border border-border hover:text-foreground transition-colors ml-auto">
                <Eye size={12} /> View Metrics
              </button>
            </div>
          </div>

          {/* Deploy Logs */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${env.status === "deploying" ? "bg-blue-400 animate-pulse" : "bg-green-400"}`} />
              <span className="text-xs font-semibold text-foreground">Deployment Log</span>
            </div>
            <div className="p-4 font-mono text-[11px] space-y-1 bg-[#0d0e11]">
              {logs.map((line, i) => (
                <div key={i} className={line.includes("✓") ? "text-green-400" : line.includes("→") ? "text-blue-400" : line.includes("✗") || line.includes("ERR") ? "text-red-400" : "text-muted-foreground"}>
                  {line}
                </div>
              ))}
              {env.status === "deploying" && (
                <div className="text-blue-400 animate-pulse">→ Waiting for pod readiness probe…</div>
              )}
            </div>
          </div>

          {/* Canary status for production */}
          {activeEnv === "production" && (
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Activity size={13} className="text-primary" /> Canary Strategy — v2.4.1</h4>
              <div className="space-y-2.5 text-xs">
                {[
                  { step: "5% Canary", status: "complete", errorRate: "0.1%" },
                  { step: "25% Traffic", status: "complete", errorRate: "0.2%" },
                  { step: "50% Traffic", status: "pending", errorRate: "—" },
                  { step: "Full Rollout", status: "pending", errorRate: "—" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${s.status === "complete" ? "bg-green-500 border-green-500" : "bg-transparent border-border"}`}>
                      {s.status === "complete" && <CheckCircle2 size={9} className="text-white" />}
                    </div>
                    <span className={s.status === "complete" ? "text-foreground" : "text-muted-foreground"}>{s.step}</span>
                    <span className={`ml-auto font-mono ${s.errorRate === "—" ? "text-muted-foreground" : "text-green-400"}`}>{s.errorRate !== "—" ? `${s.errorRate} errors` : s.errorRate}</span>
                  </div>
                ))}
              </div>
              <button className="mt-3 px-3 py-2 rounded text-xs font-medium bg-amber-400/10 text-amber-400 border border-amber-400/20 hover:bg-amber-400/20 transition-colors">
                Promote to 50% traffic
              </button>
            </div>
          )}
        </div>

        {/* Right: Deploy history */}
        <div className="w-72 flex-shrink-0 border-l border-border bg-card flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-xs font-semibold text-foreground">Deployment History</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {deployHistory.map(d => (
              <div key={d.id} className="p-3 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-semibold text-foreground">{d.version}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${d.status === "success" ? "bg-green-400/10 text-green-400 border-green-400/20" : d.status === "running" ? "bg-blue-400/10 text-blue-400 border-blue-400/20" : "bg-red-400/10 text-red-400 border-red-400/20"}`}>
                    {d.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="capitalize">{d.env}</span>
                  <span>·</span>
                  <span>{d.date}</span>
                  <span>·</span>
                  <span>{d.duration}</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Bot size={9} />{d.by}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirm deploy modal */}
      {confirmDeploy && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setConfirmDeploy(false)}>
          <div className="bg-card border border-border rounded-xl p-5 w-80 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center"><AlertTriangle size={16} className="text-amber-400" /></div>
              <h3 className="text-sm font-semibold text-foreground">Confirm Deployment</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-2 mb-4">Deploy <strong className="text-foreground">release/v2.4.1</strong> to <strong className="text-foreground">{env.label}</strong>? This requires approval from <strong className="text-foreground">Emma Torres</strong>.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDeploy(false)} className="flex-1 py-2 rounded text-xs font-medium bg-muted text-muted-foreground border border-border hover:text-foreground transition-colors">Cancel</button>
              <button onClick={() => setConfirmDeploy(false)} className="flex-1 py-2 rounded text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Request Approval</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm rollback modal */}
      {confirmRollback && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setConfirmRollback(false)}>
          <div className="bg-card border border-red-400/20 rounded-xl p-5 w-80 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-red-400/10 flex items-center justify-center"><RotateCcw size={16} className="text-red-400" /></div>
              <h3 className="text-sm font-semibold text-foreground">Confirm Rollback</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-2 mb-4">Roll back <strong className="text-foreground">{env.label}</strong> to the previous version? This will cause a brief outage.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmRollback(false)} className="flex-1 py-2 rounded text-xs font-medium bg-muted text-muted-foreground border border-border hover:text-foreground transition-colors">Cancel</button>
              <button onClick={() => setConfirmRollback(false)} className="flex-1 py-2 rounded text-xs font-medium bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition-colors">Rollback Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
