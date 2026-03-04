import React from "react";
import { Phone, Car, Calendar, Clock, Wrench, CheckCircle2, XCircle, AlertCircle, PlayCircle, Package, CreditCard, User } from "lucide-react";
import type { PopulatedAppointmentData } from "@/types/AppointmentTypes";
import DarkModal from "@/components/modal/DarkModal";

interface AppointmentHistoryModalProps {
  appointment: PopulatedAppointmentData;
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig: Record<string, { color: string; bg: string; dot: string }> = {
  pending:     { color: "text-yellow-400",  bg: "bg-yellow-400/10",  dot: "bg-yellow-400"  },
  confirmed:   { color: "text-blue-400",    bg: "bg-blue-400/10",    dot: "bg-blue-400"    },
  in_progress: { color: "text-orange-400",  bg: "bg-orange-400/10",  dot: "bg-orange-400"  },
  completed:   { color: "text-emerald-400", bg: "bg-emerald-400/10", dot: "bg-emerald-400" },
  cancelled:   { color: "text-red-400",     bg: "bg-red-400/10",     dot: "bg-red-400"     },
  delivered:   { color: "text-purple-400",  bg: "bg-purple-400/10",  dot: "bg-purple-400"  },
};

const serviceStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />;
    case "skipped":   return <XCircle      size={13} className="text-red-400 shrink-0"     />;
    case "started":   return <PlayCircle   size={13} className="text-orange-400 shrink-0"  />;
    default:          return <AlertCircle  size={13} className="text-[#555] shrink-0"      />;
  }
};

const eventIcon = (role: string) => {
  switch (role?.toLowerCase()) {
    case "garage_owner": return <Wrench  size={12} />;
    case "mechanic":     return <Package size={12} />;
    case "customer":     return <User    size={12} />;
    default:             return <AlertCircle size={12} />;
  }
};

const formatEventTime = (dateStr: string) => {
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
};

