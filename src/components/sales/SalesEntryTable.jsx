"use client";

import { useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/feedback/ToastProvider";

import salesData from "@/data/sales/sales-daily";
import { customersData } from "@/data/master/customers";
import productsData from "@/data/master/items";

const PAYMENT_METHODS = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Check",
  "Bank Transfer",
  "Other",
];

const PAYMENT_STATUSES = [
  "Paid",
  "Pending",
  "Partial",
  "Refunded",
];

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function getCustomer(id) {
  return (
    customersData.find((customer) => customer.id === id)?.name ||
    "Unknown Customer"
  );
}

function getProduct(id) {
  return (
    productsData.find((product) => product.id === id)?.name ||
    "Unknown Product"
  );
}

function normalizeSales() {
  return salesData.map((sale) => {
    const amount = Number(sale.amount || 0);

    return {
      ...sale,
      quantity: Number(sale.quantity || 1),
      unitPrice: Number(sale.unitPrice || amount),
      discount: Number(sale.discount || 0),
      tax: Number(sale.tax || 0),
      total: Number(
        sale.total ||
          Math.max(0, amount - Number(sale.discount || 0)) +
            Number(sale.tax || 0)
      ),
      paymentMethod: sale.paymentMethod || "Cash",
      paymentStatus:
        sale.paymentStatus ||
        (sale.status === "Completed" ? "Paid" : "Pending"),
      notes: sale.notes || "",
    };
  });
}

export default function SalesDailyView() {
  const { success } = useToast();

  const [sales, setSales] = useState(normalizeSales);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    customerId: customersData[0]?.id || "",
    productId: productsData[0]?.id || "",
    quantity: "1",
    unitPrice: "",
    discount: "0",
    tax: "0",
    salesperson: "Sarah Wilson",
    paymentMethod: "Cash",
    paymentStatus: "Paid",
    notes: "",
  });

  const revenue = useMemo(() => {
    return sales.reduce(
      (sum, sale) => sum + Number(sale.total || 0),
      0
    );
  }, [sales]);

  const calculatedTotal = Math.max(
    0,
    Number(form.quantity || 0) *
      Number(form.unitPrice || 0) -
      Number(form.discount || 0) +
      Number(form.tax || 0)
  );

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function addSale(event) {
    event.preventDefault();

    const quantity = Number(form.quantity);
    const unitPrice = Number(form.unitPrice);

    if (!form.customerId || !form.productId) {
      return;
    }

    if (!quantity || !unitPrice) {
      return;
    }

    const newSale = {
      id: `SAL-${String(sales.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().slice(0, 10),
      customerId: form.customerId,
      productId: form.productId,
      quantity,
      unitPrice,
      discount: Number(form.discount || 0),
      tax: Number(form.tax || 0),
      total: calculatedTotal,
      salesperson: form.salesperson,
      paymentMethod: form.paymentMethod,
      paymentStatus: form.paymentStatus,
      notes: form.notes,
      status:
        form.paymentStatus === "Paid"
          ? "Completed"
          : "Pending",
    };

    setSales((current) => [newSale, ...current]);

    setForm({
      customerId: customersData[0]?.id || "",
      productId: productsData[0]?.id || "",
      quantity: "1",
      unitPrice: "",
      discount: "0",
      tax: "0",
      salesperson: "Sarah Wilson",
      paymentMethod: "Cash",
      paymentStatus: "Paid",
      notes: "",
    });

    setModalOpen(false);

    success("Sale added successfully.");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Today's Sales
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Record sales, payments and customer transactions.
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Add Sale
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sales Count
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {sales.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Total Revenue
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {money(revenue)}
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-4">
          <h3 className="text-base font-bold text-slate-900">
            Sales Entries
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Customer, product/service, pricing and payment information.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Sale ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Product / Service</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Unit Price</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Tax</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Salesperson</th>
                <th className="px-4 py-3">Payment</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {sales.map((sale) => (
                <tr
                  key={sale.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-4 py-4 text-xs font-semibold text-slate-500">
                    {sale.id}
                  </td>

                  <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                    {getCustomer(sale.customerId)}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {getProduct(sale.productId)}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {sale.quantity}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {money(sale.unitPrice)}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {money(sale.discount)}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {money(sale.tax)}
                  </td>

                  <td className="px-4 py-4 text-sm font-bold text-slate-900">
                    {money(sale.total)}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {sale.salesperson}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {sale.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Sale"
        description="Record a new daily sales transaction."
        size="xl"
      >
        <form onSubmit={addSale} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Customer">
              <select
                value={form.customerId}
                onChange={(event) =>
                  updateForm("customerId", event.target.value)
                }
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0877aa] focus:ring-2 focus:ring-[#0877aa]/10"
              >
                {customersData.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Product / Service">
              <select
                value={form.productId}
                onChange={(event) =>
                  updateForm("productId", event.target.value)
                }
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0877aa] focus:ring-2 focus:ring-[#0877aa]/10"
              >
                {productsData.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Quantity">
              <input
                type="number"
                min="1"
                step="1"
                value={form.quantity}
                onChange={(event) =>
                  updateForm("quantity", event.target.value)
                }
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0877aa] focus:ring-2 focus:ring-[#0877aa]/10"
              />
            </Field>

            <Field label="Unit Price">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.unitPrice}
                onChange={(event) =>
                  updateForm("unitPrice", event.target.value)
                }
                placeholder="0.00"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0877aa] focus:ring-2 focus:ring-[#0877aa]/10"
              />
            </Field>

            <Field label="Discount">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.discount}
                onChange={(event) =>
                  updateForm("discount", event.target.value)
                }
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0877aa] focus:ring-2 focus:ring-[#0877aa]/10"
              />
            </Field>

            <Field label="Tax">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.tax}
                onChange={(event) =>
                  updateForm("tax", event.target.value)
                }
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0877aa] focus:ring-2 focus:ring-[#0877aa]/10"
              />
            </Field>

            <Field label="Salesperson">
              <input
                value={form.salesperson}
                onChange={(event) =>
                  updateForm("salesperson", event.target.value)
                }
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0877aa] focus:ring-2 focus:ring-[#0877aa]/10"
              />
            </Field>

            <Field label="Payment Method">
              <select
                value={form.paymentMethod}
                onChange={(event) =>
                  updateForm(
                    "paymentMethod",
                    event.target.value
                  )
                }
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0877aa] focus:ring-2 focus:ring-[#0877aa]/10"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Payment Status">
              <select
                value={form.paymentStatus}
                onChange={(event) =>
                  updateForm(
                    "paymentStatus",
                    event.target.value
                  )
                }
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0877aa] focus:ring-2 focus:ring-[#0877aa]/10"
              >
                {PAYMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {money(calculatedTotal)}
              </p>
            </div>

            <Field
              label="Notes"
              className="sm:col-span-2"
            >
              <textarea
                rows={4}
                value={form.notes}
                onChange={(event) =>
                  updateForm("notes", event.target.value)
                }
                placeholder="Optional sale notes..."
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0877aa] focus:ring-2 focus:ring-[#0877aa]/10"
              />
            </Field>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <Button type="submit">
              <Save size={16} />
              Save Sale
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
}