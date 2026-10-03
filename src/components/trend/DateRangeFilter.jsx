"use client";

import Select from "@/components/ui/Select";

export default function DateRangeFilter({
  value,
  onChange,
}) {
  return (
    <div className="w-full sm:w-48">
      <Select
        label="Period"
        value={value}
        onChange={onChange}
        options={[
          {
            value: "7",
            label: "Last 7 Days",
          },
          {
            value: "14",
            label: "Last 14 Days",
          },
          {
            value: "30",
            label: "Last 30 Days",
          },
          {
            value: "90",
            label: "Last 90 Days",
          },
        ]}
      />
    </div>
  );
}