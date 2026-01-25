import React from "react";
import { Search, Bell } from "lucide-react";

interface AdminHeaderProps {
  text: string;
  searchPlaceholder?: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  text,
  searchPlaceholder,
  setSearchQuery,
}) => {
  return (
    <div className="relative bg-gradient-to-br from-red-950 via-red-900 to-red-800 px-8 py-8 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
          {text}
        </h1>
        <div className="flex items-center gap-4">
          {searchPlaceholder ? (
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="bg-black bg-opacity-30 backdrop-blur-md border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 w-72 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all placeholder-gray-500"
                onChange={(e) => setSearchQuery?.(e.target.value)}
              />
            </div>
          ) : (
            ""
          )}
          <button className="relative p-2 hover:bg-red-800 hover:bg-opacity-50 rounded-lg transition-all group">
            <Bell className="w-5 h-5 group-hover:animate-bounce" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
