"use client";

import { useState } from "react";
import {
  Clock3,
  DollarSign,
  Users,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";

import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

import TrendChart from "@/components/trend/TrendChart";
import ComparisonCard from "@/components/trend/ComparisonCard";
import DateRangeFilter from "@/components/trend/DateRangeFilter";

import {
  weeklyTrendData,
} from "@/data/mock/trends";

export default function WeekTrendPage() {
  const [period, setPeriod] = useState("7");

  const totalHours = weeklyTrendData.reduce(
    (total, item) =>
      total + item.workforceHours,
    0
  );

  const totalRevenue = weeklyTrendData.reduce(
    (total, item) =>
      total + item.salesRevenue,
    0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Trend"
        description="Historical workforce and sales performance."
      >
        <DateRangeFilter
          value={period}
          onChange={setPeriod}
        />
      </PageHeader>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Workforce Hours"
          value={`${totalHours} hrs`}
          icon={Clock3}
          trend={6.4}
          trendLabel="vs previous period"
        />

        <StatCard
          title="Sales Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={9.2}
          trendLabel="vs previous period"
        />

        <StatCard
          title="Avg Daily Hours"
          value={`${Math.round(
            totalHours / 7
          )} hrs`}
          icon={Users}
        />

        <ComparisonCard
          title="Revenue Growth"
          current={totalRevenue}
          previous={112400}
          suffix=""
        />
      </div>

      {/* Workforce Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            Workforce Hours Trend
          </CardTitle>

          <CardDescription>
            Workforce hours across the selected period.
          </CardDescription>
        </CardHeader>

        <TrendChart
          data={weeklyTrendData}
          lines={[
            {
              dataKey: "workforceHours",
              name: "Workforce Hours",
            },
          ]}
        />
      </Card>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            Sales Revenue Trend
          </CardTitle>

          <CardDescription>
            Sales revenue across the selected period.
          </CardDescription>
        </CardHeader>

        <TrendChart
          data={weeklyTrendData}
          lines={[
            {
              dataKey: "salesRevenue",
              name: "Sales Revenue",
            },
          ]}
        />
      </Card>

      {/* Combined Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            Workforce vs Sales
          </CardTitle>

          <CardDescription>
            Combined trend comparison.
          </CardDescription>
        </CardHeader>

        <TrendChart
          data={weeklyTrendData}
          lines={[
            {
              dataKey: "workforceHours",
              name: "Workforce Hours",
            },
            {
              dataKey: "salesRevenue",
              name: "Sales Revenue",
            },
          ]}
        />
      </Card>
    </div>
  );
}