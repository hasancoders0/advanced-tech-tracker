"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  Printer,
  Receipt,
  Trash2,
  User,
  Wrench,
  CreditCard,
  FileText,
} from "lucide-react";

import SaleEntryForm from "@/components/sales/SaleEntryForm";
import SaleReceipt from "@/components/sales/SaleReceipt";

import salesDailyData from "@/data/sales/sales-daily";

/* =========================================================
   HELPERS
   ========================================================= */

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDateKey(date) {
  if (!date) return "";

  if (date instanceof Date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  }

  return String(date).slice(0, 10);
}

function getSaleDate(sale) {
  if (sale.date) {
    return String(sale.date).slice(0, 10);
  }

  if (sale.createdAt) {
    return String(sale.createdAt).slice(0, 10);
  }

  return "";
}

/* =========================================================
   NORMALIZE MOCK DATA
   ========================================================= */

function normalizeSale(sale) {
  const isService = sale.type === "service";

  return {
    ...sale,

    id: sale.id,

    date: sale.date || getSaleDate(sale),

    type: sale.type || "product",

    customerId: sale.customerId || "",
    customerName:
      sale.customerName ||
      sale.customer ||
      "",

    customer:
      sale.customer ||
      sale.customerName ||
      "Customer not selected",

    itemId: sale.itemId || "",

    itemName:
      sale.itemName ||
      sale.item ||
      "",

    item:
      sale.item ||
      sale.itemName ||
      (isService ? "Service not selected" : "Product not selected"),

    serviceId: sale.serviceId || "",
    serviceName:
      sale.serviceName ||
      (isService ? sale.item || "" : ""),

    quantity: sale.quantity ?? 1,

    unitPrice: Number(sale.unitPrice || 0),

    discount: Number(sale.discount || 0),

    tax: Number(sale.tax || 0),

    serviceCharge: Number(
      sale.serviceCharge ??
        (isService ? sale.unitPrice : 0)
    ),

    equipmentTotal: Number(sale.equipmentTotal || 0),

    total: Number(sale.total || 0),

    paymentStatus:
      sale.paymentStatus || "Pending",

    paymentMethod:
      sale.paymentMethod || "Cash",

    salespersonId:
      sale.salespersonId || "",

    salespersonName:
      sale.salespersonName ||
      sale.salesperson ||
      "",

    salesperson:
      sale.salesperson ||
      sale.salespersonName ||
      "—",

    technicianId:
      sale.technicianId || "",

    technicianName:
      sale.technicianName ||
      sale.technician ||
      "",

    technician:
      sale.technician ||
      sale.technicianName ||
      "",

    notes: sale.notes || "",

    equipment: Array.isArray(sale.equipment)
      ? sale.equipment
      : [],

    createdAt:
      sale.createdAt ||
      `${sale.date || getSaleDate(sale)}T12:00:00`,
  };
}

