"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  Edit,
  Eye,
  Plus,
  UserRound,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import DataTable from "@/components/common/DataTable";
import StatCard from "@/components/common/StatCard";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

import { useToast } from "@/components/feedback/ToastProvider";

import techniciansData from "@/data/master/technicians";

export default function TechManagementPage() {
  const [technicians, setTechnicians] =
    useState(techniciansData);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  const { addToast } = useToast();

  const filteredTechnicians = useMemo(() => {
    return technicians.filter((technician) => {
      const searchText = [
        technician.id,
        technician.name,
        technician.department,
        technician.role,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      const matchesStatus =
        status === "All" ||
        technician.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [technicians, search, status]);

  const activeCount = technicians.filter(
    (technician) =>
      technician.status === "Active"
  ).length;

  const archivedCount = technicians.filter(
    (technician) =>
      technician.status === "Archived"
  ).length;

  function archiveTechnician(id) {
    setTechnicians((current) =>
      current.map((technician) =>
        technician.id === id
          ? {
              ...technician,
              status: "Archived",
            }
          : technician
      )
    );

    addToast({
      title: "Technician archived",
      message:
        "The technician has been moved to archived status.",
      type: "success",
    });
  }

  const columns = [
    {
      key: "name",
      label: "Technician",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">
            {row.name}
          </p>

          <p className="text-xs text-slate-400">
            {row.id}
          </p>
        </div>
      ),
    },
    {
      key: "department",
      label: "Department",
    },
    {
      key: "role",
      label: "Role",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge
          variant={
            row.status === "Active"
              ? "success"
              : "default"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            title="View"
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            title="Edit"
          >
            <Edit size={16} />
          </button>

          {row.status === "Active" && (
            <button
              type="button"
              onClick={() =>
                archiveTechnician(row.id)
              }
              className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
              title="Archive"
            >
              <Archive size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tech Management"
        description="Manage technicians, departments, status and assignments."
        actionLabel="Add Technician"
        onAction={() => setModalOpen(true)}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Technicians"
          value={technicians.length}
          icon={UserRound}
        />

        <StatCard
          title="Active"
          value={activeCount}
          icon={UserRound}
        />

        <StatCard
          title="Archived"
          value={archivedCount}
          icon={Archive}
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search technicians..."
          className="flex-1"
        />

        <div className="w-full lg:w-48">
          <Select
            value={status}
            onChange={setStatus}
            options={[
              {
                value: "All",
                label: "All Statuses",
              },
              {
                value: "Active",
                label: "Active",
              },
              {
                value: "Archived",
                label: "Archived",
              },
            ]}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredTechnicians}
        getRowKey={(row) => row.id}
        emptyMessage="No technicians found."
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Technician"
        description="Create a technician record."
      >
        <div className="space-y-4">
          <Input
            label="Technician Name"
            placeholder="Enter technician name"
          />

          <Select
            label="Department"
            options={[
              {
                value: "Field Operations",
                label: "Field Operations",
              },
              {
                value: "Warehouse",
                label: "Warehouse",
              },
              {
                value: "Sales",
                label: "Sales",
              },
            ]}
          />

          <Input
            label="Role"
            placeholder="Technician"
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={() => {
                setModalOpen(false);

                addToast({
                  title: "Technician saved",
                  message:
                    "The technician form was submitted successfully.",
                  type: "success",
                });
              }}
            >
              <Plus size={16} />
              Save Technician
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
