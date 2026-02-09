export const SERVICE_STATUS_META = {
  pending: {
    color: "bg-gray-400",
    label: "Pending",
  },
  started: {
    color: "bg-blue-500",
    label: "Started",
  },
  completed: {
    color: "bg-green-500",
    label: "Completed",
  },
  skipped: {
    color: "bg-red-500",
    label: "Skipped",
  },
} as const;
