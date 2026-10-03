import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

import TrendChart from "@/components/trend/TrendChart";

import { ytdData } from "@/data/mock/trend-pages";

export default function YTDPage() {
  const revenue = ytdData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  const hours = ytdData.reduce(
    (sum, item) => sum + item.hours,
    0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Year to Date"
        description="Current year workforce and sales performance."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="YTD Revenue"
          value={`$${revenue.toLocaleString()}`}
        />

        <StatCard
          title="YTD Workforce Hours"
          value={`${hours.toLocaleString()} hrs`}
        />

        <StatCard
          title="Months Reported"
          value={ytdData.length}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            YTD Performance
          </CardTitle>

          <CardDescription>
            Monthly performance throughout the year.
          </CardDescription>
        </CardHeader>

        <TrendChart
          data={ytdData}
          lines={[
            {
              dataKey: "revenue",
              name: "Sales Revenue",
            },
            {
              dataKey: "hours",
              name: "Workforce Hours",
            },
          ]}
        />
      </Card>
    </div>
  );
}
