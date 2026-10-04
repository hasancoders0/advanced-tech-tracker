"use client";

import {
  Eye,
  Pencil,
  UserRound,
} from "lucide-react";

import Badge from "@/components/ui/Badge";

export default function TechnicianTable({
  technicians = [],
  onView,
  onEdit,
}) {
  if (!technicians.length) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <UserRound size={18} />
        </div>

        <p className="mt-3 text-sm font-medium text-slate-700">
          No technicians found
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Technician
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Technician ID
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Employee ID
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Department
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Role
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
          {technicians.map((technician) => {
            const active =
              technician.status === "Active";

            return (
              <tr
                key={technician.id}
                className="group transition hover:bg-slate-50/70"
              >
                {/* Technician */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                      <UserRound size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {technician.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {technician.role}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Technician ID */}
                <td className="px-5 py-4">
                  <span className="font-mono text-xs font-medium text-slate-600">
                    {technician.id}
                  </span>
                </td>

                {/* Employee ID */}
                <td className="px-5 py-4">
                  <span className="font-mono text-xs text-slate-500">
                    {technician.employeeId}
                  </span>
                </td>

                {/* Department */}
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-600">
                    {technician.department}
                  </span>
                </td>

                {/* Role */}
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-600">
                    {technician.role}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <Badge
                    variant={
                      active
                        ? "success"
                        : "default"
                    }
                  >
                    {technician.status}
                  </Badge>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        onView?.(technician)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      title="View"
                      aria-label={`View ${technician.name}`}
                    >
                      <Eye size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onEdit?.(technician)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      title="Edit"
                      aria-label={`Edit ${technician.name}`}
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}