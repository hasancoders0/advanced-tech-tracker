import {
  ArrowDown,
  ArrowUp,
} from "lucide-react";

export default function ComparisonCard({
  title,
  current,
  previous,
  suffix = "",
}) {
  const difference =
    previous === 0
      ? 0
      : ((current - previous) / previous) * 100;

  const positive = difference >= 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-semibold text-slate-900">
          {current}
          {suffix}
        </span>

        <span
          className={[
            "mb-1 inline-flex items-center gap-1 text-xs font-medium",
            positive
              ? "text-green-600"
              : "text-red-600",
          ].join(" ")}
        >
          {positive ? (
            <ArrowUp size={13} />
          ) : (
            <ArrowDown size={13} />
          )}

          {Math.abs(difference).toFixed(1)}%
        </span>
      </div>

      <p className="mt-1 text-xs text-slate-400">
        Previous period: {previous}
        {suffix}
      </p>
    </div>
  );
}