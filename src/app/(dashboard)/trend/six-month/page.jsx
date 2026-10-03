import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

import TrendChart from "@/components/trend/TrendChart";

import { sixMonthData } from "@/data/mock/trend-pages";

export default function SixMonthPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="6 Month Trend"
        description="Six month historical performance."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Latest Revenue"
          value="$268,600"
        />

        <StatCard
          title="Latest Workforce Hours"
          value="1,519 hrs"
        />

        <StatCard
          title="Period Months"
          value="6"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Six Month Performance
          </CardTitle>

          <CardDescription>
            Monthly workforce hours and revenue.
          </CardDescription>
        </CardHeader>

        <TrendChart
          data={sixMonthData}
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
