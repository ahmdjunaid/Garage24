import React, { useState } from "react";
import { Filter, ChevronDown } from "lucide-react";
import type { IMechanic } from "../../types/MechanicTypes";
import profilePlaceholder from "../../assets/icons/profile-placeholder.jpg";

interface AdminTableProps {
  mechanics: IMechanic[];
  onBlock: (id: string, action: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}

const AdminTable: React.FC<AdminTableProps> = ({ mechanics, onBlock, onDelete }) => {
  const [sortBy, setSortBy] = useState("A-Z");

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl backdrop-blur-sm">
      {/* Table Controls */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-950">
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-all duration-200 hover:scale-105">
          <Filter className="w-4 h-4" />
          Filter By
        </button>
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-all duration-200 hover:scale-105">
          Sort By: {sortBy}
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-800 text-xs text-gray-500 font-semibold uppercase bg-gradient-to-r from-gray-900 to-gray-950">
        <div>Employee ID</div>
        <div>Image</div>
        <div>Name</div>
        <div>Skills</div>
        <div>Status</div>
        <div>Action</div>
      </div>

      {/* Table Body */}
      <div>
        {mechanics.map((mechanic, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-800 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 transition-all duration-200 items-center group cursor-pointer"
          >
            <div className="text-gray-400 group-hover:text-gray-200 transition-colors">
              {mechanic.mechanicId}
            </div>
            <div>
              <img
                src={mechanic.imageUrl ? mechanic.imageUrl : profilePlaceholder}
                alt={mechanic.name}
                className="w-10 h-10 rounded-full bg-gray-700 ring-2 ring-gray-700 group-hover:ring-red-600 transition-all"
              />
            </div>
            <div className="text-white font-medium group-hover:text-red-400 transition-colors">
              {mechanic.name}
            </div>
            <div
              className="text-gray-400 group-hover:text-gray-200 transition-colors truncate max-w-[150px]"
              title={mechanic.skills.join(", ")}
            >
              {mechanic.skills.slice(0, 2).join(", ")}
              {mechanic.skills.length > 2 && "…"}
            </div>
            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  mechanic.isBlocked || mechanic.isOnboardingRequired
                    ? "bg-gradient-to-r from-red-900 to-red-800 text-red-300 shadow-lg shadow-red-900/50"
                    : "bg-gradient-to-r from-green-900 to-green-800 text-green-300 shadow-lg shadow-green-900/50"
                }`}
              >
                {mechanic.isBlocked || mechanic.isOnboardingRequired ? "Inactive" : "Active"}
              </span>
            </div>
            <div>
              <button className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-all hover:scale-110 me-3"
              onClick={()=>onBlock(mechanic.userId, mechanic.isBlocked ? "Unblock" : "Block")}
              >
                {mechanic.isBlocked ? "Unblock" : "Block"}
              </button>
              <button className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-all hover:scale-110"
              onClick={()=>onDelete(mechanic.userId)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTable;
