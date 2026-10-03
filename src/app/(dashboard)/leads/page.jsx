"use client";

import { useMemo, useState } from "react";
import { Edit, Eye, Plus, UserPlus } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import DataTable from "@/components/common/DataTable";
import StatCard from "@/components/common/StatCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

import leadsData from "@/data/mock/leads";

export default function LeadsPage() {
  const [leads, setLeads] = useState(leadsData);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        lead.company
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        lead.email
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || lead.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, status]);

  const totalValue = leads.reduce(
    (sum, lead) => sum + lead.value,
    0
  );

  const qualifiedCount = leads.filter(
    (lead) => lead.status === "Qualified"
  ).length;

  const newCount = leads.filter(
    (lead) => lead.status === "New"
  ).length;

  const columns = [
    {
      key: "name",
      label: "Lead",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">
            {row.name}
          </p>
          <p className="text-xs text-slate-400">
            {row.company}
          </p>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Contact",
      render: (row) => (
        <div>
          <p>{row.phone}</p>
          <p className="text-xs text-slate-400">
            {row.email}
          </p>
        </div>
      ),
    },
    {
      key: "source",
      label: "Source",
    },
    {
      key: "value",
      label: "Potential Value",
      render: (row) => `$${row.value.toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const variants = {
          New: "info",
          Contacted: "warning",
          Qualified: "success",
          Lost: "danger",
        };

        return (
          <Badge variant={variants[row.status]}>
            {row.status}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: () => (
        <div className="flex items-center gap-1">
          <button className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <Eye size={16} />
          </button>

          <button className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <Edit size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Track and manage potential customers."
        actionLabel="Add Lead"
        onAction={() => setModalOpen(true)}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={leads.length}
          icon={UserPlus}
        />

        <StatCard
          title="New Leads"
          value={newCount}
          icon={UserPlus}
        />

        <StatCard
          title="Qualified Leads"
          value={qualifiedCount}
          icon={UserPlus}
        />

        <StatCard
          title="Potential Value"
          value={`$${totalValue.toLocaleString()}`}
          icon={UserPlus}
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search leads..."
          className="flex-1"
        />

        <div className="w-full lg:w-48">
          <Select
            value={status}
            onChange={setStatus}
            options={[
              { value: "All", label: "All Statuses" },
              { value: "New", label: "New" },
              { value: "Contacted", label: "Contacted" },
              { value: "Qualified", label: "Qualified" },
              { value: "Lost", label: "Lost" },
            ]}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredLeads}
        getRowKey={(row) => row.id}
        emptyMessage="No leads found."
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Lead"
        description="Create a new lead."
      >
        <div className="space-y-4">
          <Input
            id="lead-name"
            label="Name"
            placeholder="Lead name"
          />

          <Input
            id="lead-company"
            label="Company"
            placeholder="Company name"
          />

          <Input
            id="lead-phone"
            label="Phone"
            placeholder="Phone number"
          />

          <Input
            id="lead-email"
            label="Email"
            type="email"
            placeholder="Email address"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={() => setModalOpen(false)}
            >
              <Plus size={16} />
              Save Lead
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
