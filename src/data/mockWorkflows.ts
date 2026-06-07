// Mock workflow data
import { SavedWorkflow, WorkflowNode, WorkflowEdge } from '../types';

export const workflowNodes: WorkflowNode[] = [
  { id: "n1", label: "Product Vision/Req.", type: "strategic", status: "completed", x: 60, y: 80, artifacts: 1 },
  { id: "n2", label: "PRD Agent", type: "strategic", status: "completed", x: 220, y: 80, artifacts: 3 },
  { id: "n3", label: "Story Generator", type: "strategic", status: "completed", x: 380, y: 80, artifacts: 14 },
  { id: "n4", label: "Architecture Agent", type: "engineering", status: "running", x: 540, y: 80, artifacts: 2 },
  { id: "n5", label: "Development Agent", type: "engineering", status: "waiting", x: 700, y: 80, artifacts: 0 },
  { id: "n6", label: "Security Reviewer", type: "governance", status: "waiting", x: 540, y: 220, artifacts: 0 },
  { id: "n7", label: "QA Agent", type: "engineering", status: "waiting", x: 700, y: 220, artifacts: 0 },
  { id: "n8", label: "DevOps Agent", type: "operational", status: "waiting", x: 860, y: 150, artifacts: 0 },
  { id: "n9", label: "Observability Agent", type: "operational", status: "waiting", x: 1020, y: 150, artifacts: 0 },
];

export const workflowEdges: WorkflowEdge[] = [
  { from: "n1", to: "n2" }, { from: "n2", to: "n3" }, { from: "n3", to: "n4" },
  { from: "n4", to: "n5" }, { from: "n4", to: "n6" }, { from: "n5", to: "n7" },
  { from: "n6", to: "n7" }, { from: "n7", to: "n8" }, { from: "n8", to: "n9" },
];

export const defaultSavedWorkflows: SavedWorkflow[] = [
  {
    id: "sw1", name: "Full SDLC Pipeline", status: "active", createdAt: "May 24, 2026",
    nodes: [
      { id: "sn1", type: "product-vision", label: "Product Vision/Req.", category: "Strategic",  color: "#6366f1", x: 40,  y: 60  },
      { id: "sn2", type: "prd",            label: "PRD",             category: "Strategic",  color: "#6366f1", x: 240, y: 60  },
      { id: "sn3", type: "epic",           label: "Epic",            category: "Strategic",  color: "#6366f1", x: 440, y: 60  },
      { id: "sn4", type: "hld",            label: "HLD",             category: "Architecture", color: "#f59e0b", x: 640, y: 60  },
      { id: "sn5", type: "code-module",    label: "Code Module",     category: "Development", color: "#22c55e", x: 440, y: 180 },
      { id: "sn6", type: "test-suite",     label: "Test Suite",      category: "QA",         color: "#a855f7", x: 640, y: 180 },
      { id: "sn7", type: "deployment",     label: "Deployment",      category: "Operations",  color: "#3b82f6", x: 840, y: 120 },
    ],
    edges: [
      { id: "se1", fromId: "sn1", toId: "sn2", relationship: "generates"  },
      { id: "se2", fromId: "sn2", toId: "sn3", relationship: "generates"  },
      { id: "se3", fromId: "sn3", toId: "sn4", relationship: "triggers"   },
      { id: "se4", fromId: "sn3", toId: "sn5", relationship: "successor"  },
      { id: "se5", fromId: "sn5", toId: "sn6", relationship: "validates"  },
      { id: "se6", fromId: "sn6", toId: "sn7", relationship: "triggers"   },
    ],
  },
  {
    id: "sw2", name: "Hotfix Workflow", status: "draft", createdAt: "May 25, 2026",
    nodes: [
      { id: "hn1", type: "incident",    label: "Incident Alert", category: "Observability", color: "#ef4444", x: 40,  y: 80 },
      { id: "hn2", type: "code-module", label: "Code Module",    category: "Development",   color: "#22c55e", x: 240, y: 80 },
      { id: "hn3", type: "pull-request",label: "Pull Request",   category: "Development",   color: "#22c55e", x: 440, y: 80 },
      { id: "hn4", type: "deployment",  label: "Deployment",     category: "Operations",    color: "#3b82f6", x: 640, y: 80 },
    ],
    edges: [
      { id: "he1", fromId: "hn1", toId: "hn2", relationship: "triggers"  },
      { id: "he2", fromId: "hn2", toId: "hn3", relationship: "successor" },
      { id: "he3", fromId: "hn3", toId: "hn4", relationship: "triggers"  },
    ],
  },
];
