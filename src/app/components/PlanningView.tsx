import { useState } from "react";
import {
  BookOpen, Plus, ChevronRight, ChevronDown, CheckCircle2, Circle,
  GitBranch, Users, Tag, Calendar, MoreHorizontal, Search, Filter,
  ArrowRight, Bot, FileText, Target, Edit3, Trash2, AlertCircle
} from "lucide-react";

const sprints = [
  { id: "s14", name: "Sprint 14", start: "May 26", end: "Jun 6", status: "active" as const, velocity: 42, capacity: 48 },
  { id: "s13", name: "Sprint 13", start: "May 12", end: "May 23", status: "completed" as const, velocity: 45, capacity: 48 },
  { id: "s15", name: "Sprint 15", start: "Jun 9", end: "Jun 20", status: "planned" as const, velocity: 0, capacity: 48 },
];

const epicsData = [
  { id: "ep1", key: "ASDLC-E1", title: "Core Orchestration Engine", stories: 12, done: 5, status: "In Progress", priority: "High", color: "#3b82f6" },
  { id: "ep2", key: "ASDLC-E2", title: "AI Agent Ecosystem", stories: 18, done: 8, status: "In Progress", priority: "High", color: "#6366f1" },
  { id: "ep3", key: "ASDLC-E3", title: "GitHub Native Operations", stories: 9, done: 9, status: "Done", priority: "Medium", color: "#22c55e" },
  { id: "ep4", key: "ASDLC-E4", title: "Context Graph & Traceability", stories: 7, done: 2, status: "In Progress", priority: "High", color: "#f59e0b" },
  { id: "ep5", key: "ASDLC-E5", title: "Governance & Approval Workflows", stories: 6, done: 0, status: "Backlog", priority: "Medium", color: "#a855f7" },
  { id: "ep6", key: "ASDLC-E6", title: "Observability & Feedback Loops", stories: 5, done: 0, status: "Backlog", priority: "Low", color: "#ef4444" },
];

const storiesData = [
  { id: "st1", key: "GH-142", title: "Implement JWT refresh token rotation", epic: "ep1", sprint: "s14", status: "In Progress", points: 5, assignee: "Backend Dev (AI)", priority: "High" },
  { id: "st2", key: "GH-141", title: "Add rate limiting to API gateway", epic: "ep1", sprint: "s14", status: "Todo", points: 3, assignee: "Backend Dev (AI)", priority: "High" },
  { id: "st3", key: "GH-140", title: "Dashboard KPI widget components", epic: "ep2", sprint: "s14", status: "In Progress", points: 8, assignee: "Frontend Dev (AI)", priority: "Medium" },
  { id: "st4", key: "GH-139", title: "E2E tests for payment checkout flow", epic: "ep2", sprint: "s14", status: "Todo", points: 5, assignee: "QA Agent (AI)", priority: "Medium" },
  { id: "st5", key: "GH-138", title: "ADR-012: event sourcing for orders", epic: "ep4", sprint: "s14", status: "Done", points: 3, assignee: "Architect (AI)", priority: "High" },
  { id: "st6", key: "GH-137", title: "Workflow canvas node drag & drop", epic: "ep2", sprint: "s14", status: "Done", points: 8, assignee: "Frontend Dev (AI)", priority: "High" },
  { id: "st7", key: "GH-136", title: "Context graph lineage tracing API", epic: "ep4", sprint: "s14", status: "In Progress", points: 8, assignee: "Backend Dev (AI)", priority: "High" },
  { id: "st8", key: "GH-135", title: "Agent cost monitoring dashboard", epic: "ep2", sprint: "s14", status: "Todo", points: 5, assignee: "Frontend Dev (AI)", priority: "Low" },
];

const STATUS_COLS = ["Backlog", "Todo", "In Progress", "In Review", "Done"] as const;
type StoryStatus = typeof STATUS_COLS[number];

