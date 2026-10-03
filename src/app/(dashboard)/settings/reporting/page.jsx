"use client";

import { useState } from "react";
import {
  CalendarDays,
  Mail,
  Save,
  Send,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function ReportingSettingsPage() {
  const [period, setPeriod] = useState("Weekly");
  const [format, setFormat] = useState("PDF");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reporting Settings"
        description="Configure reporting periods, exports and scheduled reports."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Report Defaults</CardTitle>
            <CardDescription>
              Configure default reporting behavior.
            </CardDescription>
          </CardHeader>

          <div className="space-y-4">
            <Select
              label="Default Report Period"
              value={period}
              onChange={setPeriod}
              options={[
                {
                  value: "Daily",
                  label: "Daily",
                },
                {
                  value: "Weekly",
                  label: "Weekly",
                },
                {
                  value: "Monthly",
                  label: "Monthly",
                },
                {
                  value: "YTD",
                  label: "Year to Date",
                },
              ]}
            />

            <Select
              label="Default Export Format"
              value={format}
              onChange={setFormat}
              options={[
                {
                  value: "PDF",
                  label: "PDF",
                },
                {
                  value: "CSV",
                  label: "CSV",
                },
                {
                  value: "Excel",
                  label: "Excel",
                },
              ]}
            />

            <Select
              label="Default Filter"
              options={[
                {
                  value: "All",
                  label: "All Departments",
                },
                {
                  value: "Field Operations",
                  label: "Field Operations",
                },
                {
                  value: "Sales",
                  label: "Sales",
                },
              ]}
            />

            <Button>
              <Save size={16} />
              Save Reporting Settings
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Reporting</CardTitle>
            <CardDescription>
              Configure report recipients and scheduled delivery.
            </CardDescription>
          </CardHeader>

          <div className="space-y-4">
            <Input
              label="Report Recipient"
              type="email"
              defaultValue="manager@advancedtech.com"
            />

            <Select
              label="Schedule"
              options={[
                {
                  value: "Daily",
                  label: "Daily",
                },
                {
                  value: "Weekly",
                  label: "Weekly",
                },
                {
                  value: "Monthly",
                  label: "Monthly",
                },
              ]}
            />

            <Input
              label="Delivery Day"
              defaultValue="Monday"
            />

            <div className="flex flex-wrap gap-2">
              <Button variant="outline">
                <CalendarDays size={16} />
                Schedule Report
              </Button>

              <Button variant="outline">
                <Send size={16} />
                Send Test
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reporting Information</CardTitle>
          <CardDescription>
            Current prototype configuration.
          </CardDescription>
        </CardHeader>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs text-slate-500">
              Period
            </p>
            <p className="mt-1 font-medium text-slate-900">
              {period}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs text-slate-500">
              Format
            </p>
            <p className="mt-1 font-medium text-slate-900">
              {format}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs text-slate-500">
              Delivery
            </p>
            <p className="mt-1 flex items-center gap-2 font-medium text-slate-900">
              <Mail size={15} />
              Email
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
