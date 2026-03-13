import React from "react";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  renderActions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

const AdminTable = <T,>({
  data = [],
  columns = [],
  renderActions,
  emptyMessage = "No Data Found",
}: AdminTableProps<T>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getValueByPath = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  const getCellValue = (item: T, col: TableColumn<T>) => {
    if (col.render) return col.render(item);
    return typeof col.key === "string"
      ? getValueByPath(item, col.key)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : (item as any)[col.key];
  };

  const getRawValue = (item: T, col: TableColumn<T>): string => {
    return typeof col.key === "string"
      ? String(getValueByPath(item, col.key) ?? "")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : String((item as any)[col.key] ?? "");
  };

  const totalCols = columns.length + (renderActions ? 1 : 0);
  const gridCols = `repeat(${totalCols}, minmax(120px, 1fr))`;

  if (data.length === 0) {
    return (
      <h1 className="text-center text-gray-400 py-6">{emptyMessage}</h1>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl backdrop-blur-sm">

      {/* ── Desktop table (md+) ── */}
      <div className="hidden md:block">
        {/* Header */}
        <div
          className="grid gap-4 px-6 py-4 border-b border-gray-800 text-xs text-gray-500 font-semibold uppercase bg-gradient-to-r from-gray-900 to-gray-950"
          style={{ gridTemplateColumns: gridCols }}
        >
          {columns.map((col, i) => (
            <div key={i}>{col.label}</div>
          ))}
          {renderActions && <div>Actions</div>}
        </div>

        {/* Rows */}
        {data.map((item, i) => (
          <div
            key={i}
            className="grid gap-4 px-6 py-4 border-b border-gray-800 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 transition-all duration-200 items-center group"
            style={{ gridTemplateColumns: gridCols }}
          >
            {columns.map((col, j) => (
              <div
                key={j}
                className="text-gray-300 truncate max-w-[180px]"
                title={getRawValue(item, col)}
              >
                {getCellValue(item, col)}
              </div>
            ))}
            {renderActions && <div>{renderActions(item)}</div>}
          </div>
        ))}
      </div>

      {/* ── Mobile cards (< md) ── */}
      <div className="md:hidden divide-y divide-gray-800">
        {data.map((item, i) => (
          <div
            key={i}
            className="px-4 py-4 hover:bg-gray-800/50 transition-colors duration-200"
          >
            <dl className="space-y-2">
              {columns.map((col, j) => (
                <div key={j} className="flex items-start justify-between gap-3">
                  <dt className="text-xs text-gray-500 font-semibold uppercase shrink-0 pt-0.5 w-28">
                    {col.label}
                  </dt>
                  <dd
                    className="text-gray-300 text-sm text-right break-words min-w-0"
                    title={getRawValue(item, col)}
                  >
                    {getCellValue(item, col)}
                  </dd>
                </div>
              ))}
            </dl>

            {renderActions && (
              <div className="mt-3 pt-3 border-t border-gray-800 flex justify-end">
                {renderActions(item)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTable;