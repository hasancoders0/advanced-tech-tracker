"use client";

import {
  ShieldCheck,
  Users,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import Badge from "@/components/ui/Badge";

const roles = [
  {
    name: "Admin",
    description: "Full access to the application.",
    permissions: "All permissions",
  },
  {
    name: "Manager",
    description: "Manage daily operations and reports.",
    permissions: "Operations + Reports",
  },
  {
    name: "Editor",
    description: "Create and edit operational records.",
    permissions: "Daily + Sales",
  },
  {
    name: "Viewer",
    description: "Read-only access to application data.",
    permissions: "View only",
  },
];

export default function UsersPermissionsPage() {
  return (
    <div className="space-y-5">

      <PageHeader
        title="Users & Permissions"
        description="Manage application access and user roles."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.5fr]">

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Users size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  User Access
                </h2>

                <p className="text-xs text-slate-400">
                  Manage users in the application.
                </p>
              </div>

            </div>
          </div>

          <div className="p-5">

            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">

              <div>
                <p className="text-sm font-medium text-slate-800">
                  Current Users
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  User management will connect to authentication later.
                </p>
              </div>

              <span className="text-xl font-semibold text-slate-900">
                0
              </span>

            </div>

          </div>

        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <ShieldCheck size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Roles & Permissions
                </h2>

                <p className="text-xs text-slate-400">
                  Application roles planned for access control.
                </p>
              </div>

            </div>
          </div>

          <div className="divide-y divide-slate-100">

            {roles.map((role) => (
              <div
                key={role.name}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >

                <div className="min-w-0">

                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800">
                      {role.name}
                    </p>

                    <Badge variant="default">
                      Planned
                    </Badge>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    {role.description}
                  </p>

                </div>

                <p className="shrink-0 text-xs font-medium text-slate-500">
                  {role.permissions}
                </p>

              </div>
            ))}

          </div>

        </section>

      </div>

    </div>
  );
}
