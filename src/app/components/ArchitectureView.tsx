import { useState } from "react";
import {
  Network, FileText, Layers, Braces, Server, Shield, TrendingUp,
  Plus, ChevronRight, AlertTriangle, CheckCircle2, Info, RefreshCw,
  Eye, ThumbsUp, ThumbsDown, Bot, GitBranch, ExternalLink, Activity
} from "lucide-react";

const adrs = [
  { id: "adr012", title: "ADR-012: Adopt Event Sourcing for Order Processing", status: "Accepted", date: "May 23, 2026", author: "Solution Architect (AI)", risk: "Medium" },
  { id: "adr011", title: "ADR-011: Use React Flow for Workflow Visualization", status: "Accepted", date: "May 18, 2026", author: "Solution Architect (AI)", risk: "Low" },
  { id: "adr010", title: "ADR-010: PostgreSQL as Context Graph Store", status: "Proposed", date: "May 26, 2026", author: "Solution Architect (AI)", risk: "High" },
  { id: "adr009", title: "ADR-009: Claude API as Primary LLM Provider", status: "Accepted", date: "May 10, 2026", author: "Solution Architect (AI)", risk: "Medium" },
  { id: "adr008", title: "ADR-008: GitHub Actions for CI/CD Orchestration", status: "Deprecated", date: "Apr 28, 2026", author: "DevOps Agent (AI)", risk: "Low" },
];

const aiRecommendations = [
  { type: "warning", title: "Single-DB Write Bottleneck", desc: "Context graph writes may saturate PostgreSQL under concurrent agent workflows. Consider read replicas or CQRS split.", severity: "High" },
  { type: "info", title: "API Gateway Missing Rate Limiting", desc: "No rate limiting layer detected on external API contract. Recommend adding token-bucket throttling per tenant.", severity: "Medium" },
  { type: "success", title: "Microservices Boundaries Well-Defined", desc: "Service decomposition follows domain-driven boundaries with no circular dependencies detected.", severity: "Good" },
  { type: "warning", title: "No Circuit Breaker on Agent Calls", desc: "Agent orchestration calls to Claude API lack retry and circuit-breaker patterns. Risk of cascading failures.", severity: "High" },
];

const services = [
  { id: "api-gw", name: "API Gateway", type: "Infrastructure", tech: "Kong", deps: ["orchestrator", "auth"] },
  { id: "orchestrator", name: "Orchestration Engine", type: "Core", tech: "Node.js", deps: ["agent-runner", "context-store", "github-svc"] },
  { id: "agent-runner", name: "Agent Runner", type: "AI", tech: "Python", deps: ["claude-api"] },
  { id: "context-store", name: "Context Store", type: "Data", tech: "PostgreSQL", deps: [] },
  { id: "github-svc", name: "GitHub Service", type: "Integration", tech: "Node.js", deps: ["github-api"] },
  { id: "auth", name: "Auth Service", type: "Core", tech: "Node.js", deps: ["context-store"] },
  { id: "ui", name: "Web UI", type: "Frontend", tech: "React/TS", deps: ["api-gw"] },
  { id: "claude-api", name: "Claude API", type: "External", tech: "Anthropic", deps: [] },
  { id: "github-api", name: "GitHub API", type: "External", tech: "REST/GQL", deps: [] },
];

const apiContracts = [
  { name: "POST /workflows", desc: "Initiate a new SDLC workflow run", method: "POST", auth: true, version: "v1" },
  { name: "GET /workflows/:id", desc: "Get workflow state and node statuses", method: "GET", auth: true, version: "v1" },
  { name: "POST /agents/:id/run", desc: "Trigger a specific agent execution", method: "POST", auth: true, version: "v1" },
  { name: "GET /artifacts/:id", desc: "Retrieve a versioned artifact", method: "GET", auth: true, version: "v1" },
  { name: "POST /approvals/:id/approve", desc: "Approve a pending governance gate", method: "POST", auth: true, version: "v1" },
  { name: "GET /context-graph", desc: "Query the artifact lineage graph", method: "GET", auth: true, version: "v1" },
];

