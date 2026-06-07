#!/usr/bin/env python3
"""Remove WorkflowsView, ArtifactsView, and GithubView functions from App.tsx (Phase 5 cleanup)"""

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
    # WorkflowsView function: lines 1826-2015 (190 lines)
    # Artifacts View header comment + config: lines 2017-2038 (22 lines)
    # ArtifactsView function: lines 2040-2405 (366 lines)
    # AI Agents View header comment: lines 2407-2409 (3 lines)
    # Approvals View header comment: lines 2410-2412 (3 lines)
    # GitHub Operations View header comment: line 2413 (1 line)
    # GithubView function: lines 2415-2859 (445 lines)

    ranges = [
        (1826, 2015),  # WorkflowsView (190 lines)
        (2017, 2038),  # Artifacts config (22 lines)
        (2040, 2405),  # ArtifactsView (366 lines)
        (2407, 2413),  # Comment headers (7 lines)
        (2415, 2859),  # GithubView (445 lines)
    ]

    total = remove_lines(app_file, ranges)
    print(f"Total lines removed: {total}")
    print(f"Expected: {190 + 22 + 366 + 7 + 445} = 1030 lines")
