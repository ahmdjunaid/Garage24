import { VehicleCard } from "@/components/cards/VehicleCard";
import AddVehicleModal from "@/components/modal/AddVehicleModal";
import { useState } from "react";


const vehicles = [
  {
    id: "1",
    name: "Honda City i-VTEC",
    licensePlate: "KL-11-BN-7774",
  },
  {
    id: "2",
    name: "Toyota Etios Liva",
    licensePlate: "KL-57-Y-5656",
  },
  {
    id: "3",
    name: "Toyota Altis GL",
    licensePlate: "KL-57-AB-1797",
  },
];

export const VehicleListing: React.FC = () => {
  const [showAddModal, setShowModal] = useState<boolean>(false)
  const handleView = (id: string) => {
    console.log("View vehicle", id);
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
          onClick={()=>setShowModal(true)}
          >
          Add Vehicle
        </button>
      </div>

      {/* Vehicle grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onView={handleView}
            onBook={handleBook}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <AddVehicleModal isOpen={showAddModal} onClose={()=>setShowModal(false)} onSubmit={(da)=>console.log(da)}/>
    </div>
  );
};
