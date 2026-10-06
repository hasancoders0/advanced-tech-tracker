"use client";

import { AlertTriangle, Clock3, UserRound } from "lucide-react";

import { formatDateKey, formatDisplayDate } from "@/lib/trend/trend-utils";

import employeesData from "@/data/master/employees";

/* =========================================================
   TIME CODE HELPERS
   ========================================================= */

function timeCodeToMinutes(value) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const text = String(value).trim();

  if (!text) {
    return 0;
  }

  /*
   * Our application uses:
   *
   * 8.00 = 8 hours 00 minutes
   * 8.30 = 8 hours 30 minutes
   * 8.45 = 8 hours 45 minutes
   *
   * Not decimal hours.
   */

  const [hoursPart, minutesPart = "0"] = text.split(".");

  const hours = Number(hoursPart || 0);

  const minutes = Number(String(minutesPart).padEnd(2, "0").slice(0, 2));

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return 0;
  }

  if (minutes > 59) {
    return 0;
  }

  return hours * 60 + minutes;
}

function minutesToTimeCode(minutes) {
  const safeMinutes = Math.max(0, Math.round(Number(minutes) || 0));

  const hours = Math.floor(safeMinutes / 60);

  const remainingMinutes = safeMinutes % 60;

  return `${hours}.${String(remainingMinutes).padStart(2, "0")}`;
}

/* =========================================================
   EMPLOYEE HELPERS
   ========================================================= */

function getEmployeeId(employee) {
  return employee?.id || employee?.employeeCode || "";
}

function getEmployeeName(employee) {
  return (
    employee?.name ||
    employee?.fullName ||
    `${employee?.firstName || ""} ${employee?.lastName || ""}`.trim() ||
    "Unknown"
  );
}

function getEmployeeDepartmentId(employee) {
  return employee?.employment?.departmentId || employee?.departmentId || "";
}

function getEmployeeDepartment(employee) {
  return employee?.employment?.department || employee?.department || "General";
}

function getEmployeeStatus(employee) {
  return employee?.employment?.status || employee?.status || "Active";
}

/* =========================================================
   LEGACY WORKFORCE ID BRIDGE
   ========================================================= */

function getEmployeeWorkforceId(employee) {
  /*
   * Support old employee records
   * if they already contain technicianId.
   */

  if (employee?.technicianId) {
    return employee.technicianId;
  }

  if (employee?.technician?.id) {
    return employee.technician.id;
  }

  /*
   * Current Employee master mapping:
   *
   * EMP-001 -> TECH-002
   * EMP-002 -> TECH-003
   * EMP-003 -> TECH-004
   *
   * and so on.
   */

  const employeeNumber = Number(
    String(getEmployeeId(employee)).replace("EMP-", ""),
  );

  if (!Number.isNaN(employeeNumber) && employeeNumber > 0) {
    return `TECH-${String(employeeNumber + 1).padStart(3, "0")}`;
  }

  return "";
}

/* =========================================================
   EMPLOYEES FOR TREND
   ========================================================= */

function getEmployeesForTrend() {
  if (!Array.isArray(employeesData)) {
    return [];
  }

  return employeesData.map((employee) => ({
    employeeId: getEmployeeId(employee),

    workforceId: getEmployeeWorkforceId(employee),

    name: getEmployeeName(employee),

    departmentId: getEmployeeDepartmentId(employee),

    department: getEmployeeDepartment(employee),

    status: getEmployeeStatus(employee),
  }));
}

/* =========================================================
   RECORD HELPERS
   ========================================================= */

function getRecordEntries(record) {
  if (!record) {
    return [];
  }

  return Array.isArray(record.entries) ? record.entries : [];
}

/* =========================================================
   FIND EMPLOYEE'S DAILY ENTRY
   ========================================================= */

function findEmployeeEntry(entries, employee) {
  if (!Array.isArray(entries)) {
    return null;
  }

  return (
    entries.find((item) => {
      /*
       * Preferred / current structure:
       *
       * employeeId: "EMP-001"
       */

      if (item?.employeeId && item.employeeId === employee.employeeId) {
        return true;
      }

      /*
       * Legacy historical structure:
       *
       * technicianId: "TECH-002"
       */

      if (item?.technicianId && item.technicianId === employee.workforceId) {
        return true;
      }

      return false;
    }) || null
  );
}

/* =========================================================
   BUILD WEEK ROWS
   ========================================================= */

function buildWeekRows(records, weekDates) {
  const employees = getEmployeesForTrend();

  const recordMap = new Map(
    records.filter(Boolean).map((record) => [record.date, record]),
  );

  return employees.map((employee) => {
    const days = {};

    let totalMinutes = 0;

    weekDates.forEach(({ date }) => {
      const dateKey = formatDateKey(date);

      const record = recordMap.get(dateKey);

      const entries = getRecordEntries(record);

      /*
       * Find this employee's
       * workforce entry.
       */

      const entry = findEmployeeEntry(entries, employee);

      /*
       * No record for this employee
       * on this date.
       */

      if (!entry) {
        days[dateKey] = null;
        return;
      }

      const entryStatus = String(entry.entryStatus || entry.status || "Worked");

      const isCalledOut =
        entryStatus.toLowerCase().includes("call") ||
        entryStatus.toLowerCase().includes("out");

      /*
       * Produced hours are used
       * for the weekly trend list.
       */

      const hoursProduced = entry.hoursProduced ?? entry.produced ?? "0.00";

      const value = isCalledOut ? "Called Out" : hoursProduced;

      const minutes = isCalledOut ? 0 : timeCodeToMinutes(hoursProduced);

      totalMinutes += minutes;

      days[dateKey] = {
        value,
        minutes,
        status: entry.entryStatus || entry.status || "Worked",
      };
    });

    return {
      ...employee,
      days,
      totalMinutes,
    };
  });
}

