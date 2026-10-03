"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  UserRound,
  LockKeyhole,
} from "lucide-react";

import { workforceData } from "@/data/workforce/workforce-daily";

const STATUS_OPTIONS = [
  {
    value: "No data received",
    label: "No data received",
  },
  {
    value: "Worked",
    label: "Worked",
  },
  {
    value: "Called Out",
    label: "Called Out",
  },
];

/* =========================================================
   TIME HELPERS

   IMPORTANT:
   The application uses HH.MM-style time values.

   40.00 = 40 hours 00 minutes
   40.30 = 40 hours 30 minutes
   40.59 = 40 hours 59 minutes

   40.60 is NOT valid.
   ========================================================= */

function timeCodeToMinutes(value) {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return 0;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  const textValue = String(value);

  const parts = textValue.split(".");

  const hours = Number(parts[0]) || 0;

  const minuteText = parts[1] || "";

  const minutes = Number(
    minuteText.padEnd(2, "0").slice(0, 2)
  );

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes)
  ) {
    return 0;
  }

  return hours * 60 + minutes;
}

function minutesToTimeCode(totalMinutes) {
  const safeMinutes = Math.max(
    0,
    Math.round(Number(totalMinutes) || 0)
  );

  const hours = Math.floor(
    safeMinutes / 60
  );

  const minutes = safeMinutes % 60;

  return Number(
    `${hours}.${String(minutes).padStart(2, "0")}`
  );
}

/*
 * Converts old decimal-hour data into the
 * new HH.MM-style time code.
 *
 * Example:
 *
 * 40.75 decimal hours
 * = 40 hours 45 minutes
 * = 41.15 in the new format.
 */
function decimalHoursToTimeCode(value) {
  const numericValue = Number(value);

  if (
    !Number.isFinite(numericValue) ||
    numericValue <= 0
  ) {
    return 0;
  }

  const totalMinutes = Math.round(
    numericValue * 60
  );

  return minutesToTimeCode(totalMinutes);
}

function isValidTimeCode(value) {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return true;
  }

  const textValue = String(value);

  /*
   * Only allow:
   *
   * 40
   * 40.
   * 40.5
   * 40.59
   */
  if (!/^\d{0,3}(\.\d{0,2})?$/.test(textValue)) {
    return false;
  }

  const parts = textValue.split(".");

  const hours = Number(parts[0] || 0);

  const minutes = Number(
    parts[1] || 0
  );

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes)
  ) {
    return false;
  }

  /*
   * This is the critical rule.
   *
   * 00-59 = valid
   * 60-99 = invalid
   */
  if (minutes > 59) {
    return false;
  }

  return true;
}

function normalizeTimeCode(value) {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return 0;
  }

  if (!isValidTimeCode(value)) {
    return 0;
  }

  const parts = String(value).split(".");

  const hours = Number(parts[0] || 0);

  const minutes = Number(
    parts[1] || 0
  );

  return minutesToTimeCode(
    hours * 60 + minutes
  );
}

function formatTimeCode(value) {
  const totalMinutes =
    timeCodeToMinutes(value);

  const hours = Math.floor(
    totalMinutes / 60
  );

  const minutes =
    totalMinutes % 60;

  return `${hours}.${String(
    minutes
  ).padStart(2, "0")}`;
}

function formatMinutesAsTimeCode(
  totalMinutes
) {
  const safeMinutes = Math.max(
    0,
    Math.round(Number(totalMinutes) || 0)
  );

  const hours = Math.floor(
    safeMinutes / 60
  );

  const minutes = safeMinutes % 60;

  return `${hours}.${String(
    minutes
  ).padStart(2, "0")}`;
}

/* =========================================================
   HOUR INPUT
   ========================================================= */

