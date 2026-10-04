"use client";

import { useMemo, useState } from "react";

import {
  Building2,
  Users,
  UserCheck,
  BarChart3,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import StatCard from "@/components/common/StatCard";

import DepartmentTable from "@/components/workforce/DepartmentTable";

import techniciansData from "@/data/master/technicians";

export default function DepartmentsPage() {
  const [search, setSearch] =
    useState("");

  /* =========================================================
     BUILD DEPARTMENTS FROM TECHNICIAN MASTER DATA
  ========================================================= */

  const departments = useMemo(() => {
    const departmentMap =
      new Map();

    techniciansData.forEach(
      (technician) => {
        const id =
          technician.departmentId;

        const name =
          technician.department;

        if (!id || !name) {
          return;
        }

        if (!departmentMap.has(id)) {
          departmentMap.set(id, {
            id,
            name,
            technicianCount: 0,
            activeCount: 0,
          });
        }

        const department =
          departmentMap.get(id);

        department.technicianCount +=
          1;

        if (
          technician.status ===
          "Active"
        ) {
          department.activeCount +=
            1;
        }
      }
    );

    return Array.from(
      departmentMap.values()
    ).sort((a, b) =>
      a.name.localeCompare(
        b.name
      )
    );
  }, []);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredDepartments =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return departments;
      }

      return departments.filter(
        (department) =>
          department.name
            .toLowerCase()
            .includes(query) ||
          department.id
            .toLowerCase()
            .includes(query)
      );
    }, [
      departments,
      search,
    ]);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(() => {
    const totalDepartments =
      departments.length;

    const activeDepartments =
      departments.filter(
        (department) =>
          department.activeCount >
          0
      ).length;

    const totalTechnicians =
      departments.reduce(
        (total, department) =>
          total +
          department.technicianCount,
        0
      );

    const largestDepartment =
      departments.reduce(
        (largest, department) => {
          if (
            !largest ||
            department.technicianCount >
              largest.technicianCount
          ) {
            return department;
          }

          return largest;
        },
        null
      );

    return {
      totalDepartments,
      activeDepartments,
      totalTechnicians,
      largestDepartment,
    };
  }, [departments]);

  /* =========================================================
     ACTIONS
  ========================================================= */

  function handleView(
    department
  ) {
    console.log(
      "View department:",
      department
    );
  }

  function handleEdit(
    department
  ) {
    console.log(
      "Edit department:",
      department
    );
  }

  return (
    <div className="space-y-5">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <PageHeader
        title="Departments"
        description="Manage workforce departments and view technician distribution."
        actionLabel="Add Department"
        onAction={() =>
          console.log(
            "Add department"
          )
        }
      />

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Departments"
          value={
            stats.totalDepartments
          }
          description="All departments"
          icon={Building2}
        />

        <StatCard
          title="Active Departments"
          value={
            stats.activeDepartments
          }
          description="With active technicians"
          icon={BarChart3}
        />

        <StatCard
          title="Total Technicians"
          value={
            stats.totalTechnicians
          }
          description="Across all departments"
          icon={Users}
        />

        <StatCard
          title="Largest Department"
          value={
            stats.largestDepartment
              ?.name || "—"
          }
          description={
            stats.largestDepartment
              ? `${stats.largestDepartment.technicianCount} technicians`
              : "No data"
          }
          icon={UserCheck}
        />
      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search department..."
        />
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Department Directory
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              {filteredDepartments.length}{" "}
              {filteredDepartments.length ===
              1
                ? "department"
                : "departments"}{" "}
              shown
            </p>
          </div>
        </div>

        <DepartmentTable
          departments={
            filteredDepartments
          }
          onView={handleView}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}