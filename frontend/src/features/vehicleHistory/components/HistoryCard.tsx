import type { PopulatedAppointmentData } from "@/types/AppointmentTypes";
import React from "react";
import { Car } from "lucide-react";

interface CardProps {
  appointments: PopulatedAppointmentData[];
  handleViewDetails: (id: string) => void;
}

const AppointmentHistoryCard: React.FC<CardProps> = ({
  appointments,
  handleViewDetails,
}) => {

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

export default AppointmentHistoryCard;