function HourInput({
  value,
  onChange,
  disabled = false,
  maxMinutes,
}) {
  const [inputValue, setInputValue] =
    useState(formatTimeCode(value));

  const isEditing =
    useRef(false);

  /*
   * Synchronize external value only when
   * the user is not currently typing.
   */
  useEffect(() => {
    if (!isEditing.current) {
      setInputValue(
        formatTimeCode(value)
      );
    }
  }, [value]);

  function commitValue(nextValue) {
    if (
      nextValue === "" ||
      nextValue === null ||
      nextValue === undefined
    ) {
      setInputValue("0.00");
      onChange(0);
      return;
    }

    if (!isValidTimeCode(nextValue)) {
      return;
    }

    const normalized =
      normalizeTimeCode(nextValue);

    const minutes =
      timeCodeToMinutes(normalized);

    if (
      maxMinutes !== undefined &&
      minutes > maxMinutes
    ) {
      return;
    }

    setInputValue(
      formatTimeCode(normalized)
    );

    onChange(normalized);
  }

  function handleChange(event) {
    const nextValue =
      event.target.value;

    /*
     * Allow temporary states while typing:
     *
     * 4
     * 40
     * 40.
     * 40.5
     * 40.59
     */
    if (
      !/^\d{0,3}(\.\d{0,2})?$/.test(
        nextValue
      )
    ) {
      return;
    }

    /*
     * Do not allow minutes above 59.
     */
    if (
      nextValue.includes(".")
    ) {
      const minutesText =
        nextValue.split(".")[1] || "";

      if (
        minutesText.length === 2 &&
        Number(minutesText) > 59
      ) {
        return;
      }
    }

    setInputValue(nextValue);

    /*
     * Don't commit incomplete values.
     */
    if (
      nextValue === "" ||
      nextValue.endsWith(".")
    ) {
      return;
    }

    if (
      !isValidTimeCode(nextValue)
    ) {
      return;
    }

    const normalized =
      normalizeTimeCode(nextValue);

    const minutes =
      timeCodeToMinutes(normalized);

    if (
      maxMinutes !== undefined &&
      minutes > maxMinutes
    ) {
      return;
    }

    onChange(normalized);
  }

  /*
   * Custom arrow behavior.

   * This is important.

   * Native number input:
   *
   * 40.59 + ArrowUp
   * would normally become 40.60.
   *
   * We don't want that.
   *
   * Instead:
   *
   * 40.59 + ArrowUp = 41.00
   * 40.00 + ArrowDown = 39.59
   */
  function handleKeyDown(event) {
    if (
      disabled ||
      (event.key !== "ArrowUp" &&
        event.key !== "ArrowDown")
    ) {
      return;
    }

    event.preventDefault();

    const currentMinutes =
      timeCodeToMinutes(inputValue);

    let nextMinutes =
      event.key === "ArrowUp"
        ? currentMinutes + 1
        : currentMinutes - 1;

    nextMinutes = Math.max(
      0,
      nextMinutes
    );

    if (
      maxMinutes !== undefined &&
      nextMinutes > maxMinutes
    ) {
      nextMinutes = maxMinutes;
    }

    const nextValue =
      minutesToTimeCode(
        nextMinutes
      );

    setInputValue(
      formatTimeCode(nextValue)
    );

    onChange(nextValue);
  }

  function handleFocus() {
    isEditing.current = true;

    /*
     * Keep the current value,
     * but allow the user to edit it naturally.
     */
    setInputValue(
      formatTimeCode(value)
    );
  }

  function handleBlur() {
    isEditing.current = false;

    if (
      inputValue === "" ||
      inputValue === "."
    ) {
      setInputValue("0.00");
      onChange(0);
      return;
    }

    if (
      !isValidTimeCode(inputValue)
    ) {
      setInputValue(
        formatTimeCode(value)
      );
      return;
    }

    const normalized =
      normalizeTimeCode(inputValue);

    const minutes =
      timeCodeToMinutes(normalized);

    if (
      maxMinutes !== undefined &&
      minutes > maxMinutes
    ) {
      const safeValue =
        minutesToTimeCode(
          maxMinutes
        );

      setInputValue(
        formatTimeCode(safeValue)
      );

      onChange(safeValue);
      return;
    }

    setInputValue(
      formatTimeCode(normalized)
    );

    onChange(normalized);
  }

  return (
    <div className="relative">
      <input
        type="number"
        min="0"
        max="999.59"
        step="0.01"
        inputMode="decimal"
        disabled={disabled}
        value={inputValue}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={[
          "h-9 w-full rounded-lg border",
          "px-2.5 pr-8 text-sm font-medium",
          "outline-none",
          "tracking-tight",
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
            : "border-slate-200 bg-white text-slate-900 focus:border-sky-400 focus:ring-2 focus:ring-sky-100",
        ].join(" ")}
      />

      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase text-slate-400">
        hr
      </span>
    </div>
  );
}

/* =========================================================
   EMPLOYEE NORMALIZATION
   ========================================================= */

