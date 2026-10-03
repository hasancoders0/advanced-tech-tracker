import {
  Users,
  Clock3,
  Timer,
  TriangleAlert,
} from "lucide-react";

export default function DailyStats({
  activeTab,
  workforceTotals = {},
  salesTotals = {},
}) {
  const employees =
    Number(workforceTotals.employees) || 0;

  const produced =
    Number(workforceTotals.produced) || 0;

  const worked =
    Number(workforceTotals.worked) || 0;

  const emergency =
    Number(workforceTotals.emergency) || 0;

  const salesCount =
    Number(salesTotals.count) || 0;

  const salesRevenue =
    Number(salesTotals.revenue) || 0;

  const workStats = [
    {
      title: "Employees",
      value: employees,
      description: "Working today",
      icon: Users,
      danger: false,
    },
    {
      title: "Hours Produced",
      value: produced.toFixed(2),
      description: "Total produced",
      icon: Clock3,
      danger: false,
    },
    {
      title: "Hours Worked",
      value: worked.toFixed(2),
      description: "Regular hours worked",
      icon: Timer,
      danger: false,
    },
    {
      title: "Emergency Hours",
      value: emergency.toFixed(2),
      description: "Extra work",
      icon: TriangleAlert,
      danger: true,
    },
  ];

  const salesStats = [
    {
      title: "Sales",
      value: salesCount,
      description: "Sales today",
      icon: Users,
      danger: false,
    },
    {
      title: "Revenue",
      value: `$${salesRevenue.toFixed(2)}`,
      description: "Total revenue",
      icon: Clock3,
      danger: false,
    },
    {
      title: "Average Sale",
      value: salesCount
        ? `$${(salesRevenue / salesCount).toFixed(2)}`
        : "$0.00",
      description: "Average value",
      icon: Timer,
      danger: false,
    },
    {
      title: "Pending",
      value: "0",
      description: "Pending sales",
      icon: TriangleAlert,
      danger: true,
    },
  ];

  const stats =
    activeTab === "sales"
      ? salesStats
      : workStats;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">
                  {stat.title}
                </p>

                <p
                  className={[
                    "mt-2 truncate text-lg font-semibold tracking-tight sm:text-xl",
                    stat.danger
                      ? "text-red-600"
                      : "text-slate-950",
                  ].join(" ")}
                >
                  {stat.value}
                </p>
              </div>

              <div
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9",
                  stat.danger
                    ? "bg-red-50 text-red-500"
                    : "bg-slate-100 text-slate-600",
                ].join(" ")}
              >
                <Icon size={17} />
              </div>
            </div>

            <p className="mt-2 truncate text-[11px] text-slate-400 sm:text-xs">
              {stat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}