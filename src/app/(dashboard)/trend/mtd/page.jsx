"use client";

import { useState } from "react";
import { Clock3, DollarSign } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

import TrendChart from "@/components/trend/TrendChart";
import DateRangeFilter from "@/components/trend/DateRangeFilter";

import { mtdTrendData } from "@/data/mock/trend-pages";

export default function MTDPage() {
  const [period, setPeriod] = useState("30");

  const hours = mtdTrendData.reduce(
    (total, item) => total + item.hours,
    0
  );

  const revenue = mtdTrendData.reduce(
    (total, item) => total + item.revenue,
    0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Month to Date"
        description="Current month workforce and sales performance."
      >
        <DateRangeFilter
          value={period}
          onChange={setPeriod}
        />
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="MTD Workforce Hours"
          value={`${hours} hrs`}
          icon={Clock3}
          trend={7.4}
          trendLabel="vs previous period"
        />

        <StatCard
          title="MTD Revenue"
          value={`$${revenue.toLocaleString()}`}
          icon={DollarSign}
          trend={10.8}
          trendLabel="vs previous period"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            MTD Performance
          </CardTitle>

          <CardDescription>
            Workforce hours and sales revenue by week.
          </CardDescription>
        </CardHeader>

        <TrendChart
          data={mtdTrendData}
          lines={[
            {
              dataKey: "hours",
              name: "Workforce Hours",
            },
            {
              dataKey: "revenue",
              name: "Sales Revenue",
            },
          ]}
        />
      </Card>
    </div>
  );
}
