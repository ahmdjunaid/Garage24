import type { IChatAppointment, IChatMessage } from "@/types/ChatTypes";

export function formatTime(date: Date | string) {
  return new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function groupByDate(messages: IChatMessage[]) {
  const groups: { label: string; messages: IChatMessage[] }[] = [];
  for (const msg of messages) {
    const d = new Date(msg.createdAt || Date.now());
    const isToday = d.toDateString() === new Date().toDateString();
    const label = isToday
      ? "Today"
      : d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.messages.push(msg);
    else groups.push({ label, messages: [msg] });
  }
  return groups;
}

export function getSenderId(senderId: string | { _id: string } | undefined): string {
  if (!senderId) return "";
  return typeof senderId === "object" ? senderId._id : senderId;
}

export function messageIsOwn(message:IChatMessage, currentUserId: string){
  return message.senderId === currentUserId
}

export function vehicleDisplayName(appt: IChatAppointment): string {
  const make  = appt.vehicle?.make?.name  || "";
  const model = appt.vehicle?.model?.name || "";
  return [make, model].filter(Boolean).join(" ") || "Vehicle";
}

export function initials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}