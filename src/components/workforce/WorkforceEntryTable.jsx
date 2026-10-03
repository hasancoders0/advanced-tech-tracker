"use client";

import { useMemo, useState } from "react";
import { Save } from "lucide-react";

import Button from "@/components/ui/Button";
import { useToast } from "@/components/feedback/ToastProvider";

import { workforceData } from "@/data/workforce/workforce-daily";
import DepartmentSection from "@/components/workforce/DepartmentSection";

function normalizeEntries() {
  return workforceData.map((employee) => ({
    ...employee,
    hoursProduced: Number(
      employee.hoursProduced ?? employee.hours ?? 0
    ),
    hoursWorked: Number(
      employee.hoursWorked ?? employee.hours ?? 0
    ),
    emergencyHours: Number(employee.emergencyHours ?? 0),
    workStatus:
      employee.workStatus ||
      (employee.status === "Inactive" ? "Off" : "Worked"),
    notes: employee.notes || "",
  }));
}

export default function WorkforceDailyView() {
  const { success } = useToast();

  const [entries, setEntries] = useState(normalizeEntries);
  const [revisionReason, setRevisionReason] = useState("");
  const [openDepartments, setOpenDepartments] = useState({});

  const groupedEntries = useMemo(() => {
    return entries.reduce((groups, entry) => {
      const department = entry.department || "Unassigned";

      if (!groups[department]) {
        groups[department] = [];
      }

      groups[department].push(entry);

      return groups;
    }, {});
  }, [entries]);

  const totals = useMemo(() => {
    return entries.reduce(
      (result, entry) => {
        result.produced += Number(entry.hoursProduced || 0);
        result.worked += Number(entry.hoursWorked || 0);
        result.emergency += Number(entry.emergencyHours || 0);

        if (entry.workStatus !== "Off") {
          result.employees += 1;
        }

        return result;
      },
      {
        employees: 0,
        produced: 0,
        worked: 0,
        emergency: 0,
      }
    );
  }, [entries]);

  function updateEntry(id, field, value) {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              [field]: value,
            }
          : entry
      )
    );
  }

  function toggleDepartment(department) {
    setOpenDepartments((current) => ({
      ...current,
      [department]: !current[department],
    }));
  }

  function saveEntries() {
    success("Workforce entries saved successfully.");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Today's Work
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update technician hours, status and notes.
          </p>
        </div>

        <Button onClick={saveEntries}>
          <Save size={16} />
          Save Entries
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
          Revision Reason
        </label>

        <input
          value={revisionReason}
          onChange={(event) =>
            setRevisionReason(event.target.value)
          }
          placeholder="Optional reason for post-submission changes"
          className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0877aa] focus:ring-2 focus:ring-[#0877aa]/10"
        />
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Workforce Entries
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Departments are collapsed by default.
              </p>
            </div>

            <span className="text-xs font-semibold text-slate-400">
              {entries.length} technicians
            </span>
          </div>
        </div>

        {Object.entries(groupedEntries).map(
          ([department, departmentEntries]) => (
            <DepartmentSection
              key={department}
              department={department}
              entries={departmentEntries}
              open={Boolean(openDepartments[department])}
              onToggle={() => toggleDepartment(department)}
              onChange={updateEntry}
            />
          )
        )}
      </section>
    </div>
  );
}

