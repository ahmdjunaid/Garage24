import type { IBaseMechanic } from "@/types/MechanicTypes";
import { StatusBadge } from "../layouts/admin/StausBadge";
import DarkModal from "../layouts/DarkModal";
import profileIcon from "@assets/icons/profileIcon.png";

interface MechanicDetailsModalProps {
  mechanics: IBaseMechanic[] | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MechanicDetailsModal: React.FC<MechanicDetailsModalProps> = ({
  mechanics,
  isOpen,
  onClose,
}) => {
  if (mechanics && mechanics.length === 0) {
    return (
      <DarkModal isOpen={isOpen} onClose={onClose}>
        <div className="text-center text-white/60 py-6">
          No mechanics found for this garage
        </div>
      </DarkModal>
    );
  }

  return (
    <DarkModal isOpen={isOpen} onClose={onClose}>
      <div className="overflow-x-auto border border-white/10 rounded-xl">
        <table className="min-w-full text-sm text-white">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Mechanic</th>
              <th className="px-4 py-3 text-left font-medium">Mobile</th>
              <th className="px-4 py-3 text-left font-medium">Skills</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {mechanics &&
              mechanics.map((mechanic) => (
                <tr key={mechanic.userId} className="hover:bg-white/5">
                  {/* Mechanic Info */}
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={mechanic.imageUrl || profileIcon}
                      alt={mechanic.name}
                      className="w-9 h-9 rounded-full object-cover border border-white/20"
                    />
                    <span className="font-medium">{mechanic.name}</span>
                  </td>

                  {/* Mobile */}
                  <td className="px-4 py-3 text-white/80">
                    {mechanic.mobileNumber}
                  </td>

                  {/* Skills */}
                  <td className="px-4 py-3 text-white/80">
                    {mechanic.skills.length > 0
                      ? mechanic.skills.join(", ")
                      : "—"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge
                      isBlocked={mechanic.isBlocked}
                      isDeleted={mechanic.isDeleted}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </DarkModal>
  );
};
