import {
  AlertTriangle,
  Clock3,
  Users,
} from "lucide-react";

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  danger = false,
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">
            {label}
          </p>

          <p
            className={[
              "mt-2 text-xl font-semibold tracking-tight sm:text-2xl",
              danger ? "text-red-600" : "text-slate-900",
            ].join(" ")}
          >
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-slate-400">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              danger
                ? "bg-red-50 text-red-500"
                : "bg-slate-100 text-slate-600",
            ].join(" ")}
          >
            <Icon size={17} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function DailySummary({
  employees = 0,
  hoursProduced = 0,
  hoursWorked = 0,
  emergencyHours = 0,
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Employees"
        value={employees}
        description="Working today"
        icon={Users}
      />

      <SummaryCard
        label="Hours Produced"
        value={Number(hoursProduced).toFixed(2)}
        description="Total produced"
        icon={Clock3}
      />

      <SummaryCard
        label="Hours Worked"
        value={Number(hoursWorked).toFixed(2)}
        description="Total worked"
        icon={Clock3}
      />

      <SummaryCard
        label="Emergency Hours"
        value={Number(emergencyHours).toFixed(2)}
        description="Emergency work"
        icon={AlertTriangle}
        danger={Number(emergencyHours) > 0}
      />
    </div>
  );
}