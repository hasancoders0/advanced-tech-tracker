"use client";

import {
  BriefcaseBusiness,
  Trash2,
  Users,
} from "lucide-react";

import Badge from "@/components/ui/Badge";

export default function RoleList({
  roles = [],
  employees = [],
  onDelete,
}) {
  if (!roles.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <BriefcaseBusiness size={18} />
        </div>

        <p className="mt-3 text-sm font-medium text-slate-700">
          No roles found
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Create your first employee role above.
        </p>
      </div>
    );
  }

  function getEmployeeCount(role) {
    return employees.filter((employee) => {
      const employment =
        employee.employment || {};

      return (
        employment.roleId === role.id ||
        employee.roleId === role.id
      );
    }).length;
  }

  function handleDelete(role) {
    const employeeCount =
      getEmployeeCount(role);

    if (employeeCount > 0) {
      window.alert(
        `"${role.name}" cannot be deleted because it is currently assigned to ${employeeCount} employee${
          employeeCount === 1 ? "" : "s"
        }.`
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete the "${role.name}" role?`
      );

    if (!confirmed) {
      return;
    }

    onDelete?.(role);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Employee Roles
          </h2>

          <p className="mt-0.5 text-[10px] text-slate-400">
            {roles.length}{" "}
            {roles.length === 1
              ? "role"
              : "roles"}{" "}
            available
          </p>
        </div>
      </div>

      {/* Role List */}

      <div className="divide-y divide-slate-100">
        {roles.map((role) => {
          const employeeCount =
            getEmployeeCount(
              role
            );

          const isUsed =
            employeeCount > 0;

          const isActive =
            role.status ===
              "Active" ||
            !role.status;

          return (
            <div
              key={role.id}
              className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-slate-50"
            >
              {/* Role information */}

              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <BriefcaseBusiness
                    size={15}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs font-semibold text-slate-800">
                      {role.name}
                    </p>

                    <Badge
                      variant={
                        isActive
                          ? "success"
                          : "default"
                      }
                    >
                      {role.status ||
                        "Active"}
                    </Badge>
                  </div>

                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Users
                      size={11}
                    />

                    <span>
                      {employeeCount}{" "}
                      {employeeCount ===
                      1
                        ? "employee"
                        : "employees"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delete */}

              <button
                type="button"
                onClick={() =>
                  handleDelete(
                    role
                  )
                }
                disabled={isUsed}
                title={
                  isUsed
                    ? "This role is assigned to employees"
                    : "Delete role"
                }
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition",
                  isUsed
                    ? "cursor-not-allowed text-slate-200"
                    : "text-slate-400 hover:bg-red-50 hover:text-red-600",
                ].join(" ")}
                aria-label={`Delete ${role.name}`}
              >
                <Trash2
                  size={14}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}