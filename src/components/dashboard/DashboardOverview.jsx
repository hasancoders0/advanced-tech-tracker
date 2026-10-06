"use client";

import {
  AlertTriangle,
  Clock3,
  DollarSign,
  ShoppingCart,
  Users,
} from "lucide-react";

import StatCard from "@/components/common/StatCard";
import DashboardChartCard from "@/components/dashboard/DashboardChartCard";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DashboardOverview({
  workforceStats,
  salesStats,
  workforceChartData = [],
  salesChartData = [],
  departmentData = [],
}) {
  return (
    <div className="space-y-5">
      {/* ===================================================
          WORKFORCE STATS
      =================================================== */}

      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Workforce Overview
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Today&apos;s workforce activity and production.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Today's Employees"
            value={workforceStats.employees}
            description="Employees with activity"
            icon={Users}
          />

          <StatCard
            title="Hours Produced"
            value={workforceStats.produced}
            description="Total produced"
            icon={Clock3}
          />

          <StatCard
            title="Hours Worked"
            value={workforceStats.worked}
            description="Total worked"
            icon={Clock3}
          />

          <StatCard
            title="Emergency Hours"
            value={workforceStats.emergency}
            description="Emergency work"
            icon={AlertTriangle}
          />
        </div>
      </section>

      {/* ===================================================
          SALES STATS
      =================================================== */}

      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Sales Overview
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Today&apos;s sales activity and revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Today's Sales"
            value={salesStats.count}
            description="Sales recorded"
            icon={ShoppingCart}
          />

          <StatCard
            title="Revenue"
            value={`$${salesStats.revenue.toFixed(2)}`}
            description="Today's revenue"
            icon={DollarSign}
          />

          <StatCard
            title="Average Sale"
            value={`$${salesStats.average.toFixed(2)}`}
            description="Average sale value"
            icon={DollarSign}
          />

          <StatCard
            title="Outstanding"
            value={`$${salesStats.outstanding.toFixed(2)}`}
            description="Pending payments"
            icon={AlertTriangle}
          />
        </div>
      </section>

      {/* ===================================================
          CHARTS
      =================================================== */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Workforce Trend */}

        <DashboardChartCard
          title="Workforce Hours Trend"
          description="Produced and worked hours over the selected period."
        >
          <div className="h-[300px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={workforceChartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="label"
                  tick={{
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="produced"
                  name="Produced"
                  stroke="currentColor"
                  fill="currentColor"
                  fillOpacity={0.08}
                />

                <Area
                  type="monotone"
                  dataKey="worked"
                  name="Worked"
                  stroke="currentColor"
                  fill="currentColor"
                  fillOpacity={0.03}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardChartCard>

        {/* Sales Revenue */}

        <DashboardChartCard
          title="Sales Revenue Trend"
          description="Revenue generated across recent sales dates."
        >
          <div className="h-[300px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={salesChartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="label"
                  tick={{
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value) =>
                    `$${Number(value).toFixed(2)}`
                  }
                />

                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  radius={[5, 5, 0, 0]}
                  fill="currentColor"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardChartCard>
      </div>

      {/* ===================================================
          DEPARTMENT PERFORMANCE
      =================================================== */}

      <DashboardChartCard
        title="Department Performance"
        description="Produced hours by department."
      >
        <div className="h-[320px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={departmentData}
              layout="vertical"
              margin={{
                top: 5,
                right: 20,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
              />

              <XAxis
                type="number"
                tick={{
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                type="category"
                dataKey="department"
                width={90}
                tick={{
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Bar
                dataKey="produced"
                name="Produced Hours"
                radius={[0, 5, 5, 0]}
                fill="currentColor"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardChartCard>
    </div>
  );
}