function normalizeEmployee(
  employee,
  index
) {
  /*
   * Existing mock data may currently use
   * conventional decimal hours.
   *
   * Example:
   * 40.75 decimal hours
   *
   * gets converted to:
   * 41.15 time code.
   */

  const workedSource =
    employee.hoursWorked ??
    employee.worked ??
    employee.hours ??
    0;

  const producedSource =
    employee.hoursProduced ??
    employee.produced ??
    employee.hours ??
    workedSource;

  const emergencySource =
    employee.emergencyHours ??
    employee.emergency ??
    0;

  const worked =
    decimalHoursToTimeCode(
      workedSource
    );

  const produced =
    decimalHoursToTimeCode(
      producedSource
    );

  const emergency =
    decimalHoursToTimeCode(
      emergencySource
    );

  const initialStatus =
    employee.status === "Inactive"
      ? "No data received"
      : employee.entryStatus ??
        employee.status ??
        "Worked";

  return {
    id:
      employee.id ??
      `EMP-${index + 1}`,

    employeeId:
      employee.employeeId ??
      employee.id ??
      `EMP-${String(
        index + 1
      ).padStart(3, "0")}`,

    name:
      employee.name ??
      "Unnamed Employee",

    role:
      employee.role ??
      "Technician",

    department:
      employee.department ??
      "General",

    status: initialStatus,

    produced,

    worked,

    emergency,

    notes:
      employee.notes ??
      "",
  };
}

/* =========================================================
   DISPLAY HELPERS
   ========================================================= */

function formatNumber(value) {
  return formatTimeCode(value);
}

