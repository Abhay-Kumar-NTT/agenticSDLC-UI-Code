import { useState } from "react";
import {
  LayoutDashboard, Cpu, Settings, ChevronRight, ChevronDown,
  Lightbulb, BookOpen, Layers, Code2, FlaskConical, Rocket, Activity,
  Bot, Workflow, CheckSquare, FileText, Network,
  FolderGit2, ListChecks, GitPullRequest, Zap,
  Shield, ScrollText, Lock
} from "lucide-react";
import { ViewId } from '../../types';

const navSections = [
  {
    title: "SDLC WORKFLOWS",
    items: [
      { id: "discovery" as ViewId, label: "Product Discovery", icon: Lightbulb },
      { id: "planning" as ViewId, label: "Planning & Requirements", icon: BookOpen },
      { id: "architecture" as ViewId, label: "Architecture", icon: Layers },
      { id: "development" as ViewId, label: "Development", icon: Code2 },
      { id: "qa" as ViewId, label: "QA & Validation", icon: FlaskConical },
      { id: "deployment" as ViewId, label: "Deployment", icon: Rocket },
      { id: "observability" as ViewId, label: "Observability", icon: Activity },
    ],
  },
  {
    title: "AI ORCHESTRATION",
    items: [
      { id: "agents" as ViewId, label: "Agents", icon: Bot },
      { id: "workflows" as ViewId, label: "Workflow Runs", icon: Workflow },
      { id: "approvals" as ViewId, label: "Approvals", icon: CheckSquare, badge: "7" },
      { id: "artifacts" as ViewId, label: "Artifacts", icon: FileText },
      { id: "context-graph" as ViewId, label: "Context Graph", icon: Network },
    ],
  },
  {
    title: "GITHUB OPERATIONS",
    items: [
      { id: "repositories" as ViewId, label: "Repositories", icon: FolderGit2 },
      { id: "issues" as ViewId, label: "Issues & Projects", icon: ListChecks },
      { id: "pull-requests" as ViewId, label: "Pull Requests", icon: GitPullRequest },
      { id: "pipelines" as ViewId, label: "CI/CD Pipelines", icon: Zap },
    ],
  },
  {
    title: "GOVERNANCE",
    items: [
      { id: "policies" as ViewId, label: "Policies", icon: Shield },
      { id: "audit" as ViewId, label: "Audit Logs", icon: ScrollText },
      { id: "security" as ViewId, label: "Security", icon: Lock },
    ],
  },
];

export function Sidebar({ active, setView }: { active: ViewId; setView: (v: ViewId) => void }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  return (
    <aside className="w-56 flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col h-full overflow-y-auto">
      <div className="px-4 py-3 border-b border-sidebar-border flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Cpu size={14} className="text-primary-foreground" />
        </div>
        <div>
          <div className="text-xs font-bold text-foreground tracking-tight">AgenticSDLC</div>
          <div className="text-[10px] text-muted-foreground">AI Orchestration Platform</div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-5">
        {/* Dashboard */}
        <button
          onClick={() => setView("dashboard")}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-xs font-medium transition-colors ${active === "dashboard" ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"}`}
        >
          <LayoutDashboard size={13} />
          Dashboard
        </button>

        {navSections.map(section => (
          <div key={section.title}>
            <button
              onClick={() => setCollapsed(c => ({ ...c, [section.title]: !c[section.title] }))}
              className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-semibold tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-1"
            >
              <span>{section.title}</span>
              {collapsed[section.title] ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
            </button>
            {!collapsed[section.title] && (
              <div className="space-y-0.5">
                {section.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-xs font-medium transition-colors ${active === item.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"}`}
                  >
                    <item.icon size={13} className="flex-shrink-0" />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {"badge" in item && item.badge && (
                      <span className="px-1.5 py-0.5 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded text-[10px] font-medium">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-2 py-3">
        <button
          onClick={() => setView("settings")}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-xs font-medium transition-colors ${active === "settings" ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"}`}
        >
          <Settings size={13} />
          Settings
        </button>
      </div>
    </aside>
  );
}