const AppointmentHistoryModal: React.FC<AppointmentHistoryModalProps> = ({
  appointment,
  isOpen,
  onClose,
}) => {
  const {
    status,
    appointmentDate,
    startTime,
    endTime,
    totalDuration,
    paymentStatus,
    services,
    vehicle,
    userData,
    events = [],
    mechanicId,
    cancellationReason,
    customerNote,
    mechanicNote,
    amount,
    appId,
  } = appointment;

  const sc = statusConfig[status] ?? statusConfig.pending;

  return (
    <DarkModal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5 text-white">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#2a2a2a] pb-4">
          <div>
            <p className="text-[10px] uppercase mb-1">
              Appointment #{appId}
            </p>
            <h2 className="text-base font-semibold text-white">Appointment History</h2>
          </div>
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize ${sc.color} ${sc.bg}`}>
            {status.replace("_", " ")}
          </span>
        </div>

        {/* Quick Info Strip */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <InfoChip icon={<Calendar size={11} />} label="Date"     value={new Date(appointmentDate).toDateString()} />
          <InfoChip icon={<Clock    size={11} />} label="Slot"     value={`${startTime} – ${endTime}`}              />
          <InfoChip icon={<Clock    size={11} />} label="Duration" value={`${totalDuration} mins`}                  />
          <InfoChip
            icon={<CreditCard size={11} />}
            label="Payment"
            value={status === "cancelled" ? "Cancelled" : paymentStatus ?? "—"}
          />
          {amount != null && (
            <InfoChip icon={<CreditCard size={11} />} label="Amount" value={`₹${amount}`} />
          )}
        </div>

        {/* Services */}
        <Section title="Services">
          <div className="space-y-2">
            {services.map((svc) => (
              <div key={svc.serviceId} className="bg-[#1a1a1a] rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2">
                  {serviceStatusIcon(svc.status)}
                  <span className="text-sm flex-1">{svc.name}</span>
                  <span className={`text-[10px] capitalize px-2 py-0.5 rounded font-medium
                    ${svc.status === "completed" ? "bg-emerald-500/15 text-emerald-400" :
                      svc.status === "skipped"   ? "bg-red-500/15 text-red-400"         :
                      svc.status === "started"   ? "bg-orange-500/15 text-orange-400"   :
                                                   "bg-[#2a2a2a] text-[#666]"}`}>
                    {svc.status}
                  </span>
                </div>

                {svc.status === "skipped" && svc.skipReason && (
                  <p className="text-[11px] text-red-400/80 mt-1.5 pl-5">
                    Skip reason: {svc.skipReason}
                  </p>
                )}

                <div className="flex gap-3 mt-1 pl-5">
                  {svc.startedAt && (
                    <p className="text-[10px] text-[#555]">
                      Started: {new Date(svc.startedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                  {svc.completedAt && (
                    <p className="text-[10px] text-[#555]">
                      Completed: {new Date(svc.completedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Event Timeline */}
        {events.length > 0 && (
          <Section title="Activity Timeline">
            <div className="relative">
              {/* vertical line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[#2a2a2a]" />

              <div className="space-y-3">
                {events.map((ev, i) => {
                  const { date, time } = formatEventTime(ev.createdAt);
                  return (
                    <div key={i} className="flex gap-3 relative">
                      {/* Icon bubble */}
                      <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center z-10
                        ${i === 0 ? "bg-blue-500/20 text-blue-400" : "bg-[#222] text-[#555]"}`}>
                        {eventIcon(ev.actorRole)}
                      </div>

                      <div className="flex-1 bg-[#1a1a1a] rounded-lg px-3 py-2">
                        <p className="text-xs text-[#ccc] leading-snug">{ev.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-[#555]">{ev.actorName}</span>
                          <span className="text-[10px] text-[#3a3a3a]">·</span>
                          <span className="text-[10px] text-[#444] capitalize">{ev.actorRole?.toLowerCase().replace("_", " ")}</span>
                          <span className="text-[10px] text-[#3a3a3a]">·</span>
                          <span className="text-[10px] text-[#444]">{date}, {time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>
        )}

        {/* Notes */}
        {(customerNote || mechanicNote || cancellationReason) && (
          <Section title="Notes">
            {customerNote && <Note label="Customer note" value={customerNote} color="text-[#aaa]" />}
            {mechanicNote && <Note label="Mechanic note" value={mechanicNote} color="text-[#aaa]" />}
            {cancellationReason && <Note label="Cancellation reason" value={cancellationReason} color="text-red-400" />}
          </Section>
        )}

        {/* Vehicle */}
        <Section title="Vehicle">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center">
              <Car size={14} className="text-[#555]" />
            </div>
            <div>
              <p className="text-sm">{vehicle.make.name} {vehicle.model.name}</p>
              <p className="text-[11px] text-[#555]">
                {vehicle.licensePlate} · {vehicle.registrationYear}
                {vehicle.fuelType && ` · ${vehicle.fuelType}`}
                {vehicle.color && ` · ${vehicle.color}`}
              </p>
            </div>
          </div>
        </Section>

        {/* Customer */}
        {userData && (
          <Section title="Customer">
            <div className="space-y-1">
              {userData.name && <p className="text-sm">{userData.name}</p>}
              {userData.email && <p className="text-xs text-[#666]">{userData.email}</p>}
              {userData.mobileNumber && (
                <p className="flex items-center gap-1.5 text-xs text-[#666]">
                  <Phone size={11} /> {userData.mobileNumber}
                </p>
              )}
            </div>
          </Section>
        )}

        {/* Mechanic */}
        {mechanicId && (
          <Section title="Assigned Mechanic">
            <div className="space-y-1">
              <p className="text-sm">{mechanicId.name}</p>
              {mechanicId.mobileNumber && (
                <p className="flex items-center gap-1.5 text-xs text-[#666]">
                  <Phone size={11} /> {mechanicId.mobileNumber}
                </p>
              )}
            </div>
          </Section>
        )}

      </div>
    </DarkModal>
  );
};

export default AppointmentHistoryModal;

/* ── helpers ─────────────────────────────────────────────────────────── */

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <p className="text-[10px] font-semibold tracking-widest uppercase text-[#444] mb-2">{title}</p>
    {children}
  </div>
);

const InfoChip = ({
  icon, label, value,
}: {
  icon: React.ReactNode; label: string; value: string;
}) => (
  <div className="bg-[#1a1a1a] rounded-lg px-3 py-2 flex items-center gap-2">
    <span className="text-[#444]">{icon}</span>
    <div>
      <p className="text-[9px] text-[#444] uppercase tracking-wider">{label}</p>
      <p className="text-xs text-[#bbb] font-medium capitalize">{value}</p>
    </div>
  </div>
);

const Note = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="bg-[#1a1a1a] rounded-lg px-3 py-2 mb-2">
    <p className="text-[10px] text-[#444] mb-0.5">{label}</p>
    <p className={`text-xs ${color}`}>{value}</p>
  </div>
);