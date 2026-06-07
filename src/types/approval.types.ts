// Approval-related type definitions
import { Status } from './common.types';

export interface Approval {
  id: string;
  item: string;
  workflow: string;
  agent: string;
  risk: "Low" | "Medium" | "High" | "Critical";
  approver: string;
  status: Status;
  sla: string;
}
