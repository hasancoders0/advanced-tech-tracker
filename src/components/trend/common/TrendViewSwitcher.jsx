"use client";

import {
  BarChart3,
  ChartColumn,
  ChartLine,
  ChartPie,
  List,
  ScatterChart,
  TrendingUp,
} from "lucide-react";

const VIEW_OPTIONS = [
  {
    value: "list",
    label: "List",
    icon: List,
  },
  {
    value: "bar",
    label: "Bar",
    icon: BarChart3,
  },
  {
    value: "column",
    label: "Column",
    icon: ChartColumn,
  },
  {
    value: "area",
    label: "Area",
    icon: TrendingUp,
  },
  {
    value: "scatter",
    label: "Scatter",
    icon: ScatterChart,
  },
  {
    value: "line",
    label: "Line",
    icon: ChartLine,
  },
  {
    value: "pie",
    label: "Pie",
    icon: ChartPie,
  },
];

export default function TrendViewSwitcher({
  value = "list",
  onChange,
}) {
  const selected =
    VIEW_OPTIONS.find((item) => item.value === value) ||
    VIEW_OPTIONS[0];

  const SelectedIcon = selected.icon;

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs font-medium text-slate-400 sm:inline">
        View
      </span>

      <div className="relative">
        <SelectedIcon
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <select
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className={[
            "h-9 min-w-[150px] appearance-none rounded-lg",
            "border border-slate-200 bg-white pl-9 pr-9",
            "text-xs font-medium text-slate-700",
            "outline-none transition",
            "focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
          ].join(" ")}
          aria-label="Trend view"
        >
          {VIEW_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
