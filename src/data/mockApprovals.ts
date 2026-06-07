// Mock approval data
import { Approval } from '../types';

export const approvals: Approval[] = [
  { id: "ap1", item: "PR #487 — feat: JWT refresh token rotation", workflow: "Development", agent: "Backend Developer", risk: "Medium", approver: "Sarah Chen", status: "pending", sla: "2h remaining" },
  { id: "ap2", item: "Architecture Approval — Microservices v2 HLD", workflow: "Architecture", agent: "Solution Architect", risk: "High", approver: "Abhay Kumar", status: "pending", sla: "6h remaining" },
  { id: "ap3", item: "Deploy release/v2.4.1 → Production", workflow: "Deployment", agent: "DevOps Agent", risk: "High", approver: "Emma Torres", status: "pending", sla: "1h remaining" },
  { id: "ap4", item: "Security Override — Auth Middleware OWASP A07", workflow: "Governance", agent: "Security Reviewer", risk: "Critical", approver: "Daniel Kim", status: "blocked", sla: "OVERDUE" },
  { id: "ap5", item: "PR #482 — refactor: payment service extraction", workflow: "Development", agent: "Backend Developer", risk: "Low", approver: "Sarah Chen", status: "completed", sla: "Approved 3h ago" },
  { id: "ap6", item: "Infrastructure IaC — EKS cluster autoscaling", workflow: "Deployment", agent: "DevOps Agent", risk: "Medium", approver: "Emma Torres", status: "pending", sla: "12h remaining" },
];
