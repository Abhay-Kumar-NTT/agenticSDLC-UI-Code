// Audit-related type definitions

export interface AuditLog {
  id: string;
  time: string;
  user: string;
  action: "CREATE" | "APPROVE" | "FLAG" | "DEPLOY" | "REJECT" | "GENERATE";
  resource: string;
  outcome: "success" | "warning" | "info" | "error";
}
