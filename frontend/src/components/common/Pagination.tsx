import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
}

const Pagination:React.FC<PaginationProps> = ({currentPage, totalPages, setCurrentPage}) => {
  return (
    <div className="px-6 py-5 flex items-center justify-center gap-4">
      <button
        className="w-8 h-8 rounded-full border-2 border-red-600 flex items-center justify-center hover:bg-red-600 transition-all text-red-600 hover:text-white hover:scale-110 shadow-lg shadow-red-900/30"
        onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
      >
        ‹
      </button>
      <span className="text-sm text-gray-400">
        Page <span className="text-red-400 font-semibold">{currentPage}</span>{" "}
        of <span className="text-gray-300">{totalPages}</span>
      </span>
      <button
        className="w-8 h-8 rounded-full border-2 border-red-600 flex items-center justify-center hover:bg-red-600 transition-all text-red-600 hover:text-white hover:scale-110 shadow-lg shadow-red-900/30"
        onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : currentPage)}
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
