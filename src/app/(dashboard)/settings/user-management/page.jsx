"use client";

import { useMemo, useState } from "react";
import {
  Edit,
  Eye,
  Plus,
  ShieldCheck,
  UserPlus,
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

import usersData from "@/data/master/users";

const roles = [
  "Owner",
  "Admin",
  "Manager",
  "Supervisor",
  "Employee",
  "Sales User",
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(usersData);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = [
        user.id,
        user.name,
        user.email,
        user.role,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      const matchesRole =
        role === "All" || user.role === role;

      const matchesStatus =
        status === "All" ||
        user.status === status;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [users, search, role, status]);

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  const columns = [
    {
      key: "name",
      label: "User",
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
      key: "email",
      label: "Email",
    },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <Badge variant="info">
          {row.role}
        </Badge>
      ),
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
      render: () => (
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
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage users, roles, permissions and access."
        actionLabel="Add User"
        onAction={() => setModalOpen(true)}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={UserPlus}
        />

        <StatCard
          title="Active Users"
          value={activeUsers}
          icon={ShieldCheck}
        />

        <StatCard
          title="Inactive Users"
          value={inactiveUsers}
          icon={UserPlus}
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search users..."
          className="flex-1"
        />

        <div className="w-full lg:w-48">
          <Select
            value={role}
            onChange={setRole}
            options={[
              {
                value: "All",
                label: "All Roles",
              },
              ...roles.map((item) => ({
                value: item,
                label: item,
              })),
            ]}
          />
        </div>

        <div className="w-full lg:w-40">
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
                value: "Inactive",
                label: "Inactive",
              },
            ]}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        getRowKey={(row) => row.id}
        emptyMessage="No users found."
      />

      <CardPermissions />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add User"
        description="Create a new application user."
      >
        <div className="space-y-4">
          <Input
            label="Name"
            placeholder="Enter user name"
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
          />

          <Select
            label="Role"
            options={roles.map((item) => ({
              value: item,
              label: item,
            }))}
          />

          <Select
            label="Status"
            options={[
              {
                value: "Active",
                label: "Active",
              },
              {
                value: "Inactive",
                label: "Inactive",
              },
            ]}
          />

          <div className="flex justify-end gap-2">
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
              Save User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function CardPermissions() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">
          Permission Overview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Prototype permission structure for role-based access.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          "Workforce",
          "Sales",
          "Customers",
          "Reports",
        ].map((permission) => (
          <div
            key={permission}
            className="rounded-lg bg-slate-50 p-4"
          >
            <p className="text-sm font-medium text-slate-900">
              {permission}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              View · Create · Edit · Delete
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
