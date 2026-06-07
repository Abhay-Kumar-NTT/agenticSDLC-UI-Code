#!/usr/bin/env python3
"""Remove DashboardView, SprintCanvas, and WorkflowDesigner from App.tsx (Phase 6 cleanup)"""

import sys

def remove_lines(file_path, ranges_to_remove):
    """Remove specified line ranges from a file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Sort ranges in reverse order to avoid index shifting
    ranges_to_remove.sort(reverse=True)

    for start, end in ranges_to_remove:
        # Convert to 0-based index
        del lines[start-1:end]

    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)

    total_removed = sum(end - start + 1 for start, end in ranges_to_remove)
    print(f"Removed {total_removed} lines from {file_path}")
    return total_removed

if __name__ == "__main__":
    app_file = r"c:\Users\267564\OneDrive - NTT Data Group\_GenAI CoE\Exploration\agenticSDLC-Code\agenticSDLC-frontend\src\app\App.tsx"

    # Ranges to remove (inclusive):
    # Dashboard View header comment: lines 67-68 (2 lines)
    # DashboardView function: lines 70-225 (156 lines)
    # Workflow Canvas View header comment: lines 227-228 (2 lines)
    # Sprint Canvas comment: line 229 (1 line)
    # SprintCanvas function: lines 230-676 (447 lines)
    # Workflow Designer comment: line 678 (1 line)
    # WorkflowDesigner function: lines 679-1835 (1157 lines)

    ranges = [
        (67, 68),    # Dashboard header (2 lines)
        (70, 225),   # DashboardView (156 lines)
        (227, 229),  # Canvas header (3 lines)
        (230, 676),  # SprintCanvas (447 lines)
        (678, 678),  # Designer comment (1 line)
        (679, 1835), # WorkflowDesigner (1157 lines)
    ]

    total = remove_lines(app_file, ranges)
    print(f"Total lines removed: {total}")
    print(f"Expected: {2 + 156 + 3 + 447 + 1 + 1157} = 1766 lines")
