// Workflow-related type definitions

export interface DesignerNode {
  id: string;
  type: string;
  label: string;
  category: string;
  color: string;
  x: number;
  y: number;
  repoToAnalyse?: string; // For code-analysis and design-analysis nodes
}

export interface DesignerEdge {
  id: string;
  fromId: string;
  toId: string;
  relationship: string;
}

export interface SavedWorkflow {
  id: string;
  name: string;
  nodes: DesignerNode[];
  edges: DesignerEdge[];
  nodeCount?: number;  // For summary view
  edgeCount?: number;  // For summary view
  createdAt: string;
  status: "draft" | "active" | "paused" | "archived";
}

export interface WorkflowNode {
  id: string;
  label: string;
  type: string;
  status: import('./common.types').Status;
  x: number;
  y: number;
  artifacts: number;
}

export interface WorkflowEdge {
  from: string;
  to: string;
  fromId?: string;
  toId?: string;
  relationship?: string;
}
