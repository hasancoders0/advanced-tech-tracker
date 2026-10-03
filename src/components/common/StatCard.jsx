import {
  ArrowDown,
  ArrowUp,
} from "lucide-react";

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendLabel,
}) {
  const isPositive = trend >= 0;

  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 truncate text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            {value}
          </p>
        </div>

        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 sm:h-10 sm:w-10">
            <Icon size={18} />
          </div>
        )}
      </div>

      {(description || trend !== undefined) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:mt-4">
          {trend !== undefined && (
            <span
              className={[
                "inline-flex items-center gap-1 font-medium",
                isPositive
                  ? "text-green-600"
                  : "text-red-600",
              ].join(" ")}
            >
              {isPositive ? (
                <ArrowUp size={13} />
              ) : (
                <ArrowDown size={13} />
              )}

              {Math.abs(trend)}%
            </span>
          )}

          {trendLabel && (
            <span className="text-slate-400">
              {trendLabel}
            </span>
          )}

          {description && (
            <span className="text-slate-400">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
