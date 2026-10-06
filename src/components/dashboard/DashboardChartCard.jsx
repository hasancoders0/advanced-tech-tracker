"use client";

export default function DashboardChartCard({
  title,
  description,
  children,
  className = "",
}) {
  return (
    <section
      className={[
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        className,
      ].join(" ")}
    >
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-800">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        )}
      </div>

      <div className="p-5">
        {children}
      </div>
    </section>
  );
}