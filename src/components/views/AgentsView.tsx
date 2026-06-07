import { useState } from "react";
import { Bot, Plus, Search, CheckSquare } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis } from "recharts";
import { agents } from '../../data';
import { StatusBadge } from '../common';

export function AgentsView() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("All");
  const agent = agents.find(a => a.id === selectedAgent);
  const types = ["All", "Strategic", "Engineering", "Governance", "Operational"];
  const filtered = filterType === "All" ? agents : agents.filter(a => a.type === filterType);

  const execHistory = [
    { t: "Mon", count: 24 }, { t: "Tue", count: 38 }, { t: "Wed", count: 31 },
    { t: "Thu", count: 45 }, { t: "Fri", count: 52 }, { t: "Sat", count: 18 }, { t: "Sun", count: 11 },
  ];

  return (
    <div className="p-6 flex gap-5 h-full min-h-0">
      {/* Agent List */}
      <div className={`flex flex-col gap-4 ${selectedAgent ? "w-[55%]" : "w-full"}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">AI Agent Console</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Manage and observe all platform agents</p>
          </div>
          <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-medium flex items-center gap-1.5 hover:bg-primary/90 transition-colors">
            <Plus size={12} /> New Agent
          </button>
        </div>

        <div className="flex items-center gap-2">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${filterType === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1.5 bg-muted rounded px-2.5 py-1.5">
            <Search size={11} className="text-muted-foreground" />
            <input placeholder="Search agents…" className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-32" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {["Agent", "Type", "Status", "Model", "Cost/Run", "Last Run", "Approval"].map(h => (
                  <th key={h} className="text-left px-3 py-2.5 text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr
                  key={a.id}
                  onClick={() => setSelectedAgent(selectedAgent === a.id ? null : a.id)}
                  className={`border-b border-border cursor-pointer transition-colors hover:bg-muted/40 ${selectedAgent === a.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${a.type === "Strategic" ? "bg-blue-500/10" : a.type === "Engineering" ? "bg-green-500/10" : a.type === "Governance" ? "bg-amber-500/10" : "bg-purple-500/10"}`}>
                        <Bot size={11} className={a.type === "Strategic" ? "text-blue-400" : a.type === "Engineering" ? "text-green-400" : a.type === "Governance" ? "text-amber-400" : "text-purple-400"} />
                      </div>
                      <span className="font-medium text-foreground">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-muted-foreground">{a.type}</span>
                  </td>
                  <td className="px-3 py-2.5"><StatusBadge status={a.status} /></td>
                  <td className="px-3 py-2.5 font-mono text-muted-foreground">{a.model}</td>
                  <td className="px-3 py-2.5 font-mono text-foreground">{a.cost}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{a.lastRun}</td>
                  <td className="px-3 py-2.5">
                    {a.approvalRequired
                      ? <span className="text-amber-400 flex items-center gap-1"><CheckSquare size={10} /> Required</span>
                      : <span className="text-muted-foreground">Autonomous</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent Detail */}
      {agent && (
        <div className="flex-1 bg-card border border-border rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{agent.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{agent.type} Agent · {agent.executions} executions</p>
            </div>
            <StatusBadge status={agent.status} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Model", value: agent.model },
              { label: "Avg Cost", value: agent.cost },
              { label: "Last Run", value: agent.lastRun },
              { label: "Approval", value: agent.approvalRequired ? "Required" : "Autonomous" },
            ].map(row => (
              <div key={row.label} className="bg-muted rounded-md p-2.5">
                <div className="text-xs text-muted-foreground">{row.label}</div>
                <div className="text-xs font-medium text-foreground mt-0.5 font-mono">{row.value}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Execution History (7d)</div>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={execHistory} barCategoryGap="30%">
                <XAxis dataKey="t" tick={{ fontSize: 9, fill: "#6b7598" }} axisLine={false} tickLine={false} />
                <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">System Instructions</div>
            <div className="bg-muted rounded-md p-3 font-mono text-xs text-muted-foreground leading-relaxed">
              You are a specialized {agent.name.toLowerCase()} operating within the AgenticSDLC platform. You produce structured, versioned artifacts and collaborate with upstream and downstream agents via shared context graphs. All outputs must include traceability metadata.
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Tool Permissions</div>
            <div className="flex flex-wrap gap-1.5">
              {["read_context", "write_artifact", "github_read", "github_write", "trigger_workflow", ...(agent.approvalRequired ? [] : ["auto_merge"])].map(t => (
                <span key={t} className="px-2 py-0.5 bg-green-400/10 text-green-400 border border-green-400/20 rounded text-xs font-mono">{t}</span>
              ))}
              {["deploy_production", "delete_resource"].map(t => (
                <span key={t} className="px-2 py-0.5 bg-red-400/10 text-red-400 border border-red-400/20 rounded text-xs font-mono line-through opacity-60">{t}</span>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-3 flex gap-2 mt-auto">
            <button className="flex-1 py-2 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
              Configure
            </button>
            <button className={`flex-1 py-2 rounded text-xs font-medium border transition-colors ${agent.status === "running" ? "bg-amber-400/10 text-amber-400 border-amber-400/20 hover:bg-amber-400/20" : "bg-green-400/10 text-green-400 border-green-400/20 hover:bg-green-400/20"}`}>
              {agent.status === "running" ? "Pause Agent" : "Enable Agent"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