export function PlanningView() {
  const [view, setView] = useState<"board" | "backlog" | "epics">("board");
  const [selectedSprint, setSelectedSprint] = useState("s14");
  const [stories, setStories] = useState(storiesData);
  const [expandedEpics, setExpandedEpics] = useState<Record<string, boolean>>({ ep1: true, ep2: true });
  const [search, setSearch] = useState("");

  const sprint = sprints.find(s => s.id === selectedSprint)!;
  const sprintStories = stories.filter(s => s.sprint === selectedSprint);
  const doneCount = sprintStories.filter(s => s.status === "Done").length;
  const totalPoints = sprintStories.reduce((a, s) => a + s.points, 0);
  const donePoints = sprintStories.filter(s => s.status === "Done").reduce((a, s) => a + s.points, 0);

  const moveStory = (storyId: string, toStatus: StoryStatus) => {
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, status: toStatus } : s));
  };

  const priorityColor: Record<string, string> = { High: "text-red-400", Medium: "text-amber-400", Low: "text-muted-foreground" };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center gap-4 flex-shrink-0">
        <div className="flex-1">
          <h2 className="text-base font-semibold text-foreground">Planning & Requirements</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Sprint planning, backlog management, and story tracking</p>
        </div>
        {/* Sprint selector */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {sprints.map(s => (
            <button key={s.id} onClick={() => setSelectedSprint(s.id)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${selectedSprint === s.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {s.name}
              <span className={`ml-1.5 text-[9px] px-1 py-0.5 rounded ${s.status === "active" ? "bg-green-400/20 text-green-400" : s.status === "completed" ? "bg-muted text-muted-foreground" : "bg-blue-400/20 text-blue-400"}`}>{s.status}</span>
            </button>
          ))}
        </div>
        {/* View toggle */}
        <div className="flex gap-1 border border-border rounded-lg p-0.5">
          {[{ id: "board", label: "Board" }, { id: "backlog", label: "Backlog" }, { id: "epics", label: "Epics" }].map(v => (
            <button key={v.id} onClick={() => setView(v.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${view === v.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {v.label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors">
          <Plus size={12} /> Add Story
        </button>
      </div>

      {/* Sprint KPIs */}
      <div className="px-6 py-3 border-b border-border flex items-center gap-6 flex-shrink-0 bg-card/50">
        {[
          { label: "Stories", value: `${doneCount}/${sprintStories.length}` },
          { label: "Points", value: `${donePoints}/${totalPoints}` },
          { label: "Velocity", value: String(sprint.velocity) },
          { label: "Capacity", value: String(sprint.capacity) },
        ].map(k => (
          <div key={k.label} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{k.label}:</span>
            <span className="text-xs font-semibold text-foreground">{k.value}</span>
          </div>
        ))}
        <div className="flex-1 mx-4">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${totalPoints > 0 ? (donePoints / totalPoints) * 100 : 0}%` }} />
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{sprint.start} – {sprint.end}</span>
      </div>

      {/* Board view */}
      {view === "board" && (
        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-3 h-full min-w-max">
            {STATUS_COLS.map(col => {
              const colStories = sprintStories.filter(s => s.status === col);
              return (
                <div key={col} className="w-60 flex flex-col gap-2 flex-shrink-0">
                  <div className="flex items-center justify-between px-1 mb-1">
                    <span className="text-xs font-semibold text-foreground">{col}</span>
                    <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">{colStories.length}</span>
                  </div>
                  <div className="flex-1 space-y-2 overflow-y-auto min-h-[120px]">
                    {colStories.map(story => {
                      const epic = epicsData.find(e => e.id === story.epic);
                      return (
                        <div key={story.id} className="bg-card border border-border rounded-lg p-3 cursor-pointer hover:border-primary/30 transition-colors group">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="text-[10px] font-mono text-muted-foreground">{story.key}</span>
                            <span className={`text-[10px] font-medium ${priorityColor[story.priority]}`}>{story.priority}</span>
                          </div>
                          <p className="text-xs text-foreground font-medium leading-snug mb-2">{story.title}</p>
                          <div className="flex items-center gap-2">
                            {epic && <span className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: `${epic.color}18`, color: epic.color }}>{epic.title.split(" ")[0]}</span>}
                            <span className="text-[10px] text-muted-foreground ml-auto">{story.points}pts</span>
                          </div>
                          <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {STATUS_COLS.filter(s => s !== col).slice(0, 2).map(s => (
                              <button key={s} onClick={() => moveStory(story.id, s)} className="text-[9px] px-1.5 py-0.5 bg-muted text-muted-foreground rounded hover:text-foreground transition-colors">→ {s}</button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Backlog view */}
      {view === "backlog" && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 bg-muted rounded px-2.5 py-1.5 flex-1 max-w-xs">
              <Search size={11} className="text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stories…" className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-full" />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded text-xs hover:text-foreground transition-colors"><Filter size={11} /> Filter</button>
            <span className="text-xs text-muted-foreground ml-2 flex items-center gap-1"><Bot size={11} className="text-primary" /> AI generated {stories.length} stories</span>
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-border">
                {["Key","Title","Epic","Sprint","Assignee","Points","Priority","Status"].map(h => (
                  <th key={h} className="text-left px-3 py-2.5 text-muted-foreground font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {stories.filter(s => !search || s.title.toLowerCase().includes(search.toLowerCase())).map(s => {
                  const epic = epicsData.find(e => e.id === s.epic);
                  return (
                    <tr key={s.id} className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-3 py-2.5 font-mono text-muted-foreground">{s.key}</td>
                      <td className="px-3 py-2.5 font-medium text-foreground max-w-xs truncate">{s.title}</td>
                      <td className="px-3 py-2.5">{epic && <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: `${epic.color}18`, color: epic.color }}>{epic.title.split(" ").slice(0,2).join(" ")}</span>}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{sprints.find(sp => sp.id === s.sprint)?.name}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{s.assignee}</td>
                      <td className="px-3 py-2.5 font-mono text-foreground">{s.points}</td>
                      <td className="px-3 py-2.5"><span className={`text-xs font-medium ${priorityColor[s.priority]}`}>{s.priority}</span></td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${s.status === "Done" ? "bg-green-400/10 text-green-400 border-green-400/20" : s.status === "In Progress" ? "bg-blue-400/10 text-blue-400 border-blue-400/20" : "bg-muted text-muted-foreground border-border"}`}>{s.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Epics view */}
      {view === "epics" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {epicsData.map(epic => {
            const pct = Math.round((epic.done / epic.stories) * 100);
            const expanded = expandedEpics[epic.id];
            const epicStories = stories.filter(s => s.epic === epic.id);
            return (
              <div key={epic.id} className="bg-card border border-border rounded-lg overflow-hidden">
                <button onClick={() => setExpandedEpics(p => ({ ...p, [epic.id]: !p[epic.id] }))} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors text-left">
                  <div className="w-2 h-6 rounded-sm flex-shrink-0" style={{ backgroundColor: epic.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-muted-foreground">{epic.key}</span>
                      <span className="text-sm font-semibold text-foreground">{epic.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${epic.status === "Done" ? "bg-green-400/10 text-green-400 border-green-400/20" : epic.status === "In Progress" ? "bg-blue-400/10 text-blue-400 border-blue-400/20" : "bg-muted text-muted-foreground border-border"}`}>{epic.status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: epic.color }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{epic.done}/{epic.stories} stories · {pct}%</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border mr-2 ${epic.priority === "High" ? "bg-red-400/10 text-red-400 border-red-400/20" : epic.priority === "Medium" ? "bg-amber-400/10 text-amber-400 border-amber-400/20" : "bg-muted text-muted-foreground border-border"}`}>{epic.priority}</span>
                  {expanded ? <ChevronDown size={13} className="text-muted-foreground flex-shrink-0" /> : <ChevronRight size={13} className="text-muted-foreground flex-shrink-0" />}
                </button>
                {expanded && (
                  <div className="border-t border-border divide-y divide-border">
                    {epicStories.map(s => (
                      <div key={s.id} className="flex items-center gap-4 px-6 py-2.5 hover:bg-muted/20 transition-colors">
                        <span className="font-mono text-[10px] text-muted-foreground w-16 flex-shrink-0">{s.key}</span>
                        <span className="text-xs text-foreground flex-1 truncate">{s.title}</span>
                        <span className="text-[10px] text-muted-foreground">{s.assignee}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{s.points}pts</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${s.status === "Done" ? "bg-green-400/10 text-green-400 border-green-400/20" : s.status === "In Progress" ? "bg-blue-400/10 text-blue-400 border-blue-400/20" : "bg-muted text-muted-foreground border-border"}`}>{s.status}</span>
                      </div>
                    ))}
                    {epicStories.length === 0 && <div className="px-6 py-3 text-xs text-muted-foreground italic">No stories in current sprint</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
