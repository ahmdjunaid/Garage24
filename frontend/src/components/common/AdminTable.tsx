import React from "react";
// import { Filter, ChevronDown } from "lucide-react";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  renderActions?: (item: T) => React.ReactNode;
  // sortBy?: string;
  // onSortChange?: (sortBy: string) => void;
  emptyMessage?: string;

}

const AdminTable = <T,>({
  data = [],
  columns = [],
  renderActions,
  // sortBy = "A-Z",
  // onSortChange,
  emptyMessage = "No Data Found"
}: AdminTableProps<T>) => {
  const getValueByPath = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  return (
    <div>
      {data.length === 0 ? (
        <h1 className="text-center text-gray-400 py-6">{ emptyMessage }</h1>
      ) : (
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl backdrop-blur-sm">
          {/* Table Controls */}
          {/* <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-950">
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-all duration-200 hover:scale-105">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-all duration-200 hover:scale-105"
              onClick={() => onSortChange?.(sortBy === "A-Z" ? "Z-A" : "A-Z")}
            >
              Sort By: {sortBy}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div> */}

          {/* Table Header */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4 px-6 py-4 border-b border-gray-800 text-xs text-gray-500 font-semibold uppercase bg-gradient-to-r from-gray-900 to-gray-950">
            {columns.map((col, i) => (
              <div key={i}>{col.label}</div>
            ))}
            {renderActions && <div>Actions</div>}
          </div>

          {/* Table Body */}
          <div>
            {data.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4 px-6 py-4 border-b border-gray-800 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 transition-all duration-200 items-center group"
              >
                {columns.map((col, j) => (
                  <div
                    key={j}
                    className="text-gray-300 truncate max-w-[180px]"
                    title={
                      typeof col.key === "string"
                        ? String(getValueByPath(item, col.key) ?? "")
                        : String((item as any)[col.key] ?? "")
                    }
                  >
                    {col.render
                      ? col.render(item)
                      : typeof col.key === "string"
                        ? getValueByPath(item, col.key)
                        : (item as any)[col.key]}
                  </div>
                ))}
                {renderActions && <div>{renderActions(item)}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable;
