# GitHub Workflow Integration Setup

This guide explains how to set up GitHub integration for the AgenticSDLC workflow orchestration system.

## Prerequisites

1. GitHub account with access to your repository
2. Repository with GitHub Actions workflows (e.g., `product-agent.yml`)
3. GitHub Personal Access Token with appropriate permissions

## Step 1: Create GitHub Personal Access Token

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a descriptive name: `AgenticSDLC Workflow Integration`
4. Set expiration (recommended: 90 days)
5. Select the following scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
   - ✅ `read:org` (Read org and team membership)
6. Click **"Generate token"**
7. **IMPORTANT**: Copy the token immediately - you won't be able to see it again!

## Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```bash
   # API Configuration
   VITE_API_BASE_URL=http://localhost:3001

   # GitHub Configuration
   VITE_GITHUB_TOKEN=ghp_your_token_here
   VITE_GITHUB_OWNER=your_github_username
   VITE_GITHUB_REPO=agenticsdlc-agents
   ```

3. Replace the values:
   - `VITE_GITHUB_TOKEN`: Paste the token you generated in Step 1
   - `VITE_GITHUB_OWNER`: Your GitHub username or organization name
   - `VITE_GITHUB_REPO`: The repository name (e.g., `agenticsdlc-agents`)

## Step 3: Verify GitHub Workflow File

Make sure your repository has the workflow file at:
```
.github/workflows/product-agent.yml
```

The workflow should be configured with `workflow_dispatch` trigger:
```yaml
name: Product Agent Workflow

on:
  workflow_dispatch:
    inputs:
      workflow_id:
        description: 'Workflow ID from AgenticSDLC'
        required: false
        type: string

jobs:
  run-agent:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Product Agent
        run: |
          python scripts/run_agent.py \
            --agent agents/product-agent/agent.yaml \
            --prompt agents/product-agent/prompt.md \
            --input artifacts/vision.md \
            --output artifacts/product/
```

## Step 4: Test the Integration

### Method 1: Using the UI

1. Start the backend and frontend servers:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

2. Open http://localhost:5173
3. Go to **Workflows** → **Workflow Designer**
4. Create a workflow with "Product Vision" as the first node
5. Save the workflow
6. Click **"Launch"** button
7. You should see an alert: "GitHub workflow 'product-agent' triggered successfully"
8. Switch to **"Live Runs"** tab to see the workflow running
9. Click **"Sync GitHub"** button to refresh status from GitHub

### Method 2: Test GitHub API Directly

Open browser console (F12) and run:
```javascript
// Test trigger workflow
const response = await fetch('https://api.github.com/repos/YOUR_OWNER/YOUR_REPO/actions/workflows/product-agent.yml/dispatches', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  },
  body: JSON.stringify({ ref: 'main' })
});
console.log(response.status); // Should be 204
```

## Available Features

### 1. Trigger Workflow
- Automatically triggered when launching a workflow that starts with "Product Vision"
- Uses GitHub workflow dispatch API
- Passes workflow ID as input (optional)

### 2. Monitor Status
- Click "Sync GitHub" button to fetch latest status
- Shows workflow run status (queued, in_progress, completed)
- Displays job-level status for each step
- Maps GitHub status to UI status:
  - `queued` → waiting
  - `in_progress` → running
  - `completed` + `success` → completed
  - `completed` + `failure` → failed
  - `cancelled` → blocked

### 3. View Logs (Coming Soon)
- Click "Logs" button to view GitHub workflow logs
- Shows real-time output from workflow execution

### 4. Retry Failed Workflows (Coming Soon)
- Click "Retry" button to re-run failed workflows
- Uses GitHub's rerun API

## Troubleshooting

### Error: "Failed to trigger workflow"

**Possible causes:**
1. Invalid GitHub token
   - Solution: Regenerate token with correct scopes
2. Wrong repository name
   - Solution: Check `VITE_GITHUB_OWNER` and `VITE_GITHUB_REPO`
3. Workflow file doesn't exist
   - Solution: Create `.github/workflows/product-agent.yml`
4. Token doesn't have `workflow` scope
   - Solution: Regenerate token with `workflow` scope

### Error: "No workflow runs found"

**Possible causes:**
1. Workflow hasn't started yet
   - Solution: Wait a few seconds and click "Sync GitHub"
2. Workflow dispatch failed
   - Solution: Check GitHub Actions tab in your repository
3. Wrong workflow file name
   - Solution: Verify the filename matches `product-agent.yml`

### CORS Errors

GitHub API doesn't have CORS issues as it's designed for client-side use. If you see CORS errors, it's likely related to your backend API, not GitHub.

### Rate Limiting

GitHub API has rate limits:
- Authenticated: 5,000 requests per hour
- Unauthenticated: 60 requests per hour

The integration polls every 10 seconds, so you have plenty of headroom.

## API Reference

### GitHub Service Functions

```typescript
// Trigger workflow
await githubService.triggerWorkflow('product-agent.yml', 'main', { workflow_id: '123' });

// Get latest runs
const runs = await githubService.getWorkflowRuns('product-agent.yml', 10);

// Get specific run details
const run = await githubService.getWorkflowRun(runId);

// Get jobs for a run
const jobs = await githubService.getWorkflowJobs(runId);

// Cancel workflow
await githubService.cancelWorkflowRun(runId);

// Rerun workflow
await githubService.rerunWorkflow(runId);

// Get logs
const logs = await githubService.getWorkflowLogs(runId);
```

## Security Best Practices

1. **Never commit `.env` file** - It's in `.gitignore` by default
2. **Use tokens with minimal required scopes**
3. **Rotate tokens regularly** (every 90 days)
4. **Use organization secrets** for production deployments
5. **Monitor token usage** in GitHub settings

## Next Steps

1. Implement automatic status polling (currently manual refresh)
2. Add log viewer in UI
3. Support multiple workflow types (not just product-agent)
4. Add workflow input parameters
5. Implement webhook listener for real-time updates
6. Add GitHub check runs integration
7. Support workflow artifacts download

## Resources

- [GitHub Actions API Documentation](https://docs.github.com/en/rest/actions)
- [Creating Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Workflow Dispatch Event](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch)
