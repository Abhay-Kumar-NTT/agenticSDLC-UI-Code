// Mock audit log data
import { AuditLog } from '../types';

export const auditLogs: AuditLog[] = [
  { id: "al1", time: "2026-05-26 14:32:11", user: "Backend Developer (AI)", action: "CREATE", resource: "PR #487", outcome: "success" },
  { id: "al2", time: "2026-05-26 14:28:03", user: "sarah.chen@org.io", action: "APPROVE", resource: "ADR-012", outcome: "success" },
  { id: "al3", time: "2026-05-26 14:15:47", user: "Security Reviewer (AI)", action: "FLAG", resource: "Auth Middleware", outcome: "warning" },
  { id: "al4", time: "2026-05-26 14:01:22", user: "DevOps Agent (AI)", action: "DEPLOY", resource: "release/v2.4.1 → staging", outcome: "success" },
  { id: "al5", time: "2026-05-26 13:54:09", user: "james.park@org.io", action: "REJECT", resource: "Microservices HLD v1", outcome: "info" },
  { id: "al6", time: "2026-05-26 13:41:55", user: "Solution Architect (AI)", action: "GENERATE", resource: "HLD v2 — Microservices", outcome: "success" },
];
