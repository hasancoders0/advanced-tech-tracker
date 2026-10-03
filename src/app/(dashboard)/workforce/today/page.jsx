"use client";

import { useState } from "react";

import DailyDateNavigator from "@/components/daily/DailyDateNavigator";
import WorkforceDailyView from "@/components/workforce/WorkforceEntryTable";

export default function WorkforcePage() {
  const [date, setDate] = useState("2026-09-30");

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0877aa]">
              Workforce
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Today's Work
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage technician work hours for the selected date.
            </p>
          </div>

          <DailyDateNavigator
            selectedDate={selectedDate}
            onChange={setSelectedDate}
          />
        </div>
      </section>

      <WorkforceDailyView />
    </div>
  );
}
