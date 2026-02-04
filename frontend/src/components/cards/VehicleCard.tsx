import type { IVehicleDTO } from "@/types/VehicleTypes";
import { X } from "lucide-react";

interface VehicleCardProps {
  vehicle: IVehicleDTO;
  onView: (vehicle: IVehicleDTO) => void;
  onBook: (id: string) => void;
  onRemove?: (id: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onView,
  onBook,
  onRemove,
}) => {
  return (
    <div className="relative bg-[#2a2a2a] rounded-xl p-6 w-full max-w-sm shadow-lg">
      {/* Remove icon */}
      {onRemove && (
        <button
          onClick={() => onRemove(vehicle._id)}
          className="absolute top-3 right-3 text-red-500 hover:scale-110 transition"
        >
          <X size={16} />
        </button>
      )}

      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-36 h-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
          <img src={vehicle.imageUrl} alt="car" className="h-full" />
        </div>
      </div>

      {/* Details */}
      <h3 className="text-white text-lg font-semibold text-center">
        {`${vehicle.makeName} ${vehicle.model} ${vehicle.variant}`}
      </h3>
      <p className="text-gray-400 text-sm text-center mt-1">
        License Plate: {vehicle.licensePlate}
      </p>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => onView(vehicle)}
          className="flex-1 p-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm transition"
        >
          View Details
        </button>
        <button
          onClick={() => onBook(vehicle._id)}
          className="flex-1 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
        >
          Book an Appointment
        </button>
      </div>
    </div>
  );
};
