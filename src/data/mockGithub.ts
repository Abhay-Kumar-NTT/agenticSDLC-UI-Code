// Mock GitHub data
import { PullRequest, Repository } from '../types';

export const pullRequests: PullRequest[] = [
  { id: "pr487", title: "feat: JWT refresh token rotation", author: "Backend Developer (AI)", branch: "feat/jwt-refresh", status: "review", checks: "passing", comments: 3, age: "2h" },
  { id: "pr486", title: "fix: race condition in order processor", author: "Backend Developer (AI)", branch: "fix/order-race", status: "merged", checks: "passing", comments: 7, age: "5h" },
  { id: "pr485", title: "feat: dashboard KPI widgets", author: "Frontend Developer (AI)", branch: "feat/dashboard-kpi", status: "review", checks: "passing", comments: 1, age: "8h" },
  { id: "pr484", title: "test: expand payment flow coverage", author: "QA Engineer (AI)", branch: "test/payment-coverage", status: "review", checks: "failing", comments: 0, age: "1d" },
  { id: "pr483", title: "docs: ADR-012 event sourcing decision", author: "Solution Architect (AI)", branch: "docs/adr-012", status: "merged", checks: "passing", comments: 4, age: "1d" },
];

export const repositories: Repository[] = [
  { name: "agenticsdlc-core", language: "TypeScript", stars: 0, branches: 12, lastCommit: "3m ago", status: "active" },
  { name: "agenticsdlc-agents", language: "Python", stars: 0, branches: 8, lastCommit: "18m ago", status: "active" },
  { name: "agenticsdlc-infra", language: "HCL", stars: 0, branches: 4, lastCommit: "2h ago", status: "active" },
  { name: "agenticsdlc-ui", language: "TypeScript", stars: 0, branches: 6, lastCommit: "31m ago", status: "active" },
];
