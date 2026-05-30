import { useState } from "react";
import {
  Code2, GitBranch, GitPullRequest, CheckCircle2, Circle, Bot, FileText,
  Play, Eye, RefreshCw, Terminal, Layers, ArrowRight, ChevronRight,
  Clock, AlertTriangle, Braces, Server, Plus, RotateCcw
} from "lucide-react";

const story = {
  key: "GH-142", title: "Implement JWT refresh token rotation",
  description: "As a user, I want my session to remain active securely without re-authentication by implementing automatic JWT refresh token rotation with sliding expiry windows.",
  acceptanceCriteria: [
    "Refresh tokens expire after 7 days of inactivity",
    "Each refresh token use issues a new token and invalidates the old one",
    "Revoked tokens are persisted in Redis with TTL",
    "Failed refresh attempts return 401 with reason code",
    "All rotation events are logged to audit trail",
  ],
  epic: "Core Orchestration Engine", sprint: "Sprint 14", points: 5, priority: "High",
};

const architectureContext = [
  { label: "Auth Service", detail: "Node.js · JWT RS256 · /api/auth/refresh endpoint" },
  { label: "Token Store", detail: "Redis · key: refresh:{userId}:{tokenId}" },
  { label: "Database", detail: "PostgreSQL · refresh_tokens table · user_sessions table" },
  { label: "Dependencies", detail: "jsonwebtoken 9.x, ioredis 5.x, bcrypt 5.x" },
];

const generatedCode = `// src/auth/refresh-token.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import * as crypto from 'crypto';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly tokenRepo: Repository<RefreshToken>,
    private readonly redis: Redis,
  ) {}

  async rotateToken(oldToken: string, userId: string) {
    // Validate and revoke old token atomically
    const tokenKey = \`refresh:\${userId}:\${this.hash(oldToken)}\`;
    const exists = await this.redis.get(tokenKey);

    if (!exists) {
      await this.auditLog(userId, 'REFRESH_REJECTED', { reason: 'TOKEN_NOT_FOUND' });
      throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
    }

    // Revoke old token (rotation prevents replay attacks)
    await this.redis.del(tokenKey);
    await this.tokenRepo.update(
      { tokenHash: this.hash(oldToken) },
      { revokedAt: new Date() }
    );

    // Issue new token pair
    const newRefresh = crypto.randomBytes(40).toString('hex');
    const newRefreshHash = this.hash(newRefresh);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.redis.set(
      \`refresh:\${userId}:\${newRefreshHash}\`,
      '1',
      'EX', 7 * 24 * 3600
    );
    await this.tokenRepo.save({ userId, tokenHash: newRefreshHash, expiresAt });

    const accessToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '15m' }
    );

    await this.auditLog(userId, 'REFRESH_ROTATED');
    return { accessToken, refreshToken: newRefresh };
  }

  private hash(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}`;

const ciSteps = [
  { name: "Install dependencies", status: "success", duration: "28s" },
  { name: "Lint & type-check", status: "success", duration: "12s" },
  { name: "Unit tests (87 tests)", status: "success", duration: "34s" },
  { name: "Integration tests", status: "running", duration: "…" },
  { name: "Security scan (Snyk)", status: "pending", duration: "—" },
  { name: "Build Docker image", status: "pending", duration: "—" },
];

