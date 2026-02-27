import type { ChatAppointmentStatus, ChatRole } from "@/types/ChatTypes";

export const STATUS_CONFIG: Record<ChatAppointmentStatus, { label: string; bg: string; text: string; dot: string }> = {
  "pending":     { label: "Pending",     bg: "bg-[#2d2006]", text: "text-[#f0a000]", dot: "bg-[#f0a000]" },
  "confirmed":     { label: "Confirmed",     bg: "bg-[#0a1a2d]", text: "text-[#3b82f6]", dot: "bg-[#3b82f6]" },
  "in_progress": { label: "In Progress", bg: "bg-[#0a1f15]", text: "text-[#3fb950]", dot: "bg-[#3fb950]" },
};

export const ROLE_BUBBLE: Record<ChatRole, string> = {
  customer: "bg-[#1c2333] border border-[#30363d] text-[#c9d1d9]",
  mechanic: "bg-[#1f1a10] border border-[#3d2f00] text-[#c9d1d9]",
  garage:   "bg-[#0d1829] border border-[#1a3050] text-[#c9d1d9]",
};

export const ROLE_LABEL: Record<ChatRole, { text: string; color: string }> = {
  customer: { text: "Customer", color: "text-[#E5173F]" },
  mechanic: { text: "Mechanic", color: "text-[#f0a000]" },
  garage:   { text: "Garage",   color: "text-[#58a6ff]" },
};

export const ROLE_AVATAR_COLOR: Record<ChatRole, string> = {
  customer: "#E5173F",
  mechanic: "#D97706",
  garage:   "#2563EB",
};