const typeColor: Record<string, string> = { Core: "#3b82f6", AI: "#a855f7", Infrastructure: "#f59e0b", Data: "#22c55e", Integration: "#06b6d4", Frontend: "#6366f1", External: "#6b7598" };

export function ArchitectureView() {
  const [tab, setTab] = useState<"hld" | "lld" | "apis" | "adrs" | "infra" | "security" | "scalability">("hld");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [adrFilter, setAdrFilter] = useState("All");

  const tabs = [
    { id: "hld", label: "HLD", icon: Network },
    { id: "lld", label: "LLD", icon: Layers },
    { id: "apis", label: "APIs", icon: Braces },
    { id: "adrs", label: "ADRs", icon: FileText },
    { id: "infra", label: "Infrastructure", icon: Server },
    { id: "security", label: "Security", icon: Shield },
    { id: "scalability", label: "Scalability", icon: TrendingUp },
  ] as const;

  const sel = services.find(s => s.id === selectedService);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-base font-semibold text-foreground">Architecture Workspace</h2>
          <p className="text-xs text-muted-foreground mt-0.5">AI-generated architecture artifacts with human review gates</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-amber-400 flex items-center gap-1 border border-amber-400/20 bg-amber-400/10 px-2 py-1 rounded">
            <AlertTriangle size={10} /> ADR-010 awaiting approval
          </span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-medium hover:bg-primary/20 transition-colors">
            <Bot size={11} /> Re-generate
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 px-6 border-b border-border flex-shrink-0 pt-1">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <Icon size={11} />{t.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* HLD Tab */}
          {tab === "hld" && (
            <div className="space-y-5">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">High-Level Architecture — AgenticSDLC v2</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle2 size={10} /> Approved by James Park</span>
                    <button className="p-1.5 hover:bg-muted rounded"><Eye size={12} className="text-muted-foreground" /></button>
                  </div>
                </div>
                {/* Architecture diagram */}
                <div className="relative bg-background rounded-lg border border-border overflow-hidden" style={{ height: 340 }}>
                  <svg width="100%" height="100%" viewBox="0 0 820 320">
                    {/* Layers */}
                    <rect x={20} y={10} width={780} height={60} rx={6} fill="rgba(99,102,241,0.06)" stroke="rgba(99,102,241,0.2)" strokeWidth={1} strokeDasharray="4 2" />
                    <text x={30} y={27} fontSize={9} fill="#6366f1" fontFamily="Inter" fontWeight={600}>FRONTEND LAYER</text>

                    <rect x={20} y={82} width={780} height={80} rx={6} fill="rgba(59,130,246,0.06)" stroke="rgba(59,130,246,0.2)" strokeWidth={1} strokeDasharray="4 2" />
                    <text x={30} y={99} fontSize={9} fill="#3b82f6" fontFamily="Inter" fontWeight={600}>API GATEWAY + ORCHESTRATION LAYER</text>

                    <rect x={20} y={174} width={780} height={80} rx={6} fill="rgba(168,85,247,0.06)" stroke="rgba(168,85,247,0.2)" strokeWidth={1} strokeDasharray="4 2" />
                    <text x={30} y={191} fontSize={9} fill="#a855f7" fontFamily="Inter" fontWeight={600}>AI AGENT + SERVICE LAYER</text>

                    <rect x={20} y={266} width={780} height={46} rx={6} fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.2)" strokeWidth={1} strokeDasharray="4 2" />
                    <text x={30} y={283} fontSize={9} fill="#22c55e" fontFamily="Inter" fontWeight={600}>DATA + INTEGRATION LAYER</text>

                    {/* Service boxes */}
                    {[
                      { x: 340, y: 20, w: 120, label: "Web UI", sub: "React/TypeScript", color: "#6366f1" },
                      { x: 40, y: 94, w: 100, label: "API Gateway", sub: "Kong", color: "#3b82f6" },
                      { x: 160, y: 94, w: 120, label: "Orchestration Engine", sub: "Node.js", color: "#3b82f6" },
                      { x: 300, y: 94, w: 100, label: "Auth Service", sub: "Node.js", color: "#3b82f6" },
                      { x: 420, y: 94, w: 100, label: "GitHub Service", sub: "Node.js", color: "#06b6d4" },
                      { x: 40, y: 186, w: 110, label: "Agent Runner", sub: "Python", color: "#a855f7" },
                      { x: 170, y: 186, w: 110, label: "QA Agent", sub: "Python", color: "#a855f7" },
                      { x: 300, y: 186, w: 110, label: "DevOps Agent", sub: "Python", color: "#a855f7" },
                      { x: 430, y: 186, w: 120, label: "Security Agent", sub: "Python", color: "#f59e0b" },
                      { x: 40, y: 278, w: 110, label: "Context Store", sub: "PostgreSQL", color: "#22c55e" },
                      { x: 170, y: 278, w: 110, label: "Event Bus", sub: "Kafka", color: "#22c55e" },
                      { x: 560, y: 94, w: 110, label: "Claude API", sub: "Anthropic", color: "#6b7598" },
                      { x: 680, y: 94, w: 100, label: "GitHub API", sub: "REST/GQL", color: "#6b7598" },
                    ].map((s, i) => (
                      <g key={i}>
                        <rect x={s.x} y={s.y} width={s.w} height={40} rx={5} fill="#13151c" stroke={s.color} strokeWidth={1} opacity={0.9} />
                        <text x={s.x + s.w / 2} y={s.y + 15} textAnchor="middle" fontSize={9} fontWeight={600} fill="#e8eaf0" fontFamily="Inter">{s.label}</text>
                        <text x={s.x + s.w / 2} y={s.y + 28} textAnchor="middle" fontSize={8} fill={s.color} fontFamily="Inter">{s.sub}</text>
                      </g>
                    ))}

                    {/* Arrows */}
                    {[
                      [400, 60, 400, 94], [200, 134, 200, 186], [110, 134, 100, 186],
                      [350, 134, 355, 186], [485, 134, 490, 186], [95, 226, 95, 278],
                    ].map(([x1,y1,x2,y2], i) => (
                      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(148,163,184,0.25)" strokeWidth={1} markerEnd="url(#a)" />
                    ))}
                    <defs><marker id="a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="rgba(148,163,184,0.4)" /></marker></defs>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* LLD Tab */}
          {tab === "lld" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground">Service Dependency Map</h3>
                <span className="text-xs text-muted-foreground">{services.length} services · click a service for details</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {services.map(svc => {
                  const col = typeColor[svc.type];
                  const isSelected = selectedService === svc.id;
                  return (
                    <div key={svc.id} onClick={() => setSelectedService(isSelected ? null : svc.id)}
                      className={`bg-card border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${isSelected ? "border-primary shadow-sm" : "border-border hover:border-primary/30"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: `${col}18`, color: col }}>{svc.type}</span>
                      </div>
                      <div className="text-sm font-semibold text-foreground">{svc.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">{svc.tech}</div>
                      {svc.deps.length > 0 && (
                        <div className="mt-2 text-[10px] text-muted-foreground">→ {svc.deps.length} deps</div>
                      )}
                    </div>
                  );
                })}
              </div>
              {sel && (
                <div className="bg-card border border-primary/30 rounded-lg p-4 mt-2">
                  <h4 className="text-sm font-semibold text-foreground mb-3">{sel.name}</h4>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div><span className="text-muted-foreground">Type: </span><span className="text-foreground">{sel.type}</span></div>
                    <div><span className="text-muted-foreground">Tech: </span><span className="font-mono text-foreground">{sel.tech}</span></div>
                    <div><span className="text-muted-foreground">Dependencies: </span><span className="text-foreground">{sel.deps.length > 0 ? sel.deps.join(", ") : "None"}</span></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* APIs Tab */}
          {tab === "apis" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">API Contracts — v1</h3>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-medium hover:bg-primary/20 transition-colors"><Plus size={11} /> Add Endpoint</button>
              </div>
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead><tr className="border-b border-border">
                    {["Endpoint","Description","Auth","Version"].map(h => <th key={h} className="text-left px-4 py-2.5 text-muted-foreground font-medium">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {apiContracts.map(api => (
                      <tr key={api.name} className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${api.method === "POST" ? "bg-green-400/10 text-green-400" : "bg-blue-400/10 text-blue-400"}`}>{api.method}</span>
                            <span className="font-mono text-foreground">{api.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{api.desc}</td>
                        <td className="px-4 py-3"><span className="text-[10px] px-1.5 py-0.5 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded">Bearer JWT</span></td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">{api.version}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADRs Tab */}
          {tab === "adrs" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                {["All","Accepted","Proposed","Deprecated"].map(f => (
                  <button key={f} onClick={() => setAdrFilter(f)} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${adrFilter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{f}</button>
                ))}
                <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-medium hover:bg-primary/20 transition-colors"><Plus size={11} /> New ADR</button>
              </div>
              {adrs.filter(a => adrFilter === "All" || a.status === adrFilter).map(adr => (
                <div key={adr.id} className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer">
                  <div className="text-[10px] font-mono text-muted-foreground w-16 flex-shrink-0">{adr.id.toUpperCase()}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{adr.title}</div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1"><Bot size={9} />{adr.author}</span>
                      <span>{adr.date}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${adr.risk === "High" ? "bg-red-400/10 text-red-400 border-red-400/20" : adr.risk === "Medium" ? "bg-amber-400/10 text-amber-400 border-amber-400/20" : "bg-muted text-muted-foreground border-border"}`}>{adr.risk} risk</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${adr.status === "Accepted" ? "bg-green-400/10 text-green-400 border-green-400/20" : adr.status === "Proposed" ? "bg-blue-400/10 text-blue-400 border-blue-400/20" : "bg-muted text-muted-foreground border-border"}`}>{adr.status}</span>
                  <ChevronRight size={13} className="text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* Infra Tab */}
          {tab === "infra" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Kubernetes Cluster", tech: "EKS on AWS", status: "healthy", details: ["3 node groups", "Auto-scaling: 2–12 nodes", "Namespace: agenticsdlc-prod"] },
                { title: "Database Tier", tech: "RDS PostgreSQL 15", status: "healthy", details: ["Multi-AZ: Yes", "Storage: 500GB", "Read replicas: 2"] },
                { title: "Message Bus", tech: "Apache Kafka", status: "healthy", details: ["3 brokers", "Retention: 7 days", "Topics: 14"] },
                { title: "CDN / Edge", tech: "CloudFront", status: "healthy", details: ["Regions: us-east-1, eu-west-1", "Cache hit rate: 87%", "P95 latency: 48ms"] },
                { title: "Container Registry", tech: "ECR", status: "healthy", details: ["Images: 8", "Scan on push: enabled", "Lifecycle policy: 90 days"] },
                { title: "Secrets Manager", tech: "AWS Secrets Manager", status: "healthy", details: ["Secrets: 24", "Auto-rotation: enabled", "Audit: CloudTrail"] },
              ].map(item => (
                <div key={item.title} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{item.title}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">{item.tech}</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-green-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />{item.status}
                    </div>
                  </div>
                  <div className="space-y-1">
                    {item.details.map(d => <div key={d} className="text-xs text-muted-foreground flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-border flex-shrink-0" />{d}</div>)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Security Tab */}
          {tab === "security" && (
            <div className="space-y-4">
              {[
                { title: "Authentication", status: "Compliant", items: ["JWT RS256 with 15-min expiry", "Refresh token rotation enabled", "MFA enforced for human users"] },
                { title: "Authorization", status: "Compliant", items: ["RBAC with 5 roles (Admin, Architect, Developer, PM, Viewer)", "Resource-level permissions", "Approval gates for critical actions"] },
                { title: "Data Security", status: "At Risk", items: ["Secrets stored in AWS Secrets Manager", "Encryption at rest: AES-256", "⚠ PII in context graph — needs anonymization policy"] },
                { title: "Network Security", status: "Compliant", items: ["VPC with private subnets", "Security groups: least-privilege", "WAF enabled on API Gateway"] },
                { title: "Dependency Scanning", status: "Compliant", items: ["Dependabot: enabled", "SAST: SonarQube on every PR", "Container scanning: Trivy"] },
                { title: "Compliance", status: "In Progress", items: ["SOC 2 Type II: in audit", "GDPR: DPA signed with Anthropic", "Pen test: scheduled June 2026"] },
              ].map(sec => (
                <div key={sec.title} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-foreground">{sec.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${sec.status === "Compliant" ? "bg-green-400/10 text-green-400 border-green-400/20" : sec.status === "At Risk" ? "bg-red-400/10 text-red-400 border-red-400/20" : "bg-amber-400/10 text-amber-400 border-amber-400/20"}`}>{sec.status}</span>
                  </div>
                  <div className="space-y-1.5">
                    {sec.items.map(item => (
                      <div key={item} className="flex items-start gap-2 text-xs">
                        <span className={`mt-0.5 flex-shrink-0 ${item.startsWith("⚠") ? "text-red-400" : "text-green-400"}`}>{item.startsWith("⚠") ? "⚠" : "✓"}</span>
                        <span className={item.startsWith("⚠") ? "text-red-400" : "text-muted-foreground"}>{item.replace("⚠ ", "")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Scalability Tab */}
          {tab === "scalability" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Target TPS", value: "2,500", sub: "API gateway throughput" },
                  { label: "P95 Latency", value: "< 200ms", sub: "Orchestration API" },
                  { label: "Agent Concurrency", value: "50", sub: "Parallel agent runs" },
                  { label: "Storage Scale", value: "10TB", sub: "Context graph limit" },
                ].map(m => (
                  <div key={m.label} className="bg-card border border-border rounded-lg p-3">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{m.label}</div>
                    <div className="text-xl font-bold text-foreground mt-1">{m.value}</div>
                    <div className="text-[10px] text-muted-foreground">{m.sub}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  { component: "Orchestration Engine", strategy: "Horizontal pod autoscaling · HPA at 70% CPU", status: "Implemented" },
                  { component: "Agent Runner", strategy: "Queue-based scaling · KEDA on Kafka consumer lag", status: "Implemented" },
                  { component: "Context Store", strategy: "Read replicas + connection pooling (PgBouncer)", status: "Planned" },
                  { component: "API Gateway", strategy: "Multi-region active-passive failover", status: "Planned" },
                  { component: "Message Bus", strategy: "Kafka partition scaling · 3 brokers → 9 under load", status: "Implemented" },
                ].map(row => (
                  <div key={row.component} className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{row.component}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{row.strategy}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${row.status === "Implemented" ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-amber-400/10 text-amber-400 border-amber-400/20"}`}>{row.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — AI Recommendations */}
        <div className="w-64 flex-shrink-0 border-l border-border bg-card flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Bot size={12} className="text-primary" />
            <h3 className="text-xs font-semibold text-foreground">AI Recommendations</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {aiRecommendations.map((rec, i) => (
              <div key={i} className={`rounded-lg p-3 border text-xs ${rec.type === "warning" ? "bg-amber-400/5 border-amber-400/20" : rec.type === "success" ? "bg-green-400/5 border-green-400/20" : "bg-blue-400/5 border-blue-400/20"}`}>
                <div className="flex items-start gap-2 mb-1.5">
                  {rec.type === "warning" ? <AlertTriangle size={11} className="text-amber-400 flex-shrink-0 mt-0.5" /> : rec.type === "success" ? <CheckCircle2 size={11} className="text-green-400 flex-shrink-0 mt-0.5" /> : <Info size={11} className="text-blue-400 flex-shrink-0 mt-0.5" />}
                  <div>
                    <div className="font-semibold text-foreground text-[11px]">{rec.title}</div>
                    <span className={`text-[9px] font-medium ${rec.severity === "High" ? "text-red-400" : rec.severity === "Medium" ? "text-amber-400" : "text-green-400"}`}>{rec.severity}</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{rec.desc}</p>
                <div className="flex gap-1.5 mt-2">
                  <button className="flex-1 py-1 rounded text-[10px] font-medium bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors flex items-center justify-center gap-1"><ThumbsUp size={9} /></button>
                  <button className="flex-1 py-1 rounded text-[10px] font-medium bg-foreground/5 hover:bg-foreground/10 text-muted-foreground transition-colors flex items-center justify-center gap-1"><ThumbsDown size={9} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
