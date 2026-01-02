import { X } from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onView: (id: string) => void;
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
          onClick={() => onRemove(vehicle.id)}
          className="absolute top-3 right-3 text-red-500 hover:scale-110 transition"
        >
          <X size={16} />
        </button>
      )}

      {/* Icon */}
      <div className="flex justify-center mb-4">
        <img
          src="/car-icon-red.svg" // replace with your svg
          alt="car"
          className="w-24 h-24"
        />
      </div>

      {/* Details */}
      <h3 className="text-white text-lg font-semibold text-center">
        {vehicle.name}
      </h3>
      <p className="text-gray-400 text-sm text-center mt-1">
        License Plate: {vehicle.licensePlate}
      </p>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => onView(vehicle.id)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm transition"
        >
          View Details
        </button>
        <button
          onClick={() => onBook(vehicle.id)}
          className="flex-1 bg-black border border-gray-600 hover:bg-gray-900 text-white py-2 rounded-lg text-sm transition"
        >
          Book an Appointment
        </button>
      </div>
    </div>
  );
};
