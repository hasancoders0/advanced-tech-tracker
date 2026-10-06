"use client";

import { useMemo, useState } from "react";

import PageHeader from "@/components/common/PageHeader";

import TrendRangeTabs from "@/components/trend/common/TrendRangeTabs";
import TrendViewSwitcher from "@/components/trend/common/TrendViewSwitcher";
import TrendPeriodNavigator from "@/components/trend/common/TrendPeriodNavigator";
import TrendChartView from "@/components/trend/common/TrendChartView";

import WorkforceSummary from "@/components/trend/workforce/WorkforceSummary";
import WorkforceWeekTable from "@/components/trend/workforce/WorkforceWeekTable";

import workforceData from "@/data/workforce/workforce-daily";

import { addDays, subDays } from "date-fns";

import {
  formatDisplayDate,
  getLatestDataDate,
  getWeekDates,
  getDailyRecord,
  getRecordEntries,
  getProducedHours,
  timeCodeToMinutes,
  getWeekStart,
} from "@/lib/trend/trend-utils";

export default function WorkforceTrendPage() {
  /* =======================================================
     LATEST DATA DATE
  ======================================================= */

  const latestDate = useMemo(() => getLatestDataDate(workforceData), []);

  /* =======================================================
     STATE
  ======================================================= */

  const [range, setRange] = useState("week");

  const [view, setView] = useState("list");

  const [selectedDate, setSelectedDate] = useState(latestDate);

  /* =======================================================
     WEEK DATES
  ======================================================= */

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  /* =======================================================
     WEEK LABEL
  ======================================================= */

  const weekLabel = useMemo(() => {
    if (!weekDates.length) {
      return "";
    }

    return `${formatDisplayDate(weekDates[0].date)} - ${formatDisplayDate(
      weekDates[weekDates.length - 1].date,
    )}`;
  }, [weekDates]);

  /* =======================================================
     CHART DATA
  ======================================================= */

  const chartData = useMemo(() => {
    return weekDates.map(({ name, date }) => {
      const record = getDailyRecord(workforceData, date);

      let produced = 0;

      getRecordEntries(record).forEach((entry) => {
        produced += timeCodeToMinutes(getProducedHours(entry));
      });

      return {
        label: name.slice(0, 3),

        produced: Number((produced / 60).toFixed(2)),
      };
    });
  }, [weekDates]);

  /* =======================================================
     WEEK NAVIGATION
  ======================================================= */

  function moveWeek(direction) {
    const currentStart = getWeekStart(selectedDate);

    setSelectedDate(
      direction === "next"
        ? addDays(currentStart, 7)
        : subDays(currentStart, 7),
    );
  }

  /* =======================================================
     GO TO LATEST DATA
  ======================================================= */

  function goLatest() {
    setSelectedDate(latestDate);
  }

  /* =======================================================
     REPORT CONTENT
  ======================================================= */

  function renderContent() {
    /*
     * WEEK + LIST
     *
     * Keep the existing workforce
     * table exactly as it is.
     */

    if (range === "week" && view === "list") {
      return (
        <WorkforceWeekTable records={workforceData} weekDates={weekDates} />
      );
    }

    /*
     * Other chart views use the
     * existing common TrendChartView.
     */

    return (
      <TrendChartView
        view={view}
        data={chartData}
        xKey="label"
        series={[
          {
            dataKey: "produced",
            label: "Produced Hours",
          },
        ]}
        title="Workforce Weekly Trend"
        description="Produced hours calculated from daily workforce records."
      />
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="space-y-5">
      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <PageHeader
        title="Workforce Trend"
        description="Review historical workforce performance from daily records."
      />

      {/* ===================================================
          RANGE TABS + VIEW SWITCHER
      =================================================== */}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <TrendRangeTabs value={range} onChange={setRange} module="workforce" />

        <TrendViewSwitcher value={view} onChange={setView} />
      </div>

      {/* ===================================================
          PERIOD NAVIGATOR
      =================================================== */}

      <TrendPeriodNavigator
        label={range === "week" ? "Week Of" : "Selected Period"}
        periodLabel={range === "week" ? weekLabel : weekLabel}
        onPrevious={() => moveWeek("previous")}
        onNext={() => moveWeek("next")}
        onToday={goLatest}
        disableNext={false}
      />

      {/* ===================================================
          RANGE-SPECIFIC SUMMARY
      =================================================== */}

      <WorkforceSummary
        range={range}
        records={workforceData}
        selectedDate={selectedDate}
      />

      {/* ===================================================
          CONTENT
      =================================================== */}

      {renderContent()}
    </div>
  );
}
