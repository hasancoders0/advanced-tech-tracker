"use client";

import { useMemo } from "react";
import {
  Activity,
  Clock3,
  DollarSign,
  ShoppingCart,
  Users,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/common/DataTable";

import { workforceData } from "@/data/workforce/workforce-daily";
import salesData from "@/data/sales/sales-daily";
import { customersData } from "@/data/master/customers";
import productsData from "@/data/master/items";

export default function DashboardPage() {
  const customerMap = useMemo(() => {
    return Object.fromEntries(
      customersData.map((customer) => [
        customer.id,
        customer,
      ])
    );
  }, []);

  const productMap = useMemo(() => {
    return Object.fromEntries(
      productsData.map((product) => [
        product.id,
        product,
      ])
    );
  }, []);

  const activeTechnicians = workforceData.filter(
    (employee) => employee.status === "Active"
  );

  const totalHours = workforceData.reduce(
    (sum, employee) => sum + employee.hours,
    0
  );

  const emergencyHours = workforceData.reduce(
    (sum, employee) =>
      sum + employee.emergencyHours,
    0
  );

  const completedSales = salesData.filter(
    (sale) => sale.status === "Completed"
  );

  const pendingSales = salesData.filter(
    (sale) => sale.status === "Pending"
  );

  const completedRevenue = completedSales.reduce(
    (sum, sale) => sum + sale.amount,
    0
  );

  const pendingRevenue = pendingSales.reduce(
    (sum, sale) => sum + sale.amount,
    0
  );

  const departmentData = useMemo(() => {
    const departments = {};

    workforceData.forEach((employee) => {
      if (!departments[employee.department]) {
        departments[employee.department] = {
          department: employee.department,
          hours: 0,
          employees: 0,
        };
      }

      departments[employee.department].hours +=
        employee.hours;

      departments[employee.department].employees += 1;
    });

    return Object.values(departments);
  }, []);

  const workforceTrend = useMemo(() => {
    const days = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];

    return days.map((day, index) => ({
      day,
      hours:
        Math.max(
          0,
          totalHours -
            (days.length - index - 1) * 4
        ),
      sales:
        completedRevenue -
        (days.length - index - 1) * 180,
    }));
  }, [totalHours, completedRevenue]);

  const recentSales = salesData.slice(0, 5);

  const recentSaleColumns = [
    {
      key: "id",
      label: "Sale",
      render: (row) => (
        <span className="font-medium text-slate-900">
          {row.id}
        </span>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (row) => {
        const customer =
          customerMap[row.customerId];

        return (
          <div>
            <p className="font-medium text-slate-800">
              {customer?.name || "Unknown"}
            </p>
            <p className="text-xs text-slate-400">
              {customer?.company || ""}
            </p>
          </div>
        );
      },
    },
    {
      key: "product",
      label: "Product / Service",
      render: (row) => {
        const product =
          productMap[row.productId];

        return product?.name || "Unknown";
      },
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => (
        <span className="font-medium">
          ${row.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const variants = {
          Completed: "success",
          Pending: "warning",
          Cancelled: "danger",
        };

        return (
          <Badge variant={variants[row.status]}>
            {row.status}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of today's workforce and sales activity."
      />

      {/* Main Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Today's Technicians"
          value={activeTechnicians.length}
          description="Active employees"
          icon={Users}
        />

        <StatCard
          title="Hours Produced"
          value={`${totalHours.toFixed(1)}h`}
          description="Workforce hours"
          icon={Clock3}
        />

        <StatCard
          title="Emergency Hours"
          value={`${emergencyHours.toFixed(1)}h`}
          description="Emergency work"
          icon={AlertCircle}
        />

        <StatCard
          title="Today's Revenue"
          value={`$${completedRevenue.toLocaleString()}`}
          description="Completed sales"
          icon={DollarSign}
        />
      </div>

      {/* Sales Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Sales Count"
          value={salesData.length}
          description="Total sales records"
          icon={ShoppingCart}
        />

        <StatCard
          title="Completed Sales"
          value={completedSales.length}
          description="Completed transactions"
          icon={TrendingUp}
        />

        <StatCard
          title="Pending Payments"
          value={`$${pendingRevenue.toLocaleString()}`}
          description="Pending revenue"
          icon={DollarSign}
        />

        <StatCard
          title="Customers"
          value={customersData.length}
          description="Registered customers"
          icon={Users}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              Workforce Hours Trend
            </CardTitle>

            <CardDescription>
              Workforce hours across the current week.
            </CardDescription>
          </CardHeader>

          <div className="h-[320px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={workforceTrend}
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
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="hours"
                  name="Hours"
                  stroke="#0f172a"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Sales Revenue Trend
            </CardTitle>

            <CardDescription>
              Revenue generated across the current week.
            </CardDescription>
          </CardHeader>

          <div className="h-[320px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={workforceTrend}
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
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="sales"
                  name="Revenue"
                  stroke="#475569"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle>
            Department Performance
          </CardTitle>

          <CardDescription>
            Workforce hours by department.
          </CardDescription>
        </CardHeader>

        <div className="h-[320px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={departmentData}
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
                dataKey="department"
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="hours"
                name="Hours"
                fill="#334155"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="employees"
                name="Employees"
                fill="#94a3b8"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Sales */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">
            Recent Sales
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest sales activity across the business.
          </p>
        </div>

        <DataTable
          columns={recentSaleColumns}
          data={recentSales}
          getRowKey={(row) => row.id}
          emptyMessage="No recent sales."
        />
      </div>
    </div>
  );
}
