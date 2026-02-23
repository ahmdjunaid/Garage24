import { errorToast } from "@/utils/notificationAudio";
import { useState, useEffect } from "react";
import { getAdminDashboardData, type cycleType } from "../services/dashboardServices";
import { dashboardPeriods } from "@/constants/constantDatas";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Garage {
  id: string;
  name: string;
  location: string;
  services: number;
  active: boolean;
}

interface DashboardData {
  revenue: number;
  revChange: string;
  revUp: boolean;
  subscriptions: number;
  subChange: string;
  subUp: boolean;
  totalSubs: number;
  subGrowth: string;
  bookingChart: number[];
  labels: string[];
  subChart: number[];
  subLabels: string[];
}

interface BarChartProps {
  values: number[];
  labels?: string[];
  highlight?: number;
}

interface LineChartProps {
  values: number[];
  labels: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_DASHBOARD_DATA: DashboardData = {
  revenue: 0,
  revChange: "0%",
  revUp: true,
  subscriptions: 0,
  subChange: "0%",
  subUp: true,
  totalSubs: 0,
  subGrowth: "0%",
  bookingChart: [0, 1],
  labels: ["", ""],
  subChart: [0, 1],
  subLabels: ["", ""],
};

const garages: Garage[] = [
  {
    id: "G24-SC01",
    name: "KR GARAGE",
    location: "Koduvally",
    services: 38,
    active: true,
  },
  {
    id: "G24-SC02",
    name: "BADAR TYRES",
    location: "Omassery",
    services: 15,
    active: true,
  },
  {
    id: "G24-SC03",
    name: "Jhonson's Garage",
    location: "Calicut",
    services: 9,
    active: false,
  },
  {
    id: "G24-SC04",
    name: "Speed Motors",
    location: "Palakkad",
    services: 5,
    active: true,
  },
];

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
              <span className="absolute -top-5 text-xs bg-red-500 text-white rounded px-1 py-0.5 font-bold">
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
              <span className="text-gray-500 text-[9px] mt-1 truncate">
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
  const max = Math.max(...values);
  const min = Math.min(...values);
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

  const gridVals = [10, 20, 30, 40, 50, 60, 70, 80];
  const showLabels =
    labels.length <= 14
      ? labels
      : labels.filter((_, i) => i % Math.ceil(labels.length / 10) === 0);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      {gridVals.map((g) => {
        const y =
          pad.top + innerH - ((g - (min < 10 ? 0 : min)) / range) * innerH;
        if (y < pad.top || y > pad.top + innerH) return null;
        return (
          <g key={g}>
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
              {g}
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
          r="2.5"
          fill="#ef4444"
          className="opacity-0 hover:opacity-100 transition-opacity"
        />
      ))}
      {showLabels.map((label, i) => {
        const idx = labels.indexOf(label);
        const x =
          pad.left + (idx / Math.max(values.length - 1, 1)) * innerW;
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
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]); // re-fetch whenever period changes

  const fetchAnalytics = async (cycle: cycleType): Promise<void> => {
    setLoading(true);
    try {
      const response: DashboardData = await getAdminDashboardData(cycle);
      setD(response);
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: `${period}'s Revenue`,
      value: d.revenue,
      change: d.revChange,
      up: d.revUp,
    },
    {
      label: `Current ${period}'s Subscription`,
      value: d.subscriptions,
      change: d.subChange,
      up: d.subUp,
    },
    {
      label: `Current ${period}'s Subscription`,
      value: d.totalSubs,
      change: d.subGrowth,
      up: !isNegativeChange(d.subGrowth), // derived from actual value
    },
  ];

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {/* Period Toggle */}
        <div className="flex bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden">
          {dashboardPeriods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value as cycleType)}
              className={`px-4 py-2 text-xs font-bold tracking-wider transition-all duration-200 ${
                period === p.value
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
              }`}
            >
              {p.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Loading indicator */}
        {loading && (
          <span className="text-xs text-gray-500 animate-pulse tracking-widest">
            LOADING...
          </span>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="relative bg-[#111] border border-[#222] rounded-xl p-5 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent pointer-events-none" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs tracking-widest uppercase mb-2">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-white">{card.value}</p>
                <div
                  className={`flex items-center gap-1 mt-2 text-xs font-bold ${
                    card.up ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  <span>{card.up ? "↗" : "↘"}</span>
                  <span>{card.change}</span>
                  <span className="text-gray-600 font-normal ml-1">
                    vs prev period
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Booking Analytics - 2/3 width */}
        <div className="col-span-2 bg-[#111] border border-[#222] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold tracking-widest uppercase text-white">
              Booking Analytics
            </h2>
            <span className="text-xs text-red-400 border border-red-900 rounded px-2 py-0.5">
              {period}
            </span>
          </div>
          <LineChart values={d.bookingChart} labels={d.labels} />
        </div>

        {/* Subscriptions Bar - 1/3 width */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold tracking-widest uppercase text-white">
              Subscriptions
            </h2>
          </div>
          <BarChart values={d.subChart} labels={d.subLabels} />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
              <p className="text-red-400 text-xl font-bold">{d.totalSubs}</p>
              <p className="text-gray-500 text-[10px] tracking-wider">TOTAL</p>
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
              <p className="text-gray-500 text-[10px] tracking-wider">GROWTH</p>
            </div>
          </div>
        </div>
      </div>

      {/* Most Booked Garages Table */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <h2 className="text-sm font-bold tracking-widest uppercase text-white mb-4">
          Most Booked Garages
        </h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#222]">
              {[
                "Garage ID",
                "Garage Name",
                "Location",
                "Total Services",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left text-[10px] tracking-widest text-gray-500 pb-3 pr-4"
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
                <td className="py-4 pr-4 text-xs text-gray-400 font-mono">
                  {g.id}
                </td>
                <td className="py-4 pr-4 text-sm font-bold text-white">
                  {g.name}
                </td>
                <td className="py-4 pr-4 text-xs text-gray-400">
                  {g.location}
                </td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 bg-[#2a2a2a] rounded-full flex-1 max-w-20">
                      <div
                        className="h-1.5 bg-red-500 rounded-full transition-all duration-700"
                        style={{ width: `${(g.services / 38) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white">
                      {g.services}
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <span
                    className={`text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full border ${
                      g.active
                        ? "text-emerald-400 bg-emerald-950 border-emerald-800"
                        : "text-red-400 bg-red-950 border-red-800"
                    }`}
                  >
                    {g.active ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}