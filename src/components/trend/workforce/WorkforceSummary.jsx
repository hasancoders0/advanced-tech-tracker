"use client";

import {
  AlertTriangle,
  CalendarDays,
  Clock3,
  PhoneCall,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  endOfMonth,
  format,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";

import {
  getRecordEntries,
  getProducedHours,
  getEmergencyHours,
  getStatus,
  timeCodeToMinutes,
  minutesToTimeCode,
} from "@/lib/trend/trend-utils";

/* =========================================================
   DATE HELPERS
========================================================= */

function getRecordDate(record) {
  return (
    record?.date ||
    record?.workDate ||
    record?.saleDate ||
    record?.createdDate ||
    record?.createdAt ||
    null
  );
}

function getRecordsInRange(records = [], start, end) {
  return records.filter((record) => {
    const value = getRecordDate(record);

    if (!value) {
      return false;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    return date >= start && date <= end;
  });
}

/* =========================================================
   EMPLOYEE IDENTITY
========================================================= */

/*
 * IMPORTANT
 *
 * Do NOT use entry.id as the employee identity.
 *
 * A daily workforce entry can have its own unique ID:
 *
 * Monday:
 *   id = WORK-001
 *   employeeId = EMP-002
 *
 * Tuesday:
 *   id = WORK-015
 *   employeeId = EMP-002
 *
 * These are two entries but only ONE employee.
 *
 * Therefore we always prefer employeeId.
 */

function getEmployeeIdentity(entry) {
  return (
    entry?.employeeId ||
    entry?.employeeCode ||
    entry?.technicianId ||
    entry?.technicianCode ||
    null
  );
}

/* =========================================================
   SUMMARY CALCULATION
========================================================= */

function getSummary(records = []) {
  const employees = new Set();

  let producedMinutes = 0;

  let emergencyMinutes = 0;

  let callOuts = 0;

  records.forEach((record) => {
    const entries = getRecordEntries(record);

    entries.forEach((entry) => {
      const employeeId = getEmployeeIdentity(entry);

      const status = String(getStatus(entry) || "").toLowerCase();

      const isCalledOut = status.includes("call") || status.includes("out");

      /*
       * Any workforce entry means the employee
       * has activity in this reporting period.
       *
       * This includes Called Out because the
       * employee still has a workforce entry.
       *
       * The important part is that we use
       * employeeId instead of entry.id.
       */

      if (employeeId) {
        employees.add(employeeId);
      }

      /* ===================================================
         PRODUCED HOURS
      =================================================== */

      producedMinutes += timeCodeToMinutes(getProducedHours(entry));

      /* ===================================================
         EMERGENCY HOURS
      =================================================== */

      emergencyMinutes += timeCodeToMinutes(getEmergencyHours(entry));

      /* ===================================================
         CALL OUTS
      =================================================== */

      if (isCalledOut) {
        callOuts += 1;
      }
    });
  });

  return {
    employees: employees.size,

    produced: minutesToTimeCode(producedMinutes),

    emergency: minutesToTimeCode(emergencyMinutes),

    callOuts,
  };
}

/* =========================================================
   WEEK RANGE
========================================================= */

function getWeekRange(date) {
  const selected = new Date(date);

  selected.setHours(0, 0, 0, 0);

  /*
   * Monday = first day of week.
   *
   * Sunday = 0
   * Monday = 1
   * Tuesday = 2
   * ...
   */

  const day = selected.getDay();

  const difference = day === 0 ? 6 : day - 1;

  const start = new Date(selected);

  start.setDate(start.getDate() - difference);

  start.setHours(0, 0, 0, 0);

  const end = new Date(start);

  end.setDate(end.getDate() + 4);

  end.setHours(23, 59, 59, 999);

  return {
    start,
    end,
  };
}

/* =========================================================
   MONTH RANGE
========================================================= */

function getMonthRange(date) {
  return {
    start: startOfMonth(date),
    end: date,
  };
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  danger = false,
  positive = false,
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">
            {label}
          </p>

          <p
            className={[
              "mt-2 text-xl font-semibold tracking-tight sm:text-2xl",
              danger
                ? "text-red-600"
                : positive
                  ? "text-emerald-600"
                  : "text-slate-900",
            ].join(" ")}
          >
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-slate-400">{description}</p>
          )}
        </div>

        {Icon && (
          <div
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              danger
                ? "bg-red-50 text-red-500"
                : positive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-600",
            ].join(" ")}
          >
            <Icon size={17} />
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   WEEK SUMMARY
========================================================= */

function WeekSummary({ records = [], selectedDate }) {
  const { start, end } = getWeekRange(selectedDate);

  const weekRecords = getRecordsInRange(records, start, end);

  const summary = getSummary(weekRecords);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {/* =================================================
          EMPLOYEES
      ================================================= */}

      <SummaryCard
        label="Employees"
        value={summary.employees}
        description="Employees with activity"
        icon={Users}
      />

      {/* =================================================
          HOURS PRODUCED
      ================================================= */}

      <SummaryCard
        label="Hours Produced"
        value={summary.produced}
        description="Total produced hours"
        icon={Clock3}
      />

      {/* =================================================
          EMERGENCY HOURS
      ================================================= */}

      <SummaryCard
        label="Emergency Hours"
        value={summary.emergency}
        description="Emergency work"
        icon={AlertTriangle}
        danger={summary.emergency !== "0.00"}
      />

      {/* =================================================
          CALL OUTS
      ================================================= */}

      <SummaryCard
        label="Call Outs"
        value={summary.callOuts}
        description="Called out entries"
        icon={PhoneCall}
        danger={summary.callOuts > 0}
      />
    </div>
  );
}

