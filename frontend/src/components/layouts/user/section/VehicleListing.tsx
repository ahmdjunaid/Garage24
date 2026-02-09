import { VehicleCard } from "@/components/cards/VehicleCard";
import { ConfirmModal } from "@/components/modal/ConfirmModal";
import AddVehicleModal from "@/components/modal/user/AddVehicleModal";
import VehicleDetailsModal from "@/components/modal/user/VehicleDetailsModal";
import {
  deleteVehicleApi,
  getVehiclesByUserIdApi,
} from "@/services/userServices";
import type { IVehicleDTO } from "@/types/VehicleTypes";
import { errorToast, successToast } from "@/utils/notificationAudio";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const VehicleListing: React.FC = () => {
  const [showAddModal, setShowModal] = useState<boolean>(false);
  const [vehicleToView, setVehicleToView] = useState<IVehicleDTO | null>(null);
  const [vehicles, setVehicles] = useState<IVehicleDTO[] | []>([]);
  const [vehicleToUpdate, setVehicleToUpdate] = useState<IVehicleDTO | null>(
    null,
  );
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const res = await getVehiclesByUserIdApi();
    setVehicles(res);
  };

  const handleRemove = async (id: string | null) => {
    if(!id) return
    try {
      await deleteVehicleApi(id);
      setVehicles(prev => prev.filter(v =>v._id !== id))
      successToast("Vehicle Deleted Successful.");
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    }
  };

  const handleUpdateClick = (vehicle: IVehicleDTO) => {
    setVehicleToUpdate(vehicle);
    setShowModal(true);
    setVehicleToView(null);
  };

  return (
    <div className="relative bg-[#1f1f1f] p-6">
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
      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              onView={(vehicle) => setVehicleToView(vehicle)}
              onBook={(id) => navigate(`/appointment?vehicleId=${id}`)}
              onRemove={setIdToDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-gray-400 border border-dashed border-gray-600 rounded-xl p-5">
          <p className="text-sm text-white">
            Vehicle not available. Add a new vehicle to make booking easier.
          </p>
        </div>
      )}

      <AddVehicleModal
        isOpen={showAddModal}
        onClose={() => {
          setShowModal(false)
          setVehicleToUpdate(null)
        }}
        onCreated={() => {
          fetchVehicles()
          setVehicleToUpdate(null)
        }}
        vehicle={vehicleToUpdate}
      />

      <VehicleDetailsModal
        vehicle={vehicleToView}
        isOpen={!!vehicleToView}
        onClose={() => setVehicleToView(null)}
        handleUpdate={handleUpdateClick}
      />

      <ConfirmModal 
        isOpen={!!idToDelete}
        onClose={()=>setIdToDelete(null)}
        message={"Are you sure want to delete this vehicle from myGarage?"}
        onConfirm={()=>{
          setIdToDelete(null)
          handleRemove(idToDelete)
        }}
      />
    </div>
  );
};
