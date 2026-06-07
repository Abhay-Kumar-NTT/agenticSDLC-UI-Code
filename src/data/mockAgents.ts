// Mock agent data
import { Agent, ActivityFeedItem } from '../types';

export const agents: Agent[] = [
  { id: "a1", name: "Product Strategist", type: "Strategic", status: "running", model: "claude-opus-4-7", cost: "$0.84", lastRun: "2m ago", approvalRequired: false, executions: 142 },
  { id: "a2", name: "Business Analyst", type: "Strategic", status: "completed", model: "claude-sonnet-4-6", cost: "$0.31", lastRun: "12m ago", approvalRequired: false, executions: 89 },
  { id: "a3", name: "Solution Architect", type: "Strategic", status: "waiting", model: "claude-opus-4-7", cost: "$1.24", lastRun: "18m ago", approvalRequired: true, executions: 67 },
  { id: "a12", name: "Code Analyst", type: "Strategic", status: "completed", model: "claude-sonnet-4-6", cost: "$0.45", lastRun: "25m ago", approvalRequired: false, executions: 156 },
  { id: "a13", name: "Design Analyst", type: "Strategic", status: "running", model: "claude-sonnet-4-6", cost: "$0.38", lastRun: "8m ago", approvalRequired: false, executions: 124 },
  { id: "a4", name: "Backend Developer", type: "Engineering", status: "running", model: "claude-sonnet-4-6", cost: "$0.52", lastRun: "5m ago", approvalRequired: false, executions: 318 },
  { id: "a5", name: "Frontend Developer", type: "Engineering", status: "completed", model: "claude-sonnet-4-6", cost: "$0.41", lastRun: "31m ago", approvalRequired: false, executions: 201 },
  { id: "a6", name: "QA Engineer", type: "Engineering", status: "running", model: "claude-haiku-4-5", cost: "$0.12", lastRun: "3m ago", approvalRequired: false, executions: 445 },
  { id: "a7", name: "Security Reviewer", type: "Governance", status: "blocked", model: "claude-opus-4-7", cost: "$0.92", lastRun: "36m ago", approvalRequired: true, executions: 54 },
  { id: "a8", name: "Compliance Validator", type: "Governance", status: "completed", model: "claude-sonnet-4-6", cost: "$0.37", lastRun: "2h ago", approvalRequired: true, executions: 38 },
  { id: "a9", name: "DevOps Agent", type: "Operational", status: "completed", model: "claude-sonnet-4-6", cost: "$0.28", lastRun: "1h ago", approvalRequired: true, executions: 127 },
  { id: "a10", name: "SRE Agent", type: "Operational", status: "waiting", model: "claude-sonnet-4-6", cost: "$0.33", lastRun: "4h ago", approvalRequired: true, executions: 92 },
  { id: "a11", name: "Incident Analyzer", type: "Operational", status: "completed", model: "claude-opus-4-7", cost: "$1.10", lastRun: "6h ago", approvalRequired: false, executions: 29 },
];

export const activityFeed: ActivityFeedItem[] = [
  { id: 1, agent: "PRD Agent", action: "Generated PRD v1.3", artifact: "User Auth Module PRD", time: "2m ago", status: "completed" },
  { id: 2, agent: "Architecture Agent", action: "Generated HLD diagram", artifact: "Microservices Topology", time: "8m ago", status: "completed" },
  { id: 3, agent: "QA Agent", action: "Detected 3 missing edge cases", artifact: "Payment Flow Tests", time: "14m ago", status: "waiting" },
  { id: 4, agent: "Development Agent", action: "Raised PR #487", artifact: "feat: JWT refresh token", time: "21m ago", status: "completed" },
  { id: 5, agent: "Security Reviewer", action: "Flagged OWASP A07 risk", artifact: "Auth middleware", time: "35m ago", status: "blocked" },
  { id: 6, agent: "DevOps Agent", action: "Deployed to staging", artifact: "release/v2.4.1", time: "1h ago", status: "completed" },
];
