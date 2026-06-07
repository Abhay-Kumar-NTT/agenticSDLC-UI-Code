import { useState } from "react";
import {
  FileText, Network, ScrollText, BookOpen, FlaskConical, Rocket,
  AlertCircle, Search, Bot, GitBranch, MessageSquare, Github,
  Terminal, CheckCircle2, GitPullRequest, GitCommit, Eye, Trash2,
  Edit3, MoreHorizontal, Plus
} from "lucide-react";
import { StatusBadge } from '../common';

const artifactTypes = [
  { type: "prd", label: "PRD", icon: FileText, color: "#6366f1" },
  { type: "architecture", label: "Architecture Doc", icon: Network, color: "#f59e0b" },
  { type: "adr", label: "ADR", icon: ScrollText, color: "#8b5cf6" },
  { type: "user-story", label: "User Story", icon: BookOpen, color: "#22c55e" },
  { type: "test-plan", label: "Test Plan", icon: FlaskConical, color: "#a855f7" },
  { type: "deployment", label: "Deployment Record", icon: Rocket, color: "#3b82f6" },
  { type: "incident", label: "Incident Report", icon: AlertCircle, color: "#ef4444" },
  { type: "analysis", label: "Analysis", icon: Search, color: "#06b6d4" },
];

const mockArtifacts = [
  { id: "art1", type: "prd", name: "User Authentication Module PRD", version: "v1.3", status: "completed" as const, owner: "Product Strategist (AI)", created: "May 24, 2026", modified: "2h ago", linkedCount: 8, aiConfidence: 0.94 },
  { id: "art2", type: "architecture", name: "Microservices Architecture HLD", version: "v2.1", status: "pending" as const, owner: "Solution Architect (AI)", created: "May 25, 2026", modified: "1h ago", linkedCount: 12, aiConfidence: 0.89 },
  { id: "art3", type: "adr", name: "ADR-012: Event Sourcing for Orders", version: "v1.0", status: "completed" as const, owner: "Backend Developer (AI)", created: "May 23, 2026", modified: "1d ago", linkedCount: 5, aiConfidence: 0.92 },
  { id: "art4", type: "user-story", name: "JWT Refresh Token Implementation", version: "v1.0", status: "completed" as const, owner: "Backend Developer (AI)", created: "May 26, 2026", modified: "3h ago", linkedCount: 4, aiConfidence: 0.96 },
  { id: "art5", type: "test-plan", name: "Payment Flow E2E Test Plan", version: "v1.2", status: "waiting" as const, owner: "QA Engineer (AI)", created: "May 25, 2026", modified: "5h ago", linkedCount: 6, aiConfidence: 0.88 },
  { id: "art6", type: "deployment", name: "Release v2.4.1 Deployment", version: "v1.0", status: "completed" as const, owner: "DevOps Agent (AI)", created: "May 26, 2026", modified: "1h ago", linkedCount: 3, aiConfidence: 0.95 },
  { id: "art7", type: "analysis", name: "Code Quality Analysis Report", version: "v1.0", status: "completed" as const, owner: "Code Analyst (AI)", created: "May 26, 2026", modified: "30m ago", linkedCount: 7, aiConfidence: 0.91 },
];

