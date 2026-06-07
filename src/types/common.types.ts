// Common type definitions used across the application

export type ViewId =
  | "dashboard" | "discovery" | "planning" | "architecture" | "development"
  | "qa" | "deployment" | "observability" | "agents" | "workflows"
  | "approvals" | "context-graph" | "artifacts" | "repositories" | "issues"
  | "pull-requests" | "pipelines" | "policies" | "audit" | "security" | "settings";

export type Status = "running" | "completed" | "failed" | "waiting" | "blocked" | "retrying" | "pending";

export type PRStatus = "review" | "merged" | "draft" | "closed";

export type RepositoryStatus = "active" | "archived" | "inactive";
