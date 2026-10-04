"use client";

import {
  Building2,
  Eye,
  Pencil,
} from "lucide-react";

import Badge from "@/components/ui/Badge";

export default function DepartmentTable({
  departments = [],
  onView,
  onEdit,
}) {
  if (!departments.length) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Building2 size={18} />
        </div>

        <p className="mt-3 text-sm font-medium text-slate-700">
          No departments found
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Try changing your search.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Department
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Department ID
            </th>

            <th className="px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Technicians
            </th>

            <th className="px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Active
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Status
            </th>

            <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {departments.map(
            (department) => (
              <tr
                key={department.id}
                className="group transition hover:bg-slate-50/70"
              >
                {/* Department */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <Building2 size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800">
                        {department.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Workforce department
                      </p>
                    </div>
                  </div>
                </td>

                {/* Department ID */}
                <td className="px-5 py-4">
                  <span className="font-mono text-xs font-medium text-slate-600">
                    {department.id}
                  </span>
                </td>

                {/* Total technicians */}
                <td className="px-5 py-4 text-center">
                  <span className="text-sm font-medium text-slate-700">
                    {department.technicianCount}
                  </span>
                </td>

                {/* Active technicians */}
                <td className="px-5 py-4 text-center">
                  <span className="text-sm font-medium text-slate-700">
                    {department.activeCount}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <Badge variant="success">
                    Active
                  </Badge>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        onView?.(
                          department
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      title="View"
                      aria-label={`View ${department.name}`}
                    >
                      <Eye size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onEdit?.(
                          department
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      title="Edit"
                      aria-label={`Edit ${department.name}`}
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}