"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
} from "lucide-react";

function startOfDay(date) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

function parseDateValue(value) {
  if (value instanceof Date) {
    return new Date(value);
  }

  if (!value) {
    return new Date();
  }

  /*
   * YYYY-MM-DD must be parsed as a local date.
   * This avoids timezone-related date shifting.
   */
  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    const [year, month, day] = value
      .split("-")
      .map(Number);

    return new Date(
      year,
      month - 1,
      day
    );
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }

  return parsed;
}

function formatInputDate(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date) {
  return date.toLocaleDateString(
    "en-US",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatLongDate(date) {
  return date.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function getDateState(date) {
  const today = startOfDay(
    new Date()
  );

  const selected = startOfDay(
    date
  );

  if (
    selected.getTime() ===
    today.getTime()
  ) {
    return "today";
  }

  if (
    selected.getTime() <
    today.getTime()
  ) {
    return "past";
  }

  return "future";
}

function getRelativeText(date) {
  const today = startOfDay(
    new Date()
  );

  const selected = startOfDay(
    date
  );

  const difference = Math.round(
    (selected.getTime() -
      today.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (difference === 0) {
    return "Today";
  }

  if (difference === -1) {
    return "Yesterday";
  }

  if (difference === 1) {
    return "Tomorrow";
  }

  if (difference < 0) {
    return `${Math.abs(
      difference
    )} days ago`;
  }

  return `In ${difference} days`;
}

export default function DailyDateNavigator({
  selectedDate,

  /*
   * Support both APIs so this component
   * works with the existing Daily page
   * and DailyEntriesSection.
   */
  onChange,
  onDateChange,
}) {
  const date = parseDateValue(
    selectedDate
  );

  const handleChange =
    onChange || onDateChange;

  const dateState =
    getDateState(date);

  const isToday =
    dateState === "today";

  const isFuture =
    dateState === "future";

  const isPast =
    dateState === "past";

  function updateDate(nextDate) {
    if (!handleChange) {
      return;
    }

    handleChange(
      startOfDay(nextDate)
    );
  }

  function changeDate(amount) {
    const nextDate =
      new Date(date);

    nextDate.setDate(
      nextDate.getDate() + amount
    );

    updateDate(nextDate);
  }

  function goToToday() {
    updateDate(new Date());
  }

  function handleDateChange(event) {
    const value =
      event.target.value;

    if (!value) {
      return;
    }

    const [year, month, day] =
      value.split("-").map(Number);

    const nextDate = new Date(
      year,
      month - 1,
      day
    );

    updateDate(nextDate);
  }

  return (
    <div className="flex flex-col gap-2">
      {/* =====================================================
          DATE CONTROL
      ===================================================== */}

      <div className="flex flex-wrap items-center gap-2">
        {/* PREVIOUS DAY */}

        <button
          type="button"
          onClick={() =>
            changeDate(-1)
          }
          aria-label="Previous day"
          title="Previous day"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-100"
        >
          <ChevronLeft size={17} />
        </button>

        {/* DATE PICKER */}

        <div className="relative">
          <div
            className={[
              "flex h-9 min-w-[150px] items-center gap-2 rounded-lg border px-3 transition",
              isToday
                ? "border-sky-200 bg-white"
                : isFuture
                ? "border-amber-200 bg-amber-50/50"
                : "border-slate-200 bg-white",
            ].join(" ")}
          >
            <CalendarDays
              size={15}
              className={[
                "shrink-0",
                isToday
                  ? "text-sky-500"
                  : isFuture
                  ? "text-amber-500"
                  : "text-slate-400",
              ].join(" ")}
            />

            <span className="text-sm font-medium text-slate-800">
              {formatDisplayDate(date)}
            </span>

            {/* Native date picker */}

            <input
              type="date"
              value={formatInputDate(
                date
              )}
              onChange={
                handleDateChange
              }
              aria-label="Select date"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
        </div>

        {/* NEXT DAY */}

        <button
          type="button"
          onClick={() =>
            changeDate(1)
          }
          aria-label="Next day"
          title="Next day"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-100"
        >
          <ChevronRight
            size={17}
          />
        </button>

        {/* TODAY BUTTON */}

        {!isToday && (
          <button
            type="button"
            onClick={goToToday}
            className="h-9 rounded-lg border border-sky-200 bg-sky-50 px-3 text-xs font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-100"
          >
            Today
          </button>
        )}
      </div>

      {/* =====================================================
          DATE INFORMATION
      ===================================================== */}

      <div className="flex flex-wrap items-center gap-2">
        {/* TODAY */}

        {isToday && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Today
          </span>
        )}

        {/* PAST */}

        {isPast && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
            <Clock3 size={11} />

            {getRelativeText(date)}
          </span>
        )}

        {/* FUTURE */}

        {isFuture && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
            <Clock3 size={11} />

            {getRelativeText(date)}
          </span>
        )}

        <span className="text-[11px] text-slate-400">
          {formatLongDate(date)}
        </span>
      </div>
    </div>
  );
}