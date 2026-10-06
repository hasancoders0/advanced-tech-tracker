"use client";

import { useMemo, useState } from "react";
import { Building2, DollarSign, MoreHorizontal, Users } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import SearchInput from "@/components/common/SearchInput";
import FilterBar from "@/components/common/FilterBar";
import DataTable from "@/components/common/DataTable";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";

import { customersData } from "@/data/master/customers";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredCustomers = useMemo(() => {
    return customersData.filter((customer) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        String(customer.name ?? "")
          .toLowerCase()
          .includes(searchValue) ||
        String(customer.company ?? "")
          .toLowerCase()
          .includes(searchValue) ||
        String(customer.phone ?? "")
          .toLowerCase()
          .includes(searchValue) ||
        String(customer.email ?? "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus = status === "all" || customer.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const totalRevenue = customersData.reduce(
    (sum, customer) => sum + customer.revenue,
    0,
  );

  const columns = [
    {
      key: "name",
      label: "Customer",
      render: (row) => (
        <div>
          <div className="font-medium text-slate-900">{row.name}</div>

          <div className="mt-0.5 text-xs text-slate-400">{row.company}</div>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      render: (row) => (
        <div>
          <div className="text-slate-700">{row.email}</div>

          <div className="mt-0.5 text-xs text-slate-400">{row.phone}</div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
    },
    {
      key: "sales",
      label: "Sales",
      render: (row) => <span>{row.sales}</span>,
    },
    {
      key: "revenue",
      label: "Revenue",
      render: (row) => (
        <span className="font-medium text-slate-900">
          ${Number(row.revenue ?? 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "danger"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Action",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: () => (
        <div className="flex justify-end">
          <Dropdown
            trigger={
              <button
                type="button"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <MoreHorizontal size={18} />
              </button>
            }
          >
            <DropdownItem>View Customer</DropdownItem>

            <DropdownItem>Edit Customer</DropdownItem>

            <DropdownItem>Sales History</DropdownItem>

            <DropdownItem danger>Delete Customer</DropdownItem>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage customers and sales history."
        actionLabel="Add Customer"
        onAction={() => setModalOpen(true)}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Customers"
          value={customersData.length}
          icon={Users}
        />

        <StatCard
          title="Active Customers"
          value={
            customersData.filter((customer) => customer.status === "Active")
              .length
          }
          icon={Building2}
        />

        <StatCard
          title="Customer Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
        />
      </div>

      <FilterBar
        filters={[
          {
            name: "status",
            label: "Status",
            value: status,
            onChange: setStatus,
            options: [
              {
                value: "all",
                label: "All Status",
              },
              {
                value: "Active",
                label: "Active",
              },
              {
                value: "Inactive",
                label: "Inactive",
              },
            ],
          },
        ]}
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search customers..."
          className="sm:w-80"
        />
      </FilterBar>

      <div>
        <div className="mb-3">
          <h2 className="text-base font-semibold text-slate-900">Customers</h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredCustomers.length} customers found
          </p>
        </div>

        <DataTable
          columns={columns}
          data={filteredCustomers}
          getRowKey={(row) => row.id}
          emptyMessage="No customers found."
        />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Customer"
        description="Create a new customer record."
      >
        <div className="space-y-4">
          <Input label="Customer Name" placeholder="Enter customer name" />

          <Input label="Company" placeholder="Enter company name" />

          <Input
            label="Email"
            type="email"
            placeholder="customer@example.com"
          />

          <Input label="Phone" placeholder="+1 555-0000" />

          <Input label="Address" placeholder="Enter address" />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>

            <Button onClick={() => setModalOpen(false)}>Add Customer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
