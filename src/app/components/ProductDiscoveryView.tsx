import { useState } from "react";
import {
  Lightbulb, Upload, Mic, FileText, ChevronRight, CheckCircle2,
  Bot, Sparkles, GitBranch, Users, AlertTriangle, Target, Plus,
  ArrowRight, RefreshCw, Eye, ThumbsUp, ThumbsDown, Send, Paperclip, X
} from "lucide-react";

const visionOutputs = [
  {
    id: "v1", type: "Vision Document", status: "generated",
    content: "Build an AI-native SDLC orchestration platform that autonomously manages the complete software development lifecycle — from raw product vision to production deployment — using specialized AI agents for each SDLC phase.",
    agent: "Product Strategist", confidence: 94,
  },
  {
    id: "v2", type: "PRD v0.1", status: "generated",
    content: "Product Requirements Document covering persona definitions, functional requirements across 8 SDLC phases, non-functional requirements, success metrics (50% reduction in planning effort, 60% faster architecture documentation), and MVP scope.",
    agent: "Business Analyst", confidence: 91,
  },
];

const epics = [
  { id: "e1", title: "Core Orchestration Engine", stories: 12, status: "ready", priority: "High" },
  { id: "e2", title: "AI Agent Ecosystem", stories: 18, status: "ready", priority: "High" },
  { id: "e3", title: "GitHub Native Operations", stories: 9, status: "ready", priority: "Medium" },
  { id: "e4", title: "Context Graph & Traceability", stories: 7, status: "in-review", priority: "High" },
  { id: "e5", title: "Governance & Approval Workflows", stories: 6, status: "ready", priority: "Medium" },
  { id: "e6", title: "Observability & Feedback Loops", stories: 5, status: "draft", priority: "Low" },
];

const personas = [
  { role: "Solution Architect", goal: "Govern architecture quality and ensure traceability", pain: "Context lost between design and implementation", primary: true },
  { role: "Engineering Manager", goal: "Track delivery velocity and risk across teams", pain: "Manual coordination overhead across tooling", primary: true },
  { role: "Developer", goal: "Get rich context when implementing features", pain: "Unclear requirements, lack of upstream context", primary: true },
  { role: "Product Manager", goal: "Translate vision into traceable requirements", pain: "PRD-to-code traceability gap", primary: false },
];

const risks = [
  { id: "r1", desc: "AI agent hallucinations in architecture decisions", severity: "High", mitigation: "Human-in-the-loop approval gates for all architectural artifacts" },
  { id: "r2", desc: "GitHub rate limit constraints under high workflow volume", severity: "Medium", mitigation: "Implement token pooling and request queuing strategy" },
  { id: "r3", desc: "Context graph size impacting query performance at scale", severity: "Medium", mitigation: "Implement graph partitioning and lazy-loading strategies" },
];

const agentLog = [
  { agent: "Product Strategist", action: "Analyzed input prompt", time: "0s" },
  { agent: "Product Strategist", action: "Generated Vision Document", time: "4s" },
  { agent: "Business Analyst", action: "Derived product goals from vision", time: "7s" },
  { agent: "Business Analyst", action: "Identified 4 primary personas", time: "12s" },
  { agent: "Business Analyst", action: "Generated PRD v0.1 (3,200 words)", time: "18s" },
  { agent: "Product Strategist", action: "Extracted 6 epics from PRD", time: "22s" },
  { agent: "Business Analyst", action: "Identified 3 strategic risks", time: "26s" },
];

