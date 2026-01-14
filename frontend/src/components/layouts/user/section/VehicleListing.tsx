import { VehicleCard } from "@/components/cards/VehicleCard";
import AddVehicleModal from "@/components/modal/user/AddVehicleModal";
import VehicleDetailsModal from "@/components/modal/user/VehicleDetailsModal";
import { getVehiclesByUserIdApi } from "@/services/userRouter";
import type { IVehicleDTO } from "@/types/VehicleTypes";
import { useEffect, useState } from "react";

export const VehicleListing: React.FC = () => {
  const [showAddModal, setShowModal] = useState<boolean>(false);
  const [vehicleToView, setVehicleToView] = useState<IVehicleDTO | null>(null);
  const [vehicles, setVehicles] = useState<IVehicleDTO[] | []>([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const res = await getVehiclesByUserIdApi();
    setVehicles(res);
  };

  const handleBook = (id: string) => {
    console.log("Book appointment", id);
  };

  const handleRemove = (id: string) => {
    console.log("Remove vehicle", id);
  };

  return (
    <div className="relative min-h-screen bg-[#1f1f1f] p-6">
      {/* Header */}
      <div className="flex justify-end mb-6">
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm"
          onClick={() => setShowModal(true)}
        >
          Add Vehicle
        </button>
      </div>

      {/* Vehicle grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle._id}
            vehicle={vehicle}
            onView={(vehicle) => setVehicleToView(vehicle)}
            onBook={handleBook}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <AddVehicleModal
        isOpen={showAddModal}
        onClose={() => setShowModal(false)}
        onCreated={() => fetchVehicles()}
      />
      <VehicleDetailsModal
        vehicle={vehicleToView}
        isOpen={!!vehicleToView}
        onClose={() => setVehicleToView(null)}
      />
    </div>
  );
};