function getStatusClasses(status) {
  switch (status) {
    case "Paid":
      return "border-emerald-100 bg-emerald-50 text-emerald-700";

    case "Partial":
      return "border-amber-100 bg-amber-50 text-amber-700";

    case "Overdue":
      return "border-red-100 bg-red-50 text-red-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function getTypeClasses(type) {
  if (type === "service") {
    return "border-violet-100 bg-violet-50 text-violet-700";
  }

  return "border-sky-100 bg-sky-50 text-sky-700";
}

/* =========================================================
   ACTION MENU
   ========================================================= */

function ActionMenu({
  sale,
  onPrint,
  onEdit,
  onDelete,
  readOnly = false,
}) {
  const [open, setOpen] = useState(false);

  function handleAction(callback) {
    setOpen(false);
    callback(sale);
  }

  return (
    <div className="relative">
      <button
        type="button"
        title="More actions"
        aria-label="More actions"
        onClick={() => setOpen((value) => !value)}
        className={[
          "flex h-8 w-8 items-center justify-center rounded-lg",
          "border border-transparent text-slate-400",
          "transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700",
          open
            ? "border-slate-200 bg-slate-50 text-slate-700"
            : "",
        ].join(" ")}
      >
        <MoreHorizontal size={17} />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close action menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
            <button
              type="button"
              onClick={() => handleAction(onPrint)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <Printer size={14} />
              Print Receipt
            </button>

            {!readOnly && (
              <>
                <button
                  type="button"
                  onClick={() => handleAction(onEdit)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <Pencil size={14} />
                  Edit Sale
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={() => handleAction(onDelete)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Delete Sale
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function SalesEntryTable({
  selectedDate,
  entriesVisible = true,
  readOnly = false,
  onSalesTotalsChange,
}) {
  /* =======================================================
     SALES STATE

     The source is now:
     src/data/sales/sales-daily.js
     ======================================================= */

  const [sales, setSales] = useState(() =>
    salesDailyData.map(normalizeSale)
  );

  const [showEntries, setShowEntries] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingSale, setEditingSale] = useState(null);

  const [receiptSale, setReceiptSale] = useState(null);

  const [expandedSaleId, setExpandedSaleId] =
    useState(null);

  /* =======================================================
     DATE FILTER
     ======================================================= */

  const selectedDateKey = useMemo(() => {
    return getDateKey(selectedDate);
  }, [selectedDate]);

  const visibleSales = useMemo(() => {
    if (!selectedDateKey) {
      return sales;
    }

    return sales.filter((sale) => {
      return getSaleDate(sale) === selectedDateKey;
    });
  }, [sales, selectedDateKey]);

  /* =======================================================
     SALES SUMMARY

     This is the single source of truth for:
     - Sales
     - Revenue
     - Average Sale
     - Pending
     ======================================================= */

  const summary = useMemo(() => {
    const total = visibleSales.reduce(
      (sum, sale) =>
        sum + Number(sale.total || 0),
      0
    );

    const pending = visibleSales.filter(
      (sale) =>
        sale.paymentStatus === "Pending"
    ).length;

    const paid = visibleSales.filter(
      (sale) =>
        sale.paymentStatus === "Paid"
    ).length;

    const serviceCount = visibleSales.filter(
      (sale) =>
        sale.type === "service"
    ).length;

    const productCount = visibleSales.filter(
      (sale) =>
        sale.type === "product"
    ).length;

    const averageSale =
      visibleSales.length > 0
        ? total / visibleSales.length
        : 0;

    return {
      count: visibleSales.length,

      sales: visibleSales.length,

      revenue: total,

      total,

      averageSale,

      average: averageSale,

      pending,

      pendingSales: pending,

      paid,

      productCount,

      serviceCount,
    };
  }, [visibleSales]);

  /* =======================================================
     SEND SALES SUMMARY TO DAILY PAGE

     Workforce and Sales remain independent.
     ======================================================= */

  useEffect(() => {
    if (!onSalesTotalsChange) {
      return;
    }

    onSalesTotalsChange({
      type: "sales",

      count: summary.count,

      sales: summary.sales,

      revenue: summary.revenue,

      total: summary.total,

      averageSale: summary.averageSale,

      average: summary.average,

      pending: summary.pending,

      pendingSales: summary.pendingSales,

      paid: summary.paid,

      productCount: summary.productCount,

      serviceCount: summary.serviceCount,
    });
  }, [
    summary,
    onSalesTotalsChange,
  ]);

  /* =======================================================
     EDIT SALE
     ======================================================= */

  function handleEditSale(sale) {
    if (readOnly) {
      return;
    }

    setEditingSale({
      ...sale,

      customerId:
        sale.customerId || "",

      customerName:
        sale.customerName ||
        sale.customer ||
        "",

      itemId:
        sale.itemId || "",

      itemName:
        sale.itemName ||
        (sale.type === "product"
          ? sale.item
          : ""),

      serviceId:
        sale.serviceId || "",

      serviceName:
        sale.serviceName ||
        (sale.type === "service"
          ? sale.item
          : ""),

      salespersonId:
        sale.salespersonId || "",

      salespersonName:
        sale.salespersonName ||
        sale.salesperson ||
        "",

      technicianId:
        sale.technicianId || "",

      technicianName:
        sale.technicianName ||
        sale.technician ||
        "",

      quantity:
        sale.quantity ?? 1,

      unitPrice:
        sale.unitPrice ?? 0,

      serviceCharge:
        sale.serviceCharge ??
        sale.unitPrice ??
        0,

      discount:
        sale.discount ?? 0,

      tax:
        sale.tax ?? 0,

      paymentMethod:
        sale.paymentMethod ||
        "Cash",

      paymentStatus:
        sale.paymentStatus ||
        "Pending",

      notes:
        sale.notes || "",

      equipment:
        Array.isArray(sale.equipment)
          ? sale.equipment
          : [],
    });

    setShowForm(true);
  }

  /* =======================================================
     CREATE DATE/TIME
     ======================================================= */

  function createSaleDate() {
    const baseDate = selectedDate
      ? new Date(selectedDate)
      : new Date();

    if (Number.isNaN(baseDate.getTime())) {
      return new Date().toISOString();
    }

    const now = new Date();

    baseDate.setHours(
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    );

    return baseDate.toISOString();
  }

  /* =======================================================
     SAVE SALE
     ======================================================= */

  function handleSave(payload) {
    const saleId =
      editingSale?.id ||
      payload.id ||
      `sale-${Date.now()}`;

    const isProduct =
      payload.type === "product";

    const saleDate =
      editingSale?.date ||
      payload.date ||
      selectedDateKey ||
      getDateKey(new Date());

    const newSale = normalizeSale({
      id: saleId,

      date: saleDate,

      type:
        payload.type ||
        "product",

      customerId:
        payload.customerId ||
        "",

      customerName:
        payload.customerName ||
        "",

      customer:
        payload.customerName ||
        payload.customerId ||
        "Customer not selected",

      itemId:
        isProduct
          ? payload.itemId || ""
          : "",

      itemName:
        isProduct
          ? payload.itemName || ""
          : "",

      item:
        isProduct
          ? payload.itemName ||
            payload.itemId ||
            "Product not selected"
          : payload.serviceName ||
            payload.serviceId ||
            "Service not selected",

      serviceId:
        !isProduct
          ? payload.serviceId || ""
          : "",

      serviceName:
        !isProduct
          ? payload.serviceName || ""
          : "",

      quantity:
        payload.quantity || 1,

      unitPrice:
        payload.unitPrice || 0,

      serviceCharge:
        payload.serviceCharge || 0,

      discount:
        payload.discount || 0,

      tax:
        payload.tax || 0,

      total:
        payload.total || 0,

      paymentStatus:
        payload.paymentStatus ||
        "Pending",

      paymentMethod:
        payload.paymentMethod ||
        "Cash",

      salespersonId:
        payload.salespersonId ||
        "",

      salespersonName:
        payload.salespersonName ||
        "",

      salesperson:
        payload.salespersonName ||
        payload.salespersonId ||
        "—",

      technicianId:
        payload.technicianId ||
        "",

      technicianName:
        payload.technicianName ||
        "",

      technician:
        payload.technicianName ||
        payload.technicianId ||
        "",

      notes:
        payload.notes || "",

      equipment:
        payload.equipment || [],

      createdAt:
        editingSale?.createdAt ||
        payload.savedAt ||
        createSaleDate(),
    });

    setSales((current) => {
      if (editingSale) {
        return current.map((sale) =>
          sale.id === editingSale.id
            ? newSale
            : sale
        );
      }

      return [
        ...current,
        newSale,
      ];
    });

    setShowForm(false);

    setEditingSale(null);

    setExpandedSaleId(newSale.id);
  }

  /* =======================================================
     DELETE
     ======================================================= */

  function deleteSale(sale) {
    if (readOnly) {
      return;
    }

    const confirmed = window.confirm(
      `Delete the sale for ${sale.customer}?`
    );

    if (!confirmed) {
      return;
    }

    setSales((current) =>
      current.filter(
        (item) =>
          item.id !== sale.id
      )
    );

    if (expandedSaleId === sale.id) {
      setExpandedSaleId(null);
    }
  }

  /* =======================================================
     VIEW DETAILS
     ======================================================= */

  function toggleDetails(id) {
    setExpandedSaleId(
      (current) =>
        current === id
          ? null
          : id
    );
  }

  /* =======================================================
     PRINT
     ======================================================= */

  function printReceipt(sale) {
    setReceiptSale(sale);
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <section className="min-w-0">

      {/* =================================================
          HEADER
         ================================================= */}

      <div className="border-b border-slate-200 bg-white px-3 py-3 sm:px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">
              Sales Entries
            </span>

            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
              {summary.count}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">

            {/* PRODUCT COUNT */}

            <span className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 sm:inline-flex">
              <span className="font-semibold text-slate-700">
                {summary.productCount}
              </span>

              <span className="ml-1">
                product
                {summary.productCount !== 1
                  ? "s"
                  : ""}
              </span>
            </span>

            {/* SERVICE COUNT */}

            <span className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 sm:inline-flex">
              <span className="font-semibold text-slate-700">
                {summary.serviceCount}
              </span>

              <span className="ml-1">
                service
                {summary.serviceCount !== 1
                  ? "s"
                  : ""}
              </span>
            </span>

            {/* PENDING */}

            {summary.pending > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                <span className="font-semibold">
                  {summary.pending}
                </span>{" "}
                pending
              </div>
            )}

            {/* SHOW / HIDE */}

            <button
              type="button"
              onClick={() =>
                setShowEntries(
                  (current) =>
                    !current
                )
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              {showEntries ? (
                <ChevronUp size={15} />
              ) : (
                <ChevronDown size={15} />
              )}

              {showEntries
                ? "Hide Entries"
                : "Show Entries"}
            </button>

            {/* ADD SALE */}

            {!readOnly && (
              <button
                type="button"
                onClick={() => {
                  setEditingSale(null);
                  setShowForm(
                    (current) =>
                      !current
                  );
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-sky-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700"
              >
                {showForm ? (
                  <ChevronUp size={15} />
                ) : (
                  <Plus size={15} />
                )}

                {showForm
                  ? "Close Form"
                  : "Add Sale"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          FORM
         ================================================= */}

      {showForm && !readOnly && (
        <SaleEntryForm
          open={showForm}
          selectedDate={selectedDate}
          initialSale={editingSale}
          onClose={() => {
            setShowForm(false);
            setEditingSale(null);
          }}
          onSave={handleSave}
          onPrint={(sale) =>
            setReceiptSale(sale)
          }
        />
      )}

      {/* =================================================
          ENTRIES
         ================================================= */}

      {entriesVisible && showEntries && (
        <>

          {/* =================================================
              TABLE HEADER
             ================================================= */}

          <div className="hidden overflow-x-auto border-b border-slate-200 bg-slate-50 lg:block">
            <div className="grid min-w-[1180px] grid-cols-[42px_minmax(150px,1.25fr)_minmax(180px,1.5fr)_60px_100px_90px_105px_100px_105px_105px] items-center gap-2 px-3 py-2.5">

              <div className="text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                #
              </div>

              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Customer
              </div>

              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Product / Service
              </div>

              <div className="text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Qty
              </div>

              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Unit Price
              </div>

              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Discount
              </div>

              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Total
              </div>

              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Status
              </div>

              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Method
              </div>

              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </div>
            </div>
          </div>

          {/* =================================================
              SALES
             ================================================= */}

          {visibleSales.length > 0 ? (
            <div className="divide-y divide-slate-100 bg-white">

              {visibleSales.map(
                (sale, index) => {
                  const isExpanded =
                    expandedSaleId ===
                    sale.id;

                  return (
                    <div
                      key={sale.id}
                      className="group"
                    >

                      {/* =================================
                          DESKTOP
                         ================================= */}

                      <div className="hidden min-w-[1180px] lg:block">

                        <div className="grid grid-cols-[42px_minmax(150px,1.25fr)_minmax(180px,1.5fr)_60px_100px_90px_105px_100px_105px_105px] items-center gap-2 px-3 py-3 transition hover:bg-slate-50">

                          {/* NUMBER */}

                          <div className="text-center text-xs text-slate-400">
                            {index + 1}
                          </div>

                          {/* CUSTOMER */}

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-800">
                              {sale.customer}
                            </p>
                          </div>

                          {/* PRODUCT / SERVICE */}

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">

                              <span
                                className={[
                                  "inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 text-[9px] font-semibold",
                                  getTypeClasses(
                                    sale.type
                                  ),
                                ].join(" ")}
                              >
                                {sale.type ===
                                "service" ? (
                                  <Wrench
                                    size={9}
                                    className="mr-1"
                                  />
                                ) : (
                                  <Package
                                    size={9}
                                    className="mr-1"
                                  />
                                )}

                                {sale.type ===
                                "service"
                                  ? "Service"
                                  : "Product"}
                              </span>

                              <span className="truncate text-sm font-medium text-slate-700">
                                {sale.item}
                              </span>
                            </div>
                          </div>

                          {/* QTY */}

                          <div className="text-center text-sm text-slate-700">
                            {sale.quantity}
                          </div>

                          {/* UNIT PRICE */}

                          <div className="text-sm text-slate-700">
                            {formatCurrency(
                              sale.unitPrice
                            )}
                          </div>

                          {/* DISCOUNT */}

                          <div className="text-sm text-slate-600">
                            {Number(
                              sale.discount || 0
                            ) > 0
                              ? `-${formatCurrency(
                                  sale.discount
                                )}`
                              : "$0.00"}
                          </div>

                          {/* TOTAL */}

                          <div className="text-sm font-semibold text-slate-900">
                            {formatCurrency(
                              sale.total
                            )}
                          </div>

                          {/* STATUS */}

                          <div>
                            <span
                              className={[
                                "inline-flex rounded-md border px-2 py-1 text-[10px] font-semibold",
                                getStatusClasses(
                                  sale.paymentStatus
                                ),
                              ].join(" ")}
                            >
                              {sale.paymentStatus}
                            </span>
                          </div>

                          {/* METHOD */}

                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <CreditCard
                              size={13}
                              className="text-slate-400"
                            />

                            {sale.paymentMethod}
                          </div>

                          {/* ACTIONS */}

                          <div className="flex items-center gap-1">

                            <button
                              type="button"
                              onClick={() =>
                                toggleDetails(
                                  sale.id
                                )
                              }
                              className={[
                                "inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-medium transition",
                                isExpanded
                                  ? "border-sky-200 bg-sky-50 text-sky-700"
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                              ].join(" ")}
                            >
                              {isExpanded ? (
                                <EyeOff size={13} />
                              ) : (
                                <Eye size={13} />
                              )}

                              {isExpanded
                                ? "Hide"
                                : "View"}
                            </button>

                            <ActionMenu
                              sale={sale}
                              onPrint={
                                printReceipt
                              }
                              onEdit={
                                handleEditSale
                              }
                              onDelete={
                                deleteSale
                              }
                              readOnly={
                                readOnly
                              }
                            />
                          </div>
                        </div>

                        {/* =================================
                            DETAIL
                           ================================= */}

                        {isExpanded && (
                          <div className="border-t border-slate-100 bg-slate-50/70 px-3 py-3">

                            <div className="grid grid-cols-4 gap-4">

                              {/* SALE TYPE */}

                              <div>
                                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                                  Sale Type
                                </p>

                                <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-700">
                                  {sale.type ===
                                  "service" ? (
                                    <Wrench
                                      size={13}
                                      className="text-violet-500"
                                    />
                                  ) : (
                                    <Package
                                      size={13}
                                      className="text-sky-500"
                                    />
                                  )}

                                  {sale.type ===
                                  "service"
                                    ? "Service Sale"
                                    : "Product Sale"}
                                </div>
                              </div>

                              {/* SALESPERSON */}

                              <div>
                                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                                  Salesperson
                                </p>

                                <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-700">
                                  <User
                                    size={13}
                                    className="text-slate-400"
                                  />

                                  {sale.salesperson ||
                                    "—"}
                                </div>
                              </div>

                              {/* TECHNICIAN */}

                              <div>
                                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                                  Worked By
                                </p>

                                <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-700">
                                  <Wrench
                                    size={13}
                                    className="text-slate-400"
                                  />

                                  {sale.technician ||
                                    "—"}
                                </div>
                              </div>

                              {/* RECORDED */}

                              <div>
                                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                                  Recorded
                                </p>

                                <p className="mt-1 text-xs font-medium text-slate-700">
                                  {formatTime(
                                    sale.createdAt
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* EQUIPMENT */}

                            {sale.type ===
                              "service" &&
                              sale.equipment
                                ?.length >
                                0 && (
                                <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">

                                  <div className="flex items-center gap-2">
                                    <Package
                                      size={13}
                                      className="text-violet-500"
                                    />

                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                      Equipment / Parts
                                    </p>

                                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">
                                      {
                                        sale
                                          .equipment
                                          .length
                                      }
                                    </span>
                                  </div>

                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {sale.equipment.map(
                                      (
                                        item
                                      ) => (
                                        <span
                                          key={
                                            item.id
                                          }
                                          className="rounded-md bg-slate-50 px-2 py-1 text-[10px] text-slate-600"
                                        >
                                          {
                                            item.name
                                          }{" "}
                                          ×{" "}
                                          {
                                            item.quantity
                                          }
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* NOTES */}

                            {sale.notes && (
                              <div className="mt-3 flex items-start gap-2 rounded-lg bg-white px-3 py-2.5">
                                <FileText
                                  size={13}
                                  className="mt-0.5 shrink-0 text-slate-400"
                                />

                                <div className="min-w-0">
                                  <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                                    Notes
                                  </p>

                                  <p className="mt-1 text-xs leading-5 text-slate-600">
                                    {sale.notes}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* SALE ID */}

                            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2">
                              <span className="text-[9px] uppercase tracking-wide text-slate-400">
                                Sale ID
                              </span>

                              <span className="font-mono text-[10px] text-slate-400">
                                {sale.id}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* =================================
                          MOBILE
                         ================================= */}

                      <div className="p-3 lg:hidden">

                        <div className="flex items-start justify-between gap-3">

                          <div className="flex min-w-0 items-start gap-2.5">

                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                              {index + 1}
                            </span>

                            <div className="min-w-0">

                              <div className="flex items-center gap-2">

                                <p className="truncate text-sm font-semibold text-slate-800">
                                  {sale.item}
                                </p>

                                <span
                                  className={[
                                    "shrink-0 rounded-md border px-1.5 py-0.5 text-[9px] font-semibold",
                                    getTypeClasses(
                                      sale.type
                                    ),
                                  ].join(" ")}
                                >
                                  {sale.type ===
                                  "service"
                                    ? "Service"
                                    : "Product"}
                                </span>
                              </div>

                              <p className="mt-0.5 truncate text-xs text-slate-400">
                                {sale.customer}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-1">

                            <button
                              type="button"
                              onClick={() =>
                                toggleDetails(
                                  sale.id
                                )
                              }
                              title={
                                isExpanded
                                  ? "Hide"
                                  : "View"
                              }
                              className={[
                                "flex h-8 w-8 items-center justify-center rounded-lg border transition",
                                isExpanded
                                  ? "border-sky-200 bg-sky-50 text-sky-700"
                                  : "border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-700",
                              ].join(" ")}
                            >
                              {isExpanded ? (
                                <EyeOff
                                  size={15}
                                />
                              ) : (
                                <Eye
                                  size={15}
                                />
                              )}
                            </button>

                            <ActionMenu
                              sale={sale}
                              onPrint={
                                printReceipt
                              }
                              onEdit={
                                handleEditSale
                              }
                              onDelete={
                                deleteSale
                              }
                              readOnly={
                                readOnly
                              }
                            />
                          </div>
                        </div>

                        {/* MOBILE SUMMARY */}

                        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">

                          <div className="rounded-lg bg-slate-50 p-2">
                            <p className="text-[9px] uppercase text-slate-400">
                              Qty
                            </p>

                            <p className="mt-0.5 text-sm font-medium text-slate-700">
                              {sale.quantity}
                            </p>
                          </div>

                          <div className="rounded-lg bg-slate-50 p-2">
                            <p className="text-[9px] uppercase text-slate-400">
                              Unit Price
                            </p>

                            <p className="mt-0.5 text-sm font-medium text-slate-700">
                              {formatCurrency(
                                sale.unitPrice
                              )}
                            </p>
                          </div>

                          <div className="rounded-lg bg-slate-50 p-2">
                            <p className="text-[9px] uppercase text-slate-400">
                              Total
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-slate-900">
                              {formatCurrency(
                                sale.total
                              )}
                            </p>
                          </div>

                          <div className="rounded-lg bg-slate-50 p-2">
                            <p className="text-[9px] uppercase text-slate-400">
                              Status
                            </p>

                            <span
                              className={[
                                "mt-0.5 inline-flex rounded-md border px-1.5 py-0.5 text-[9px] font-semibold",
                                getStatusClasses(
                                  sale.paymentStatus
                                ),
                              ].join(" ")}
                            >
                              {sale.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {/* MOBILE DETAILS */}

                        {isExpanded && (
                          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">

                            <div className="grid grid-cols-2 gap-3">

                              <div>
                                <p className="text-[9px] uppercase tracking-wide text-slate-400">
                                  Salesperson
                                </p>

                                <p className="mt-1 text-xs font-medium text-slate-700">
                                  {sale.salesperson ||
                                    "—"}
                                </p>
                              </div>

                              <div>
                                <p className="text-[9px] uppercase tracking-wide text-slate-400">
                                  Worked By
                                </p>

                                <p className="mt-1 text-xs font-medium text-slate-700">
                                  {sale.technician ||
                                    "—"}
                                </p>
                              </div>

                              <div>
                                <p className="text-[9px] uppercase tracking-wide text-slate-400">
                                  Payment
                                </p>

                                <p className="mt-1 text-xs font-medium text-slate-700">
                                  {sale.paymentMethod}
                                </p>
                              </div>

                              <div>
                                <p className="text-[9px] uppercase tracking-wide text-slate-400">
                                  Discount
                                </p>

                                <p className="mt-1 text-xs font-medium text-slate-700">
                                  {formatCurrency(
                                    sale.discount
                                  )}
                                </p>
                              </div>
                            </div>

                            {sale.notes && (
                              <div className="mt-3 border-t border-slate-200 pt-3">
                                <p className="text-[9px] uppercase tracking-wide text-slate-400">
                                  Notes
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-600">
                                  {sale.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            /* =================================================
               EMPTY STATE
               ================================================= */

            <div className="bg-white px-4 py-12 text-center">

              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Receipt size={18} />
              </div>

              <p className="mt-3 text-sm font-medium text-slate-700">
                No sales recorded for this date.
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Click Add Sale to create the first entry.
              </p>

              {!readOnly && (
                <button
                  type="button"
                  onClick={() =>
                    setShowForm(true)
                  }
                  className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg bg-sky-600 px-3 text-xs font-semibold text-white hover:bg-sky-700"
                >
                  <Plus size={14} />
                  Add Sale
                </button>
              )}
            </div>
          )}

          {/* =================================================
              FOOTER SUMMARY
             ================================================= */}

          <div className="border-t border-slate-200 bg-slate-50 px-3 py-3 sm:px-4">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-6">

              <div className="text-xs text-slate-500">
                {summary.count}{" "}
                {summary.count === 1
                  ? "sale"
                  : "sales"}
              </div>

              <div className="text-xs text-slate-500">
                Paid{" "}
                <span className="font-semibold text-emerald-700">
                  {summary.paid}
                </span>
              </div>

              <div className="text-xs text-slate-500">
                Pending{" "}
                <span className="font-semibold text-amber-700">
                  {summary.pending}
                </span>
              </div>

              <div className="border-l border-slate-200 pl-0 text-sm sm:pl-6">
                <span className="text-xs text-slate-500">
                  Total Sales
                </span>

                <span className="ml-2 font-semibold text-slate-900">
                  {formatCurrency(
                    summary.total
                  )}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =================================================
          RECEIPT
         ================================================= */}

      <SaleReceipt
        sale={receiptSale}
        open={Boolean(receiptSale)}
        onClose={() =>
          setReceiptSale(null)
        }
      />
    </section>
  );
}