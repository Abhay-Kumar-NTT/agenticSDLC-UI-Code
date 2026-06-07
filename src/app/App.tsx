import { useState, useCallback, useRef, useEffect } from "react";
import { ProductDiscoveryView } from "./components/ProductDiscoveryView";
import { PlanningView } from "./components/PlanningView";
import { ArchitectureView } from "./components/ArchitectureView";
import { DevelopmentView } from "./components/DevelopmentView";
import { QAView } from "./components/QAView";
import { DeploymentView } from "./components/DeploymentView";
import { ObservabilityView } from "./components/ObservabilityView";
import {
  LayoutDashboard, Lightbulb, BookOpen, GitBranch, Code2, FlaskConical,
  Rocket, Activity, Bot, CheckSquare, Network, Github, FolderGit2,
  GitPullRequest, Zap, Shield, ScrollText, Lock, Settings, Bell, Search,
  ChevronRight, ChevronDown, Play, Pause, RotateCcw, AlertTriangle,
  CheckCircle2, Clock, XCircle, TrendingUp, Users, FileText, Eye,
  ThumbsUp, ThumbsDown, RefreshCw, Filter, MoreHorizontal, Plus,
  ExternalLink, Cpu, AlertCircle, Circle, Terminal, Layers, GitMerge,
  MonitorDot, Gauge, ListChecks, GitCommit, ArrowRight, Workflow,
  SlidersHorizontal, ChevronUp, Minus, TriangleAlert, Info, Braces,
  PackageCheck, Server, TrendingDown, Radio, Database, MapPin, Trash2,
  Edit3, MessageSquare
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import * as workflowService from "../services/workflow.service";
import * as githubService from "../services/github.service";
import * as repositoryService from "../services/repository.service";

// Phase 1 Refactoring: Extracted types, data, and config
import { ViewId, Status, DesignerNode, DesignerEdge, SavedWorkflow, WorkflowNode, WorkflowEdge } from '../types';
import {
  metricsData, deployData, agents, activityFeed,
  approvals, pullRequests, repositories,
  workflowNodes, workflowEdges, defaultSavedWorkflows,
  auditLogs
} from '../data';
import {
  statusConfig, nodeColorByType, statusFillByStatus,
  paletteCategories, relationships,
  NODE_W, NODE_H
} from '../config';
// Phase 2 Refactoring: Extracted utility components
import {
  StatusBadge, RiskBadge, KpiCard, SectionHeader, ComingSoon, ChartTooltip
} from '../components/common';
// Phase 3 Refactoring: Extracted view components
import {
  AuditView, ContextGraphView, ApprovalsView, AgentsView
} from '../components/views';
// Phase 4 Refactoring: Extracted layout components
import {
  Sidebar, TopNav
} from '../components/layout';
// Phase 5 Refactoring: Extracted remaining large view components
import {
  WorkflowsView, ArtifactsView, GithubView
} from '../components/views';
// Phase 6 Refactoring: Extracted dashboard and canvas components
import {
  DashboardView
} from '../components/views';
import {
  SprintCanvas, WorkflowDesigner
} from '../components/canvas';

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<ViewId>("dashboard");

  const githubTabMap: Partial<Record<ViewId, "repos" | "prs" | "issues" | "pipelines">> = {
    repositories: "repos",
    "pull-requests": "prs",
    issues: "issues",
    pipelines: "pipelines",
  };

  function renderView() {
    switch (view) {
      case "dashboard":   return <DashboardView setView={setView} />;
      case "workflows":   return <WorkflowsView />;
      case "agents":      return <AgentsView />;
      case "approvals":   return <ApprovalsView />;
      case "artifacts":   return <ArtifactsView />;
      case "context-graph": return <ContextGraphView />;
      case "repositories":
      case "pull-requests":
      case "issues":
      case "pipelines":
        return <GithubView initialTab={githubTabMap[view]} />;
      case "audit":       return <AuditView />;
      case "discovery":   return <ProductDiscoveryView />;
      case "planning":    return <PlanningView />;
      case "architecture": return <ArchitectureView />;
      case "development": return <DevelopmentView />;
      case "qa":          return <QAView />;
      case "deployment":  return <DeploymentView />;
      case "observability": return <ObservabilityView />;
      case "policies":    return <ComingSoon title="Policy Management" icon={Shield} />;
      case "security":    return <ComingSoon title="Security Center" icon={Lock} />;
      case "settings":    return <ComingSoon title="Platform Settings" icon={Settings} />;
      default:            return <DashboardView setView={setView} />;
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <Sidebar active={view} setView={setView} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNav active={view} />
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
