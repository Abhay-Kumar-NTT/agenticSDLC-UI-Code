/**
 * API Configuration
 *
 * Centralized configuration for API endpoints
 */

// Get API base URL from environment variable or use default
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// API endpoints
export const API_ENDPOINTS = {
  WORKFLOWS: `${API_BASE_URL}/api/workflows`,
  WORKFLOW_BY_ID: (id: string) => `${API_BASE_URL}/api/workflows/${id}`,
  WORKFLOW_CONTENT: (id: string) => `${API_BASE_URL}/api/workflows/${id}/content`,
  HEALTH: `${API_BASE_URL}/health`,
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  REQUEST_TIMEOUT,
  DEFAULT_HEADERS,
};
