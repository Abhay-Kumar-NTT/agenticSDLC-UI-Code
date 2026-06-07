// GitHub-related type definitions
import { PRStatus, RepositoryStatus } from './common.types';

export interface PullRequest {
  id: string;
  title: string;
  author: string;
  branch: string;
  status: PRStatus;
  checks: "passing" | "failing" | "pending";
  comments: number;
  age: string;
}

export interface Repository {
  name: string;
  language: string;
  stars: number;
  branches: number;
  lastCommit: string;
  status: RepositoryStatus;
}
