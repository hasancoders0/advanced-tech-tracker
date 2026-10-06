"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function TrendPeriodNavigator({
  label = "Selected Period",
  periodLabel,
  onPrevious,
  onNext,
  onToday,
  disableNext = false,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-slate-800">
            {periodLabel}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevious}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            aria-label="Previous period"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={onToday}
            className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <CalendarDays size={14} />
            Latest Data
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={disableNext}
            className={[
              "flex h-9 w-9 items-center justify-center rounded-lg border",
              "border-slate-200 bg-white text-slate-500 transition",
              disableNext
                ? "cursor-not-allowed opacity-40"
                : "hover:bg-slate-50 hover:text-slate-800",
            ].join(" ")}
            aria-label="Next period"
          >
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