/* =========================================================
   FILTER EMPLOYEES WITH WEEK ACTIVITY
   ========================================================= */

/*
 * Employee should appear only when they have
 * at least ONE actual workforce entry
 * during the selected week.
 *
 * Called Out is also considered activity.
 */

function filterEmployeesWithWeekActivity(rows) {
  return rows.filter((row) => {
    if (!row?.days) {
      return false;
    }

    return Object.values(row.days).some(
      (day) => day !== null && day !== undefined,
    );
  });
}

/* =========================================================
   GROUP BY DEPARTMENT
   ========================================================= */

function groupByDepartment(rows) {
  const groups = [];

  rows.forEach((row) => {
    const existing = groups.find(
      (group) => group.departmentId === row.departmentId,
    );

    if (existing) {
      existing.rows.push(row);
    } else {
      groups.push({
        departmentId: row.departmentId,

        department: row.department,

        rows: [row],
      });
    }
  });

  return groups;
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function WorkforceWeekTable({ records = [], weekDates = [] }) {
  /*
   * First build all employee rows.
   */

  const allRows = buildWeekRows(records, weekDates);

  /*
   * Remove employees who have
   * absolutely no workforce entry
   * during this selected week.
   */

  const rows = filterEmployeesWithWeekActivity(allRows);

  /*
   * Group only active-week employees
   * by department.
   */

  const departmentGroups = groupByDepartment(rows);

  /* =======================================================
     NO PERIOD
     ======================================================= */

  if (!weekDates.length) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Clock3 size={18} />
        </div>

        <p className="mt-3 text-sm font-medium text-slate-700">
          No period selected
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Select a valid reporting period.
        </p>
      </div>
    );
  }

  /* =======================================================
     NO EMPLOYEES WITH ACTIVITY
     ======================================================= */

  if (!rows.length) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <UserRound size={18} />
        </div>

        <p className="mt-3 text-sm font-medium text-slate-700">
          No workforce activity
        </p>

        <p className="mt-1 text-xs text-slate-400">
          No employees have workforce activity during this reporting period.
        </p>
      </div>
    );
  }

  /* =======================================================
     TABLE
     ======================================================= */

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[1050px] border-collapse">
        {/* =================================================
            HEADER
        ================================================= */}

        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="w-[150px] px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Dept
            </th>

            <th className="w-[230px] px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Employee
            </th>

            {weekDates.map(({ name, date }) => (
              <th
                key={formatDateKey(date)}
                className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500"
              >
                <div>{name.slice(0, 3)}</div>

                <div className="mt-1 text-[10px] font-normal normal-case text-slate-400">
                  {formatDisplayDate(date)}
                </div>
              </th>
            ))}

            <th className="w-[100px] px-4 py-4 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Total
            </th>
          </tr>
        </thead>

        {/* =================================================
            BODY
        ================================================= */}

        <tbody>
          {departmentGroups.map((group) =>
            group.rows.map((row, rowIndex) => (
              <tr
                key={row.employeeId}
                className={[
                  "border-b border-slate-100",
                  "transition-colors",
                  "hover:bg-slate-50/70",

                  /*
                   * First employee of every
                   * department gets a stronger
                   * top border so the department
                   * group is easy to identify.
                   */
                  rowIndex === 0 ? "border-t-2 border-t-slate-200" : "",
                ].join(" ")}
              >
                {/* =====================================
                        DEPARTMENT
                    ===================================== */}

                <td
                  className={[
                    "px-4 py-4 align-middle",

                    /*
                     * Give the first department
                     * row a very subtle background.
                     */
                    rowIndex === 0 ? "bg-slate-50/70" : "",
                  ].join(" ")}
                >
                  {rowIndex === 0 ? (
                    <div className="flex items-center">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">
                        {group.department}
                      </span>
                    </div>
                  ) : null}
                </td>

                {/* =====================================
                        EMPLOYEE
                    ===================================== */}

                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <UserRound size={15} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {row.name}
                      </p>

                      <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                        {row.employeeId}
                      </p>
                    </div>
                  </div>
                </td>

                {/* =====================================
                        DAILY VALUES
                    ===================================== */}

                {weekDates.map(({ date }) => {
                  const key = formatDateKey(date);

                  const day = row.days[key];

                  /*
                   * Employee has activity
                   * during the week, but not
                   * on this particular day.
                   */

                  if (!day) {
                    return (
                      <td
                        key={key}
                        className="px-4 py-4 text-sm text-slate-400"
                      >
                        No data
                      </td>
                    );
                  }

                  const isCalledOut = day.value === "Called Out";

                  return (
                    <td
                      key={key}
                      className={[
                        "px-4 py-4 text-sm",

                        isCalledOut
                          ? "font-medium text-orange-600"
                          : "text-slate-700",
                      ].join(" ")}
                    >
                      {isCalledOut ? (
                        <span className="inline-flex items-center gap-1.5">
                          <AlertTriangle size={13} />
                          Called Out
                        </span>
                      ) : (
                        day.value
                      )}
                    </td>
                  );
                })}

                {/* =====================================
                        TOTAL
                    ===================================== */}

                <td className="px-4 py-4 text-right">
                  <span className="text-sm font-semibold text-sky-700">
                    {minutesToTimeCode(row.totalMinutes)}
                  </span>
                </td>
              </tr>
            )),
          )}
        </tbody>
      </table>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="border-t border-slate-200 px-4 py-3">
        <p className="text-[11px] text-slate-400">
          Time values are displayed as hours.minutes, where the decimal portion
          represents minutes.
        </p>
      </div>
    </div>
  );
}
