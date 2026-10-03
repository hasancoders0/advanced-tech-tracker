import { PhoneCall } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

import TrendChart from "@/components/trend/TrendChart";

import { callOutData } from "@/data/mock/trend-pages";

export default function CallOutsPage() {
  const total = callOutData.reduce(
    (sum, item) => sum + item.callOuts,
    0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Call Outs"
        description="Historical employee call out activity."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Total Call Outs"
          value={total}
          icon={PhoneCall}
        />

        <StatCard
          title="Average Per Day"
          value={(total / 7).toFixed(1)}
          icon={PhoneCall}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Call Out Trend
          </CardTitle>

          <CardDescription>
            Daily call out activity.
          </CardDescription>
        </CardHeader>

        <TrendChart
          data={callOutData}
          lines={[
            {
              dataKey: "callOuts",
              name: "Call Outs",
            },
          ]}
        />
      </Card>
    </div>
  );
}
