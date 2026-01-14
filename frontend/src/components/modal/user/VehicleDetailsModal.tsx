import DarkModal from "@/components/layouts/DarkModal";
import type { IVehicleDTO } from "@/types/VehicleTypes";
import React from "react";

interface ModalProps {
  vehicle: IVehicleDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

const VehicleDetailsModal: React.FC<ModalProps> = ({
  vehicle,
  isOpen,
  onClose,
}) => {
  return (
    <DarkModal isOpen={isOpen} onClose={onClose}>
      {vehicle && (
        <section className="text-white space-y-5">
          {/* Vehicle Title */}
          <header>
            <h2 className="text-xl font-semibold tracking-wide">
              {vehicle.makeName} {vehicle.model}
            </h2>
            <p className="text-sm text-gray-400">Variant: {vehicle.variant}</p>
          </header>

          {/* Vehicle Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">License Plate</p>
              <p className="font-medium">{vehicle.licensePlate}</p>
            </div>

            <div>
              <p className="text-gray-400">Fuel Type</p>
              <p className="font-medium">{vehicle.fuelType}</p>
            </div>

            <div>
              <p className="text-gray-400">Color</p>
              <p className="font-medium">{vehicle.color}</p>
            </div>

            <div>
              <p className="text-gray-400">Last Service</p>
              <p className="font-medium">{ vehicle.lastServicedKM ? `${vehicle.lastServicedKM} KM` : "Not Available"}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 pt-4">
            {/* Documents */}
            <h3 className="text-base font-semibold mb-3">Documents Validity</h3>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Insurance</span>
              <span>
                { new Date(vehicle.insuranceValidity) < new Date() ? `Expired on ${new Date(vehicle.insuranceValidity).toLocaleDateString("en-GB")}` : new Date(vehicle.insuranceValidity).toLocaleDateString("en-GB")}
              </span>
            </div>

            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-400">PUCC</span>
              <span>{new Date(vehicle.puccValidity) < new Date() ? `Expired on ${new Date(vehicle.puccValidity).toLocaleDateString("en-GB")}` : new Date(vehicle.puccValidity).toLocaleDateString("en-GB")}</span>
            </div>
          </div>
        </section>
      )}
    </DarkModal>
  );
};

export default VehicleDetailsModal;
