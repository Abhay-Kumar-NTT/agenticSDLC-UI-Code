// Workflow relationship configuration

export const relationships = [
  { type: "successor",   label: "Successor",   color: "#3b82f6", dash: false },
  { type: "predecessor", label: "Predecessor",  color: "#6366f1", dash: false },
  { type: "triggers",    label: "Triggers",     color: "#f59e0b", dash: false },
  { type: "blocks",      label: "Blocks",       color: "#ef4444", dash: true  },
  { type: "validates",   label: "Validates",    color: "#22c55e", dash: false },
  { type: "generates",   label: "Generates",    color: "#a855f7", dash: false },
  { type: "depends-on",  label: "Depends On",   color: "#06b6d4", dash: true  },
  { type: "reviewed-by", label: "Reviewed By",  color: "#f97316", dash: true  },
];
