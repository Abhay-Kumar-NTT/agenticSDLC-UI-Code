import {
  Workflow, CheckSquare, AlertTriangle, Rocket, Bot, AlertCircle,
  CheckCircle2, ArrowRight, GitPullRequest, FileText
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ViewId } from '../../types';
import { metricsData, deployData, activityFeed, pullRequests } from '../../data';
import { KpiCard, SectionHeader, StatusBadge, ChartTooltip } from '../common';

export function DashboardView({ setView }: { setView: (v: ViewId) => void }) {

  return (
    <div className="p-6 space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard label="Active Workflows" value="12" sub="4 awaiting approval" icon={Workflow} trend="+3 vs yesterday" trendUp />
        <KpiCard label="Pending Approvals" value="7" sub="2 critical, 1 overdue" icon={CheckSquare} trend="1 overdue" trendUp={false} />
        <KpiCard label="Open Risks" value="3" sub="1 critical severity" icon={AlertTriangle} trend="-2 resolved today" trendUp />
        <KpiCard label="Deployment Health" value="98.2%" sub="Staging — healthy" icon={Rocket} trend="+0.4% uptime" trendUp />
        <KpiCard label="AI Agent Health" value="9/11" sub="2 agents blocked" icon={Bot} trend="2 need attention" trendUp={false} />
        <KpiCard label="Active Incidents" value="2" sub="P2 — investigating" icon={AlertCircle} trend="-1 resolved today" trendUp />
      </div>

      {/* Workflow Timeline */}
      <div className="bg-card border border-border rounded-lg p-4">
        <SectionHeader title="SDLC Workflow Progress" sub="Current sprint — User Auth Module v2.4.1" />
        <div className="flex items-center gap-0">
          {[
            { label: "Vision", done: true }, { label: "PRD", done: true },
            { label: "Stories", done: true }, { label: "Architecture", done: false, active: true },
            { label: "Development", done: false }, { label: "QA", done: false },
            { label: "Deployment", done: false },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  step.done ? "bg-green-500 border-green-500 text-white"
                  : step.active ? "bg-blue-500/20 border-blue-500 text-blue-400 animate-pulse"
                  : "bg-muted border-border text-muted-foreground"
                }`}>
                  {step.done ? <CheckCircle2 size={13} /> : i + 1}
                </div>
                <span className={`text-xs font-medium truncate max-w-full ${step.done ? "text-green-400" : step.active ? "text-blue-400" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className={`h-0.5 flex-shrink-0 w-8 -mx-1 ${step.done ? "bg-green-500/50" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
          <SectionHeader title="AI Agent Activity" sub="Real-time execution feed">
            <button onClick={() => setView("agents")} className="text-xs text-primary hover:underline flex items-center gap-1">
              View all agents <ArrowRight size={11} />
            </button>
          </SectionHeader>
          <div className="space-y-2">
            {activityFeed.map(item => (
              <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  item.status === "completed" ? "bg-green-500/10" : item.status === "blocked" ? "bg-amber-500/10" : "bg-blue-500/10"
                }`}>
                  <Bot size={11} className={
                    item.status === "completed" ? "text-green-400" : item.status === "blocked" ? "text-amber-400" : "text-blue-400"
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">{item.agent}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{item.action}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <FileText size={10} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-primary truncate">{item.artifact}</span>
                    <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">{item.time}</span>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Activity */}
        <div className="bg-card border border-border rounded-lg p-4">
          <SectionHeader title="GitHub Activity" sub="Live repository signals">
            <button onClick={() => setView("pull-requests")} className="text-xs text-primary hover:underline flex items-center gap-1">
              View PRs <ArrowRight size={11} />
            </button>
          </SectionHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Pull Requests</div>
              {pullRequests.slice(0, 3).map(pr => (
                <div key={pr.id} className="flex items-center gap-2 py-1.5 hover:bg-muted/40 rounded px-1.5 cursor-pointer group">
                  <GitPullRequest size={12} className={pr.status === "merged" ? "text-purple-400" : "text-blue-400"} />
                  <span className="text-xs text-foreground truncate flex-1">{pr.title}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${pr.checks === "passing" ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"}`}>
                    {pr.checks === "passing" ? "✓" : "✗"}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-1.5">
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Deployments</div>
              {[
                { env: "staging", status: "healthy", time: "1h ago" },
                { env: "qa", status: "healthy", time: "3h ago" },
                { env: "production", status: "v2.4.0 — stable", time: "2d ago" },
              ].map(d => (
                <div key={d.env} className="flex items-center gap-2 py-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                  <span className="text-xs font-mono text-foreground">{d.env}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{d.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <SectionHeader title="API Latency & Errors" sub="Last 24 hours" />
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={metricsData}>
              <defs>
                <linearGradient id="dashboard-lat-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#6b7598" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#6b7598" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={1.5} fill="url(#dashboard-lat-gradient)" name="Latency (ms)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <SectionHeader title="Deployments — 7 Days" sub="Success vs failed runs" />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={deployData} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6b7598" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#6b7598" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="success" fill="#22c55e" radius={[3, 3, 0, 0]} name="Success" />
              <Bar dataKey="failed" fill="#ef4444" radius={[3, 3, 0, 0]} name="Failed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
