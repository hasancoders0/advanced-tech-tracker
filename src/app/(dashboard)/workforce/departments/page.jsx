"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Building2,
  Users,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";

import DepartmentForm from "@/components/workforce/DepartmentForm";
import DepartmentList from "@/components/workforce/DepartmentList";

import departmentsData from "@/data/master/departments";
import employeesData from "@/data/master/employees";

function generateDepartmentId(
  departments
) {
  const numbers = departments
    .map((department) => {
      const match = String(
        department.id || ""
      ).match(
        /DEPT-(\d+)/i
      );

      return match
        ? Number(match[1])
        : 0;
    })
    .filter(Boolean);

  const highest = numbers.length
    ? Math.max(...numbers)
    : 0;

  return `DEPT-${String(
    highest + 1
  ).padStart(3, "0")}`;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] =
    useState(
      departmentsData || []
    );

  const [employees] =
    useState(
      employeesData || []
    );

  const stats = useMemo(() => {
    const total =
      departments.length;

    const totalEmployees =
      employees.length;

    const departmentsWithEmployees =
      departments.filter(
        (department) => {
          return employees.some(
            (employee) => {
              const employment =
                employee.employment ||
                {};

              const departmentId =
                employment.departmentId ||
                employee.departmentId;

              return (
                departmentId ===
                department.id
              );
            }
          );
        }
      ).length;

    return {
      total,
      totalEmployees,
      departmentsWithEmployees,
    };
  }, [
    departments,
    employees,
  ]);

  async function handleAddDepartment(
    data
  ) {
    const newDepartment = {
      id: generateDepartmentId(
        departments
      ),

      name: data.name,

      description:
        data.description || "",
    };

    setDepartments(
      (current) => [
        ...current,
        newDepartment,
      ]
    );
  }

  function handleDeleteDepartment(
    department
  ) {
    setDepartments(
      (current) =>
        current.filter(
          (item) =>
            item.id !==
            department.id
        )
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}

      <PageHeader
        title="Departments"
        description="Manage workforce departments and their employee assignments."
      />

      {/* Summary */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Departments"
          value={
            stats.total
          }
          description="Configured departments"
          icon={Building2}
        />

        <StatCard
          title="Employees"
          value={
            stats.totalEmployees
          }
          description="Across all departments"
          icon={Users}
        />

        <StatCard
          title="In Use"
          value={
            stats.departmentsWithEmployees
          }
          description="Departments with employees"
          icon={Building2}
        />
      </div>

      {/* 50 / 50 Layout */}

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        {/* LEFT — ADD DEPARTMENT */}

        <div className="min-w-0">
          <DepartmentForm
            onSubmit={
              handleAddDepartment
            }
          />
        </div>

        {/* RIGHT — DEPARTMENT LIST */}

        <div className="min-w-0">
          <DepartmentList
            departments={
              departments
            }
            employees={
              employees
            }
            onDelete={
              handleDeleteDepartment
            }
          />
        </div>
      </div>
    </div>
  );
}