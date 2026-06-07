import { useState, useEffect, useCallback } from "react";
import { SlidersHorizontal, Activity } from "lucide-react";
import { Status } from '../../types';
import * as workflowService from '../../services/workflow.service';
import * as githubService from '../../services/github.service';
import * as repositoryService from '../../services/repository.service';
import { SprintCanvas, WorkflowDesigner } from '../canvas';

export function WorkflowsView() {
  const [tab, setTab] = useState<"live" | "designer">("designer");
  const [liveRuns, setLiveRuns] = useState<Array<{ id: string; name: string; nodes: any[]; edges: any[]; status: string; startedAt: string; githubRunId?: number }>>([]);
  const [connectedRepos, setConnectedRepos] = useState<any[]>([]);

  // Load connected repositories on component mount
  useEffect(() => {
    const loadRepositories = async () => {
      try {
        const response = await repositoryService.getAllRepositories();
        if (response.success && response.data) {
          setConnectedRepos(response.data);
        }
      } catch (error) {
        console.error('Error loading repositories:', error);
      }
    };
    loadRepositories();
  }, []);

  // Load active workflows on component mount
  useEffect(() => {
    const loadActiveWorkflows = async () => {
      try {
        console.log('Loading active workflows from database...');
        const response = await workflowService.getAllWorkflows();

        if (response.success && response.data) {
          // Filter for active workflows only
          const activeWorkflows = response.data.filter((wf: any) => wf.status === 'active');

          if (activeWorkflows.length === 0) {
            console.log('No active workflows found');
            return;
          }

          console.log(`Found ${activeWorkflows.length} active workflows`);

          // Switch to Live Runs tab if there are active workflows
          setTab("live");

          // Load full details for each active workflow and convert to live runs
          const liveRunsPromises = activeWorkflows.map(async (wf: any) => {
            try {
              const detailResponse = await workflowService.getWorkflowById(wf.id);
              if (!detailResponse.success || !detailResponse.data) {
                console.warn(`Failed to load details for workflow ${wf.id}`);
                return null;
              }

              const fullWorkflow = detailResponse.data;

              // Convert positions to numbers
              const nodesWithPositions = fullWorkflow.nodes.map((n: any) => ({
                ...n,
                x: parseFloat(n.x) || 0,
                y: parseFloat(n.y) || 0
              }));

              // Calculate bounding box and scaling for Live Runs canvas
              const minX = Math.min(...nodesWithPositions.map((n: any) => n.x));
              const maxX = Math.max(...nodesWithPositions.map((n: any) => n.x));
              const minY = Math.min(...nodesWithPositions.map((n: any) => n.y));
              const maxY = Math.max(...nodesWithPositions.map((n: any) => n.y));

              const workflowWidth = maxX - minX + 128;
              const workflowHeight = maxY - minY + 56;

              const canvasWidth = 1120;
              const canvasHeight = 320;
              const padding = 40;
              const availableWidth = canvasWidth - padding * 2;
              const availableHeight = canvasHeight - padding * 2;

              const scaleX = availableWidth / workflowWidth;
              const scaleY = availableHeight / workflowHeight;
              const scale = Math.min(scaleX, scaleY, 1);

              const scaledWidth = workflowWidth * scale;
              const scaledHeight = workflowHeight * scale;
              const offsetX = (canvasWidth - scaledWidth) / 2 - minX * scale;
              const offsetY = (canvasHeight - scaledHeight) / 2 - minY * scale;

              // Map nodes to live run format with scaled positions
              const liveNodes = nodesWithPositions.map((n: any, i: number) => ({
                id: n.id,
                label: n.label,
                type: n.category?.toLowerCase() || "strategic",
                status: "completed" as Status, // Default to completed for existing runs
                x: n.x * scale + offsetX,
                y: n.y * scale + offsetY,
                artifacts: 0
              }));

              // Map edges to live run format
              const liveEdges = fullWorkflow.edges.map((e: any) => ({
                from: e.fromId,
                to: e.toId,
                fromId: e.fromId,
                toId: e.toId,
                relationship: e.relationship || "successor"
              }));

              return {
                id: wf.id,
                name: wf.name,
                nodes: liveNodes,
                edges: liveEdges,
                status: wf.status,
                startedAt: wf.updated_at || wf.created_at
              };
            } catch (error) {
              console.error(`Error loading workflow ${wf.id}:`, error);
              return null;
            }
          });

          const loadedRuns = (await Promise.all(liveRunsPromises)).filter(Boolean);
          console.log(`Loaded ${loadedRuns.length} live runs`);
          setLiveRuns(loadedRuns as any[]);
        }
      } catch (error) {
        console.error('Error loading active workflows:', error);
      }
    };

    loadActiveWorkflows();
  }, []); // Run once on mount

  // Update live run node status
  const updateLiveRunNode = useCallback((runId: string, nodeId: string, status: Status, artifacts?: number) => {
    setLiveRuns(prev => prev.map(run => {
      if (run.id === runId) {
        return {
          ...run,
          nodes: run.nodes.map((n: any) =>
            n.id === nodeId ? { ...n, status, artifacts: artifacts ?? n.artifacts } : n
          )
        };
      }
      return run;
    }));
  }, []);

  // Sync GitHub workflow status
  const syncGitHubStatus = useCallback(async (runId: string, githubRunId: number) => {
    try {
      const jobsResponse = await githubService.getWorkflowJobs(githubRunId);

      if (jobsResponse.success && jobsResponse.data) {
        jobsResponse.data.forEach((job: any) => {
          const status = githubService.mapGitHubStatus(job.status, job.conclusion);
          // Map job name to node - would need better mapping logic based on your workflow
          const nodeIndex = jobsResponse.data.indexOf(job);
          updateLiveRunNode(runId, `node-${nodeIndex}`, status);
        });
      }
    } catch (error) {
      console.error('Error syncing GitHub status:', error);
    }
  }, [updateLiveRunNode]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-5 pb-0 flex-shrink-0">
        <div>
          <h2 className="text-base font-semibold text-foreground">Workflow Orchestration Canvas</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Visualize, design, save and launch SDLC workflows</p>
        </div>
        <div className="flex gap-1 border border-border rounded-lg p-0.5 bg-muted">
          {[{ id: "designer" as const, label: "Workflow Designer", icon: SlidersHorizontal }, { id: "live" as const, label: "Live Runs", icon: Activity }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${tab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              <t.icon size={11} /> {t.label} {t.id === "live" && liveRuns.length > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-blue-500/20 text-blue-400">{liveRuns.length}</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden mt-4 relative">
        {tab === "live" ? (
          <SprintCanvas liveRuns={liveRuns} onRefreshStatus={syncGitHubStatus} />
        ) : (
          <WorkflowDesigner
            onLaunch={(run) => { setLiveRuns(prev => [run, ...prev]); setTab("live"); }}
            connectedRepos={connectedRepos}
          />
        )}
      </div>
    </div>
  );
}