export function ArtifactsView() {
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>("art1");
  const [filterType, setFilterType] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"overview" | "lineage" | "ai-history" | "comments" | "github" | "logs">("overview");

  const artifact = mockArtifacts.find(a => a.id === selectedArtifact);
  const artifactType = artifact ? artifactTypes.find(t => t.type === artifact.type) : null;

  // Filter by matching label to type
  const filtered = filterType === "All"
    ? mockArtifacts
    : mockArtifacts.filter(a => {
        const typeInfo = artifactTypes.find(t => t.type === a.type);
        return typeInfo?.label === filterType;
      });

  const types = ["All", ...artifactTypes.map(t => t.label)];

  return (
    <div className="flex h-full overflow-hidden">
      {/* LEFT PANEL - Artifact List */}
      <div className="w-80 flex-shrink-0 bg-card flex flex-col border-r border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">Artifacts</h2>
            <button className="px-2 py-1.5 bg-primary text-primary-foreground rounded text-xs font-medium flex items-center gap-1 hover:bg-primary/90 transition-colors">
              <Plus size={12} /> New
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${filterType === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(a => {
            const type = artifactTypes.find(t => t.type === a.type);
            const Icon = type?.icon || FileText;
            return (
              <div
                key={a.id}
                onClick={() => setSelectedArtifact(a.id)}
                className={`px-4 py-3 border-b border-border cursor-pointer transition-colors hover:bg-muted/40 ${selectedArtifact === a.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}
              >
                <div className="flex items-start gap-2.5">
                  <div style={{ backgroundColor: `${type?.color}15` }} className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={12} style={{ color: type?.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground truncate">{a.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-muted-foreground">{a.version}</span>
                      <StatusBadge status={a.status as any} />
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      Modified {a.modified} · {a.linkedCount} links
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {artifact ? (
        <>
          {/* CENTER PANEL - Artifact Content */}
          <div className="flex-1 flex flex-col overflow-hidden bg-background">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <div style={{ backgroundColor: `${artifactType?.color}15` }} className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0">
                  {artifactType && <artifactType.icon size={16} style={{ color: artifactType.color }} />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{artifact.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{artifactType?.label}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs font-mono text-muted-foreground">{artifact.version}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">Modified {artifact.modified}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded text-xs font-medium hover:text-foreground transition-colors flex items-center gap-1">
                  <Eye size={11} /> View
                </button>
                <button className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-medium hover:bg-primary/20 transition-colors flex items-center gap-1">
                  <Edit3 size={11} /> Edit
                </button>
                <button className="px-2 py-1.5 bg-muted text-muted-foreground border border-border rounded text-xs font-medium hover:text-foreground transition-colors">
                  <MoreHorizontal size={12} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <h1 className="text-foreground">User Authentication Module PRD</h1>
                <div className="flex items-center gap-2 my-3">
                  <StatusBadge status={artifact.status as any} />
                  <span className="px-2 py-0.5 bg-blue-400/10 text-blue-400 border border-blue-400/20 rounded text-xs font-medium">High Priority</span>
                  <span className="text-xs text-muted-foreground">{artifact.owner}</span>
                </div>

                <h2 className="text-foreground">Problem Statement</h2>
                <p className="text-muted-foreground">
                  We need a secure, scalable authentication system for the AgenticSDLC platform that supports JWT-based
                  authentication with refresh token rotation, role-based access control, and comprehensive audit logging.
                </p>

                <h2 className="text-foreground">Proposed Solution</h2>
                <p className="text-muted-foreground">
                  Implement a modern authentication system using JWT access tokens (15-minute expiry) and refresh tokens
                  (7-day expiry). All authentication events will be logged to an immutable audit trail.
                </p>

                <h2 className="text-foreground">Technical Approach</h2>
                <pre className="bg-muted p-3 rounded text-xs"><code className="text-foreground">{`// JWT Generation with asymmetric RS256
const token = jwt.sign(
  { userId, role, permissions },
  process.env.JWT_SECRET,
  { expiresIn: '15m', issuer: 'agenticsdlc' }
);`}</code></pre>

                <h2 className="text-foreground">Acceptance Criteria</h2>
                <ul className="text-muted-foreground">
                  <li>Users can register and authenticate using email/password</li>
                  <li>JWT tokens expire after 15 minutes; refresh tokens valid for 7 days</li>
                  <li>Failed login attempts trigger rate limiting after 5 attempts</li>
                  <li>All authentication events logged to audit trail</li>
                  <li>Password requirements: minimum 12 characters, complexity rules enforced</li>
                </ul>

                <h2 className="text-foreground">AI-Generated Insights</h2>
                <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Bot size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-foreground font-medium mb-1">Security Recommendation</p>
                      <p className="text-xs text-muted-foreground">
                        Consider implementing WebAuthn for passwordless authentication to improve security
                        and user experience. This aligns with modern authentication best practices.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Tabs with Context */}
          <div className="w-80 flex-shrink-0 bg-card flex flex-col overflow-hidden border-r border-border">
            {/* Tabs */}
            <div className="flex border-b border-border">
              {[
                { id: "overview" as const, label: "Overview", icon: FileText },
                { id: "lineage" as const, label: "Lineage", icon: GitBranch },
                { id: "ai-history" as const, label: "AI History", icon: Bot },
                { id: "comments" as const, label: "Comments", icon: MessageSquare },
                { id: "github" as const, label: "GitHub", icon: Github },
                { id: "logs" as const, label: "Logs", icon: Terminal },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-medium border-b-2 transition-colors ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                    title={tab.label}
                  >
                    <Icon size={11} />
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Metadata</div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-0.5">Owner</div>
                        <div className="text-xs text-foreground">{artifact.owner}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-0.5">Version</div>
                        <div className="text-xs text-foreground">{artifact.version}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-0.5">Created</div>
                        <div className="text-xs text-foreground">{artifact.created}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-0.5">AI Confidence</div>
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-green-400" style={{ width: `${artifact.aiConfidence * 100}%` }} />
                          </div>
                          <span className="text-[10px] text-foreground font-medium">{Math.round(artifact.aiConfidence * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Linked Artifacts ({artifact.linkedCount})</div>
                    <div className="space-y-1.5">
                      {[
                        { name: "User Auth Epic", type: "epic", rel: "Parent" },
                        { name: "JWT Implementation Story", type: "story", rel: "Child" },
                        { name: "Security ADR-008", type: "adr", rel: "Referenced by" },
                      ].map((link, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs p-2 rounded hover:bg-muted/50 cursor-pointer border border-transparent hover:border-border">
                          <GitBranch size={10} className="text-muted-foreground mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="text-foreground text-[11px] font-medium truncate">{link.name}</div>
                            <div className="text-muted-foreground text-[10px]">{link.rel}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Dependencies</div>
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-muted-foreground p-2 bg-muted rounded">
                        <AlertCircle size={10} className="inline mr-1" />
                        No blocking dependencies
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "lineage" && (
                <div className="space-y-3">
                  <div className="text-center py-8">
                    <GitBranch size={24} className="text-muted-foreground mx-auto mb-2" />
                    <div className="text-xs font-medium text-foreground mb-1">Artifact Lineage</div>
                    <div className="text-[10px] text-muted-foreground">Interactive graph visualization</div>
                  </div>
                </div>
              )}

              {activeTab === "ai-history" && (
                <div className="space-y-2">
                  {[
                    { time: "2h ago", agent: "Product Strategist", action: "Generated version v1.3" },
                    { time: "1d ago", agent: "Solution Architect", action: "Reviewed and approved" },
                    { time: "2d ago", agent: "Backend Developer", action: "Generated initial draft v1.0" },
                  ].map((log, i) => (
                    <div key={i} className="bg-muted rounded-lg p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Bot size={10} className="text-primary" />
                        <span className="text-[11px] font-medium text-foreground">{log.agent}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">{log.action}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">{log.time}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "comments" && (
                <div className="text-center py-8">
                  <MessageSquare size={24} className="text-muted-foreground mx-auto mb-2" />
                  <div className="text-xs font-medium text-foreground mb-1">No Comments</div>
                  <div className="text-[10px] text-muted-foreground">Add collaborative comments</div>
                </div>
              )}

              {activeTab === "github" && (
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sync Status</div>
                    <div className="flex items-center gap-2 text-xs p-2 bg-green-400/10 border border-green-400/20 rounded">
                      <CheckCircle2 size={12} className="text-green-400" />
                      <span className="text-foreground text-[11px]">Synced to Issue #142</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Linked Resources</div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs p-2 rounded hover:bg-muted/50 cursor-pointer">
                        <GitPullRequest size={11} className="text-blue-400" />
                        <span className="text-foreground text-[11px]">PR #487</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs p-2 rounded hover:bg-muted/50 cursor-pointer">
                        <GitCommit size={11} className="text-green-400" />
                        <span className="text-foreground text-[11px]">feat/jwt-refresh</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "logs" && (
                <div className="space-y-1 font-mono text-[10px]">
                  <div className="text-green-400">[14:32:11] Generated successfully</div>
                  <div className="text-blue-400">[14:32:15] AI validated (94%)</div>
                  <div className="text-green-400">[14:32:18] Synced to GitHub</div>
                  <div className="text-amber-400">[14:35:42] Version v1.3 created</div>
                  <div className="text-green-400">[14:35:45] Approval requested</div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <FileText size={32} className="mx-auto mb-3 opacity-50" />
            <div className="text-sm font-medium">No artifact selected</div>
            <div className="text-xs mt-1">Select an artifact from the list to view details</div>
          </div>
        </div>
      )}
    </div>
  );
}
