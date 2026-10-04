"use client";

import { useMemo, useState } from "react";

import DailySummary from "@/components/daily/DailySummary";
import DailyDateNavigator from "@/components/daily/DailyDateNavigator";
import WorkforceEntryTable from "@/components/workforce/WorkforceEntryTable";

import {
  workforceData,
} from "@/data/workforce/workforce-daily";

/* =========================================================
   DATE HELPERS
========================================================= */

function formatDateForData(date) {
  if (!date) {
    return "";
  }

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================================================
   TIME CODE HELPERS

   "8.30" = 8 hours 30 minutes
   "8.45" = 8 hours 45 minutes
   "0.30" = 30 minutes

   We NEVER treat these values as normal decimals.
========================================================= */

function timeCodeToMinutes(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return 0;
  }

  const text = String(value).trim();

  if (!text) {
    return 0;
  }

  const parts = text.split(".");

  const hours =
    Number(parts[0]) || 0;

  const minutes =
    Number(parts[1] || 0);

  return (
    hours * 60 +
    minutes
  );
}

function minutesToTimeCode(
  totalMinutes
) {
  const safeMinutes = Math.max(
    0,
    Math.round(
      Number(totalMinutes) || 0
    )
  );

  const hours = Math.floor(
    safeMinutes / 60
  );

  const minutes =
    safeMinutes % 60;

  return `${hours}.${String(
    minutes
  ).padStart(2, "0")}`;
}

/* =========================================================
   GET DAILY RECORD
========================================================= */

function getDailyRecord(dateKey) {
  if (!Array.isArray(workforceData)) {
    return null;
  }

  return (
    workforceData.find(
      (record) =>
        record?.date === dateKey
    ) || null
  );
}

/* =========================================================
   GET DAILY ENTRIES
========================================================= */

function getDailyEntries(dateKey) {
  const record =
    getDailyRecord(dateKey);

  if (
    !record ||
    !Array.isArray(record.entries)
  ) {
    return [];
  }

  return record.entries;
}

/* =========================================================
   PAGE
========================================================= */

export default function WorkforcePage() {
  const [selectedDate, setSelectedDate] =
    useState(() => {
      const today = new Date();

      today.setHours(
        12,
        0,
        0,
        0
      );

      return today;
    });

  /* =======================================================
     SELECTED DATE KEY
  ======================================================= */

  const selectedDateKey =
    useMemo(
      () =>
        formatDateForData(
          selectedDate
        ),
      [selectedDate]
    );

  /* =======================================================
     DAILY ENTRIES
  ======================================================= */

  const dailyEntries =
    useMemo(
      () =>
        getDailyEntries(
          selectedDateKey
        ),
      [selectedDateKey]
    );

  /* =======================================================
     WORKFORCE SUMMARY

     IMPORTANT:
     The mock data uses time-code strings.

     Example:
     "8.30" = 8h 30m

     Therefore all calculations happen
     in minutes and are converted back
     to HH.MM at the end.
  ======================================================= */

  const workforceTotals =
    useMemo(() => {
      let employees = 0;

      let producedMinutes = 0;

      let workedMinutes = 0;

      let emergencyMinutes = 0;

      dailyEntries.forEach(
        (entry) => {
          const status =
            entry?.entryStatus ??
            entry?.status ??
            "";

          /* ---------------------------------------------
             Employees
          --------------------------------------------- */

          if (status === "Worked") {
            employees += 1;
          }

          /* ---------------------------------------------
             Hours Produced
          --------------------------------------------- */

          producedMinutes +=
            timeCodeToMinutes(
              entry?.hoursProduced
            );

          /* ---------------------------------------------
             Hours Worked
          --------------------------------------------- */

          workedMinutes +=
            timeCodeToMinutes(
              entry?.hoursWorked
            );

          /* ---------------------------------------------
             Emergency Hours
          --------------------------------------------- */

          emergencyMinutes +=
            timeCodeToMinutes(
              entry?.emergencyHours
            );
        }
      );

      return {
        employees,

        produced:
          minutesToTimeCode(
            producedMinutes
          ),

        worked:
          minutesToTimeCode(
            workedMinutes
          ),

        emergency:
          minutesToTimeCode(
            emergencyMinutes
          ),
      };
    }, [dailyEntries]);

  return (
    <div className="space-y-4">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600">
          Workforce
        </div>

        <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          Today's Work
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View workforce hours and technician activity by date.
        </p>
      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <DailySummary
        activeTab="work"
        workforceTotals={{
          employees:
            workforceTotals.employees,

          produced:
            workforceTotals.produced,

          worked:
            workforceTotals.worked,

          emergency:
            workforceTotals.emergency,
        }}
      />

      {/* =====================================================
          DATE NAVIGATION
      ===================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <DailyDateNavigator
          selectedDate={selectedDate}
          onDateChange={
            setSelectedDate
          }
        />
      </div>

      {/* =====================================================
          WORKFORCE TABLE

          VIEW ONLY
      ===================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <WorkforceEntryTable
          selectedDate={selectedDate}
          entriesVisible={true}
          readOnly={true}
          lastEditedBy="Roberta Christie"
          lastEditedAt="4:39 AM"
        />
      </div>
    </div>
  );
}