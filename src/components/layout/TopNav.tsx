import { useState } from "react";
import { Search, Bell, ChevronRight } from "lucide-react";
import { ViewId } from '../../types';

export function TopNav({ active }: { active: ViewId }) {
  const [notifOpen, setNotifOpen] = useState(false);

  const breadcrumb: Record<ViewId, string> = {
    dashboard: "Dashboard", discovery: "Product Discovery", planning: "Planning & Requirements",
    architecture: "Architecture", development: "Development", qa: "QA & Validation",
    deployment: "Deployment Center", observability: "Observability", agents: "AI Agents",
    workflows: "Workflow Runs", approvals: "Approvals", artifacts: "Artifact Workspace",
    "context-graph": "Context Graph", repositories: "Repositories", issues: "Issues & Projects",
    "pull-requests": "Pull Requests", pipelines: "CI/CD Pipelines", policies: "Policies",
    audit: "Audit Logs", security: "Security", settings: "Settings",
  };

  return (
    <header className="h-12 border-b border-border flex items-center px-4 gap-4 bg-background/95 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span>AgenticSDLC</span>
        <ChevronRight size={11} />
        <span className="text-foreground font-medium">{breadcrumb[active]}</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5 bg-muted rounded px-2.5 py-1.5 w-52">
        <Search size={11} className="text-muted-foreground flex-shrink-0" />
        <input
          placeholder="Search artifacts, agents…"
          className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-full"
        />
        <kbd className="text-[9px] text-muted-foreground border border-border rounded px-1">⌘K</kbd>
      </div>

      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-400 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        9 agents active
      </div>

      <div className="relative">
        <button
          onClick={() => setNotifOpen(o => !o)}
          className="relative w-8 h-8 rounded-md bg-muted flex items-center justify-center hover:bg-sidebar-accent transition-colors"
        >
          <Bell size={13} className="text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full border border-background" />
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-10 w-72 bg-popover border border-border rounded-lg shadow-2xl z-50 overflow-hidden">
            <div className="px-3 py-2.5 border-b border-border text-xs font-medium text-foreground">Notifications</div>
            {[
              { text: "Security Reviewer flagged OWASP A07 risk", time: "35m ago", type: "warning" },
              { text: "PR #487 awaiting your approval", time: "2h ago", type: "info" },
              { text: "Deploy to production pending approval", time: "3h ago", type: "warning" },
            ].map((n, i) => (
              <div key={i} className="px-3 py-2.5 hover:bg-muted/40 transition-colors cursor-pointer border-b border-border last:border-0">
                <div className="flex gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${n.type === "warning" ? "bg-amber-400" : "bg-blue-400"}`} />
                  <div>
                    <div className="text-xs text-foreground">{n.text}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{n.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pl-2 border-l border-border">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white">
          AK
        </div>
        <div className="hidden sm:block">
          <div className="text-xs font-medium text-foreground">Abhay Kumar</div>
          <div className="text-[10px] text-muted-foreground">Solution Architect</div>
        </div>
      </div>
    </header>
  );
}
