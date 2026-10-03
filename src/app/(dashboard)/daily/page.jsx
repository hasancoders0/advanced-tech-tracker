"use client";

import { useState } from "react";

import DailyTabs from "@/components/daily/DailyTabs";
import DailyStats from "@/components/daily/DailyStats";
import DailyEntriesSection from "@/components/daily/DailyEntriesSection";

export default function DailyPage() {
  const [activeTab, setActiveTab] = useState("work");

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();

    today.setHours(12, 0, 0, 0);

    return today;
  });

  const [workforceTotals, setWorkforceTotals] = useState({
    employees: 0,
    produced: 0,
    worked: 0,
    emergency: 0,
  });

  const [salesTotals, setSalesTotals] = useState({
    count: 0,
    revenue: 0,
  });

  return (
    <div className="space-y-4">
      {/* =====================================================
          TOP SECTION
          LEFT  = PAGE TITLE + TABS
          RIGHT = SUMMARY CARDS
      ===================================================== */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(320px,0.8fr)_minmax(760px,1.7fr)] xl:items-start">
        {/* =================================================
            LEFT SIDE
        ================================================= */}
        <div className="min-w-0">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600">
              Daily Operations
            </div>

            <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Today's Work & Sales
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Enter and manage daily workforce hours and sales.
            </p>
          </div>

          {/* TABS */}
          <div className="mt-4">
            <DailyTabs activeTab={activeTab} onChange={setActiveTab} />
          </div>
        </div>

        {/* =================================================
            RIGHT SIDE — SUMMARY CARDS
        ================================================= */}
        <div className="min-w-0">
          <DailyStats
            activeTab={activeTab}
            workforceTotals={workforceTotals}
            salesTotals={salesTotals}
          />
        </div>
      </div>

      {/* =====================================================
          DAILY ENTRIES
      ===================================================== */}
      <DailyEntriesSection
        activeTab={activeTab}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onTotalsChange={setWorkforceTotals}
        onSalesTotalsChange={setSalesTotals}
      />
    </div>
  );
}