/* =========================================================
   MTD SUMMARY
========================================================= */

function MtdSummary({ records = [], selectedDate }) {
  const { start, end } = getMonthRange(selectedDate);

  const monthRecords = getRecordsInRange(records, start, end);

  const summary = getSummary(monthRecords);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Employees"
        value={summary.employees}
        description="Employees with activity"
        icon={Users}
      />

      <SummaryCard
        label="Hours Produced"
        value={summary.produced}
        description="Produced hours MTD"
        icon={Clock3}
      />

      <SummaryCard
        label="Emergency Hours"
        value={summary.emergency}
        description="Emergency hours MTD"
        icon={AlertTriangle}
        danger={summary.emergency !== "0.00"}
      />

      <SummaryCard
        label="Call Outs"
        value={summary.callOuts}
        description="Call outs MTD"
        icon={PhoneCall}
        danger={summary.callOuts > 0}
      />
    </div>
  );
}

/* =========================================================
   CURRENT MONTH VS LAST MONTH
========================================================= */

function CmVsLmSummary({ records = [], selectedDate }) {
  const currentMonthRecords = getRecordsInRange(
    records,
    startOfMonth(selectedDate),
    selectedDate,
  );

  const previousMonthDate = subMonths(selectedDate, 1);

  const previousMonthRecords = getRecordsInRange(
    records,
    startOfMonth(previousMonthDate),
    endOfMonth(previousMonthDate),
  );

  const currentMonth = getSummary(currentMonthRecords);

  const previousMonth = getSummary(previousMonthRecords);

  const currentMinutes = timeCodeToMinutes(currentMonth.produced);

  const previousMinutes = timeCodeToMinutes(previousMonth.produced);

  const difference = currentMinutes - previousMinutes;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Current Month"
        value={currentMonth.produced}
        description="Produced hours"
        icon={TrendingUp}
      />

      <SummaryCard
        label="Last Month"
        value={previousMonth.produced}
        description="Produced hours"
        icon={CalendarDays}
      />

      <SummaryCard
        label="Difference"
        value={minutesToTimeCode(Math.abs(difference))}
        description={
          difference >= 0 ? "Higher than last month" : "Lower than last month"
        }
        icon={difference >= 0 ? TrendingUp : TrendingDown}
        positive={difference >= 0}
        danger={difference < 0}
      />

      <SummaryCard
        label="Call Outs"
        value={currentMonth.callOuts}
        description="Current month"
        icon={PhoneCall}
        danger={currentMonth.callOuts > 0}
      />
    </div>
  );
}

/* =========================================================
   CALL OUT SUMMARY
========================================================= */

function CallOutSummary({ records = [], selectedDate }) {
  const { start, end } = getMonthRange(selectedDate);

  const summary = getSummary(getRecordsInRange(records, start, end));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <SummaryCard
        label="Call Outs"
        value={summary.callOuts}
        description="Current month"
        icon={PhoneCall}
        danger={summary.callOuts > 0}
      />

      <SummaryCard
        label="Employees"
        value={summary.employees}
        description="Employees with activity"
        icon={Users}
      />

      <SummaryCard
        label="Hours Produced"
        value={summary.produced}
        description="Produced hours"
        icon={Clock3}
      />
    </div>
  );
}

/* =========================================================
   EMERGENCY HOURS SUMMARY
========================================================= */

function EmergencyHoursSummary({ records = [], selectedDate }) {
  const { start, end } = getMonthRange(selectedDate);

  const summary = getSummary(getRecordsInRange(records, start, end));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <SummaryCard
        label="Emergency Hours"
        value={summary.emergency}
        description="Current month"
        icon={AlertTriangle}
        danger={summary.emergency !== "0.00"}
      />

      <SummaryCard
        label="Employees"
        value={summary.employees}
        description="Employees with activity"
        icon={Users}
      />

      <SummaryCard
        label="Hours Produced"
        value={summary.produced}
        description="Produced hours"
        icon={Clock3}
      />
    </div>
  );
}