function getDepartmentTotals(
  entries
) {
  return entries.reduce(
    (totals, entry) => {
      totals.produced +=
        timeCodeToMinutes(
          entry.produced
        );

      totals.worked +=
        timeCodeToMinutes(
          entry.worked
        );

      totals.emergency +=
        timeCodeToMinutes(
          entry.emergency
        );

      return totals;
    },
    {
      produced: 0,
      worked: 0,
      emergency: 0,
    }
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function DailyWorkforceEntry({
  selectedDate,
  onDateChange,
  onTotalsChange,
  entriesVisible = true,
  readOnly = false,
  lastEditedBy = "Roberta Christie",
  lastEditedAt = "4:39 AM",
}) {
  const normalizedData = useMemo(() => {
    return workforceData.map(
      normalizeEmployee
    );
  }, []);

  const [entries, setEntries] =
    useState(normalizedData);

  const [
    expandedDepartments,
    setExpandedDepartments,
  ] = useState({});

  const previousEntriesVisible =
    useRef(entriesVisible);

  /* =======================================================
     TOTALS
     ======================================================= */

  const totals = useMemo(() => {
    return entries.reduce(
      (result, entry) => {
        if (
          entry.status === "Worked"
        ) {
          result.employees += 1;
        }

        result.produced +=
          timeCodeToMinutes(
            entry.produced
          );

        result.worked +=
          timeCodeToMinutes(
            entry.worked
          );

        result.emergency +=
          timeCodeToMinutes(
            entry.emergency
          );

        return result;
      },
      {
        employees: 0,
        produced: 0,
        worked: 0,
        emergency: 0,
      }
    );
  }, [entries]);

  /*
   * Send totals to parent.

   * Parent receives minutes-based totals,
   * which is much safer for calculations.
   */
  useEffect(() => {
    if (
      typeof onTotalsChange ===
      "function"
    ) {
      onTotalsChange({
        employees:
          totals.employees,

        produced:
          minutesToTimeCode(
            totals.produced
          ),

        worked:
          minutesToTimeCode(
            totals.worked
          ),

        emergency:
          minutesToTimeCode(
            totals.emergency
          ),
      });
    }
  }, [
    totals,
    onTotalsChange,
  ]);

  /* =======================================================
     DEPARTMENTS
     ======================================================= */

  const departments = useMemo(() => {
    const grouped = {};

    entries.forEach((entry) => {
      if (
        !grouped[entry.department]
      ) {
        grouped[entry.department] =
          [];
      }

      grouped[entry.department].push(
        entry
      );
    });

    return Object.entries(grouped);
  }, [entries]);

  /* =======================================================
     INITIALIZE DEPARTMENTS
     ======================================================= */

  useEffect(() => {
    setExpandedDepartments(
      (current) => {
        const next = {
          ...current,
        };

        let changed = false;

        departments.forEach(
          ([department]) => {
            if (
              next[department] ===
              undefined
            ) {
              next[department] = true;
              changed = true;
            }
          }
        );

        return changed
          ? next
          : current;
      }
    );
  }, [departments]);

  /* =======================================================
     GLOBAL SHOW / HIDE
     ======================================================= */

  useEffect(() => {
    const previous =
      previousEntriesVisible.current;

    /*
     * Show -> Hide
     */
    if (
      previous === true &&
      entriesVisible === false
    ) {
      setExpandedDepartments(() => {
        const next = {};

        departments.forEach(
          ([department]) => {
            next[department] = false;
          }
        );

        return next;
      });
    }

    /*
     * Hide -> Show
     */
    if (
      previous === false &&
      entriesVisible === true
    ) {
      setExpandedDepartments(() => {
        const next = {};

        departments.forEach(
          ([department]) => {
            next[department] = true;
          }
        );

        return next;
      });
    }

    previousEntriesVisible.current =
      entriesVisible;
  }, [
    entriesVisible,
    departments,
  ]);

  /* =======================================================
     DEPARTMENT TOGGLE
     ======================================================= */

  function toggleDepartment(
    department
  ) {
    setExpandedDepartments(
      (current) => ({
        ...current,
        [department]:
          !current[department],
      })
    );
  }

  /* =======================================================
     UPDATE ENTRY
     ======================================================= */

  function updateEntry(
    id,
    field,
    value
  ) {
    if (readOnly) {
      return;
    }

    setEntries((current) =>
      current.map((entry) => {
        if (entry.id !== id) {
          return entry;
        }

        return {
          ...entry,
          [field]: value,
        };
      })
    );
  }

  const hasExpandedDepartment =
    Object.values(
      expandedDepartments
    ).some(Boolean);

  const showTableHeader =
    entriesVisible ||
    hasExpandedDepartment;

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="min-w-0 bg-white">
      {/* =====================================================
          READ ONLY / SUBMITTED
      ===================================================== */}

      {readOnly && (
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4">
          <LockKeyhole
            size={14}
            className="shrink-0 text-slate-400"
          />

          <p className="text-xs text-slate-500">
            This day has been submitted.
            Workforce entries are read-only.
          </p>
        </div>
      )}

      {/* =====================================================
          TABLE HEADER
      ===================================================== */}

      {showTableHeader && (
        <div className="hidden border-b border-slate-200 bg-slate-50 px-4 py-2.5 lg:grid lg:grid-cols-[minmax(240px,1fr)_120px_120px_120px_120px_minmax(180px,1.2fr)] lg:items-center lg:gap-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Technician
          </div>

          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Status
          </div>

          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Hours Produced
          </div>

          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Hours Worked
          </div>

          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Emergency Hours
          </div>

          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Notes
          </div>
        </div>
      )}

      {/* =====================================================
          DEPARTMENTS
      ===================================================== */}

      <div>
        {departments.map(
          ([
            department,
            departmentEntries,
          ]) => {
            const departmentTotals =
              getDepartmentTotals(
                departmentEntries
              );

            const isExpanded =
              expandedDepartments[
                department
              ] === true;

            return (
              <div
                key={department}
                className="border-b border-slate-200 last:border-b-0"
              >
                {/* =================================================
                    DEPARTMENT HEADER
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    toggleDepartment(
                      department
                    )
                  }
                  className="flex w-full items-center justify-between gap-4 bg-white px-3 py-3 text-left transition hover:bg-slate-50 sm:px-4"
                  aria-expanded={
                    isExpanded
                  }
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                      {isExpanded ? (
                        <ChevronDown
                          size={15}
                        />
                      ) : (
                        <ChevronRight
                          size={15}
                        />
                      )}
                    </span>

                    <span className="truncate text-sm font-semibold uppercase tracking-wide text-slate-800">
                      {department}
                    </span>

                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                      {
                        departmentEntries.length
                      }
                    </span>
                  </div>

                  {/* Department totals */}

                  <div className="hidden shrink-0 items-center gap-5 text-xs sm:flex">
                    <div>
                      <span className="text-slate-400">
                        Produced:
                      </span>{" "}
                      <span className="font-semibold text-slate-700">
                        {formatMinutesAsTimeCode(
                          departmentTotals.produced
                        )}
                        <span className="ml-1 text-[10px] font-normal text-slate-400">
                          hr
                        </span>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400">
                        Worked:
                      </span>{" "}
                      <span className="font-semibold text-slate-700">
                        {formatMinutesAsTimeCode(
                          departmentTotals.worked
                        )}
                        <span className="ml-1 text-[10px] font-normal text-slate-400">
                          hr
                        </span>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400">
                        Emergency:
                      </span>{" "}
                      <span className="font-semibold text-slate-700">
                        {formatMinutesAsTimeCode(
                          departmentTotals.emergency
                        )}
                        <span className="ml-1 text-[10px] font-normal text-slate-400">
                          hr
                        </span>
                      </span>
                    </div>
                  </div>
                </button>

                {/* =================================================
                    EMPLOYEE ENTRIES
                ================================================= */}

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/40">
                    {departmentEntries.map(
                      (entry) => (
                        <div
                          key={entry.id}
                          className="border-b border-slate-100 bg-white px-3 py-3 last:border-b-0 sm:px-4"
                        >
                          {/* =================================================
                              DESKTOP
                          ================================================= */}

                          <div className="hidden lg:grid lg:grid-cols-[minmax(240px,1fr)_120px_120px_120px_120px_minmax(180px,1.2fr)] lg:items-center lg:gap-3">
                            {/* TECHNICIAN */}

                            <div className="min-w-0">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm">
                                  <UserRound
                                    size={15}
                                  />
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-slate-900">
                                    {
                                      entry.name
                                    }
                                  </p>

                                  <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                    Last edited{" "}
                                    {
                                      lastEditedAt
                                    }{" "}
                                    by{" "}
                                    <span className="font-medium text-slate-500">
                                      {
                                        lastEditedBy
                                      }
                                    </span>
                                  </p>

                                  <div className="mt-0.5 flex min-w-0 items-center gap-1.5 truncate text-[10px] text-slate-400">
                                    <span>
                                      {
                                        entry.role
                                      }
                                    </span>

                                    <span>
                                      •
                                    </span>

                                    <span>
                                      {
                                        entry.employeeId
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* STATUS */}

                            <select
                              disabled={
                                readOnly
                              }
                              value={
                                entry.status
                              }
                              onChange={(
                                event
                              ) =>
                                updateEntry(
                                  entry.id,
                                  "status",
                                  event.target
                                    .value
                                )
                              }
                              className={[
                                "h-9 w-full rounded-lg border px-2.5 text-xs font-medium outline-none",
                                readOnly
                                  ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                                  : "border-slate-200 bg-white text-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-100",
                              ].join(" ")}
                            >
                              {STATUS_OPTIONS.map(
                                (
                                  option
                                ) => (
                                  <option
                                    key={
                                      option.value
                                    }
                                    value={
                                      option.value
                                    }
                                  >
                                    {
                                      option.label
                                    }
                                  </option>
                                )
                              )}
                            </select>

                            {/* HOURS PRODUCED */}

                            <HourInput
                              value={
                                entry.produced
                              }
                              disabled={
                                readOnly
                              }
                              onChange={(
                                value
                              ) =>
                                updateEntry(
                                  entry.id,
                                  "produced",
                                  value
                                )
                              }
                            />

                            {/* HOURS WORKED */}

                            <HourInput
                              value={
                                entry.worked
                              }
                              disabled={
                                readOnly
                              }
                              maxMinutes={
                                24 * 60
                              }
                              onChange={(
                                value
                              ) =>
                                updateEntry(
                                  entry.id,
                                  "worked",
                                  value
                                )
                              }
                            />

                            {/* EMERGENCY HOURS */}

                            <HourInput
                              value={
                                entry.emergency
                              }
                              disabled={
                                readOnly
                              }
                              maxMinutes={
                                24 * 60
                              }
                              onChange={(
                                value
                              ) =>
                                updateEntry(
                                  entry.id,
                                  "emergency",
                                  value
                                )
                              }
                            />

                            {/* NOTES */}

                            <div className="relative">
                              <FileText
                                size={14}
                                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                              />

                              <input
                                type="text"
                                disabled={
                                  readOnly
                                }
                                value={
                                  entry.notes
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateEntry(
                                    entry.id,
                                    "notes",
                                    event.target
                                      .value
                                  )
                                }
                                placeholder="Add notes..."
                                className={[
                                  "h-9 w-full rounded-lg border pl-8 pr-2.5 text-xs outline-none",
                                  readOnly
                                    ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                                    : "border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100",
                                ].join(
                                  " "
                                )}
                              />
                            </div>
                          </div>

                          {/* =================================================
                              MOBILE / TABLET
                          ================================================= */}

                          <div className="space-y-3 lg:hidden">
                            {/* TECHNICIAN */}

                            <div className="flex items-center gap-2.5">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm">
                                <UserRound
                                  size={16}
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                  {
                                    entry.name
                                  }
                                </p>

                                <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                  Last edited{" "}
                                  {
                                    lastEditedAt
                                  }{" "}
                                  by{" "}
                                  <span className="font-medium text-slate-500">
                                    {
                                      lastEditedBy
                                    }
                                  </span>
                                </p>

                                <p className="mt-0.5 truncate text-xs text-slate-400">
                                  {
                                    entry.role
                                  }{" "}
                                  •{" "}
                                  {
                                    entry.employeeId
                                  }
                                </p>
                              </div>
                            </div>

                            {/* FIELDS */}

                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                              {/* STATUS */}

                              <div>
                                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                  Status
                                </label>

                                <select
                                  disabled={
                                    readOnly
                                  }
                                  value={
                                    entry.status
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    updateEntry(
                                      entry.id,
                                      "status",
                                      event.target
                                        .value
                                    )
                                  }
                                  className={[
                                    "h-9 w-full rounded-lg border px-2 text-xs font-medium outline-none",
                                    readOnly
                                      ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                                      : "border-slate-200 bg-white text-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-100",
                                  ].join(
                                    " "
                                  )}
                                >
                                  {STATUS_OPTIONS.map(
                                    (
                                      option
                                    ) => (
                                      <option
                                        key={
                                          option.value
                                        }
                                        value={
                                          option.value
                                        }
                                      >
                                        {
                                          option.label
                                        }
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>

                              {/* PRODUCED */}

                              <div>
                                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                  Produced
                                </label>

                                <HourInput
                                  value={
                                    entry.produced
                                  }
                                  disabled={
                                    readOnly
                                  }
                                  onChange={(
                                    value
                                  ) =>
                                    updateEntry(
                                      entry.id,
                                      "produced",
                                      value
                                    )
                                  }
                                />
                              </div>

                              {/* WORKED */}

                              <div>
                                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                  Worked
                                </label>

                                <HourInput
                                  value={
                                    entry.worked
                                  }
                                  disabled={
                                    readOnly
                                  }
                                  maxMinutes={
                                    24 * 60
                                  }
                                  onChange={(
                                    value
                                  ) =>
                                    updateEntry(
                                      entry.id,
                                      "worked",
                                      value
                                    )
                                  }
                                />
                              </div>

                              {/* EMERGENCY */}

                              <div>
                                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                  Emergency Hours
                                </label>

                                <HourInput
                                  value={
                                    entry.emergency
                                  }
                                  disabled={
                                    readOnly
                                  }
                                  maxMinutes={
                                    24 * 60
                                  }
                                  onChange={(
                                    value
                                  ) =>
                                    updateEntry(
                                      entry.id,
                                      "emergency",
                                      value
                                    )
                                  }
                                />
                              </div>
                            </div>

                            {/* NOTES */}

                            <div>
                              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Notes
                              </label>

                              <div className="relative">
                                <FileText
                                  size={14}
                                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                  type="text"
                                  disabled={
                                    readOnly
                                  }
                                  value={
                                    entry.notes
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    updateEntry(
                                      entry.id,
                                      "notes",
                                      event.target
                                        .value
                                    )
                                  }
                                  placeholder="Add notes..."
                                  className={[
                                    "h-9 w-full rounded-lg border pl-8 pr-3 text-xs outline-none",
                                    readOnly
                                      ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                                      : "border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100",
                                  ].join(
                                    " "
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>

      {/* =====================================================
          TOTAL FOOTER
      ===================================================== */}

      <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-end sm:gap-5">
        <div className="text-xs">
          <span className="text-slate-400">
            Employees:
          </span>{" "}
          <span className="font-semibold text-slate-700">
            {totals.employees}
          </span>
        </div>

        <div className="text-xs">
          <span className="text-slate-400">
            Produced:
          </span>{" "}
          <span className="font-semibold text-slate-700">
            {formatMinutesAsTimeCode(
              totals.produced
            )}
            <span className="ml-1 text-[10px] font-normal text-slate-400">
              hr
            </span>
          </span>
        </div>

        <div className="text-xs">
          <span className="text-slate-400">
            Worked:
          </span>{" "}
          <span className="font-semibold text-slate-700">
            {formatMinutesAsTimeCode(
              totals.worked
            )}
            <span className="ml-1 text-[10px] font-normal text-slate-400">
              hr
            </span>
          </span>
        </div>

        <div className="text-xs">
          <span className="text-slate-400">
            Emergency Hours:
          </span>{" "}
          <span className="font-semibold text-slate-700">
            {formatMinutesAsTimeCode(
              totals.emergency
            )}
            <span className="ml-1 text-[10px] font-normal text-slate-400">
              hr
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}