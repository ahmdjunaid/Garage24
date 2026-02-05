import type { PopulatedAppointmentData } from "@/types/AppointmentTypes";
import React from "react";
import { Car } from "lucide-react";

interface CardProps {
  appointments: PopulatedAppointmentData[];
  handleCancel: (id: string) => void;
  handleReschedule: (id: string) => void;
  handleViewDetails: (data: PopulatedAppointmentData) => void;
}

const ACTIVE_STATUSES = ["pending", "confirmed", "in_progress"];

const AppointmentCard: React.FC<CardProps> = ({
  appointments,
  handleCancel,
  handleReschedule,
  handleViewDetails,
}) => {
  return (
    <div>
      <div className="space-y-5">
        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-2xl p-7 transition-colors hover:border-[#ef4444]/40"
          >
            <div className="flex items-center justify-between gap-6">
              {/* Left */}
              <div className="flex items-center gap-5">
                <div className="w-[70px] h-[70px] rounded-xl flex items-center justify-center border border-[#ef4444]/30 bg-[#2a2a2a] overflow-hidden">
                  {appointment.vehicle.imageUrl ? (
                    <img
                      src={appointment.vehicle.imageUrl}
                      alt="Vehicle"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Car
                      size={36}
                      className="text-[#ef4444]"
                      strokeWidth={1.5}
                    />
                  )}
                </div>

                <div>
                  <h3 className="text-white text-lg font-semibold">
                    {appointment.vehicle.make.name +
                      appointment.vehicle.model.name}
                    <span className="text-[#888] font-normal">
                      ({appointment.vehicle.licensePlate})
                    </span>
                  </h3>
                  <p className="text-[#999] text-sm">
                    {appointment.services
                      .map((service) => service.name)
                      .join(", ")}
                  </p>
                  <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-gray-600 text-white capitalize">
                    {new Date(appointment.appointmentDate).toDateString()}
                    {" • "}
                    {appointment.startTime}
                    {" • "}
                    {appointment.status}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {ACTIVE_STATUSES.includes(appointment.status) && (
                  <>
                    <button
                      onClick={() => handleCancel(appointment._id)}
                      className="px-5 py-2 bg-[#2a2a2a] hover:bg-[#333] text-[#ddd] rounded-lg text-sm border border-[#3a3a3a]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReschedule(appointment._id)}
                      className="px-5 py-2 bg-[#2a2a2a] hover:bg-[#333] text-[#ddd] rounded-lg text-sm border border-[#3a3a3a]"
                    >
                      Reschedule
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleViewDetails(appointment)}
                  className="px-5 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-lg text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentCard;
