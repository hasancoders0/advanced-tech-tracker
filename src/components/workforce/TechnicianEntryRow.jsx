"use client";

const STATUS_OPTIONS = [
  "Worked",
  "Called Out",
  "PTO",
  "Off",
];

function NumberInput({
  value,
  onChange,
}) {
  return (
    <input
      type="number"
      min="0"
      step="0.25"
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0877aa] focus:ring-2 focus:ring-[#0877aa]/10"
    />
  );
}

export default function TechnicianEntryRow({
  entry,
  onChange,
}) {
  return (
    <div className="border-t border-slate-100 p-4 lg:p-0">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr_1.5fr] lg:items-center lg:gap-3 lg:px-4 lg:py-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {entry.name}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {entry.employeeId || entry.id}
          </p>

          <div className="mt-2 lg:hidden">
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Status
            </label>

            <select
              value={entry.workStatus}
              onChange={(event) =>
                onChange(
                  entry.id,
                  "workStatus",
                  event.target.value
                )
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0877aa]"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500 lg:hidden">
            Hours Produced
          </label>

          <NumberInput
            value={entry.hoursProduced}
            onChange={(value) =>
              onChange(entry.id, "hoursProduced", value)
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500 lg:hidden">
            Hours Worked
          </label>

          <NumberInput
            value={entry.hoursWorked}
            onChange={(value) =>
              onChange(entry.id, "hoursWorked", value)
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500 lg:hidden">
            Emergency Hours
          </label>

          <NumberInput
            value={entry.emergencyHours}
            onChange={(value) =>
              onChange(entry.id, "emergencyHours", value)
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500 lg:hidden">
            Notes
          </label>

          <textarea
            rows={2}
            value={entry.notes}
            onChange={(event) =>
              onChange(entry.id, "notes", event.target.value)
            }
            placeholder="Add notes..."
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0877aa] focus:ring-2 focus:ring-[#0877aa]/10"
          />
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="grid grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr_1.5fr] gap-3 px-4 pb-3">
          <div>
            <select
              value={entry.workStatus}
              onChange={(event) =>
                onChange(
                  entry.id,
                  "workStatus",
                  event.target.value
                )
              }
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-[#0877aa]"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-4" />
        </div>
      </div>
    </div>
  );
}