import type { PopulatedAppointmentData } from "@/types/AppointmentTypes";
import React from "react";
import { Car, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";

interface CardProps {
  appointments: PopulatedAppointmentData[];
  handleCancel: (id: string) => void;
  handleReschedule: (id: string) => void;
  handleViewDetails: (id: string) => void;
  handleChat: (id: string) => void;
}

const ACTIVE_STATUSES = ["pending", "confirmed", "in_progress"];

const AppointmentCard: React.FC<CardProps> = ({
  appointments,
  handleCancel,
  handleReschedule,
  handleViewDetails,
  handleChat,
}) => {
  const { unreadCounts } = useSelector((state: RootState) => state.chat);

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment._id}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4"
        >
          {/* Vehicle Image */}
          <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-[#2a2a2a] overflow-hidden">
            {appointment.vehicle.imageUrl ? (
              <img
                src={appointment.vehicle.imageUrl}
                alt="Vehicle"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="text-[#555]" size={36} />
              </div>
            )}
          </div>

          {/* Vehicle Info */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-base truncate">
              {appointment.vehicle.make.name} {appointment.vehicle.model.name}{" "}
              <span className="text-[#888] font-normal text-sm">
                ({appointment.vehicle.licensePlate})
              </span>
            </p>
            <p className="text-[#aaa] text-sm mt-1 truncate">
              {appointment.services.map((s) => s.name).join(", ")}
            </p>
            <p className="text-[#666] text-xs mt-2">
              {new Date(appointment.appointmentDate).toDateString()}
              {" • "}
              {appointment.startTime}
              {" • "}
              <span className="capitalize">{appointment.status}</span>
            </p>
          </div>

          {/* Action Buttons — right side on md+, below on mobile */}
          <div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:justify-end md:flex-shrink-0">
            {ACTIVE_STATUSES.includes(appointment.status) && (
              <>
                <button
                  onClick={() => handleCancel(appointment._id)}
                  className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-[#ddd] rounded-lg text-sm border border-[#3a3a3a] transition-colors whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReschedule(appointment._id)}
                  className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-[#ddd] rounded-lg text-sm border border-[#3a3a3a] transition-colors whitespace-nowrap"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => handleChat(appointment._id)}
                  className="relative flex items-center gap-1.5 px-4 py-2 
                      bg-[#2a2a2a] hover:bg-[#1d3a5c] text-[#60a5fa] 
                      hover:text-[#93c5fd] rounded-lg text-sm 
                      border border-[#3a3a3a] hover:border-[#3b6ea8] 
                      transition-colors whitespace-nowrap"
                >
                  <MessageCircle size={15} />
                  Chat
                  {unreadCounts?.[appointment._id] > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 
                          min-w-[18px] h-[18px] px-1 
                          bg-red-600 border-2 border-zinc-950 
                          rounded-full text-[10px] font-bold 
                          text-white flex items-center justify-center"
                    >
                      {unreadCounts[appointment._id]}
                    </span>
                  )}
                </button>
              </>
            )}
            <button
              onClick={() => handleViewDetails(appointment._id)}
              className="px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-lg text-sm transition-colors whitespace-nowrap"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentCard;
