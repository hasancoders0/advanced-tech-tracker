"use client";

import Select from "@/components/ui/Select";

export default function FilterBar({
  filters = [],
  children,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end">
      {filters.map((filter) => (
        <div
          key={filter.name}
          className="w-full sm:min-w-40 sm:flex-1 lg:flex-none"
        >
          <Select
            label={filter.label}
            value={filter.value}
            onChange={filter.onChange}
            options={filter.options}
          />
        </div>
      ))}

      {children}
    </div>
  );
}
