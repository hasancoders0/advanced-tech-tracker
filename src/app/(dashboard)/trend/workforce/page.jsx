"use client";

import { useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  addYears,
  subDays,
  subMonths,
  subYears,
} from "date-fns";

import PageHeader from "@/components/common/PageHeader";

import TrendRangeTabs from "@/components/trend/common/TrendRangeTabs";
import TrendViewSwitcher from "@/components/trend/common/TrendViewSwitcher";
import TrendPeriodNavigator from "@/components/trend/common/TrendPeriodNavigator";
import TrendChartView from "@/components/trend/common/TrendChartView";

import WorkforceSummary from "@/components/trend/workforce/WorkforceSummary";
import WorkforceExceptionSummary from "@/components/trend/workforce/WorkforceExceptionSummary";
import WorkforceWeekTable from "@/components/trend/workforce/WorkforceWeekTable";

import workforceData from "@/data/workforce/workforce-daily";

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

const MONTH_RANGES = new Set([
  "mtd",
  "cm-vs-lm",
  "call-outs",
  "emergency-hours",
  "three-month",
  "six-month",
]);

function formatMonth(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatShortMonth(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function getPeriodLabel(range, selectedDate, weekLabel) {
  switch (range) {
    case "week":
      return weekLabel;

    case "mtd":
    case "call-outs":
    case "emergency-hours":
      return formatMonth(selectedDate);

    case "cm-vs-lm":
      return `${formatShortMonth(subMonths(selectedDate, 1))} vs ${formatShortMonth(
        selectedDate,
      )}`;

    case "three-month":
      return `${formatShortMonth(subMonths(selectedDate, 2))} - ${formatShortMonth(
        selectedDate,
      )}`;

    case "six-month":
      return `${formatShortMonth(subMonths(selectedDate, 5))} - ${formatShortMonth(
        selectedDate,
      )}`;

    case "ytd":
      return String(selectedDate.getFullYear());

    case "custom":
      return weekLabel;

    default:
      return weekLabel;
  }
}

function getPeriodLabelTitle(range) {
  switch (range) {
    case "week":
      return "Week Of";

    case "mtd":
    case "call-outs":
    case "emergency-hours":
      return "Month";

    case "cm-vs-lm":
      return "Month Comparison";

    case "three-month":
      return "3 Month Period";

    case "six-month":
      return "6 Month Period";

    case "ytd":
      return "Year";

    case "custom":
      return "Custom Range";

    default:
      return "Selected Period";
  }
}

export default function WorkforceTrendPage() {
  const latestDate = useMemo(
    () => getLatestDataDate(workforceData),
    [],
  );

  const [range, setRange] = useState("week");
  const [view, setView] = useState("list");
  const [selectedDate, setSelectedDate] = useState(latestDate);

  const weekDates = useMemo(
    () => getWeekDates(selectedDate),
    [selectedDate],
  );

  const weekLabel = useMemo(() => {
    if (!weekDates.length) return "";

    return `${formatDisplayDate(weekDates[0].date)} - ${formatDisplayDate(
      weekDates[weekDates.length - 1].date,
    )}`;
  }, [weekDates]);

  const periodLabel = useMemo(
    () => getPeriodLabel(range, selectedDate, weekLabel),
    [range, selectedDate, weekLabel],
  );

  const periodLabelTitle = useMemo(
    () => getPeriodLabelTitle(range),
    [range],
  );

  const chartData = useMemo(() => {
    return weekDates.map(({ name, date }) => {
      const record = getDailyRecord(workforceData, date);

      const producedMinutes = getRecordEntries(record).reduce(
        (total, entry) =>
          total + timeCodeToMinutes(getProducedHours(entry)),
        0,
      );

      return {
        label: name.slice(0, 3),
        produced: Number((producedMinutes / 60).toFixed(2)),
      };
    });
  }, [weekDates]);

  function movePeriod(direction) {
    const next = direction === "next";

    switch (range) {
      case "week": {
        const weekStart = getWeekStart(selectedDate);

        setSelectedDate(
          next
            ? addDays(weekStart, 7)
            : subDays(weekStart, 7),
        );

        break;
      }

      case "mtd":
      case "cm-vs-lm":
      case "call-outs":
      case "emergency-hours":
      case "three-month":
      case "six-month":
        setSelectedDate(
          next
            ? addMonths(selectedDate, 1)
            : subMonths(selectedDate, 1),
        );
        break;

      case "ytd":
        setSelectedDate(
          next
            ? addYears(selectedDate, 1)
            : subYears(selectedDate, 1),
        );
        break;

      case "custom":
        break;

      default:
        break;
    }
  }

  function handleRangeChange(nextRange) {
    setRange(nextRange);
    setSelectedDate(latestDate);
  }

  function goLatest() {
    setSelectedDate(latestDate);
  }

  const disableNext = useMemo(() => {
    if (!latestDate || !selectedDate) return false;

    switch (range) {
      case "week":
        return (
          getWeekStart(selectedDate) >=
          getWeekStart(latestDate)
        );

      case "mtd":
      case "cm-vs-lm":
      case "call-outs":
      case "emergency-hours":
        return (
          selectedDate.getFullYear() ===
            latestDate.getFullYear() &&
          selectedDate.getMonth() === latestDate.getMonth()
        );

      case "three-month":
      case "six-month":
        return selectedDate >= latestDate;

      case "ytd":
        return (
          selectedDate.getFullYear() >=
          latestDate.getFullYear()
        );

      case "custom":
        return true;

      default:
        return false;
    }
  }, [range, selectedDate, latestDate]);

  function renderContent() {
    if (
      range === "call-outs" ||
      range === "emergency-hours"
    ) {
      return (
        <WorkforceExceptionSummary
          type={range}
          records={workforceData}
          selectedDate={selectedDate}
        />
      );
    }

    if (range === "week" && view === "list") {
      return (
        <WorkforceWeekTable
          records={workforceData}
          weekDates={weekDates}
        />
      );
    }

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
        title={
          range === "week"
            ? "Workforce Weekly Trend"
            : "Workforce Trend"
        }
        description="Produced hours calculated from daily workforce records."
      />
    );
  }

  const showSummary =
    range !== "call-outs" &&
    range !== "emergency-hours";

  return (
    <div className="space-y-5">
      <PageHeader
        title="Workforce Trend"
        description="Review historical workforce performance from daily records."
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <TrendRangeTabs
          value={range}
          onChange={handleRangeChange}
          module="workforce"
        />

        <TrendViewSwitcher
          value={view}
          onChange={setView}
        />
      </div>

      <TrendPeriodNavigator
        label={periodLabelTitle}
        periodLabel={periodLabel}
        onPrevious={() => movePeriod("previous")}
        onNext={() => movePeriod("next")}
        onToday={goLatest}
        disableNext={disableNext}
      />

      {showSummary && (
        <WorkforceSummary
          range={range}
          records={workforceData}
          selectedDate={selectedDate}
        />
      )}

      {renderContent()}
    </div>
  );
}