import type { IChatAppointment } from "@/types/ChatTypes";
import { STATUS_CONFIG } from "../constants/constantsDatas";
import { initials, vehicleDisplayName } from "../handlers/handler";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";

export function AppointmentRow({
  appt,
  selected,
  onClick,
}: {
  appt: IChatAppointment;
  selected: boolean;
  onClick: () => void;
}) {
  const st   = STATUS_CONFIG[appt.status];
  const name = vehicleDisplayName(appt);
  const { unreadCounts } = useSelector((state:RootState)=>state.chat)

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 flex gap-3 items-center transition-all duration-150 border-b border-gray-800 ${
        selected
          ? "bg-gradient-to-r from-gray-800/60 to-gray-900/60"
          : "hover:bg-gray-800/30"
      }`}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 bg-[#E5173F] shadow-md">
        {initials(name)}
      </div>

      <div className="flex-1 min-w-0">
        {/* Vehicle name */}
        <span className={`block text-sm font-semibold truncate ${selected ? "text-white" : "text-gray-300"}`}>
          {name}
        </span>

        {/* Plate */}
        <span className="block text-[11px] text-gray-500 tracking-wider mt-0.5">
          {appt.vehicle?.licensePlate || "—"}
        </span>

        {/* Status + unread */}
        <div className="flex items-center justify-between mt-1.5">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
            {st.label}
          </span>
          {(unreadCounts[appt._id] ?? 0) > 0 && (
            <span className="bg-[#E5173F] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
              {unreadCounts[appt._id]}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}