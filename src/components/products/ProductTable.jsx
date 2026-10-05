"use client";

import { Eye, Package, Pencil, Trash2 } from "lucide-react";

import Badge from "@/components/ui/Badge";

export default function ProductTable({
  products = [],
  onView,
  onEdit,
  onDelete,
}) {
  if (!products.length) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Package size={18} />
        </div>

        <p className="mt-3 text-sm font-medium text-slate-700">
          No products found
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Product
            </th>

            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              SKU
            </th>

            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Category
            </th>

            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Price
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
          {products.map((product) => (
            <tr key={product.id} className="transition hover:bg-slate-50/70">
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Package size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-800">
                      {product.name}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                      {product.notes || "Product"}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-3.5">
                <span className="font-mono text-[10px] text-slate-500">
                  {product.sku}
                </span>
              </td>

              <td className="px-4 py-3.5 text-xs text-slate-600">
                {product.category}
              </td>

              <td className="px-4 py-3.5 text-xs font-medium text-slate-700">
                ${Number(product.price || 0).toFixed(2)}
              </td>

              <td className="px-4 py-3.5">
                <Badge
                  variant={product.status === "Active" ? "success" : "default"}
                >
                  {product.status}
                </Badge>
              </td>

              <td className="px-4 py-3.5">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onView?.(product)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    title="View"
                  >
                    <Eye size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit?.(product)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete?.(product)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
