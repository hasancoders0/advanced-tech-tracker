import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function TrendMetricCard({
  label,
  value,
  description,
  icon: Icon,
  danger = false,
  trend,
}) {
  const positive = Number(trend) >= 0;

  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500">
            {label}
          </p>

          <div className="mt-1 flex items-baseline gap-2">
            <p
              className={[
                "text-xl font-semibold tracking-tight",
                danger ? "text-red-600" : "text-slate-900",
              ].join(" ")}
            >
              {value}
            </p>

            {trend !== undefined && (
              <span
                className={[
                  "inline-flex items-center text-[11px] font-medium",
                  positive ? "text-emerald-600" : "text-red-600",
                ].join(" ")}
              >
                {positive ? (
                  <ArrowUpRight size={13} />
                ) : (
                  <ArrowDownRight size={13} />
                )}
                {Math.abs(Number(trend))}%
              </span>
            )}
          </div>

          {description && (
            <p className="mt-1 text-[11px] text-slate-400">
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
            <Icon size={16} />
          </div>
        )}
      </div>
    </div>
  );
}
