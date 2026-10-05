"use client";

import {
  Eye,
  Pencil,
  UserRound,
} from "lucide-react";

import Badge from "@/components/ui/Badge";

export default function CustomerTable({
  customers = [],
  onView,
  onEdit,
}) {
  if (!customers.length) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <UserRound size={18} />
        </div>

        <p className="mt-3 text-sm font-medium text-slate-700">
          No customers found
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Customer
            </th>

            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Contact
            </th>

            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Type
            </th>

            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Status
            </th>

            <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {customers.map(
            (customer) => {
              const name =
                customer.name ||
                customer.customerName ||
                "Unnamed Customer";

              const company =
                customer.company ||
                "";

              const phone =
                customer.phone ||
                customer.contact?.phone ||
                "—";

              const email =
                customer.email ||
                customer.contact?.email ||
                "—";

              const type =
                customer.customerType ||
                customer.type ||
                "—";

              const status =
                customer.status ||
                "Active";

              return (
                <tr
                  key={
                    customer.id
                  }
                  className="group transition hover:bg-slate-50/70"
                >
                  {/* Customer */}

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        <UserRound
                          size={15}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-800">
                          {name}
                        </p>

                        {company ? (
                          <p className="mt-0.5 truncate text-[10px] text-slate-400">
                            {company}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>

                  {/* Contact */}

                  <td className="px-4 py-3.5">
                    <p className="text-xs text-slate-600">
                      {phone}
                    </p>

                    <p className="mt-0.5 max-w-[180px] truncate text-[10px] text-slate-400">
                      {email}
                    </p>
                  </td>

                  {/* Type */}

                  <td className="px-4 py-3.5">
                    <span className="text-xs text-slate-600">
                      {type}
                    </span>
                  </td>

                  {/* Status */}

                  <td className="px-4 py-3.5">
                    <Badge
                      variant={
                        status ===
                        "Active"
                          ? "success"
                          : "default"
                      }
                    >
                      {status}
                    </Badge>
                  </td>

                  {/* Actions */}

                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          onView?.(
                            customer
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label={`View ${name}`}
                        title="View"
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onEdit?.(
                            customer
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label={`Edit ${name}`}
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}