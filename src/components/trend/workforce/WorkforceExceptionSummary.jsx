"use client";

import { useMemo, useState } from "react";

import {
  AlertTriangle,
  PhoneCall,
  Users,
} from "lucide-react";

import {
  endOfMonth,
  endOfQuarter,
  endOfYear,
  format,
  isWithinInterval,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from "date-fns";

import Select from "@/components/ui/Select";

import {
  getRecordDate,
  getRecordEntries,
  getEntryName,
  getEntryId,
  getEntryDepartment,
  getStatus,
  getEmergencyHours,
  timeCodeToMinutes,
  minutesToTimeCode,
} from "@/lib/trend/trend-utils";

export default function WorkforceExceptionSummary({
  type = "call-outs",
  records = [],
  selectedDate,
}) {
  const [period, setPeriod] = useState("mtd");
  const [department, setDepartment] = useState("all");
  const [employee, setEmployee] = useState("all");

  const isCallOut = type === "call-outs";

  /* =======================================================
     TITLE / ICON
  ======================================================= */

  const title = isCallOut
    ? "Call Outs"
    : "Emergency Hours";

  const description = isCallOut
    ? "Employees with call out activity."
    : "Employees with emergency work.";

  const Icon = isCallOut ? PhoneCall : AlertTriangle;

  /* =======================================================
     SELECTED DATE
  ======================================================= */

  const safeDate = selectedDate || new Date();

  /* =======================================================
     PERIOD RANGE
  ======================================================= */

  const periodRange = useMemo(() => {
    switch (period) {
      case "mtd":
        return {
          start: startOfMonth(safeDate),
          end: safeDate,
        };

      case "qtd":
        return {
          start: startOfQuarter(safeDate),
          end: safeDate,
        };

      case "ytd":
        return {
          start: startOfYear(safeDate),
          end: safeDate,
        };

      default:
        return {
          start: startOfMonth(safeDate),
          end: safeDate,
        };
    }
  }, [period, safeDate]);

  /* =======================================================
     PERIOD OPTIONS
  ======================================================= */

  const periodOptions = [
    {
      value: "mtd",
      label: "Month to date",
    },
    {
      value: "qtd",
      label: "Quarter to date",
    },
    {
      value: "ytd",
      label: "Year to date",
    },
  ];

  /* =======================================================
     RAW ENTRIES
  ======================================================= */

  const entries = useMemo(() => {
    const result = [];

    records.forEach((record) => {
      const recordDateValue = getRecordDate(record);

      if (!recordDateValue) {
        return;
      }

      const recordDate = new Date(recordDateValue);

      if (Number.isNaN(recordDate.getTime())) {
        return;
      }

      if (
        !isWithinInterval(recordDate, {
          start: periodRange.start,
          end: periodRange.end,
        })
      ) {
        return;
      }

      getRecordEntries(record).forEach((entry) => {
        const status = String(getStatus(entry)).toLowerCase();

        const emergencyMinutes = timeCodeToMinutes(
          getEmergencyHours(entry),
        );

        const calledOut =
          status.includes("call") ||
          status.includes("out");

        if (isCallOut) {
          if (!calledOut) {
            return;
          }

          result.push({
            id: getEntryId(entry),
            name: getEntryName(entry),
            department: getEntryDepartment(entry),
            date: recordDate,
            callOut: 1,
            emergencyMinutes: 0,
          });

          return;
        }

        if (emergencyMinutes <= 0) {
          return;
        }

        result.push({
          id: getEntryId(entry),
          name: getEntryName(entry),
          department: getEntryDepartment(entry),
          date: recordDate,
          callOut: 0,
          emergencyMinutes,
        });
      });
    });

    return result;
  }, [
    records,
    periodRange,
    isCallOut,
  ]);

  /* =======================================================
     DEPARTMENTS
  ======================================================= */

  const departments = useMemo(() => {
    return Array.from(
      new Set(
        entries
          .map((entry) => entry.department)
          .filter(Boolean),
      ),
    ).sort();
  }, [entries]);

  const departmentOptions = [
    {
      value: "all",
      label: "All departments",
    },
    ...departments.map((item) => ({
      value: item,
      label: item,
    })),
  ];

  /* =======================================================
     EMPLOYEES
  ======================================================= */

  const employees = useMemo(() => {
    const map = new Map();

    entries.forEach((entry) => {
      const id = entry.id || entry.name;

      if (!id) {
        return;
      }

      if (!map.has(id)) {
        map.set(id, {
          id,
          name: entry.name,
          department: entry.department,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      String(a.name).localeCompare(String(b.name)),
    );
  }, [entries]);

  const employeeOptions = [
    {
      value: "all",
      label: "All employees",
    },
    ...employees.map((item) => ({
      value: item.id,
      label: item.name,
    })),
  ];

  /* =======================================================
     FILTERED ENTRIES
  ======================================================= */

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesDepartment =
        department === "all" ||
        entry.department === department;

      const matchesEmployee =
        employee === "all" ||
        entry.id === employee;

      return (
        matchesDepartment &&
        matchesEmployee
      );
    });
  }, [
    entries,
    department,
    employee,
  ]);

  /* =======================================================
     EMPLOYEE SUMMARY
  ======================================================= */

  const employeeSummary = useMemo(() => {
    const map = new Map();

    filteredEntries.forEach((entry) => {
      const id = entry.id || entry.name;

      if (!id) {
        return;
      }

      if (!map.has(id)) {
        map.set(id, {
          id,
          name: entry.name,
          department: entry.department,
          callOuts: 0,
          emergencyMinutes: 0,
        });
      }

      const item = map.get(id);

      item.callOuts += entry.callOut || 0;

      item.emergencyMinutes +=
        entry.emergencyMinutes || 0;
    });

    return Array.from(map.values()).sort((a, b) => {
      if (a.department !== b.department) {
        return String(a.department).localeCompare(
          String(b.department),
        );
      }

      return String(a.name).localeCompare(
        String(b.name),
      );
    });
  }, [filteredEntries]);

  /* =======================================================
     TOTALS
  ======================================================= */

  const totals = useMemo(() => {
    return filteredEntries.reduce(
      (result, entry) => {
        result.callOuts += entry.callOut || 0;

        result.emergencyMinutes +=
          entry.emergencyMinutes || 0;

        return result;
      },
      {
        callOuts: 0,
        emergencyMinutes: 0,
      },
    );
  }, [filteredEntries]);

  /* =======================================================
     DEPARTMENT GROUPS
  ======================================================= */

  const departmentGroups = useMemo(() => {
    const groups = new Map();

    employeeSummary.forEach((employeeItem) => {
      const departmentName =
        employeeItem.department || "General";

      if (!groups.has(departmentName)) {
        groups.set(departmentName, []);
      }

      groups
        .get(departmentName)
        .push(employeeItem);
    });

    return Array.from(groups.entries());
  }, [employeeSummary]);

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  function resetFilters() {
    setPeriod("mtd");
    setDepartment("all");
    setEmployee("all");
  }

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!employeeSummary.length) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  isCallOut
                    ? "bg-red-50 text-red-500"
                    : "bg-orange-50 text-orange-500",
                ].join(" ")}
              >
                <Icon size={18} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  {title}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Select
                label="Period"
                value={period}
                onChange={setPeriod}
                options={periodOptions}
              />

              <Select
                label="Department"
                value={department}
                onChange={setDepartment}
                options={departmentOptions}
              />

              <Select
                label="Employee"
                value={employee}
                onChange={setEmployee}
                options={employeeOptions}
              />
            </div>
          </div>
        </div>

        <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Users size={18} />
          </div>

          <p className="mt-3 text-sm font-medium text-slate-700">
            No {isCallOut ? "call outs" : "emergency hours"} found
          </p>

          <p className="mt-1 text-xs text-slate-400">
            No matching records were found for the selected filters.
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="space-y-4">
      {/* ===================================================
          FILTERS
      =================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Select
            label="Period"
            value={period}
            onChange={setPeriod}
            options={periodOptions}
          />

          <Select
            label="Department"
            value={department}
            onChange={setDepartment}
            options={departmentOptions}
          />

          <Select
            label="Employee"
            value={employee}
            onChange={setEmployee}
            options={employeeOptions}
          />
        </div>
      </div>

      {/* ===================================================
          SUMMARY CARDS
      =================================================== */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">
                {isCallOut
                  ? "Total Call Outs"
                  : "Emergency Hours"}
              </p>

              <p
                className={[
                  "mt-2 text-2xl font-semibold tracking-tight",
                  isCallOut
                    ? "text-red-600"
                    : "text-orange-600",
                ].join(" ")}
              >
                {isCallOut
                  ? totals.callOuts
                  : minutesToTimeCode(
                      totals.emergencyMinutes,
                    )}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Selected period
              </p>
            </div>

            <div
              className={[
                "flex h-9 w-9 items-center justify-center rounded-lg",
                isCallOut
                  ? "bg-red-50 text-red-500"
                  : "bg-orange-50 text-orange-500",
              ].join(" ")}
            >
              <Icon size={17} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Employees
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {employeeSummary.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Employees with activity
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Users size={17} />
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================
          TABLE
      =================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Department
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Employee
                </th>

                <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  {isCallOut
                    ? "Call Outs"
                    : "Emergency Hours"}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {departmentGroups.map(
                ([departmentName, items]) => {
                  return items.map(
                    (item, index) => (
                      <tr
                        key={item.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4">
                          {index === 0 ? (
                            <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                              {departmentName}
                            </span>
                          ) : (
                            <span className="text-transparent">
                              {departmentName}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {item.name}
                            </p>

                            {item.id && (
                              <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                                {item.id}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <span
                            className={[
                              "text-sm font-semibold",
                              isCallOut
                                ? "text-red-600"
                                : "text-orange-600",
                            ].join(" ")}
                          >
                            {isCallOut
                              ? item.callOuts
                              : minutesToTimeCode(
                                  item.emergencyMinutes,
                                )}
                          </span>
                        </td>
                      </tr>
                    ),
                  );
                },
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 px-5 py-3">
          <p className="text-xs text-slate-400">
            {isCallOut
              ? `${totals.callOuts} total call out${
                  totals.callOuts === 1 ? "" : "s"
                }`
              : `${minutesToTimeCode(
                  totals.emergencyMinutes,
                )} total emergency hours`}
          </p>
        </div>
      </div>
    </div>
  );
}