export function DevelopmentView() {
  const [activeTab, setActiveTab] = useState<"context" | "code" | "pr" | "ci">("context");
  const [checkedAC, setCheckedAC] = useState<Record<number, boolean>>({});
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(true);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); setActiveTab("code"); }, 1800);
  };

  const toggleAC = (i: number) => setCheckedAC(p => ({ ...p, [i]: !p[i] }));

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left — Story Context */}
      <div className="w-72 flex-shrink-0 border-r border-border bg-card flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono text-[10px] text-primary">{story.key}</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-red-400/10 text-red-400 border border-red-400/20 rounded">{story.priority}</span>
          </div>
          <h3 className="text-sm font-semibold text-foreground leading-snug">{story.title}</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Description */}
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Description</div>
            <p className="text-foreground leading-relaxed">{story.description}</p>
          </div>

          {/* Acceptance Criteria */}
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">Acceptance Criteria</div>
            <div className="space-y-2">
              {story.acceptanceCriteria.map((ac, i) => (
                <button key={i} onClick={() => toggleAC(i)} className="flex items-start gap-2 w-full text-left group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${checkedAC[i] ? "bg-green-500 border-green-500" : "border-border group-hover:border-primary"}`}>
                    {checkedAC[i] && <CheckCircle2 size={10} className="text-white" />}
                  </div>
                  <span className={checkedAC[i] ? "text-muted-foreground line-through" : "text-foreground"}>{ac}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Architecture Context */}
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">Architecture Context</div>
            <div className="space-y-2">
              {architectureContext.map(ctx => (
                <div key={ctx.label} className="bg-muted rounded-md p-2">
                  <div className="font-medium text-foreground">{ctx.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">{ctx.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Meta */}
          <div className="border-t border-border pt-3 space-y-1.5">
            {[["Epic", story.epic], ["Sprint", story.sprint], ["Points", String(story.points)]].map(([l, v]) => (
              <div key={l} className="flex justify-between">
                <span className="text-muted-foreground">{l}</span>
                <span className="text-foreground">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-border">
          <button onClick={generate} disabled={generating}
            className="w-full py-2 rounded text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {generating ? <><RefreshCw size={12} className="animate-spin" /> Generating…</> : <><Bot size={12} /> {generated ? "Re-generate" : "Generate Implementation"}</>}
          </button>
        </div>
      </div>

      {/* Center — Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Tabs */}
        <div className="flex gap-1 px-4 border-b border-border flex-shrink-0 pt-1">
          {[
            { id: "context", label: "Story Context", icon: FileText },
            { id: "code", label: "Generated Code", icon: Code2 },
            { id: "pr", label: "Pull Request", icon: GitPullRequest },
            { id: "ci", label: "CI / CD", icon: Play },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                <Icon size={11} />{t.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Context tab */}
          {activeTab === "context" && (
            <div className="p-5 space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">Upstream Business Context</h4>
                <div className="space-y-2 text-xs">
                  {[
                    { level: "Vision", text: "Secure, governed AI orchestration platform with enterprise-grade auth" },
                    { level: "PRD Goal", text: "Ensure all user sessions are cryptographically secure with zero-knowledge token design" },
                    { level: "Epic", text: "Core Orchestration Engine — Auth subsystem" },
                    { level: "Story", text: story.title },
                  ].map((row, i, arr) => (
                    <div key={row.level} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-[9px] font-bold text-primary">{i + 1}</div>
                        {i < arr.length - 1 && <div className="w-px h-4 bg-border" />}
                      </div>
                      <div className="pb-3">
                        <div className="text-[10px] text-muted-foreground font-medium">{row.level}</div>
                        <div className="text-foreground mt-0.5">{row.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">Linked Architecture Decisions</h4>
                {[{ id: "ADR-009", title: "Claude API as Primary LLM Provider" }, { id: "ADR-012", title: "Event Sourcing for Audit Trail" }].map(a => (
                  <div key={a.id} className="flex items-center gap-2 py-2 border-b border-border last:border-0 text-xs cursor-pointer hover:text-primary group transition-colors">
                    <span className="font-mono text-muted-foreground">{a.id}</span>
                    <span className="flex-1 text-foreground group-hover:text-primary">{a.title}</span>
                    <ArrowRight size={11} className="text-muted-foreground group-hover:text-primary" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code tab */}
          {activeTab === "code" && (
            <div className="p-4 h-full">
              {generated ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">src/auth/refresh-token.service.ts</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-green-400/10 text-green-400 border border-green-400/20 rounded">AI Generated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Bot size={9} /> Backend Developer Agent</span>
                      <button className="px-2.5 py-1 rounded text-xs bg-muted text-muted-foreground border border-border hover:text-foreground transition-colors flex items-center gap-1"><RotateCcw size={10} /> Refactor</button>
                      <button className="px-2.5 py-1 rounded text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-1"><GitPullRequest size={10} /> Create PR</button>
                    </div>
                  </div>
                  <div className="bg-[#0d0e11] border border-border rounded-lg overflow-auto">
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/20">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                      <span className="ml-2 text-[10px] text-muted-foreground font-mono">refresh-token.service.ts</span>
                    </div>
                    <pre className="p-4 text-[11px] leading-relaxed font-mono overflow-x-auto" style={{ color: "#e8eaf0" }}>
                      {generatedCode.split("\n").map((line, i) => (
                        <div key={i} className="flex">
                          <span className="text-muted-foreground w-7 flex-shrink-0 select-none text-right mr-4">{i + 1}</span>
                          <span style={{ color: line.trim().startsWith("//") ? "#6b7598" : line.includes("async ") || line.includes("private ") || line.includes("constructor") ? "#3b82f6" : line.includes("'") ? "#22c55e" : line.includes("await ") ? "#a855f7" : "#e8eaf0" }}>{line}</span>
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <Code2 size={24} className="text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click <strong className="text-foreground">Generate Implementation</strong> to produce code.</p>
                </div>
              )}
            </div>
          )}

          {/* PR tab */}
          {activeTab === "pr" && (
            <div className="p-5 space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <GitPullRequest size={14} className="text-blue-400" />
                      <span className="text-sm font-semibold text-foreground">PR #487 — feat: JWT refresh token rotation</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">feat/jwt-refresh → main · opened 2h ago by Backend Developer (AI)</div>
                  </div>
                  <span className="px-2.5 py-1 rounded text-xs font-medium bg-blue-400/10 text-blue-400 border border-blue-400/20">Open</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                  {[["Files Changed", "4"], ["Lines Added", "+187"], ["Lines Removed", "-12"]].map(([l, v]) => (
                    <div key={l} className="bg-muted rounded-md p-2.5 text-center">
                      <div className="text-muted-foreground">{l}</div>
                      <div className={`font-semibold mt-0.5 ${v.startsWith("+") ? "text-green-400" : v.startsWith("-") ? "text-red-400" : "text-foreground"}`}>{v}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">Checklist</div>
                  {[["Tests added", true], ["Docs updated", true], ["Breaking changes", false], ["Security review", false]].map(([l, done]) => (
                    <div key={String(l)} className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded border ${done ? "bg-green-500 border-green-500" : "border-border"} flex items-center justify-center`}>
                        {done && <CheckCircle2 size={9} className="text-white" />}
                      </div>
                      <span className={done ? "text-foreground" : "text-muted-foreground"}>{String(l)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2 rounded text-xs font-medium bg-green-400/10 text-green-400 border border-green-400/20 hover:bg-green-400/20 transition-colors">Approve & Merge</button>
                  <button className="flex-1 py-2 rounded text-xs font-medium bg-muted text-muted-foreground border border-border hover:text-foreground transition-colors">Request Changes</button>
                </div>
              </div>
            </div>
          )}

          {/* CI tab */}
          {activeTab === "ci" && (
            <div className="p-5 space-y-4">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-sm font-semibold text-foreground">ci-core · PR #487</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Branch: feat/jwt-refresh</span>
                    <span>Started 3m ago</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {ciSteps.map(step => (
                    <div key={step.name} className="flex items-center gap-3 py-2">
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {step.status === "success" ? <CheckCircle2 size={14} className="text-green-400" /> : step.status === "running" ? <RefreshCw size={14} className="text-blue-400 animate-spin" /> : step.status === "failed" ? <AlertTriangle size={14} className="text-red-400" /> : <Circle size={14} className="text-muted-foreground" />}
                      </div>
                      <span className={`flex-1 text-xs ${step.status === "success" ? "text-foreground" : step.status === "running" ? "text-blue-400" : "text-muted-foreground"}`}>{step.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{step.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#0d0e11] border border-border rounded-lg p-4 font-mono text-[11px] text-muted-foreground space-y-1">
                <div className="text-green-400">✓ Dependencies installed (1247 packages)</div>
                <div className="text-green-400">✓ TypeScript compiled — 0 errors</div>
                <div className="text-green-400">✓ ESLint — 0 warnings</div>
                <div className="text-green-400">✓ 87 unit tests passed in 34s</div>
                <div className="text-blue-400 animate-pulse">→ Running integration tests against test DB…</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right — GitHub Status */}
      <div className="w-52 flex-shrink-0 border-l border-border bg-card flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-xs font-semibold text-foreground">GitHub Status</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
          {[
            { label: "Branch", value: "feat/jwt-refresh" },
            { label: "Base", value: "main" },
            { label: "PR", value: "#487 Open" },
            { label: "CI Status", value: "Running" },
            { label: "Reviewers", value: "Sarah Chen" },
            { label: "Approvals", value: "0 / 1" },
          ].map(row => (
            <div key={row.label} className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground">{row.label}</span>
              <span className="font-mono text-foreground">{row.value}</span>
            </div>
          ))}
          <div className="border-t border-border pt-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">Recent Commits</div>
            {["feat: add token rotation service", "feat: redis token store", "test: rotation unit tests"].map((c, i) => (
              <div key={i} className="flex items-start gap-1.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                <span className="text-[10px] text-muted-foreground leading-snug">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
