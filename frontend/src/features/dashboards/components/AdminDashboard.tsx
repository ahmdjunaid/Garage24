import { errorToast } from "@/utils/notificationAudio";
import { useState, useEffect } from "react";
import {
  getAdminDashboardDataApi,
  getMostBookedGaragesApi,
  type cycleType,
} from "../services/dashboardServices";
import { dashboardPeriods } from "@/constants/constantDatas";
import type {
  BarChartProps,
  DashboardData,
  LineChartProps,
  MostBookedGarage,
} from "@/types/Dashboard";

const DEFAULT_DASHBOARD_DATA: DashboardData = {
  revenue: 0,
  revChange: "0%",
  revUp: true,
  subscriptions: 0,
  subChange: "0%",
  subUp: true,
  services: 0,
  servChange: "0%",
  servUp: true,
  totalSubs: 0,
  subGrowth: "0%",
  bookingChart: [0, 1],
  labels: ["", ""],
  subChart: [0, 1],
  subLabels: ["", ""],
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function isNegativeChange(change: string): boolean {
  return change.trim().startsWith("-");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BarChart({ values, labels }: BarChartProps) {
  const max = Math.max(...values);
  const maxH = 60;
  const topIdx = values.indexOf(max);
  return (
    <div className="flex items-end gap-1 h-20 w-full">
      {values.map((v, i) => {
        const h = max === 0 ? 0 : (v / max) * maxH;
        const isTop = i === topIdx && max > 0;
        const total = values.reduce((a, b) => a + b, 0);
        return (
          <div
            key={i}
            className="flex flex-col items-center flex-1 relative group"
          >
            {isTop && total > 0 && (
              <span className="absolute -top-5 text-[10px] bg-red-500 text-white rounded px-1 py-0.5 font-bold whitespace-nowrap">
                {Math.round((v / total) * 100)}%
              </span>
            )}
            <div
              className="w-full rounded-sm transition-all duration-500"
              style={{
                height: `${h}px`,
                background: isTop
                  ? "linear-gradient(to top, #ef4444, #f87171)"
                  : "rgba(239,68,68,0.45)",
              }}
            />
            {labels && labels.length <= 12 && (
              <span className="text-gray-500 text-[8px] mt-1 truncate w-full text-center">
                {labels[i]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LineChart({ values, labels }: LineChartProps) {
  // Always baseline from 0 for sparse data readability
  const max = Math.max(...values);
  const min = 0;
  const range = max - min || 1;

  const W = 540,
    H = 140;
  const pad = { top: 10, bottom: 30, left: 30, right: 10 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const pts: [number, number][] = values.map((v, i) => {
    const x = pad.left + (i / Math.max(values.length - 1, 1)) * innerW;
    const y = pad.top + innerH - ((v - min) / range) * innerH;
    return [x, y];
  });

  const pathD = pts
    .map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`))
    .join(" ");

  // Dynamically computed grid lines based on actual data range
  const gridLineCount = 4;
  const gridVals = Array.from({ length: gridLineCount + 1 }, (_, i) =>
    parseFloat((min + (i / gridLineCount) * range).toFixed(2)),
  );

  const showLabels =
    labels.length <= 14
      ? labels
      : labels.filter((_, i) => i % Math.ceil(labels.length / 10) === 0);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      {gridVals.map((g, idx) => {
        const y = pad.top + innerH - ((g - min) / range) * innerH;
        return (
          <g key={idx}>
            <line
              x1={pad.left}
              y1={y}
              x2={W - pad.right}
              y2={y}
              stroke="#2a2a2a"
              strokeWidth="1"
            />
            <text
              x={pad.left - 4}
              y={y + 4}
              fill="#555"
              fontSize="9"
              textAnchor="end"
            >
              {Number.isInteger(g) ? g : g.toFixed(1)}
            </text>
          </g>
        );
      })}

      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d={`${pathD} L${pts[pts.length - 1][0]},${pad.top + innerH} L${pts[0][0]},${pad.top + innerH} Z`}
        fill="url(#lineGrad)"
      />
      <path
        d={pathD}
        fill="none"
        stroke="#ef4444"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {pts.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="3"
          fill="#ef4444"
          className="opacity-0 hover:opacity-100 transition-opacity"
        />
      ))}

      {showLabels.map((label, i) => {
        const idx = labels.indexOf(label);
        const x = pad.left + (idx / Math.max(values.length - 1, 1)) * innerW;
        return (
          <text
            key={i}
            x={x}
            y={H - 4}
            fill="#555"
            fontSize="9"
            textAnchor="middle"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [period, setPeriod] = useState<cycleType>("year");
  const [d, setD] = useState<DashboardData>(DEFAULT_DASHBOARD_DATA);
  const [garages, setGarages] = useState<MostBookedGarage[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  useEffect(() => {
    fetchTopGarages();
  }, []);

  const fetchAnalytics = async (cycle: cycleType): Promise<void> => {
    setLoading(true);
    try {
      const response: DashboardData = await getAdminDashboardDataApi(cycle);
      setD(response);
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopGarages = async () => {
    try {
      const response = await getMostBookedGaragesApi();
      setGarages(response);
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    }
  };

  const totalServicesDone = garages.reduce((acc, g) => acc + g.count, 0);

  const statCards = [
    {
      label: `${period}'s Revenue`,
      value: d.revenue,
      change: d.revChange,
      up: d.revUp,
      prefix: "₹",
    },
    {
      label: `${period}'s Services revenue`,
      value: d.services,
      change: d.servChange,
      up: d.servUp,
      prefix: "₹",
    },
    {
      label: `${period}'s Subscriptions count`,
      value: d.subscriptions,
      change: d.subChange,
      up: d.subUp,
      prefix: "",
    },
  ];

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-950 via-gray-900 to-black overflow-auto">
      <div className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            {/* Period Toggle */}
            <div className="flex bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-2xl backdrop-blur-sm overflow-hidden isolate">
              {dashboardPeriods.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value as cycleType)}
                  className={`px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold transition-colors duration-200 ${
                    period === p.value
                      ? "bg-red-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                  }`}
                >
                  {p.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile loading indicator */}
          {loading && (
            <span className="text-xs text-gray-500 animate-pulse tracking-widest sm:hidden">
              LOADING...
            </span>
          )}
        </div>

        {/* ── Stat Cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {statCards.map((card, i) => (
            <div
              key={i}
              className="relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl backdrop-blur-sm p-4 sm:p-5 overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none" />
              <p className="text-gray-500 text-[10px] tracking-widest uppercase mb-2 truncate">
                {card.label}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {card.prefix}
                {card.value.toLocaleString()}
              </p>
              <div
                className={`flex items-center gap-1 mt-2 text-xs font-bold ${
                  card.up ? "text-emerald-400" : "text-red-400"
                }`}
              >
                <span>{card.up ? "↗" : "↘"}</span>
                <span>{card.change}</span>
                <span className="text-gray-600 font-normal ml-1 text-[10px]">
                  vs prev period
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts Row ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Booking Analytics — full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl backdrop-blur-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-white">
                Booking Analytics
              </h2>
              <span className="text-[10px] sm:text-xs text-red-400 border border-red-900 rounded px-2 py-0.5 capitalize">
                {period}
              </span>
            </div>
            <div className="w-full overflow-x-auto">
              <div className="min-w-[280px]">
                <LineChart values={d.bookingChart} labels={d.labels} />
              </div>
            </div>
          </div>

          {/* Subscriptions Bar — full width on mobile, 1/3 on desktop */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl backdrop-blur-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-white">
                Subscriptions
              </h2>
              <span className="text-[10px] sm:text-xs text-red-400 border border-red-900 rounded px-2 py-0.5 capitalize">
                {period}
              </span>
            </div>
            <BarChart values={d.subChart} labels={d.subLabels} />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
                <p className="text-red-400 text-xl font-bold">
                  {d.totalSubs.toLocaleString()}
                </p>
                <p className="text-gray-500 text-[10px] tracking-wider mt-0.5">
                  TOTAL
                </p>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
                <p
                  className={`text-xl font-bold ${
                    isNegativeChange(d.subGrowth)
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  {d.subGrowth}
                </p>
                <p className="text-gray-500 text-[10px] tracking-wider mt-0.5">
                  GROWTH
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Most Booked Garages ────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl backdrop-blur-sm p-4 sm:p-5">
          <h2 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-white mb-4">
            Most Booked Garages
          </h2>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[520px]">
              <thead>
                <tr className="border-b border-[#222]">
                  {[
                    "Garage Name",
                    "Supported Fuel Types",
                    "Location",
                    "Total Services",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] tracking-widest text-gray-500 pb-3 pr-4 whitespace-nowrap"
                    >
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {garages.map((g, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors"
                  >
                    <td className="py-3 sm:py-4 pr-4 text-xs text-gray-400 font-mono whitespace-nowrap">
                      {g.name}
                    </td>
                    <td className="py-3 sm:py-4 pr-4 text-sm font-bold text-white whitespace-nowrap">
                      {Array.isArray(g.supportedFuelTypes)
                        ? g.supportedFuelTypes.join(", ")
                        : "N/A"}
                    </td>
                    <td className="py-3 sm:py-4 pr-4 text-xs text-gray-400">
                      {g.location.city}
                    </td>
                    <td className="py-3 sm:py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 bg-[#2a2a2a] rounded-full w-16 sm:w-20 flex-shrink-0">
                          <div
                            className="h-1.5 bg-red-500 rounded-full transition-all duration-700"
                            style={{
                              width: `${(g.count / totalServicesDone) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold text-white">
                          {g.count}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4">
                      <span
                        className={`text-[10px] font-bold tracking-wider px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border ${
                          !g.isBlocked && !g.isDeleted
                            ? "text-emerald-400 bg-emerald-950 border-emerald-800"
                            : "text-red-400 bg-red-950 border-red-800"
                        }`}
                      >
                        {!g.isBlocked && !g.isDeleted ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {garages.map((g, i) => (
              <div
                key={i}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-white">{g.name}</p>
                    <p className="text-[10px] font-mono text-gray-500 mt-0.5">
                      {Array.isArray(g.supportedFuelTypes)
                        ? g.supportedFuelTypes.join(", ")
                        : "N/A"}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded-full border flex-shrink-0 ${
                      !g.isBlocked && !g.isDeleted
                        ? "text-emerald-400 bg-emerald-950 border-emerald-800"
                        : "text-red-400 bg-red-950 border-red-800"
                    }`}
                  >
                    {!g.isBlocked && !g.isDeleted ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>📍 {g.location.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 tracking-wider uppercase w-20 flex-shrink-0">
                    Services
                  </span>
                  <div className="h-1.5 bg-[#2a2a2a] rounded-full flex-1">
                    <div
                      className="h-1.5 bg-red-500 rounded-full transition-all duration-700"
                      style={{
                        width: `${(g.count / totalServicesDone) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white w-6 text-right">
                    {g.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