export function ProductDiscoveryView() {
  const [inputText, setInputText] = useState("Build an AI-native SDLC orchestration platform that coordinates specialized AI agents, structured engineering workflows, and GitHub-native operations across the complete software development lifecycle.");
  const [ran, setRan] = useState(true);
  const [running, setRunning] = useState(false);
  const [activeOutput, setActiveOutput] = useState<string>("vision");
  const [syncStatus, setSyncStatus] = useState<"idle" | "synced">("synced");

  const runDiscovery = () => {
    if (!inputText.trim()) return;
    setRunning(true);
    setTimeout(() => { setRunning(false); setRan(true); }, 2000);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left — Input Sources */}
      <div className="w-64 flex-shrink-0 bg-card border-r border-border flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-xs font-semibold text-foreground">Input Sources</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Feed context to the AI agents</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Prompt */}
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium block mb-1.5">Product Vision Prompt</label>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              rows={6}
              className="w-full bg-muted border border-border rounded-md px-2.5 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary resize-none leading-relaxed"
              placeholder="Describe your product vision, goals, or problem statement…"
            />
          </div>

          {/* Upload */}
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium block mb-1.5">Documents</label>
            <button className="w-full flex items-center gap-2 px-2.5 py-2 border border-dashed border-border rounded-md text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors">
              <Upload size={12} /> Upload PRD, notes, specs…
            </button>
            <div className="mt-2 space-y-1">
              {["market-research-2026.pdf", "competitor-analysis.docx"].map(f => (
                <div key={f} className="flex items-center gap-2 px-2 py-1.5 bg-muted rounded text-[10px] text-muted-foreground">
                  <FileText size={10} className="flex-shrink-0" />
                  <span className="truncate flex-1">{f}</span>
                  <X size={10} className="hover:text-foreground cursor-pointer flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Voice */}
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium block mb-1.5">Voice / Meeting Notes</label>
            <button className="w-full flex items-center gap-2 px-2.5 py-2 border border-border rounded-md text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Mic size={12} /> Record or transcribe…
            </button>
          </div>

          {/* Agent selection */}
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium block mb-1.5">Active Agents</label>
            {[{ name: "Product Strategist", model: "opus-4-7", on: true }, { name: "Business Analyst", model: "sonnet-4-6", on: true }, { name: "Risk Assessor", model: "sonnet-4-6", on: false }].map(a => (
              <div key={a.name} className="flex items-center gap-2 py-1.5">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 border-2 ${a.on ? "bg-green-400 border-green-400" : "bg-transparent border-border"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-medium text-foreground truncate">{a.name}</div>
                  <div className="text-[9px] text-muted-foreground font-mono">{a.model}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-border">
          <button
            onClick={runDiscovery}
            disabled={running || !inputText.trim()}
            className="w-full py-2 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {running ? <><RefreshCw size={12} className="animate-spin" /> Running…</> : <><Sparkles size={12} /> Run Discovery</>}
          </button>
        </div>
      </div>

      {/* Center — AI Collaboration Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Output tab bar */}
        <div className="flex items-center gap-1 px-4 pt-4 pb-0 border-b border-border flex-shrink-0">
          {[
            { id: "vision", label: "Vision & PRD", icon: FileText },
            { id: "epics", label: "Epics", icon: Layers },
            { id: "personas", label: "Personas", icon: Users },
            { id: "risks", label: "Risks", icon: AlertTriangle },
            { id: "log", label: "Agent Log", icon: Bot },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setActiveOutput(t.id)} className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${activeOutput === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                <Icon size={11} />{t.label}
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-2 pb-2">
            {ran && <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle2 size={10} /> Generated 26s ago</span>}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Vision & PRD Tab */}
          {activeOutput === "vision" && (
            <div className="space-y-4">
              {ran ? visionOutputs.map(out => (
                <div key={out.id} className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-2">
                      <FileText size={13} className="text-primary" />
                      <span className="text-sm font-semibold text-foreground">{out.type}</span>
                      <span className="px-2 py-0.5 bg-green-400/10 text-green-400 border border-green-400/20 rounded text-[10px] font-medium">Generated</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Bot size={10} />{out.agent}</span>
                      <span className="flex items-center gap-1 text-blue-400"><Target size={10} />{out.confidence}% confidence</span>
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-muted rounded transition-colors"><Eye size={11} /></button>
                        <button className="p-1 hover:bg-muted rounded transition-colors text-green-400"><ThumbsUp size={11} /></button>
                        <button className="p-1 hover:bg-muted rounded transition-colors text-red-400"><ThumbsDown size={11} /></button>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm text-foreground leading-relaxed">{out.content}</p>
                    <button className="mt-3 text-xs text-primary hover:underline flex items-center gap-1">View full document <ArrowRight size={11} /></button>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-60 gap-3 text-center text-muted-foreground">
                  <Sparkles size={24} className="opacity-30" />
                  <p className="text-sm">Enter your product vision and click <strong className="text-foreground">Run Discovery</strong> to generate outputs.</p>
                </div>
              )}
            </div>
          )}

          {/* Epics Tab */}
          {activeOutput === "epics" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-muted-foreground">{epics.length} epics generated · {epics.reduce((a, e) => a + e.stories, 0)} total user stories</div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-medium hover:bg-primary/20 transition-colors">
                  <Plus size={11} /> Add Epic
                </button>
              </div>
              {epics.map((epic, i) => (
                <div key={epic.id} className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer group">
                  <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">E{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{epic.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{epic.stories} user stories</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${epic.priority === "High" ? "bg-red-400/10 text-red-400 border-red-400/20" : epic.priority === "Medium" ? "bg-amber-400/10 text-amber-400 border-amber-400/20" : "bg-muted text-muted-foreground border-border"}`}>{epic.priority}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${epic.status === "ready" ? "bg-green-400/10 text-green-400 border-green-400/20" : epic.status === "in-review" ? "bg-blue-400/10 text-blue-400 border-blue-400/20" : "bg-muted text-muted-foreground border-border"}`}>{epic.status}</span>
                  <ChevronRight size={13} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* Personas Tab */}
          {activeOutput === "personas" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personas.map(p => (
                <div key={p.role} className={`bg-card border rounded-lg p-4 space-y-3 ${p.primary ? "border-primary/30" : "border-border"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center"><Users size={15} className="text-primary" /></div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{p.role}</div>
                        {p.primary && <span className="text-[10px] text-primary">Primary Persona</span>}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Goal</div>
                    <p className="text-xs text-foreground">{p.goal}</p>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Pain Point</div>
                    <p className="text-xs text-muted-foreground">{p.pain}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Risks Tab */}
          {activeOutput === "risks" && (
            <div className="space-y-3">
              {risks.map(r => (
                <div key={r.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${r.severity === "High" ? "bg-red-400/10" : "bg-amber-400/10"}`}>
                      <AlertTriangle size={12} className={r.severity === "High" ? "text-red-400" : "text-amber-400"} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-medium text-foreground">{r.desc}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${r.severity === "High" ? "bg-red-400/10 text-red-400 border-red-400/20" : "bg-amber-400/10 text-amber-400 border-amber-400/20"}`}>{r.severity}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-0.5">Mitigation</div>
                      <p className="text-xs text-muted-foreground">{r.mitigation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Agent Log Tab */}
          {activeOutput === "log" && (
            <div className="bg-card border border-border rounded-lg overflow-hidden font-mono text-xs">
              <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-foreground">Discovery run completed · 26s · $0.42</span>
              </div>
              <div className="p-4 space-y-1.5">
                {agentLog.map((l, i) => (
                  <div key={i} className="flex items-start gap-3 text-[11px]">
                    <span className="text-muted-foreground w-6 flex-shrink-0">{l.time}</span>
                    <span className="text-blue-400 flex-shrink-0">[{l.agent}]</span>
                    <span className="text-foreground">{l.action}</span>
                  </div>
                ))}
                <div className="flex items-start gap-3 text-[11px] text-green-400 mt-2">
                  <span className="w-6">26s</span>
                  <span>[System]</span>
                  <span>Discovery pipeline complete. Artifacts ready for GitHub sync.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right — Context Panel */}
      <div className="w-60 flex-shrink-0 bg-card border-l border-border flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-xs font-semibold text-foreground">Context & Sync</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Traceability */}
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">Artifact Lineage</div>
            {[
              { label: "Vision Document", status: "done" },
              { label: "PRD v0.1", status: "done" },
              { label: "6 Epics", status: "done" },
              { label: "57 User Stories", status: "pending" },
              { label: "Acceptance Criteria", status: "pending" },
            ].map((item, i, arr) => (
              <div key={item.label} className="flex items-start gap-2">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${item.status === "done" ? "bg-green-400/20 border-green-400" : "bg-muted border-border"}`}>
                    {item.status === "done" ? <CheckCircle2 size={9} className="text-green-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />}
                  </div>
                  {i < arr.length - 1 && <div className={`w-px h-4 mt-0.5 ${item.status === "done" ? "bg-green-400/30" : "bg-border"}`} />}
                </div>
                <span className={`text-xs mt-0.5 pb-3 ${item.status === "done" ? "text-foreground" : "text-muted-foreground"}`}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Approval */}
          <div className="border-t border-border pt-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">Approval</div>
            <div className="bg-amber-400/10 border border-amber-400/20 rounded-md p-2.5 text-xs text-amber-400">
              PRD v0.1 awaiting review by <strong>Product Lead</strong>
            </div>
            <button className="w-full mt-2 py-1.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">Request Approval</button>
          </div>

          {/* GitHub Sync */}
          <div className="border-t border-border pt-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">GitHub Sync</div>
            <div className={`flex items-center gap-2 px-2.5 py-2 rounded-md border text-xs ${syncStatus === "synced" ? "bg-green-400/10 border-green-400/20 text-green-400" : "bg-muted border-border text-muted-foreground"}`}>
              <GitBranch size={11} />
              {syncStatus === "synced" ? "6 issues synced to GitHub" : "Not synced"}
            </div>
            <button onClick={() => setSyncStatus("synced")} className="w-full mt-2 py-1.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border hover:text-foreground transition-colors flex items-center justify-center gap-1.5">
              <RefreshCw size={10} /> Sync to GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// TS trick: keep Layers importable without pulling all of lucide in this file
function Layers(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width={props.size ?? 16} height={props.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>; }
