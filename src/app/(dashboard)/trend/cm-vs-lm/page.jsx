import { Clock3, DollarSign, ShoppingCart } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import ComparisonCard from "@/components/trend/ComparisonCard";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

import { comparisonData } from "@/data/mock/trend-pages";

export default function CMvsLMPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Current Month vs Last Month"
        description="Compare current month performance with the previous month."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <ComparisonCard
          title="Workforce Hours"
          current={comparisonData[0].current}
          previous={comparisonData[0].previous}
          suffix=" hrs"
        />

        <ComparisonCard
          title="Sales Revenue"
          current={`$${comparisonData[1].current.toLocaleString()}`}
          previous={`$${comparisonData[1].previous.toLocaleString()}`}
        />

        <ComparisonCard
          title="Sales Count"
          current={comparisonData[2].current}
          previous={comparisonData[2].previous}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Period Comparison
          </CardTitle>

          <CardDescription>
            Current month and previous month summary.
          </CardDescription>
        </CardHeader>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <Clock3
              size={19}
              className="text-slate-500"
            />

            <p className="mt-3 text-sm text-slate-500">
              Workforce Hours
            </p>

            <p className="mt-1 text-xl font-semibold text-slate-900">
              1,519 hrs
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <DollarSign
              size={19}
              className="text-slate-500"
            />

            <p className="mt-3 text-sm text-slate-500">
              Revenue
            </p>

            <p className="mt-1 text-xl font-semibold text-slate-900">
              $268,600
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <ShoppingCart
              size={19}
              className="text-slate-500"
            />

            <p className="mt-3 text-sm text-slate-500">
              Sales
            </p>

            <p className="mt-1 text-xl font-semibold text-slate-900">
              86
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
