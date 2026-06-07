// Workflow palette configuration
import {
  Lightbulb, FileText, Layers, BookOpen, Terminal, Network, ScrollText,
  Braces, Code2, GitPullRequest, CheckSquare, FlaskConical, ListChecks,
  Bot, Users, Rocket, PackageCheck, AlertCircle, Activity
} from "lucide-react";

export const paletteCategories = [
  {
    category: "Strategic", color: "#6366f1",
    items: [
      { type: "product-vision", label: "Product Vision/Req.", icon: Lightbulb },
      { type: "prd", label: "PRD", icon: FileText },
      { type: "epic", label: "Epic", icon: Layers },
      { type: "user-story", label: "User Story", icon: BookOpen },
    ],
  },
  {
    category: "Analysis", color: "#8b5cf6",
    items: [
      { type: "code-analysis", label: "Code Analysis", icon: Terminal },
      { type: "design-analysis", label: "Design Analysis", icon: Layers },
    ],
  },
  {
    category: "Architecture", color: "#f59e0b",
    items: [
      { type: "hld", label: "HLD", icon: Network },
      { type: "lld", label: "LLD", icon: Layers },
      { type: "adr", label: "ADR", icon: ScrollText },
      { type: "api-contract", label: "API Contract", icon: Braces },
      { type: "ui-ux", label: "UI/UX", icon: Layers },
    ],
  },
  {
    category: "Development", color: "#22c55e",
    items: [
      { type: "code-module", label: "Code Module", icon: Code2 },
      { type: "pull-request", label: "Pull Request", icon: GitPullRequest },
    ],
  },
  {
    category: "QA", color: "#a855f7",
    items: [
      { type: "test-strategy", label: "Test Strategy", icon: FileText },
      { type: "test-cases", label: "Test Cases", icon: CheckSquare },
      { type: "test-plan", label: "Test Plan", icon: BookOpen },
      { type: "test-suite", label: "Test Suite", icon: FlaskConical },
      { type: "test-report", label: "Test Report", icon: ListChecks },
    ],
  },
  {
    category: "Reviews", color: "#ec4899",
    items: [
      { type: "ai-agent-reviewer", label: "AI Agent Reviewer", icon: Bot, color: "#06b6d4" },
      { type: "human-in-loop", label: "Human-in-Loop", icon: Users },
    ],
  },
  {
    category: "Operations", color: "#3b82f6",
    items: [
      { type: "deployment", label: "Deployment", icon: Rocket },
      { type: "release", label: "Release", icon: PackageCheck },
    ],
  },
  {
    category: "Observability", color: "#ef4444",
    items: [
      { type: "incident", label: "Incident Alert", icon: AlertCircle },
      { type: "monitoring", label: "Monitoring", icon: Activity },
    ],
  },
];
