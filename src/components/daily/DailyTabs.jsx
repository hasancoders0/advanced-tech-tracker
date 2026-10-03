"use client";

import { ShoppingCart, Users } from "lucide-react";

export default function DailyTabs({
  activeTab = "work",
  onChange,
}) {
  return (
    <div className="flex w-fit items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={() => onChange("work")}
        className={[
          "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition",
          activeTab === "work"
            ? "bg-sky-600 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        ].join(" ")}
      >
        <Users size={16} />
        Today's Work
      </button>

      <button
        type="button"
        onClick={() => onChange("sales")}
        className={[
          "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition",
          activeTab === "sales"
            ? "bg-sky-600 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        ].join(" ")}
      >
        <ShoppingCart size={16} />
        Today's Sales
      </button>
    </div>
  );
}