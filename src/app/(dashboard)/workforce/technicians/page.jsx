"use client";

import { useMemo, useState } from "react";

import {
  Users,
  UserCheck,
  Award,
  Building2,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import StatCard from "@/components/common/StatCard";
import Select from "@/components/ui/Select";

import TechnicianTable from "@/components/workforce/TechnicianTable";

import techniciansData from "@/data/master/technicians";

export default function TechniciansPage() {
  const [search, setSearch] =
    useState("");

  const [department, setDepartment] =
    useState("all");

  const [status, setStatus] =
    useState("all");

  /* =========================================================
     DEPARTMENTS
  ========================================================= */

  const departments = useMemo(() => {
    return Array.from(
      new Set(
        techniciansData
          .map(
            (technician) =>
              technician.department
          )
          .filter(Boolean)
      )
    ).sort();
  }, []);

  /* =========================================================
     FILTER OPTIONS
  ========================================================= */

  const departmentOptions = [
    {
      value: "all",
      label: "All Departments",
    },
    ...departments.map(
      (item) => ({
        value: item,
        label: item,
      })
    ),
  ];

  const statusOptions = [
    {
      value: "all",
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
  ];

  /* =========================================================
     FILTER TECHNICIANS
  ========================================================= */

  const filteredTechnicians =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return techniciansData.filter(
        (technician) => {
          const matchesSearch =
            !query ||
            technician.name
              ?.toLowerCase()
              .includes(query) ||
            technician.employeeId
              ?.toLowerCase()
              .includes(query) ||
            technician.id
              ?.toLowerCase()
              .includes(query) ||
            technician.role
              ?.toLowerCase()
              .includes(query);

          const matchesDepartment =
            department === "all" ||
            technician.department ===
              department;

          const matchesStatus =
            status === "all" ||
            technician.status === status;

          return (
            matchesSearch &&
            matchesDepartment &&
            matchesStatus
          );
        }
      );
    }, [
      search,
      department,
      status,
    ]);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(() => {
    const total =
      techniciansData.length;

    const active =
      techniciansData.filter(
        (technician) =>
          technician.status ===
          "Active"
      ).length;

    const senior =
      techniciansData.filter(
        (technician) =>
          technician.role ===
          "Senior Technician"
      ).length;

    const departmentCount =
      new Set(
        techniciansData.map(
          (technician) =>
            technician.departmentId
        )
      ).size;

    return {
      total,
      active,
      senior,
      departmentCount,
    };
  }, []);

  /* =========================================================
     ACTIONS
  ========================================================= */

  function handleView(
    technician
  ) {
    console.log(
      "View technician:",
      technician
    );
  }

  function handleEdit(
    technician
  ) {
    console.log(
      "Edit technician:",
      technician
    );
  }

  return (
    <div className="space-y-5">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <PageHeader
        title="Technicians"
        description="Manage technician profiles, departments, roles, and status."
        actionLabel="Add Technician"
        onAction={() =>
          console.log(
            "Add technician"
          )
        }
      />

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Technicians"
          value={stats.total}
          description="All technicians"
          icon={Users}
        />

        <StatCard
          title="Active"
          value={stats.active}
          description="Currently active"
          icon={UserCheck}
        />

        <StatCard
          title="Senior Technicians"
          value={stats.senior}
          description="Senior technician roles"
          icon={Award}
        />

        <StatCard
          title="Departments"
          value={stats.departmentCount}
          description="Departments with technicians"
          icon={Building2}
        />
      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px_180px]">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search technician, ID, or role..."
          />

          <Select
            label="Department"
            value={department}
            onChange={setDepartment}
            options={departmentOptions}
          />

          <Select
            label="Status"
            value={status}
            onChange={setStatus}
            options={statusOptions}
          />
        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Technician Directory
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              {filteredTechnicians.length}{" "}
              {filteredTechnicians.length ===
              1
                ? "technician"
                : "technicians"}{" "}
              shown
            </p>
          </div>
        </div>

        <TechnicianTable
          technicians={
            filteredTechnicians
          }
          onView={handleView}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}