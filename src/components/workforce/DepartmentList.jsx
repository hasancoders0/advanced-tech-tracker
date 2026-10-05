"use client";

import {
  Building2,
  Trash2,
  Users,
} from "lucide-react";

export default function DepartmentList({
  departments = [],
  employees = [],
  onDelete,
}) {
  function getEmployeeCount(
    department
  ) {
    return employees.filter(
      (employee) => {
        const employment =
          employee.employment || {};

        const departmentId =
          employment.departmentId ||
          employee.departmentId;

        return (
          departmentId ===
          department.id
        );
      }
    ).length;
  }

  function handleDelete(
    department
  ) {
    const employeeCount =
      getEmployeeCount(
        department
      );

    if (employeeCount > 0) {
      window.alert(
        `"${department.name}" cannot be deleted because it is currently assigned to ${employeeCount} employee${
          employeeCount === 1
            ? ""
            : "s"
        }.`
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete the "${department.name}" department?`
      );

    if (!confirmed) {
      return;
    }

    onDelete?.(department);
  }

  if (!departments.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Building2 size={18} />
        </div>

        <p className="mt-3 text-sm font-medium text-slate-700">
          No departments found
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Create your first department
          using the form.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-800">
          Departments
        </h2>

        <p className="mt-0.5 text-[10px] text-slate-400">
          {departments.length}{" "}
          {departments.length === 1
            ? "department"
            : "departments"}{" "}
          available
        </p>
      </div>

      {/* List */}

      <div className="divide-y divide-slate-100">
        {departments.map(
          (department) => {
            const employeeCount =
              getEmployeeCount(
                department
              );

            const isUsed =
              employeeCount > 0;

            return (
              <div
                key={department.id}
                className="flex items-center justify-between gap-3 px-4 py-3.5 transition hover:bg-slate-50"
              >
                {/* Department */}

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Building2
                      size={16}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-800">
                      {department.name}
                    </p>

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

                    {department.description ? (
                      <p className="mt-1 truncate text-[10px] text-slate-400">
                        {
                          department.description
                        }
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Delete */}

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      department
                    )
                  }
                  disabled={isUsed}
                  title={
                    isUsed
                      ? "Cannot delete a department assigned to employees"
                      : "Delete department"
                  }
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition",
                    isUsed
                      ? "cursor-not-allowed text-slate-200"
                      : "text-slate-400 hover:bg-red-50 hover:text-red-600",
                  ].join(" ")}
                  aria-label={`Delete ${department.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}