"use client";

import { useMemo } from "react";

import PageHeader from "@/components/common/PageHeader";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

import workforceData from "@/data/workforce/workforce-daily";
import salesData from "@/data/sales/sales-daily";

import {
  format,
  parseISO,
} from "date-fns";

import {
  getRecordDate,
  getRecordEntries,
  getEntryDepartment,
  getProducedHours,
  getWorkedHours,
  getEmergencyHours,
  getStatus,
  timeCodeToMinutes,
  minutesToTimeCode,
} from "@/lib/trend/trend-utils";

function getTodayKey() {
  return format(new Date(), "yyyy-MM-dd");
}

function getSaleDate(sale) {
  return (
    sale?.date ||
    sale?.saleDate ||
    sale?.createdDate ||
    sale?.createdAt ||
    null
  );
}

function getSaleTotal(sale) {
  return Number(
    sale?.total ??
      sale?.totalAmount ??
      sale?.grandTotal ??
      sale?.amount ??
      sale?.revenue ??
      0,
  );
}

function isPendingSale(sale) {
  const status = String(
    sale?.paymentStatus ||
      sale?.status ||
      "",
  ).toLowerCase();

  return [
    "pending",
    "unpaid",
    "partial",
    "partially paid",
  ].includes(status);
}

export default function DashboardPage() {
  const todayKey = useMemo(
    () => getTodayKey(),
    [],
  );

  /* =======================================================
     TODAY'S WORKFORCE RECORD
  ======================================================= */

  const todayWorkforce = useMemo(() => {
    return workforceData.find(
      (record) =>
        getRecordDate(record) === todayKey,
    );
  }, [todayKey]);

  const workforceEntries = useMemo(() => {
    return getRecordEntries(
      todayWorkforce,
    );
  }, [todayWorkforce]);

  /* =======================================================
     WORKFORCE STATS
  ======================================================= */

  const workforceStats = useMemo(() => {
    const employees = new Set();

    let producedMinutes = 0;
    let workedMinutes = 0;
    let emergencyMinutes = 0;

    workforceEntries.forEach((entry) => {
      const status = String(
        getStatus(entry),
      ).toLowerCase();

      if (
        !status.includes("call") &&
        !status.includes("out")
      ) {
        const id =
          entry?.employeeId ||
          entry?.technicianId ||
          entry?.id;

        if (id) {
          employees.add(id);
        }
      }

      producedMinutes += timeCodeToMinutes(
        getProducedHours(entry),
      );

      workedMinutes += timeCodeToMinutes(
        getWorkedHours(entry),
      );

      emergencyMinutes += timeCodeToMinutes(
        getEmergencyHours(entry),
      );
    });

    return {
      employees: employees.size,
      produced:
        minutesToTimeCode(
          producedMinutes,
        ),
      worked:
        minutesToTimeCode(
          workedMinutes,
        ),
      emergency:
        minutesToTimeCode(
          emergencyMinutes,
        ),
    };
  }, [workforceEntries]);

  /* =======================================================
     SALES TODAY
  ======================================================= */

  const todaySales = useMemo(() => {
    if (!Array.isArray(salesData)) {
      return [];
    }

    return salesData.filter(
      (sale) =>
        getSaleDate(sale) === todayKey,
    );
  }, [todayKey]);

  const salesStats = useMemo(() => {
    const revenue = todaySales.reduce(
      (total, sale) =>
        total + getSaleTotal(sale),
      0,
    );

    const outstanding = todaySales
      .filter(isPendingSale)
      .reduce(
        (total, sale) =>
          total + getSaleTotal(sale),
        0,
      );

    return {
      count: todaySales.length,
      revenue,
      average:
        todaySales.length > 0
          ? revenue / todaySales.length
          : 0,
      outstanding,
    };
  }, [todaySales]);

  /* =======================================================
     WORKFORCE CHART
  ======================================================= */

  const workforceChartData = useMemo(() => {
    return workforceData
      .slice(-7)
      .map((record) => {
        const entries =
          getRecordEntries(record);

        let produced = 0;
        let worked = 0;

        entries.forEach((entry) => {
          produced += timeCodeToMinutes(
            getProducedHours(entry),
          );

          worked += timeCodeToMinutes(
            getWorkedHours(entry),
          );
        });

        const date =
          getRecordDate(record);

        return {
          label: date
            ? format(
                parseISO(date),
                "MMM d",
              )
            : "—",
          produced: Number(
            (
              produced / 60
            ).toFixed(2),
          ),
          worked: Number(
            (
              worked / 60
            ).toFixed(2),
          ),
        };
      });
  }, []);

  /* =======================================================
     SALES CHART
  ======================================================= */

  const salesChartData = useMemo(() => {
    if (!Array.isArray(salesData)) {
      return [];
    }

    const grouped = new Map();

    salesData.forEach((sale) => {
      const date =
        getSaleDate(sale);

      if (!date) {
        return;
      }

      const key = String(date).slice(
        0,
        10,
      );

      grouped.set(
        key,
        (grouped.get(key) || 0) +
          getSaleTotal(sale),
      );
    });

    return Array.from(
      grouped.entries(),
    )
      .sort(([a], [b]) =>
        a.localeCompare(b),
      )
      .slice(-7)
      .map(([date, revenue]) => ({
        label: format(
          parseISO(date),
          "MMM d",
        ),
        revenue: Number(
          revenue.toFixed(2),
        ),
      }));
  }, []);

  /* =======================================================
     DEPARTMENT PERFORMANCE
  ======================================================= */

  const departmentData = useMemo(() => {
    const departments = new Map();

    workforceEntries.forEach((entry) => {
      const department =
        getEntryDepartment(entry) ||
        "General";

      const produced =
        timeCodeToMinutes(
          getProducedHours(entry),
        );

      if (!departments.has(department)) {
        departments.set(
          department,
          0,
        );
      }

      departments.set(
        department,
        departments.get(
          department,
        ) + produced,
      );
    });

    return Array.from(
      departments.entries(),
    )
      .map(
        ([
          department,
          minutes,
        ]) => ({
          department,
          produced: Number(
            (
              minutes / 60
            ).toFixed(2),
          ),
        }),
      )
      .sort(
        (a, b) =>
          b.produced -
          a.produced,
      );
  }, [workforceEntries]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        description="Overview of today's workforce and sales performance."
      />

      <DashboardOverview
        workforceStats={
          workforceStats
        }
        salesStats={
          salesStats
        }
        workforceChartData={
          workforceChartData
        }
        salesChartData={
          salesChartData
        }
        departmentData={
          departmentData
        }
      />
    </div>
  );
}