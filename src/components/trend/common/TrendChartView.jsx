"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function TrendChartView({
  view = "line",
  data = [],
  xKey = "label",
  series = [],
  title = "Trend",
  description = "",
}) {
  if (!data.length) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-400">
        No chart data available.
      </div>
    );
  }

  const activeSeries = series.length
    ? series
    : [{ dataKey: "value", label: "Value" }];

  const tooltipFormatter = (value, name) => [
    value,
    name,
  ];

  function chartContent() {
    if (view === "pie") {
      const pieSeries = activeSeries[0];

      return (
        <PieChart>
          <Tooltip formatter={tooltipFormatter} />

          <Pie
            data={data}
            dataKey={pieSeries.dataKey}
            nameKey={xKey}
            cx="50%"
            cy="50%"
            outerRadius={110}
            innerRadius={45}
            paddingAngle={2}
          >
            {data.map((item, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`hsl(${(index * 47) % 360} 65% 52%)`}
              />
            ))}
          </Pie>
        </PieChart>
      );
    }

    if (view === "scatter") {
      const scatterSeries = activeSeries[0];

      return (
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            type="number"
            dataKey={xKey}
            name={xKey}
          />

          <YAxis
            type="number"
            dataKey={scatterSeries.dataKey}
            name={scatterSeries.label}
          />

          <Tooltip cursor={{ strokeDasharray: "3 3" }} />

          <Scatter
            name={scatterSeries.label}
            data={data}
          />
        </ScatterChart>
      );
    }

    if (view === "area") {
      return (
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey={xKey} />

          <YAxis />

          <Tooltip />

          {activeSeries.map((item) => (
            <Area
              key={item.dataKey}
              type="monotone"
              dataKey={item.dataKey}
              name={item.label}
              fill="hsl(198 85% 43% / 0.18)"
              stroke="hsl(198 85% 43%)"
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      );
    }

    if (view === "bar") {
      return (
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 20, right: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis type="number" />

          <YAxis
            type="category"
            dataKey={xKey}
            width={90}
          />

          <Tooltip />

          {activeSeries.map((item) => (
            <Bar
              key={item.dataKey}
              dataKey={item.dataKey}
              name={item.label}
              fill="hsl(198 85% 43%)"
              radius={[0, 4, 4, 0]}
            />
          ))}
        </BarChart>
      );
    }

    if (view === "column") {
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey={xKey} />

          <YAxis />

          <Tooltip />

          {activeSeries.map((item) => (
            <Bar
              key={item.dataKey}
              dataKey={item.dataKey}
              name={item.label}
              fill="hsl(198 85% 43%)"
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      );
    }

    return (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey={xKey} />

        <YAxis />

        <Tooltip />

        {activeSeries.map((item) => (
          <Line
            key={item.dataKey}
            type="monotone"
            dataKey={item.dataKey}
            name={item.label}
            stroke="hsl(198 85% 43%)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-800">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        )}
      </div>

      <div className="h-[380px] w-full p-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartContent()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
