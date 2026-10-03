"use client";

import Link from "next/link";
import PageHeader from "@/components/common/PageHeader";
import Card from "@/components/ui/Card";

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Manage employees and workforce records."
      />

      <Card>
        <div className="p-6">
          <p className="text-sm text-slate-500">
            Employee management will be implemented here.
          </p>

          <Link
            href="/workforce/today"
            className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Go to Today's Work
          </Link>
        </div>
      </Card>
    </div>
  );
}