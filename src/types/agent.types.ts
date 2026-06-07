// Agent-related type definitions
import { Status } from './common.types';

export interface Agent {
  id: string;
  name: string;
  type: "Strategic" | "Engineering" | "Governance" | "Operational";
  status: Status;
  model: string;
  cost: string;
  lastRun: string;
  approvalRequired: boolean;
  executions: number;
}

export interface ActivityFeedItem {
  id: number;
  agent: string;
  action: string;
  artifact: string;
  time: string;
  status: Status;
}
