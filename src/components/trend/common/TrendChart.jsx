"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function TrendChart({
  title,
  description,
  data = [],
  dataKey = "value",
  xKey = "label",
  valuePrefix = "",
  valueSuffix = "",
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
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

      <div className="h-[280px] w-full p-4 sm:h-[320px]">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey={xKey}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "#94a3b8",
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "#94a3b8",
                }}
              />

              <Tooltip
                formatter={(value) =>
                  `${valuePrefix}${Number(value || 0).toLocaleString()}${valueSuffix}`
                }
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  boxShadow:
                    "0 8px 25px rgba(15, 23, 42, 0.08)",
                }}
              />

              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#087eae"
                strokeWidth={2.5}
                dot={{
                  r: 3,
                  strokeWidth: 2,
                  fill: "#ffffff",
                }}
                activeDot={{
                  r: 5,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-400">
              No trend data available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
