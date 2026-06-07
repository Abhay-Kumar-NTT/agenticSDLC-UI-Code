import { useState } from "react";
import { Filter, MapPin } from "lucide-react";

export function ContextGraphView() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const graphNodes = [
    { id: "vision", label: "Vision", color: "#6366f1", x: 540, y: 60 },
    { id: "prd", label: "PRD v1.3", color: "#3b82f6", x: 380, y: 160 },
    { id: "epic1", label: "Epic: Auth", color: "#3b82f6", x: 200, y: 270 },
    { id: "epic2", label: "Epic: API", color: "#3b82f6", x: 380, y: 280 },
    { id: "story1", label: "Story GH-142", color: "#22c55e", x: 120, y: 380 },
    { id: "story2", label: "Story GH-141", color: "#22c55e", x: 280, y: 390 },
    { id: "arch", label: "HLD v2", color: "#f59e0b", x: 680, y: 180 },
    { id: "code", label: "PR #487", color: "#06b6d4", x: 160, y: 490 },
    { id: "deploy", label: "Deploy v2.4.1", color: "#a855f7", x: 700, y: 340 },
    { id: "incident", label: "INC-009", color: "#ef4444", x: 820, y: 460 },
  ];

  const graphEdges = [
    { from: "vision", to: "prd", label: "derived from" },
    { from: "prd", to: "epic1", label: "generates" },
    { from: "prd", to: "epic2", label: "generates" },
    { from: "epic1", to: "story1", label: "contains" },
    { from: "epic2", to: "story2", label: "contains" },
    { from: "prd", to: "arch", label: "informs" },
    { from: "story1", to: "code", label: "implemented by" },
    { from: "arch", to: "deploy", label: "deployed via" },
    { from: "deploy", to: "incident", label: "triggered" },
  ];

  const findNode = (id: string) => graphNodes.find(n => n.id === id)!;

  return (
    <div className="p-6 flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Context & Traceability Graph</h2>
          <p className="text-xs text-muted-foreground mt-0.5">End-to-end artifact lineage: Vision → PRD → Epic → Story → Code → Deploy → Incident</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded text-xs font-medium hover:text-foreground transition-colors flex items-center gap-1.5">
            <Filter size={11} /> Filter nodes
          </button>
          <button className="px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded text-xs font-medium hover:text-foreground transition-colors flex items-center gap-1.5">
            <MapPin size={11} /> Impact analysis
          </button>
        </div>
      </div>
      <div className="flex-1 bg-card border border-border rounded-lg relative overflow-hidden" style={{ minHeight: 460 }}>
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(148,163,184,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <svg width="100%" height="100%" viewBox="0 0 980 560" className="relative z-10">
          {/* Edges */}
          {graphEdges.map((e, i) => {
            const from = findNode(e.from);
            const to = findNode(e.to);
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const highlighted = hoveredNode === e.from || hoveredNode === e.to;
            return (
              <g key={i}>
                <line
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={highlighted ? from.color : "rgba(148,163,184,0.15)"}
                  strokeWidth={highlighted ? 1.5 : 1}
                  strokeDasharray={highlighted ? "0" : "5 3"}
                />
                <text x={midX} y={midY - 4} textAnchor="middle" fontSize={8} fill="rgba(148,163,184,0.4)" fontFamily="Inter, sans-serif">
                  {e.label}
                </text>
              </g>
            );
          })}
          {/* Nodes */}
          {graphNodes.map(node => {
            const isHovered = hoveredNode === node.id;
            return (
              <g
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
              >
                <circle cx={node.x} cy={node.y} r={isHovered ? 26 : 22} fill={`${node.color}18`} stroke={node.color} strokeWidth={isHovered ? 2 : 1.5} />
                <circle cx={node.x} cy={node.y} r={6} fill={node.color} opacity={0.8} />
                <text x={node.x} y={node.y + 36} textAnchor="middle" fontSize={10} fill="#e8eaf0" fontFamily="Inter, sans-serif" fontWeight={500}>
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        {[
          { label: "Strategic", color: "#6366f1" }, { label: "Requirements", color: "#3b82f6" },
          { label: "Engineering", color: "#22c55e" }, { label: "Architecture", color: "#f59e0b" },
          { label: "Operations", color: "#a855f7" }, { label: "Incident", color: "#ef4444" },
        ].map(l => (
          <span key={l.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
