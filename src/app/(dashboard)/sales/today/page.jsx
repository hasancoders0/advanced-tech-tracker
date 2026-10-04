"use client";

import { useMemo, useState } from "react";

import DailySummary from "@/components/daily/DailySummary";
import DailyDateNavigator from "@/components/daily/DailyDateNavigator";
import SalesEntryTable from "@/components/sales/SalesEntryTable";

import salesData from "@/data/sales/sales-daily";

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
   SALES DATA HELPERS
========================================================= */

function getSalesRecords() {
  if (!Array.isArray(salesData)) {
    return [];
  }

  return salesData;
}

/* =========================================================
   GET SALE DATE
========================================================= */

function getSaleDate(sale) {
  return (
    sale?.date ??
    sale?.saleDate ??
    sale?.createdDate ??
    sale?.createdAt?.split("T")[0] ??
    ""
  );
}

/* =========================================================
   GET SALE TOTAL
========================================================= */

function getSaleTotal(sale) {
  const possibleValues = [
    sale?.total,
    sale?.totalAmount,
    sale?.grandTotal,
    sale?.amount,
    sale?.revenue,
  ];

  for (const value of possibleValues) {
    if (
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      const number = Number(value);

      if (Number.isFinite(number)) {
        return number;
      }
    }
  }

  return 0;
}

/* =========================================================
   GET PAYMENT STATUS
========================================================= */

function getPaymentStatus(sale) {
  return String(
    sale?.paymentStatus ??
      sale?.status ??
      ""
  ).toLowerCase();
}

/* =========================================================
   PAGE
========================================================= */

export default function SalesTodayPage() {
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
     FILTER SALES BY DATE
  ======================================================= */

  const dailySales =
    useMemo(() => {
      const records =
        getSalesRecords();

      return records.filter(
        (sale) =>
          getSaleDate(sale) ===
          selectedDateKey
      );
    }, [selectedDateKey]);

  /* =======================================================
     SALES SUMMARY
  ======================================================= */

  const salesTotals =
    useMemo(() => {
      const count =
        dailySales.length;

      const revenue =
        dailySales.reduce(
          (total, sale) =>
            total +
            getSaleTotal(sale),
          0
        );

      const averageSale =
        count > 0
          ? revenue / count
          : 0;

      const pending =
        dailySales.filter(
          (sale) => {
            const status =
              getPaymentStatus(
                sale
              );

            return (
              status ===
                "pending" ||
              status ===
                "unpaid" ||
              status ===
                "partial" ||
              status ===
                "partially paid"
            );
          }
        ).length;

      return {
        count,
        revenue,
        averageSale,
        pending,
      };
    }, [dailySales]);

  return (
    <div className="space-y-4">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600">
          Sales
        </div>

        <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          Today's Sales
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View sales activity and revenue by date.
        </p>
      </div>

      {/* =====================================================
          SALES SUMMARY
      ===================================================== */}

      <DailySummary
        activeTab="sales"
        salesTotals={{
          count:
            salesTotals.count,

          revenue:
            salesTotals.revenue,

          averageSale:
            salesTotals.averageSale,

          pending:
            salesTotals.pending,
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
          SALES TABLE

          VIEW ONLY
      ===================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <SalesEntryTable
          selectedDate={selectedDate}
          readOnly={true}
        />
      </div>
    </div>
  );
}