import React,{ useState } from "react";
import { Filter, ChevronDown } from "lucide-react"

interface IMechanic {
      id: string,
      name: string,
      image: string,
      skills: string[],
      rsaAvailability: boolean,
      status: string
}

interface AdminTableProps {
    mechanics: IMechanic[];
}

const AdminTable: React.FC<AdminTableProps> = ({mechanics}) => {
    const [sortBy, setSortBy] = useState('A-Z');

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
      <div className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-gray-800 text-xs text-gray-500 font-semibold uppercase bg-gradient-to-r from-gray-900 to-gray-950">
        <div>Employee ID</div>
        <div>Image</div>
        <div>Name</div>
        <div>Skills</div>
        <div>RSA Availability</div>
        <div>Status</div>
        <div>Action</div>
      </div>

      {/* Table Body */}
      <div>
        {mechanics.map((mechanic, index) => (
          <div
            key={index}
            className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-gray-800 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 transition-all duration-200 items-center group cursor-pointer"
          >
            <div className="text-gray-400 group-hover:text-gray-200 transition-colors">
              {mechanic.id}
            </div>
            <div>
              <img
                src={mechanic.image}
                alt={mechanic.name}
                className="w-10 h-10 rounded-full bg-gray-700 ring-2 ring-gray-700 group-hover:ring-red-600 transition-all"
              />
            </div>
            <div className="text-white font-medium group-hover:text-red-400 transition-colors">
              {mechanic.name}
            </div>
            <div className="text-gray-400 group-hover:text-gray-200 transition-colors">
              {mechanic.skills}
            </div>
            <div className="text-gray-400 group-hover:text-gray-200 transition-colors">
              {mechanic.rsaAvailability}
            </div>
            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  mechanic.status === "Active"
                    ? "bg-gradient-to-r from-green-900 to-green-800 text-green-300 shadow-lg shadow-green-900/50"
                    : "bg-gradient-to-r from-red-900 to-red-800 text-red-300 shadow-lg shadow-red-900/50"
                }`}
              >
                {mechanic.status}
              </span>
            </div>
            <div>
              <button className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-all hover:scale-110">
                Edit/Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="px-6 py-5 flex items-center justify-center gap-4 bg-gradient-to-r from-gray-900 to-gray-950">
        <button className="w-8 h-8 rounded-full border-2 border-red-600 flex items-center justify-center hover:bg-red-600 transition-all text-red-600 hover:text-white hover:scale-110 shadow-lg shadow-red-900/30">
          ‹
        </button>
        <span className="text-sm text-gray-400">
          Page <span className="text-red-400 font-semibold">1</span> of{" "}
          <span className="text-gray-300">1</span>
        </span>
        <button className="w-8 h-8 rounded-full border-2 border-red-600 flex items-center justify-center hover:bg-red-600 transition-all text-red-600 hover:text-white hover:scale-110 shadow-lg shadow-red-900/30">
          ›
        </button>
      </div>
    </div>
  );
};

export default AdminTable;
