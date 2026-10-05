"use client";

import {
  Eye,
  Pencil,
  UserRound,
} from "lucide-react";

import Badge from "@/components/ui/Badge";

export default function EmployeeTable({
  employees = [],
  onView,
  onEdit,
}) {
  if (!employees.length) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center px-6 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <UserRound
            size={18}
          />
        </div>

        <p className="mt-3 text-sm font-medium text-slate-700">
          No employees found
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-2.5 text-left text-[9px] font-semibold uppercase tracking-wide text-slate-400">
              Employee
            </th>

            <th className="px-4 py-2.5 text-left text-[9px] font-semibold uppercase tracking-wide text-slate-400">
              Employee ID
            </th>

            <th className="px-4 py-2.5 text-left text-[9px] font-semibold uppercase tracking-wide text-slate-400">
              Department
            </th>

            <th className="px-4 py-2.5 text-left text-[9px] font-semibold uppercase tracking-wide text-slate-400">
              Role
            </th>

            <th className="px-4 py-2.5 text-left text-[9px] font-semibold uppercase tracking-wide text-slate-400">
              Status
            </th>

            <th className="px-4 py-2.5 text-right text-[9px] font-semibold uppercase tracking-wide text-slate-400">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {employees.map(
            (employee) => {
              const employment =
                employee.employment ||
                {};

              const status =
                employment.status ||
                "Unknown";

              const isActive =
                status ===
                "Active";

              return (
                <tr
                  key={
                    employee.id
                  }
                  className="group transition hover:bg-slate-50/70"
                >
                  {/* Employee */}

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <UserRound
                          size={14}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-slate-800">
                          {
                            employee.name
                          }
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-slate-400">
                          {
                            employee.firstName
                          }{" "}
                          {
                            employee.lastName
                          }
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ID */}

                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] font-medium text-slate-600">
                      {
                        employee.employeeCode ||
                        employee.id
                      }
                    </span>
                  </td>

                  {/* Department */}

                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-600">
                      {
                        employment.department ||
                        "-"
                      }
                    </span>
                  </td>

                  {/* Role */}

                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-600">
                      {
                        employment.role ||
                        "-"
                      }
                    </span>
                  </td>

                  {/* Status */}

                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        isActive
                          ? "success"
                          : "default"
                      }
                    >
                      {
                        status
                      }
                    </Badge>
                  </td>

                  {/* Actions */}

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          onView?.(
                            employee
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label={`View ${employee.name}`}
                        title="View"
                      >
                        <Eye
                          size={14}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onEdit?.(
                            employee
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label={`Edit ${employee.name}`}
                        title="Edit"
                      >
                        <Pencil
                          size={14}
                        />
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