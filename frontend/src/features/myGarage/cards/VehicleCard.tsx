import type { IVehicleDTO } from "@/types/VehicleTypes";
import { X, History, CalendarPlus, ChevronRight } from "lucide-react";

interface VehicleCardProps {
  vehicle: IVehicleDTO;
  onView: (vehicle: IVehicleDTO) => void;
  onBook: (id: string) => void;
  onHistory: (id: string) => void;
  onRemove?: (id: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onView,
  onBook,
  onHistory,
  onRemove,
}) => {
  return (
    <div
      className="relative w-full max-w-sm rounded-2xl overflow-hidden group cursor-pointer"
      style={{
        background: "linear-gradient(145deg, #2c2c2c 0%, #1e1e1e 100%)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(220,38,38,0.3), inset 0 1px 0 rgba(255,255,255,0.07)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)";
      }}
    >
      {/* Red top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "linear-gradient(90deg, transparent, #dc2626, transparent)" }}
      />

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(vehicle._id); }}
          className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full flex items-center justify-center text-[#555] hover:text-red-400 transition-all duration-200"
          style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <X size={12} />
        </button>
      )}

      {/* Image Section */}
      <div
        className="relative h-44 flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(180deg, #1a1a1a 0%, #141414 100%)" }}
      >
        {/* Glow behind image */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-16 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
          style={{
            background: "radial-gradient(ellipse, rgba(220,38,38,0.6) 0%, transparent 70%)",
            filter: "blur(12px)",
          }}
        />
        <img
          src={vehicle.imageUrl}
          alt={`${vehicle.makeName} ${vehicle.model}`}
          className="h-32 w-auto object-contain relative z-10 drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="px-5 pt-4 pb-5">

        {/* Name row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="text-white font-bold text-base leading-tight tracking-wide">
              {vehicle.makeName} {vehicle.model}
            </h3>
            {vehicle.variant && (
              <span className="text-xs text-gray-500 font-medium tracking-wider uppercase mt-0.5 block">
                {vehicle.variant}
              </span>
            )}
          </div>
          {/* Plate badge */}
          <span
            className="shrink-0 flex items-center gap-1.5 text-[10px] font-mono font-semibold text-gray-300 px-2.5 py-1 rounded-md mt-0.5"
            style={{
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
              letterSpacing: "0.08em",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            {vehicle.licensePlate}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* Action Buttons */}
        <div className="flex gap-2 mb-2.5">
          <button
            onClick={() => onView(vehicle)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            View Details
            <ChevronRight size={13} />
          </button>

          <button
            onClick={() => onBook(vehicle._id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
              boxShadow: "0 4px 15px rgba(220,38,38,0.35)",
              border: "1px solid rgba(255,100,100,0.2)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(220,38,38,0.55)";
              (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 15px rgba(220,38,38,0.35)";
              (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)";
            }}
          >
            <CalendarPlus size={13} />
            Book
          </button>
        </div>

        {/* History Button — full width */}
        <button
          onClick={() => onHistory(vehicle.licensePlate)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-all duration-200"
          style={{
            background: "rgba(220,38,38,0.07)",
            border: "1px solid rgba(220,38,38,0.18)",
            color: "#f87171",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.14)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(220,38,38,0.35)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.07)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(220,38,38,0.18)";
          }}
        >
          <History size={13} />
          Service History
        </button>
      </div>
    </div>
  );
};