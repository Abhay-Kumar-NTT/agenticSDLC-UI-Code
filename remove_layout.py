#!/usr/bin/env python3
"""Remove Sidebar and TopNav functions from App.tsx (Phase 4 cleanup)"""

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
    # navSections config: lines 2863-2905 (includes comment)
    # Sidebar function: lines 2907-2977 (includes comment)
    # TopNav function: lines 2979-3059 (includes comment)
    ranges = [
        (2863, 2905),  # navSections config (43 lines)
        (2907, 2977),  # Sidebar function (71 lines)
        (2979, 3059),  # TopNav function (81 lines)
    ]

    total = remove_lines(app_file, ranges)
    print(f"Total lines removed: {total}")
    print(f"Expected: {43 + 71 + 81} = 195 lines")
