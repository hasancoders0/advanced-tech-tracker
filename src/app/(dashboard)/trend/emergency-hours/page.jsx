import { Clock3 } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

import TrendChart from "@/components/trend/TrendChart";

import { emergencyHoursData } from "@/data/mock/trend-pages";

export default function EmergencyHoursPage() {
  const total = emergencyHoursData.reduce(
    (sum, item) => sum + item.hours,
    0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emergency Hours"
        description="Historical emergency workforce hours."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Emergency Hours"
          value={`${total} hrs`}
          icon={Clock3}
        />

        <StatCard
          title="Average Per Day"
          value={`${(total / 7).toFixed(1)} hrs`}
          icon={Clock3}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Emergency Hours Trend
          </CardTitle>

          <CardDescription>
            Daily emergency hours.
          </CardDescription>
        </CardHeader>

        <TrendChart
          data={emergencyHoursData}
          lines={[
            {
              dataKey: "hours",
              name: "Emergency Hours",
            },
          ]}
        />
      </Card>
    </div>
  );
}