/* =========================================================
   MULTI MONTH SUMMARY
========================================================= */

function MultiMonthSummary({ records = [], selectedDate, months = 3 }) {
  const start = startOfMonth(subMonths(selectedDate, months - 1));

  const summary = getSummary(getRecordsInRange(records, start, selectedDate));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label={`${months} Month Employees`}
        value={summary.employees}
        description="Employees with activity"
        icon={Users}
      />

      <SummaryCard
        label="Hours Produced"
        value={summary.produced}
        description={`Produced hours over ${months} months`}
        icon={Clock3}
      />

      <SummaryCard
        label="Emergency Hours"
        value={summary.emergency}
        description={`Emergency hours over ${months} months`}
        icon={AlertTriangle}
        danger={summary.emergency !== "0.00"}
      />

      <SummaryCard
        label="Call Outs"
        value={summary.callOuts}
        description={`Call outs over ${months} months`}
        icon={PhoneCall}
        danger={summary.callOuts > 0}
      />
    </div>
  );
}

/* =========================================================
   YTD SUMMARY
========================================================= */

function YtdSummary({ records = [], selectedDate }) {
  const start = startOfYear(selectedDate);

  const summary = getSummary(getRecordsInRange(records, start, selectedDate));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Employees"
        value={summary.employees}
        description="Employees with activity"
        icon={Users}
      />

      <SummaryCard
        label="Hours Produced"
        value={summary.produced}
        description="Produced hours YTD"
        icon={Clock3}
      />

      <SummaryCard
        label="Emergency Hours"
        value={summary.emergency}
        description="Emergency hours YTD"
        icon={AlertTriangle}
        danger={summary.emergency !== "0.00"}
      />

      <SummaryCard
        label="Call Outs"
        value={summary.callOuts}
        description="Call outs YTD"
        icon={PhoneCall}
        danger={summary.callOuts > 0}
      />
    </div>
  );
}

/* =========================================================
   CUSTOM SUMMARY
========================================================= */

function CustomSummary({ records = [], selectedDate }) {
  /*
   * Custom date range UI can be connected
   * later. For now we keep the existing
   * selected-month behaviour.
   */

  const { start, end } = getMonthRange(selectedDate);

  const summary = getSummary(getRecordsInRange(records, start, end));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Employees"
        value={summary.employees}
        description="Employees with activity"
        icon={Users}
      />

      <SummaryCard
        label="Hours Produced"
        value={summary.produced}
        description="Produced hours"
        icon={Clock3}
      />

      <SummaryCard
        label="Emergency Hours"
        value={summary.emergency}
        description="Emergency work"
        icon={AlertTriangle}
        danger={summary.emergency !== "0.00"}
      />

      <SummaryCard
        label="Call Outs"
        value={summary.callOuts}
        description="Call outs"
        icon={PhoneCall}
        danger={summary.callOuts > 0}
      />
    </div>
  );
}

/* =========================================================
   MAIN WORKFORCE SUMMARY
========================================================= */

export default function WorkforceSummary({
  range = "week",
  records = [],
  selectedDate = new Date(),
}) {
  switch (range) {
    /* =====================================================
       WEEK
    ===================================================== */

    case "week":
      return <WeekSummary records={records} selectedDate={selectedDate} />;

    /* =====================================================
       MTD
    ===================================================== */

    case "mtd":
      return <MtdSummary records={records} selectedDate={selectedDate} />;

    /* =====================================================
       CM VS LM
    ===================================================== */

    case "cm-vs-lm":
      return <CmVsLmSummary records={records} selectedDate={selectedDate} />;

    /* =====================================================
       CALL OUTS
    ===================================================== */

    case "call-outs":
      return <CallOutSummary records={records} selectedDate={selectedDate} />;

    /* =====================================================
       EMERGENCY HOURS
    ===================================================== */

    case "emergency-hours":
      return (
        <EmergencyHoursSummary records={records} selectedDate={selectedDate} />
      );

    /* =====================================================
       3 MONTH
    ===================================================== */

    case "three-month":
      return (
        <MultiMonthSummary
          records={records}
          selectedDate={selectedDate}
          months={3}
        />
      );

    /* =====================================================
       6 MONTH
    ===================================================== */

    case "six-month":
      return (
        <MultiMonthSummary
          records={records}
          selectedDate={selectedDate}
          months={6}
        />
      );

    /* =====================================================
       YTD
    ===================================================== */

    case "ytd":
      return <YtdSummary records={records} selectedDate={selectedDate} />;

    /* =====================================================
       CUSTOM
    ===================================================== */

    case "custom":
      return <CustomSummary records={records} selectedDate={selectedDate} />;

    /* =====================================================
       DEFAULT
    ===================================================== */

    default:
      return <WeekSummary records={records} selectedDate={selectedDate} />;
  }
}
