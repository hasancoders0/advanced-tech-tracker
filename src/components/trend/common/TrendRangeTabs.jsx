"use client";

import {
  CalendarDays,
  ChartNoAxesCombined,
  GitCompare,
  History,
  Timer,
  TrendingUp,
} from "lucide-react";

const DEFAULT_RANGES = [
  {
    key: "week",
    label: "Week",
    icon: CalendarDays,
  },
  {
    key: "mtd",
    label: "MTD",
    icon: TrendingUp,
  },
  {
    key: "cm-vs-lm",
    label: "CM vs LM",
    icon: GitCompare,
  },
  {
    key: "call-outs",
    label: "Call Outs",
    icon: History,
    workforceOnly: true,
  },
  {
    key: "emergency-hours",
    label: "Emergency Hours",
    icon: Timer,
    workforceOnly: true,
  },
  {
    key: "three-month",
    label: "3 Month",
    icon: ChartNoAxesCombined,
  },
  {
    key: "six-month",
    label: "6 Month",
    icon: ChartNoAxesCombined,
  },
  {
    key: "ytd",
    label: "YTD",
    icon: TrendingUp,
  },
  {
    key: "custom",
    label: "Custom",
    icon: CalendarDays,
  },
];

export default function TrendRangeTabs({
  value = "week",
  onChange,
  module = "workforce",
}) {
  const ranges = DEFAULT_RANGES.filter(
    (item) => !item.workforceOnly || module === "workforce",
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      <div className="flex min-w-max items-center gap-1">
        {ranges.map((item) => {
          const Icon = item.icon;
          const active = value === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange?.(item.key)}
              className={[
                "flex h-9 items-center gap-2 rounded-lg px-4",
                "text-xs font-medium transition",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
                active
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
              ].join(" ")}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
