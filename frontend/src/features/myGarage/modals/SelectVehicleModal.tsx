import React, { useState } from "react";
import DarkModal from "../../../components/modal/DarkModal";
import { Car, ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SelectVehicleModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isHovering, setIsHovering] = useState<"myGarage" | "newVehicle" | null>(null);
  const navigate = useNavigate()

  return (
    <DarkModal isOpen={isOpen} onClose={onClose}>
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-8 mt-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Select Vehicle Source
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Choose where you want to book your appointment from
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* My Garage Option */}
          <button
            onClick={()=>navigate("/my-garage")}
            onMouseEnter={() => setIsHovering("myGarage")}
            onMouseLeave={() => setIsHovering(null)}
            className={`relative group overflow-hidden rounded-xl transition-all duration-500 transform hover:scale-105 
            `}
          >
            {/* Background with gradient */}
            <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 flex flex-col items-center justify-center min-h-[280px] h-full">
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon container */}
              <div className="relative z-10 mb-6">
                <div className="relative">
                  {/* Main icon background */}
                  <div className="w-28 h-28 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:rotate-6 transition-transform duration-500">
                    <Car size={56} className="text-white" strokeWidth={1.5} />
                  </div>

                  {/* Badge */}
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-xl border-4 border-black transform group-hover:scale-110 transition-transform duration-300">
                    {/* <span className="text-xl font-bold text-white">3</span> */}
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="relative z-10 text-center">
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  My Garage
                  <ChevronRight
                    className={`transform transition-all duration-300 ${
                      isHovering === "myGarage"
                        ? "translate-x-1 opacity-100"
                        : "translate-x-0 opacity-0"
                    }`}
                    size={24}
                  />
                </h3>
                <p className="text-gray-400 text-sm px-4">
                  Select from your saved vehicles
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </button>

          {/* New Vehicle Option */}
          <button
            onClick={()=>navigate("/appointment")}
            onMouseEnter={() => setIsHovering("newVehicle")}
            onMouseLeave={() => setIsHovering(null)}
            className={`relative group overflow-hidden rounded-xl transition-all duration-500 transform hover:scale-105`}
          >
            {/* Background with gradient */}
            <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 flex flex-col items-center justify-center min-h-[280px]">
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon container */}
              <div className="relative z-10 mb-6">
                <div className="relative">
                  {/* Main icon background */}
                  <div className="w-28 h-28 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:-rotate-6 transition-transform duration-500">
                    <Car size={56} className="text-white" strokeWidth={1.5} />
                  </div>

                  {/* Plus badge */}
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-xl border-4 border-black transform group-hover:scale-110 group-hover:rotate-90 transition-all duration-300">
                    <Plus size={28} strokeWidth={3} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="relative z-10 text-center">
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  New Vehicle
                  <ChevronRight
                    className={`transform transition-all duration-300 ${
                      isHovering === "newVehicle"
                        ? "translate-x-1 opacity-100"
                        : "translate-x-0 opacity-0"
                    }`}
                    size={24}
                  />
                </h3>
                <p className="text-gray-400 text-sm px-4">
                  Add a new vehicle to book appointment
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </button>
        </div>

        {/* Optional: Additional info or cancel button can go here */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            You can manage your vehicles anytime from your garage
          </p>
        </div>
      </div>
    </DarkModal>
  );
};

export default SelectVehicleModal;
