"use client";

import Link from "next/link";
import {
  ArrowRight,
  Database,
  FileText,
  Settings,
  Shield,
  Users,
  Wrench,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

const settingsItems = [
  {
    title: "Main Settings",
    description:
      "Manage departments, data management, backups, audit logs and application preferences.",
    href: "/settings/main",
    icon: Settings,
  },
  {
    title: "Reporting",
    description:
      "Configure report periods, default filters, exports, recipients and scheduled reporting.",
    href: "/settings/reporting",
    icon: FileText,
  },
  {
    title: "Tech Management",
    description:
      "Manage technicians, departments, status, assignments and technician history.",
    href: "/settings/tech-management",
    icon: Wrench,
  },
  {
    title: "User Management",
    description:
      "Manage users, roles, permissions, status and system access.",
    href: "/settings/user-management",
    icon: Users,
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage administrative configuration for Advanced Tech Tracker."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {settingsItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group"
            >
              <Card className="h-full transition hover:border-slate-300 hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <Icon size={20} />
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700"
                    />
                  </div>

                  <CardTitle className="mt-4">
                    {item.title}
                  </CardTitle>

                  <CardDescription>
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Prototype configuration overview.
          </CardDescription>
        </CardHeader>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <Database
              size={18}
              className="text-slate-500"
            />
            <p className="mt-3 text-sm font-medium text-slate-900">
              Data Source
            </p>
            <p className="mt-1 text-xs text-slate-500">
              JSON Mock Data
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <Shield
              size={18}
              className="text-slate-500"
            />
            <p className="mt-3 text-sm font-medium text-slate-900">
              Access Control
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Prototype permissions
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <Settings
              size={18}
              className="text-slate-500"
            />
            <p className="mt-3 text-sm font-medium text-slate-900">
              Application
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Advanced Tech Tracker
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
