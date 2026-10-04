"use client";

import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Users,
  UserCheck,
  UserX,
  Building2,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Select from "@/components/ui/Select";
import StatCard from "@/components/common/StatCard";

import EmployeeTable from "@/components/workforce/EmployeeTable";

import techniciansData from "@/data/master/technicians";

export default function EmployeesPage() {
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
    const uniqueDepartments =
      Array.from(
        new Set(
          techniciansData
            .map(
              (employee) =>
                employee.department
            )
            .filter(Boolean)
        )
      );

    return uniqueDepartments.sort();
  }, []);

  /* =========================================================
     FILTER OPTIONS
  ========================================================= */

  const departmentOptions = useMemo(
    () => [
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
    ],
    [departments]
  );

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
     FILTER EMPLOYEES
  ========================================================= */

  const filteredEmployees =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return techniciansData.filter(
        (employee) => {
          const matchesSearch =
            !query ||
            employee.name
              ?.toLowerCase()
              .includes(query) ||
            employee.firstName
              ?.toLowerCase()
              .includes(query) ||
            employee.lastName
              ?.toLowerCase()
              .includes(query) ||
            employee.employeeId
              ?.toLowerCase()
              .includes(query) ||
            employee.id
              ?.toLowerCase()
              .includes(query);

          const matchesDepartment =
            department === "all" ||
            employee.department ===
              department;

          const matchesStatus =
            status === "all" ||
            employee.status === status;

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
        (employee) =>
          employee.status ===
          "Active"
      ).length;

    const inactive =
      techniciansData.filter(
        (employee) =>
          employee.status ===
          "Inactive"
      ).length;

    const departmentCount =
      new Set(
        techniciansData.map(
          (employee) =>
            employee.departmentId
        )
      ).size;

    return {
      total,
      active,
      inactive,
      departmentCount,
    };
  }, []);

  /* =========================================================
     ACTIONS
  ========================================================= */

  function handleView(employee) {
    console.log(
      "View employee:",
      employee
    );
  }

  function handleEdit(employee) {
    console.log(
      "Edit employee:",
      employee
    );
  }

  return (
    <div className="space-y-5">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <PageHeader
        title="Employees"
        description="Manage technicians and employee information across departments."
        actionLabel="Add Employee"
        onAction={() => {
          console.log(
            "Add employee"
          );
        }}
      />

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={stats.total}
          description="All employees"
          icon={Users}
        />

        <StatCard
          title="Active"
          value={stats.active}
          description="Currently active"
          icon={UserCheck}
        />

        <StatCard
          title="Inactive"
          value={stats.inactive}
          description="Currently inactive"
          icon={UserX}
        />

        <StatCard
          title="Departments"
          value={stats.departmentCount}
          description="Departments with employees"
          icon={Building2}
        />
      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px_180px]">
          {/* Search */}
          <div>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by name or employee ID..."
            />
          </div>

          {/* Department */}
          <Select
            label="Department"
            value={department}
            onChange={setDepartment}
            options={
              departmentOptions
            }
          />

          {/* Status */}
          <Select
            label="Status"
            value={status}
            onChange={setStatus}
            options={
              statusOptions
            }
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
              Employee Directory
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              {filteredEmployees.length}{" "}
              {filteredEmployees.length ===
              1
                ? "employee"
                : "employees"}{" "}
              shown
            </p>
          </div>
        </div>

        <EmployeeTable
          employees={
            filteredEmployees
          }
          onView={handleView}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}