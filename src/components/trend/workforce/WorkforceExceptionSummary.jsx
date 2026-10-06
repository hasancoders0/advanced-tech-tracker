"use client";

import { useMemo, useState } from "react";

import { AlertTriangle, PhoneCall, Users } from "lucide-react";

import {
  isWithinInterval,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from "date-fns";

import Select from "@/components/ui/Select";

import employeesData from "@/data/master/employees";

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
  toDate,
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

  const title = isCallOut ? "Call Outs" : "Emergency Hours";

  const Icon = isCallOut ? PhoneCall : AlertTriangle;

  const safeDate = selectedDate || new Date();

  /* =======================================================
     EMPLOYEE MASTER
  ======================================================= */

  const employeeMaster = useMemo(() => {
    if (!Array.isArray(employeesData)) {
      return [];
    }

    return employeesData.map((item) => {
      const employeeId = item?.id || item?.employeeCode || "";

      const name =
        item?.name ||
        item?.fullName ||
        `${item?.firstName || ""} ${item?.lastName || ""}`.trim() ||
        "Unknown";

      const department =
        item?.employment?.department || item?.department || "General";

      const departmentId =
        item?.employment?.departmentId || item?.departmentId || "";

      /*
       * Current Employee master:
       *
       * EMP-001 -> TECH-002
       * EMP-002 -> TECH-003
       * EMP-003 -> TECH-004
       *
       * This is only a legacy data bridge.
       */

      let workforceId = "";

      const employeeNumber = Number(String(employeeId).replace("EMP-", ""));

      if (!Number.isNaN(employeeNumber) && employeeNumber > 0) {
        workforceId = `TECH-${String(employeeNumber + 1).padStart(3, "0")}`;
      }

      return {
        employeeId,
        employeeCode: item?.employeeCode || employeeId,
        name,
        department,
        departmentId,
        workforceId,
      };
    });
  }, []);

  /* =======================================================
     EMPLOYEE RESOLVER
  ======================================================= */

  function resolveEmployee(entry) {
    const entryEmployeeId = entry?.employeeId || entry?.employeeCode || "";

    const entryTechnicianId = entry?.technicianId || "";

    const entryId = entry?.id || "";

    /*
     * 1. Direct Employee ID
     */

    let employee = employeeMaster.find(
      (item) =>
        item.employeeId === entryEmployeeId ||
        item.employeeCode === entryEmployeeId,
    );

    if (employee) {
      return employee;
    }

    /*
     * 2. Legacy Technician ID
     */

    employee = employeeMaster.find(
      (item) => item.workforceId === entryTechnicianId,
    );

    if (employee) {
      return employee;
    }

    /*
     * 3. Sometimes the historical workforce
     * record itself has a WF ID such as:
     *
     * WF-1002-002
     *
     * The last section identifies the employee.
     */

    const wfMatch = String(entryId).match(/-(\d{3})$/);

    if (wfMatch) {
      const employeeNumber = wfMatch[1];

      employee = employeeMaster.find((item) =>
        String(item.employeeId).endsWith(`-${employeeNumber}`),
      );

      if (employee) {
        return employee;
      }
    }

    /*
     * 4. Direct technicianId can sometimes
     * be present in the record itself.
     */

    employee = employeeMaster.find(
      (item) =>
        item.workforceId === entryTechnicianId ||
        item.workforceId === entryEmployeeId,
    );

    if (employee) {
      return employee;
    }

    /*
     * 5. Fallback to data already inside
     * the workforce entry.
     */

    return {
      employeeId: entryEmployeeId || entryTechnicianId || entryId || "UNKNOWN",

      employeeCode:
        entryEmployeeId || entryTechnicianId || entryId || "UNKNOWN",

      name: getEntryName(entry) || "Unknown Employee",

      department: getEntryDepartment(entry) || "General",

      departmentId: entry?.departmentId || "",

      workforceId: entryTechnicianId || "",
    };
  }

  /* =======================================================
     PERIOD RANGE
  ======================================================= */

  const periodRange = useMemo(() => {
    switch (period) {
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

      case "mtd":
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
     RAW REPORT ENTRIES
  ======================================================= */

  const entries = useMemo(() => {
    const result = [];

    records.forEach((record) => {
      const recordDateValue = getRecordDate(record);

      if (!recordDateValue) {
        return;
      }

      const recordDate = toDate(recordDateValue);

      if (!recordDate) {
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

      const dailyEntries = getRecordEntries(record);

      dailyEntries.forEach((entry) => {
        const status = String(getStatus(entry)).toLowerCase();

        const emergencyMinutes = timeCodeToMinutes(getEmergencyHours(entry));

        const calledOut = status.includes("call") || status.includes("out");

        /*
         * CALL OUT REPORT
         */

        if (isCallOut) {
          if (!calledOut) {
            return;
          }

          const resolved = resolveEmployee(entry);

          result.push({
            id: resolved.employeeId,
            name: resolved.name,
            department: resolved.department,
            date: recordDate,
            callOut: 1,
            emergencyMinutes: 0,
          });

          return;
        }

        /*
         * EMERGENCY HOURS REPORT
         */

        if (emergencyMinutes <= 0) {
          return;
        }

        const resolved = resolveEmployee(entry);

        result.push({
          id: resolved.employeeId,
          name: resolved.name,
          department: resolved.department,
          date: recordDate,
          callOut: 0,
          emergencyMinutes,
        });
      });
    });

    return result;
  }, [records, periodRange, isCallOut, employeeMaster]);

  /* =======================================================
     DEPARTMENT OPTIONS
  ======================================================= */

  const departments = useMemo(() => {
    return Array.from(
      new Set(entries.map((item) => item.department).filter(Boolean)),
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
     EMPLOYEE OPTIONS
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
     FILTER
  ======================================================= */

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesDepartment =
        department === "all" || entry.department === department;

      const matchesEmployee = employee === "all" || entry.id === employee;

      return matchesDepartment && matchesEmployee;
    });
  }, [entries, department, employee]);

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

      item.emergencyMinutes += entry.emergencyMinutes || 0;
    });

    return Array.from(map.values()).sort((a, b) => {
      const departmentCompare = String(a.department).localeCompare(
        String(b.department),
      );

      if (departmentCompare !== 0) {
        return departmentCompare;
      }

      return String(a.name).localeCompare(String(b.name));
    });
  }, [filteredEntries]);

  /* =======================================================
     TOTALS
  ======================================================= */

  const totals = useMemo(() => {
    return filteredEntries.reduce(
      (result, entry) => {
        result.callOuts += entry.callOut || 0;

        result.emergencyMinutes += entry.emergencyMinutes || 0;

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

    employeeSummary.forEach((item) => {
      const departmentName = item.department || "General";

      if (!groups.has(departmentName)) {
        groups.set(departmentName, []);
      }

      groups.get(departmentName).push(item);
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
     UI
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
          SUMMARY
      =================================================== */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">
                {isCallOut ? "Total Call Outs" : "Emergency Hours"}
              </p>

              <p
                className={[
                  "mt-2 text-2xl font-semibold tracking-tight",
                  isCallOut ? "text-red-600" : "text-orange-600",
                ].join(" ")}
              >
                {isCallOut
                  ? totals.callOuts
                  : minutesToTimeCode(totals.emergencyMinutes)}
              </p>

              <p className="mt-1 text-xs text-slate-400">Selected period</p>
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
              <p className="text-xs font-medium text-slate-500">Employees</p>

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

      {employeeSummary.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="w-[24%] px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Department
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Employee
                  </th>

                  <th className="w-[20%] px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    {isCallOut ? "Call Outs" : "Emergency Hours"}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {departmentGroups.map(([departmentName, items]) => (
                  <tbody
                    key={departmentName}
                    className="divide-y divide-slate-100"
                  >
                    {items.map((item, index) => (
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
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                              <Users size={15} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-800">
                                {item.name}
                              </p>

                              <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                                {item.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <span
                            className={[
                              "text-sm font-semibold",
                              isCallOut ? "text-red-600" : "text-orange-600",
                            ].join(" ")}
                          >
                            {isCallOut
                              ? item.callOuts
                              : minutesToTimeCode(item.emergencyMinutes)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ))}
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
      ) : (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Users size={18} />
          </div>

          <p className="mt-3 text-sm font-medium text-slate-700">
            No {isCallOut ? "call out" : "emergency hour"} data
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
      )}
    </div>
  );
}
