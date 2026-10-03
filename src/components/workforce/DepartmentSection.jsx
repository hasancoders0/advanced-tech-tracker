"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import TechnicianEntryRow from "@/components/workforce/TechnicianEntryRow";

export default function DepartmentSection({
  department,
  entries,
  open,
  onToggle,
  onChange,
}) {
  return (
    <section className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between bg-slate-50 px-4 py-4 text-left transition hover:bg-slate-100"
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown size={18} className="text-[#0877aa]" />
          ) : (
            <ChevronRight size={18} className="text-[#0877aa]" />
          )}

          <span className="text-sm font-bold uppercase tracking-wide text-slate-800">
            {department}
          </span>

          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-400">
            {entries.length}
          </span>
        </div>
      </button>

      {open && (
        <div>
          <div className="hidden grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr_1.5fr] gap-3 border-b border-slate-100 bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-400 lg:grid">
            <span>Tech</span>
            <span>Hours Produced</span>
            <span>Hours Worked</span>
            <span>Emergency Hours</span>
            <span>Notes</span>
          </div>

          {entries.map((entry) => (
            <TechnicianEntryRow
              key={entry.id}
              entry={entry}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </section>
  );
}