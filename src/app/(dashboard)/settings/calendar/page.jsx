"use client";

import {
  CalendarDays,
  Clock3,
  Save,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export default function CalendarSettingsPage() {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="space-y-5">

      <PageHeader
        title="Calendar"
        description="Configure working days, business hours, and calendar preferences."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <CalendarDays size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Working Days
                </h2>

                <p className="text-xs text-slate-400">
                  Select the normal business days.
                </p>
              </div>

            </div>
          </div>

          <div className="space-y-2 p-5">

            {days.map((day) => (
              <label
                key={day}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3"
              >
                <span className="text-sm text-slate-700">
                  {day}
                </span>

                <input
                  type="checkbox"
                  defaultChecked={
                    !["Saturday", "Sunday"].includes(day)
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
              </label>
            ))}

          </div>

        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Clock3 size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Calendar Preferences
                </h2>

                <p className="text-xs text-slate-400">
                  Configure default calendar behavior.
                </p>
              </div>

            </div>
          </div>

          <div className="grid gap-4 p-5">

            <Select
              label="Week Starts On"
              value="Monday"
              onChange={() => {}}
              options={[
                {
                  value: "Monday",
                  label: "Monday",
                },
                {
                  value: "Sunday",
                  label: "Sunday",
                },
              ]}
            />

            <Select
              label="Default Time Format"
              value="12"
              onChange={() => {}}
              options={[
                {
                  value: "12",
                  label: "12-hour",
                },
                {
                  value: "24",
                  label: "24-hour",
                },
              ]}
            />

            <div className="grid grid-cols-2 gap-3">

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Start Time
                </label>

                <input
                  type="time"
                  defaultValue="08:00"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  End Time
                </label>

                <input
                  type="time"
                  defaultValue="17:00"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
                />
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <Button>
                <Save size={16} />
                Save Changes
              </Button>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
}
