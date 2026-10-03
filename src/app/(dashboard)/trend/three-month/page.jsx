import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

import TrendChart from "@/components/trend/TrendChart";

import { threeMonthData } from "@/data/mock/trend-pages";

export default function ThreeMonthPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="3 Month Trend"
        description="Three month historical performance."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Latest Revenue"
          value="$268,600"
        />

        <StatCard
          title="Latest Workforce Hours"
          value="1,519 hrs"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Three Month Performance
          </CardTitle>

          <CardDescription>
            Monthly workforce hours and revenue.
          </CardDescription>
        </CardHeader>

        <TrendChart
          data={threeMonthData}
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
