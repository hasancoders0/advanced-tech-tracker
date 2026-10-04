"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Printer, X, Wrench, Package } from "lucide-react";

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getEquipmentTotal(equipment = []) {
  return equipment.reduce(
    (sum, item) =>
      sum +
      Number(item?.price || 0) * Number(item?.quantity || 1),
    0,
  );
}

export default function SaleReceipt({
  sale,
  open,
  onClose,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const totals = useMemo(() => {
    if (!sale) {
      return {
        serviceSubtotal: 0,
        equipmentTotal: 0,
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
      };
    }

    const equipmentTotal =
      sale.type === "service"
        ? getEquipmentTotal(sale.equipment)
        : 0;

    const serviceSubtotal =
      sale.type === "service"
        ? Number(sale.serviceCharge ?? sale.unitPrice ?? 0)
        : Number(sale.unitPrice || 0) *
          Number(sale.quantity || 1);

    const calculatedSubtotal =
      sale.type === "service"
        ? serviceSubtotal + equipmentTotal
        : serviceSubtotal;

    return {
      serviceSubtotal,
      equipmentTotal,
      subtotal:
        Number(sale.total || 0) > 0 && sale.type === "service"
          ? calculatedSubtotal
          : calculatedSubtotal,
      discount: Number(sale.discount || 0),
      tax: Number(sale.tax || 0),
      total: Number(sale.total || 0),
    };
  }, [sale]);

  if (!mounted || !open || !sale) {
    return null;
  }

  function handlePrint() {
    window.print();
  }

  const isService = sale.type === "service";

  const receipt = (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/50 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <style>{`
        @media print {
          html,
          body {
            background: #fff !important;
          }

          body * {
            visibility: hidden !important;
          }

          .sale-receipt-print,
          .sale-receipt-print * {
            visibility: visible !important;
          }

          .sale-receipt-print {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: #fff !important;
          }

          .receipt-no-print {
            display: none !important;
          }

          @page {
            margin: 12mm;
            size: auto;
          }
        }
      `}</style>

      <div className="mx-auto flex min-h-full max-w-4xl items-start justify-center py-4 sm:py-8">
        <div className="w-full">
          <div className="receipt-no-print mb-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Receipt Preview
              </p>
              <p className="text-xs text-slate-400">
                Review the receipt before printing.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-sky-600 px-3 text-xs font-semibold text-white transition hover:bg-sky-700"
              >
                <Printer size={15} />
                Print Receipt
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close receipt"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          <div className="sale-receipt-print overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-200 px-6 py-6 sm:px-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Advanced Tech Tracker
                  </h1>
                  <p className="mt-1 text-xs text-slate-500">
                    Sales Receipt
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Receipt #
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold text-slate-800">
                    {sale.id}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(sale.createdAt)}
                    {formatTime(sale.createdAt) && (
                      <>
                        {" · "}
                        {formatTime(sale.createdAt)}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 border-b border-slate-200 px-6 py-5 sm:grid-cols-2 sm:px-10">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Customer
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {sale.customer || "Customer not selected"}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Sale Type
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                  {isService ? (
                    <Wrench size={14} className="text-violet-500" />
                  ) : (
                    <Package size={14} className="text-sky-500" />
                  )}
                  {isService ? "Service Sale" : "Product Sale"}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Salesperson
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {sale.salesperson || "—"}
                </p>
              </div>

              {isService && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Worked By
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {sale.technician || "—"}
                  </p>
                </div>
              )}

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Payment Method
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {sale.paymentMethod || "—"}
                </p>
              </div>
            </div>

            <div className="px-6 py-6 sm:px-10">
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <div className="grid grid-cols-[1fr_70px_100px_100px] gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </div>
                  <div className="text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Qty
                  </div>
                  <div className="text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Unit Price
                  </div>
                  <div className="text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_70px_100px_100px] gap-2 px-3 py-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {sale.item || "Item"}
                    </p>
                    {isService && sale.technician && (
                      <p className="mt-1 text-xs text-slate-400">
                        Worked by: {sale.technician}
                      </p>
                    )}
                  </div>

                  <div className="text-center text-sm text-slate-600">
                    {isService ? "—" : sale.quantity || 1}
                  </div>

                  <div className="text-right text-sm text-slate-600">
                    {formatCurrency(
                      isService
                        ? sale.serviceCharge ?? sale.unitPrice
                        : sale.unitPrice,
                    )}
                  </div>

                  <div className="text-right text-sm font-medium text-slate-800">
                    {formatCurrency(
                      isService
                        ? totals.serviceSubtotal
                        : Number(sale.unitPrice || 0) *
                          Number(sale.quantity || 1),
                    )}
                  </div>
                </div>
              </div>

              {isService && sale.equipment?.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Equipment / Parts Used
                  </p>

                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    {sale.equipment.map((equipment, index) => (
                      <div
                        key={equipment.id || `${equipment.name}-${index}`}
                        className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5 last:border-b-0"
                      >
                        <div>
                          <p className="text-xs font-medium text-slate-700">
                            {equipment.name || "Equipment"}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Qty: {equipment.quantity || 1}
                          </p>
                        </div>

                        <p className="text-xs font-semibold text-slate-700">
                          {formatCurrency(
                            Number(equipment.price || 0) *
                              Number(equipment.quantity || 1),
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Subtotal</span>
                    <span>{formatCurrency(totals.subtotal)}</span>
                  </div>

                  {totals.discount > 0 && (
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Discount</span>
                      <span className="text-red-600">
                        - {formatCurrency(totals.discount)}
                      </span>
                    </div>
                  )}

                  {totals.tax > 0 && (
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Tax</span>
                      <span>{formatCurrency(totals.tax)}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">
                        Total
                      </span>
                      <span className="text-lg font-bold text-slate-900">
                        {formatCurrency(totals.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-6 mb-5 flex flex-col gap-3 rounded-lg bg-slate-50 px-4 py-3 sm:mx-10 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Payment Method
                </p>
                <p className="mt-1 text-xs font-medium text-slate-700">
                  {sale.paymentMethod || "—"}
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Payment Status
                </p>
                <p
                  className={[
                    "mt-1 text-xs font-semibold",
                    sale.paymentStatus === "Paid"
                      ? "text-emerald-600"
                      : sale.paymentStatus === "Partial"
                        ? "text-amber-600"
                        : sale.paymentStatus === "Overdue"
                          ? "text-red-600"
                          : "text-slate-600",
                  ].join(" ")}
                >
                  {sale.paymentStatus || "Pending"}
                </p>
              </div>
            </div>

            {sale.notes && (
              <div className="border-t border-slate-200 px-6 py-5 sm:px-10">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Notes
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {sale.notes}
                </p>
              </div>
            )}

            <div className="border-t border-slate-200 px-6 py-5 text-center sm:px-10">
              <p className="text-xs font-medium text-slate-600">
                Thank you for your business.
              </p>
              <p className="mt-1 text-[10px] text-slate-400">
                This receipt was generated from Advanced Tech Tracker.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(receipt, document.body);
}
