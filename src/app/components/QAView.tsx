import { useState } from "react";
import {
  FlaskConical, CheckCircle2, XCircle, AlertTriangle, RefreshCw,
  Bot, FileText, Target, TrendingUp, Filter, Plus, Eye, ChevronRight,
  ListChecks, Activity, Shield
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const coverageData = [
  { name: "Covered", value: 78 },
  { name: "Uncovered", value: 22 },
];
const COLORS = ["#22c55e", "#1e2232"];

const trendData = [
  { sprint: "S11", coverage: 61, passed: 142, failed: 8 },
  { sprint: "S12", coverage: 68, passed: 178, failed: 5 },
  { sprint: "S13", coverage: 73, passed: 201, failed: 3 },
  { sprint: "S14", coverage: 78, passed: 224, failed: 4 },
];

const testSuites = [
  { id: "ts1", name: "Auth Service — Unit Tests", tests: 87, passed: 87, failed: 0, skipped: 0, duration: "34s", status: "passing" as const },
  { id: "ts2", name: "Auth Service — Integration Tests", tests: 24, passed: 22, failed: 2, skipped: 0, duration: "1m 12s", status: "failing" as const },
  { id: "ts3", name: "Orchestration Engine — Unit Tests", tests: 56, passed: 56, failed: 0, skipped: 2, duration: "28s", status: "passing" as const },
  { id: "ts4", name: "Payment Flow — E2E Tests", tests: 18, passed: 14, failed: 1, skipped: 3, duration: "3m 44s", status: "failing" as const },
  { id: "ts5", name: "Context Graph — Unit Tests", tests: 39, passed: 39, failed: 0, skipped: 0, duration: "18s", status: "passing" as const },
];

const failedTests = [
  { id: "ft1", name: "should return 401 when refresh token is expired", suite: "Auth Integration", error: "AssertionError: expected 200 to equal 401 — token expiry not enforced in test DB", ai: "Test DB clock not frozen. Add jest.setSystemTime() before token creation." },
  { id: "ft2", name: "should rollback payment on gateway timeout", suite: "Payment E2E", error: "TimeoutError: Exceeded 5000ms waiting for rollback event on EventBus", ai: "Rollback listener registered after event dispatch. Move subscription to beforeEach." },
  { id: "ft3", name: "POST /api/auth/refresh — rate limit after 5 attempts", suite: "Auth Integration", error: "Expected 429, received 200 — rate limiter middleware not applied to test router", ai: "Apply rateLimiter middleware to the test app router in beforeAll block." },
];

const traceability = [
  { story: "GH-142", title: "JWT refresh token rotation", tests: 18, covered: 18, risk: "Low" },
  { story: "GH-141", title: "API gateway rate limiting", tests: 6, covered: 4, risk: "Medium" },
  { story: "GH-140", title: "Dashboard KPI widgets", tests: 12, covered: 8, risk: "Medium" },
  { story: "GH-139", title: "Payment checkout E2E", tests: 18, covered: 14, risk: "High" },
  { story: "GH-136", title: "Workflow canvas drag & drop", tests: 9, covered: 9, risk: "Low" },
];

const flaky = [
  { name: "should handle concurrent token refresh requests", flakeRate: "34%", runs: 50, suite: "Auth Integration" },
  { name: "context graph query returns in <100ms", flakeRate: "18%", runs: 50, suite: "Context Graph" },
];

export function QAView() {
  const [tab, setTab] = useState<"coverage" | "failed" | "regression" | "traceability" | "risk">("coverage");

  const totalTests = testSuites.reduce((a, s) => a + s.tests, 0);
  const totalPassed = testSuites.reduce((a, s) => a + s.passed, 0);
  const totalFailed = testSuites.reduce((a, s) => a + s.failed, 0);

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
          <h2 className="text-base font-semibold text-foreground">QA & Validation Workspace</h2>
          <p className="text-xs text-muted-foreground mt-0.5">AI-assisted quality engineering with requirement traceability</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className={`text-[10px] px-2.5 py-1 rounded border flex items-center gap-1.5 ${totalFailed > 0 ? "bg-red-400/10 text-red-400 border-red-400/20" : "bg-green-400/10 text-green-400 border-green-400/20"}`}>
            {totalFailed > 0 ? <><XCircle size={10} /> {totalFailed} failing tests</> : <><CheckCircle2 size={10} /> All tests passing</>}
          </span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-medium hover:bg-primary/20 transition-colors">
            <Bot size={11} /> AI Analyse
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded text-xs font-medium hover:text-foreground transition-colors">
            <RefreshCw size={11} /> Run All
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="px-6 py-3 border-b border-border grid grid-cols-5 gap-4 flex-shrink-0 bg-card/50">
        {[
          { label: "Total Tests", value: String(totalTests), color: "text-foreground" },
          { label: "Passing", value: String(totalPassed), color: "text-green-400" },
          { label: "Failing", value: String(totalFailed), color: "text-red-400" },
          { label: "Coverage", value: "78%", color: "text-blue-400" },
          { label: "Reliability Score", value: "94.2", color: "text-purple-400" },
        ].map(k => (
          <div key={k.label} className="text-center">
            <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[10px] text-muted-foreground">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 px-6 border-b border-border flex-shrink-0 pt-1">
        {[
          { id: "coverage", label: "Test Coverage", icon: Target },
          { id: "failed", label: "Failed Tests", icon: XCircle },
          { id: "regression", label: "Regression", icon: Activity },
          { id: "traceability", label: "Req. Traceability", icon: ListChecks },
          { id: "risk", label: "Risk Analysis", icon: Shield },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <Icon size={11} />{t.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {/* Coverage */}
        {tab === "coverage" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
                <div style={{ width: 80, height: 80 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={coverageData} cx="50%" cy="50%" innerRadius={25} outerRadius={38} dataKey="value" startAngle={90} endAngle={-270}>
                        {coverageData.map((_, i) => <Cell key={i} fill={COLORS[i]} strokeWidth={0} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">78%</div>
                  <div className="text-xs text-muted-foreground">Code Coverage</div>
                  <div className="text-[10px] text-amber-400 mt-1">⚠ Target: 85%</div>
                </div>
              </div>
              <div className="md:col-span-2 bg-card border border-border rounded-lg p-4">
                <div className="text-xs font-semibold text-foreground mb-3">Coverage Trend — Last 4 Sprints</div>
                <ResponsiveContainer width="100%" height={100}>
                  <BarChart data={trendData} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" />
                    <XAxis dataKey="sprint" tick={{ fontSize: 9, fill: "#6b7598" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "#6b7598" }} axisLine={false} tickLine={false} domain={[50, 100]} />
                    <Tooltip content={<ChartTip />} />
                    <Bar dataKey="coverage" fill="#22c55e" radius={[2, 2, 0, 0]} name="Coverage %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border">
                  {["Suite", "Tests", "Passed", "Failed", "Skipped", "Duration", "Status"].map(h => <th key={h} className="text-left px-4 py-2.5 text-muted-foreground font-medium">{h}</th>)}
                </tr></thead>
                <tbody>
                  {testSuites.map(s => (
                    <tr key={s.id} className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-4 py-2.5 font-medium text-foreground">{s.name}</td>
                      <td className="px-4 py-2.5 font-mono text-muted-foreground">{s.tests}</td>
                      <td className="px-4 py-2.5 font-mono text-green-400">{s.passed}</td>
                      <td className="px-4 py-2.5 font-mono text-red-400">{s.failed || "—"}</td>
                      <td className="px-4 py-2.5 font-mono text-muted-foreground">{s.skipped || "—"}</td>
                      <td className="px-4 py-2.5 font-mono text-muted-foreground">{s.duration}</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${s.status === "passing" ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-red-400/10 text-red-400 border-red-400/20"}`}>{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Failed Tests */}
        {tab === "failed" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{totalFailed} failing tests across {testSuites.filter(s => s.status === "failing").length} suites</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-medium hover:bg-primary/20 transition-colors"><Bot size={11} /> AI Diagnose All</button>
            </div>
            {failedTests.map(ft => (
              <div key={ft.id} className="bg-card border border-red-400/20 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <XCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{ft.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{ft.suite}</div>
                  </div>
                </div>
                <div className="bg-red-400/5 border border-red-400/10 rounded p-2.5 font-mono text-[10px] text-red-300">{ft.error}</div>
                <div className="flex items-start gap-2 bg-blue-400/5 border border-blue-400/10 rounded p-2.5">
                  <Bot size={11} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-blue-400 font-medium mb-0.5">AI Diagnosis</div>
                    <div className="text-[10px] text-foreground">{ft.ai}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">Auto-fix</button>
                  <button className="px-3 py-1.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border hover:text-foreground transition-colors">View Diff</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Regression */}
        {tab === "regression" && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Flaky Test Analysis</h4>
              <div className="space-y-3">
                {flaky.map(f => (
                  <div key={f.name} className="flex items-center gap-4 py-2 border-b border-border last:border-0 text-xs">
                    <div className="flex-1 min-w-0">
                      <div className="text-foreground font-medium truncate">{f.name}</div>
                      <div className="text-muted-foreground mt-0.5">{f.suite} · {f.runs} runs</div>
                    </div>
                    <div className="text-amber-400 font-semibold">{f.flakeRate}</div>
                    <div className="flex items-center gap-1.5 text-amber-400 text-[10px]"><AlertTriangle size={10} /> Flaky</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Test Run History</h4>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={trendData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" />
                  <XAxis dataKey="sprint" tick={{ fontSize: 9, fill: "#6b7598" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#6b7598" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="passed" fill="#22c55e" radius={[2, 2, 0, 0]} name="Passed" />
                  <Bar dataKey="failed" fill="#ef4444" radius={[2, 2, 0, 0]} name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Traceability */}
        {tab === "traceability" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Requirement-to-test coverage map</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-medium hover:bg-primary/20 transition-colors"><Bot size={11} /> Detect Missing Tests</button>
            </div>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border">
                  {["Story", "Title", "Tests", "Covered", "Gap", "Risk"].map(h => <th key={h} className="text-left px-4 py-2.5 text-muted-foreground font-medium">{h}</th>)}
                </tr></thead>
                <tbody>
                  {traceability.map(row => {
                    const pct = Math.round((row.covered / row.tests) * 100);
                    return (
                      <tr key={row.story} className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer">
                        <td className="px-4 py-3 font-mono text-primary">{row.story}</td>
                        <td className="px-4 py-3 text-foreground max-w-xs truncate">{row.title}</td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">{row.tests}</td>
                        <td className="px-4 py-3 font-mono text-green-400">{row.covered}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-green-400" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="font-mono text-muted-foreground">{pct}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${row.risk === "Low" ? "bg-green-400/10 text-green-400 border-green-400/20" : row.risk === "Medium" ? "bg-amber-400/10 text-amber-400 border-amber-400/20" : "bg-red-400/10 text-red-400 border-red-400/20"}`}>{row.risk}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Risk */}
        {tab === "risk" && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 p-3 bg-amber-400/5 border border-amber-400/20 rounded-lg text-xs text-amber-400 mb-4">
              <AlertTriangle size={12} /> AI detected 3 high-risk gaps. Review before proceeding to deployment.
            </div>
            {[
              { area: "Auth Token Security", risk: "High", desc: "2 failing integration tests in token rotation suite. Potential replay attack vulnerability if deployed.", action: "Block deployment until tests pass" },
              { area: "Payment Flow E2E", risk: "High", desc: "1 failing E2E test for rollback on gateway timeout. Data integrity risk under network failure.", action: "Fix rollback listener registration" },
              { area: "API Rate Limiting", risk: "Medium", desc: "4/6 rate limiting stories covered. Edge cases for burst traffic and IP rotation untested.", action: "Add missing test scenarios" },
              { area: "Context Graph Concurrency", risk: "Medium", desc: "Flaky test at 18% failure rate under concurrent reads. May degrade under load.", action: "Investigate locking strategy in test setup" },
            ].map(r => (
              <div key={r.area} className={`bg-card border rounded-lg p-4 ${r.risk === "High" ? "border-red-400/20" : "border-amber-400/20"}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="text-sm font-semibold text-foreground">{r.area}</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${r.risk === "High" ? "bg-red-400/10 text-red-400 border-red-400/20" : "bg-amber-400/10 text-amber-400 border-amber-400/20"}`}>{r.risk}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{r.desc}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-foreground bg-muted rounded px-2.5 py-1.5">
                  <Target size={9} className="text-primary" /> Recommended: {r.action}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
