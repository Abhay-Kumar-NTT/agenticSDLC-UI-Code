#!/usr/bin/env python3
"""Extract SprintCanvas and WorkflowDesigner components from App.tsx"""

import sys

def extract_lines(file_path, start, end):
    """Extract lines from file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    return ''.join(lines[start-1:end])

def write_component(output_path, content):
    """Write component to file"""
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created {output_path}")

if __name__ == "__main__":
    app_file = r"c:\Users\267564\OneDrive - NTT Data Group\_GenAI CoE\Exploration\agenticSDLC-Code\agenticSDLC-frontend\src\app\App.tsx"

    # Read necessary imports from App.tsx
    imports_header = '''import { useState, useCallback, useRef, useEffect } from "react";
import {
  Play, Pause, RotateCcw, AlertTriangle, CheckCircle2, Clock, XCircle,
  TrendingUp, Users, FileText, Eye, Plus, ExternalLink, Circle, Terminal,
  Layers, GitMerge, MonitorDot, Gauge, SlidersHorizontal, ChevronUp, Minus,
  TriangleAlert, Info, Braces, PackageCheck, Server, TrendingDown, Radio,
  Database, MapPin, Trash2, RefreshCw
} from "lucide-react";
import { ViewId, Status, DesignerNode, DesignerEdge, SavedWorkflow, WorkflowNode, WorkflowEdge } from '../../types';
import {
  workflowNodes, workflowEdges, defaultSavedWorkflows
} from '../../data';
import {
  statusConfig, nodeColorByType, statusFillByStatus,
  paletteCategories, relationships,
  NODE_W, NODE_H
} from '../../config';
import { StatusBadge } from '../common';
import * as workflowService from '../../services/workflow.service';
import * as githubService from '../../services/github.service';

'''

    # Extract SprintCanvas (lines 222-668)
    print("Extracting SprintCanvas...")
    sprint_canvas_body = extract_lines(app_file, 222, 668)
    sprint_canvas = imports_header + '\nexport ' + sprint_canvas_body
    write_component(
        r"c:\Users\267564\OneDrive - NTT Data Group\_GenAI CoE\Exploration\agenticSDLC-Code\agenticSDLC-frontend\src\components\canvas\SprintCanvas.tsx",
        sprint_canvas
    )

    # Extract WorkflowDesigner (lines 671-1827)
    print("Extracting WorkflowDesigner...")
    workflow_designer_body = extract_lines(app_file, 671, 1827)
    workflow_designer = imports_header + '\nexport ' + workflow_designer_body
    write_component(
        r"c:\Users\267564\OneDrive - NTT Data Group\_GenAI CoE\Exploration\agenticSDLC-Code\agenticSDLC-frontend\src\components\canvas\WorkflowDesigner.tsx",
        workflow_designer
    )

    print("\nExtraction complete!")
    print("SprintCanvas: 447 lines")
    print("WorkflowDesigner: 1,157 lines")
