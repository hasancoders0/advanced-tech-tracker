"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Building2,
  BriefcaseBusiness,
  ChevronRight,
  UserCheck,
  Users,
  UserX,
  X,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";

import Select from "@/components/ui/Select";

import EmployeeForm from "@/components/workforce/EmployeeForm";
import EmployeeTable from "@/components/workforce/EmployeeTable";
import EmployeeDetails from "@/components/workforce/EmployeeDetails";
import RoleForm from "@/components/workforce/RoleForm";

import employeesData from "@/data/master/employees";
import rolesData from "@/data/master/roles";
import departmentsData from "@/data/master/departments";
import RoleList from "@/components/workforce/RoleList";

const PAGE_SIZE = 7;

/* =========================================================
   SUMMARY CARD
========================================================= */

function CompactSummaryCard({ title, value, description, icon: Icon }) {
  return (
    <div className="flex min-h-[76px] items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="min-w-0">
        <p className="truncate text-[10px] font-medium text-slate-500">
          {title}
        </p>

        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-xl font-semibold leading-none tracking-tight text-slate-900">
            {value}
          </p>

          <p className="hidden text-[9px] text-slate-400 lg:block">
            {description}
          </p>
        </div>
      </div>

      <div className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon size={15} />
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function EmployeesPage() {
  /* =======================================================
     DATA
  ======================================================= */

  const [employees, setEmployees] = useState(employeesData || []);

  const [roles, setRoles] = useState(rolesData || []);

  /* =======================================================
     PANEL
  ======================================================= */

  const [activePanel, setActivePanel] = useState("employee");

  /* =======================================================
     FILTERS
  ======================================================= */

  const [search, setSearch] = useState("");

  const [department, setDepartment] = useState("all");

  const [role, setRole] = useState("all");

  const [status, setStatus] = useState("all");

  /* =======================================================
     PAGINATION
  ======================================================= */

  const [currentPage, setCurrentPage] = useState(1);

  /* =======================================================
     VIEW / EDIT
  ======================================================= */

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  /* =======================================================
     DEPARTMENTS
  ======================================================= */

  const departments = useMemo(() => {
    return departmentsData || [];
  }, []);

  /* =======================================================
     DEPARTMENT OPTIONS
  ======================================================= */

  const departmentOptions = useMemo(() => {
    return [
      {
        value: "all",
        label: "All Departments",
      },

      ...departments
        .filter((department) => department.status !== "Inactive")
        .map((department) => ({
          value: department.id,

          label:
            department.name || department.department || department.title || "",
        })),
    ];
  }, [departments]);

  /* =======================================================
     ROLE OPTIONS
  ======================================================= */

  const roleOptions = useMemo(() => {
    return [
      {
        value: "all",
        label: "All Roles",
      },

      ...roles
        .filter((role) => role.status !== "Inactive")
        .map((role) => ({
          value: role.id,
          label: role.name,
        })),
    ];
  }, [roles]);

  /* =======================================================
     STATUS OPTIONS
  ======================================================= */

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
      value: "On Leave",
      label: "On Leave",
    },

    {
      value: "Inactive",
      label: "Inactive",
    },

    {
      value: "Terminated",
      label: "Terminated",
    },
  ];

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const employment = employee.employment || {};

      const employeeName = employee.name || employee.fullName || "";

      const employeeCode = employee.employeeCode || employee.id || "";

      const email = employee.contact?.email || employee.email || "";

      const phone = employee.contact?.phone || employee.phone || "";

      const employeeDepartmentId =
        employment.departmentId || employee.departmentId || "";

      const employeeRoleId = employment.roleId || employee.roleId || "";

      const employeeStatus = employment.status || employee.status || "";

      const matchesSearch =
        !query ||
        employeeName.toLowerCase().includes(query) ||
        employeeCode.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        phone.toLowerCase().includes(query);

      const matchesDepartment =
        department === "all" || employeeDepartmentId === department;

      const matchesRole = role === "all" || employeeRoleId === role;

      const matchesStatus = status === "all" || employeeStatus === status;

      return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
    });
  }, [employees, search, department, role, status]);

  /* =======================================================
     RESET PAGINATION
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [search, department, role, status]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredEmployees.slice(start, start + PAGE_SIZE);
  }, [filteredEmployees, currentPage]);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    const total = employees.length;

    const active = employees.filter((employee) => {
      const employment = employee.employment || {};

      return employment.status === "Active" || employee.status === "Active";
    }).length;

    const inactive = employees.filter((employee) => {
      const employment = employee.employment || {};

      return employment.status === "Inactive" || employee.status === "Inactive";
    }).length;

    const departmentCount = new Set(
      employees
        .map((employee) => {
          const employment = employee.employment || {};

          return employment.departmentId || employee.departmentId;
        })
        .filter(Boolean),
    ).size;

    return {
      total,
      active,
      inactive,
      departmentCount,
    };
  }, [employees]);

  /* =======================================================
     FILTER STATE
  ======================================================= */

  const hasActiveFilters =
    Boolean(search.trim()) ||
    department !== "all" ||
    role !== "all" ||
    status !== "all";

  function clearFilters() {
    setSearch("");
    setDepartment("all");
    setRole("all");
    setStatus("all");
    setCurrentPage(1);
  }

  /* =======================================================
     EMPLOYEE ID
  ======================================================= */

  function generateEmployeeId() {
    const numbers = employees
      .map((employee) => {
        const code = employee.employeeCode || employee.id || "";

        const match = String(code).match(/EMP-(\d+)/i);

        return match ? Number(match[1]) : 0;
      })
      .filter(Boolean);

    const highest = numbers.length ? Math.max(...numbers) : 0;

    return `EMP-${String(highest + 1).padStart(3, "0")}`;
  }

  /* =======================================================
     ROLE ID
  ======================================================= */

  function generateRoleId(name) {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const base = `role-${slug}`;

    let roleId = base;
    let counter = 2;

    while (roles.some((role) => role.id === roleId)) {
      roleId = `${base}-${counter}`;

      counter += 1;
    }

    return roleId;
  }

  /* =======================================================
     ADD EMPLOYEE
  ======================================================= */

  async function handleAddEmployee(data) {
    const employeeCode = generateEmployeeId();

    const selectedDepartment = departments.find(
      (department) => department.id === data.departmentId,
    );

    const selectedRole = roles.find((role) => role.id === data.roleId);

    const newEmployee = {
      id: employeeCode,

      employeeCode,

      name: data.fullName,

      fullName: data.fullName,

      contact: {
        email: data.email,
        phone: data.phone,
      },

      address: data.address,

      employment: {
        departmentId: data.departmentId,

        department:
          selectedDepartment?.name || selectedDepartment?.department || "",

        roleId: data.roleId,

        role: selectedRole?.name || "",

        employmentType: data.employmentType,

        status: data.status,

        hireDate: data.hireDate,

        terminationDate: null,

        notes: data.notes || "",
      },

      statusHistory: [
        {
          id: `STATUS-${employeeCode}-001`,
          status: data.status,
          date: data.hireDate,
          reason: "Employee record created.",
          recordedBy: "Current User",
        },
      ],
    };

    setEmployees((current) => [newEmployee, ...current]);

    setCurrentPage(1);
  }

  /* =======================================================
     ADD ROLE
  ======================================================= */

  async function handleAddRole(data) {
    const newRole = {
      id: generateRoleId(data.name),

      name: data.name,

      description: data.description || "",
    };

    setRoles((current) => [...current, newRole]);
  }

  function handleDeleteRole(role) {
    setRoles((current) => current.filter((item) => item.id !== role.id));
  }
  /* =======================================================
     VIEW
  ======================================================= */

  function handleView(employee) {
    setSelectedEmployee(employee);

    setViewOpen(true);
  }

  function closeView() {
    setViewOpen(false);
    setSelectedEmployee(null);
  }

  /* =======================================================
     EDIT
  ======================================================= */

  function handleEdit(employee) {
    setSelectedEmployee(employee);

    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);

    setSelectedEmployee(null);
  }

  /* =======================================================
     UPDATE EMPLOYEE
  ======================================================= */

  async function handleUpdateEmployee(data) {
    if (!selectedEmployee) {
      return;
    }

    const selectedDepartment = departments.find(
      (department) => department.id === data.departmentId,
    );

    const selectedRole = roles.find((role) => role.id === data.roleId);

    const previousEmployment = selectedEmployee.employment || {};

    const statusChanged = previousEmployment.status !== data.status;

    const employeeCode = selectedEmployee.employeeCode || selectedEmployee.id;

    const updatedEmployee = {
      ...selectedEmployee,

      name: data.fullName,

      fullName: data.fullName,

      contact: {
        ...(selectedEmployee.contact || {}),
        email: data.email,

        phone: data.phone,
      },

      address: data.address,

      employment: {
        ...previousEmployment,

        departmentId: data.departmentId,

        department:
          selectedDepartment?.name || selectedDepartment?.department || "",

        roleId: data.roleId,

        role: selectedRole?.name || "",

        employmentType: data.employmentType,

        status: data.status,

        hireDate: data.hireDate,

        notes: data.notes || "",
      },

      statusHistory: statusChanged
        ? [
            ...(selectedEmployee.statusHistory || []),

            {
              id: `STATUS-${employeeCode}-${Date.now()}`,

              status: data.status,

              date: new Date().toISOString().slice(0, 10),

              reason: `Employee status changed from ${previousEmployment.status || "Unknown"} to ${data.status}.`,

              recordedBy: "Current User",
            },
          ]
        : selectedEmployee.statusHistory || [],
    };

    setEmployees((current) =>
      current.map((employee) =>
        employee.id === selectedEmployee.id ? updatedEmployee : employee,
      ),
    );

    setSelectedEmployee(updatedEmployee);

    setEditOpen(false);
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}

      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <span className="font-medium text-slate-500">Workforce</span>

        <ChevronRight size={12} />

        <span className="font-medium text-slate-700">Employees</span>
      </div>

      {/* Header */}

      <PageHeader
        title="Employees"
        description="Manage employee records, roles, contact information, and employment status."
      />

      {/* Summary */}

      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        <CompactSummaryCard
          title="Total Employees"
          value={stats.total}
          description="All employees"
          icon={Users}
        />

        <CompactSummaryCard
          title="Active"
          value={stats.active}
          description="Currently active"
          icon={UserCheck}
        />

        <CompactSummaryCard
          title="Inactive"
          value={stats.inactive}
          description="Currently inactive"
          icon={UserX}
        />

        <CompactSummaryCard
          title="Departments"
          value={stats.departmentCount}
          description="With employees"
          icon={Building2}
        />
      </div>

      {/* 50 / 50 */}

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        {/* LEFT */}

        <div className="min-w-0">
          {/* Tabs */}

          <div className="mb-2 flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setActivePanel("employee")}
              className={[
                "flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition",
                activePanel === "employee"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
              ].join(" ")}
            >
              <Users size={14} />
              Employee
            </button>

            <button
              type="button"
              onClick={() => setActivePanel("role")}
              className={[
                "flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition",
                activePanel === "role"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
              ].join(" ")}
            >
              <BriefcaseBusiness size={14} />
              Role
            </button>
          </div>

          {/* Add Employee */}

          {activePanel === "employee" ? (
            <EmployeeForm
              departments={departments}
              roles={roles}
              onSubmit={handleAddEmployee}
            />
          ) : (
            <div className="space-y-3">
              {/* Add Role Form */}

              <RoleForm onSubmit={handleAddRole} />

              {/* Role List directly below the form */}

              <RoleList
                roles={roles}
                employees={employees}
                onDelete={handleDeleteRole}
              />
            </div>
          )}
        </div>

        {/* RIGHT */}

        <div className="min-w-0 space-y-3">
          {/* Filters */}

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search employee name, ID, email or phone..."
                />
              </div>

              <Select
                label="Department"
                value={department}
                onChange={setDepartment}
                options={departmentOptions}
              />

              <Select
                label="Role"
                value={role}
                onChange={setRole}
                options={roleOptions}
              />

              <Select
                label="Status"
                value={status}
                onChange={setStatus}
                options={statusOptions}
              />

              <div className="flex items-end">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <X size={13} />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Directory */}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Employees
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  {filteredEmployees.length}{" "}
                  {filteredEmployees.length === 1 ? "employee" : "employees"}{" "}
                  found
                </p>
              </div>

              {hasActiveFilters && (
                <span className="rounded-md bg-sky-50 px-2 py-1 text-[10px] font-semibold text-sky-700">
                  Filtered
                </span>
              )}
            </div>

            <EmployeeTable
              employees={paginatedEmployees}
              onView={handleView}
              onEdit={handleEdit}
            />

            <Pagination
              currentPage={currentPage}
              totalItems={filteredEmployees.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* =================================================
          VIEW MODAL
      ================================================= */}

      {viewOpen && selectedEmployee && (
        <EmployeeDetails employee={selectedEmployee} onClose={closeView} />
      )}

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editOpen && selectedEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-3 backdrop-blur-[2px]">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl">
            <EmployeeForm
              departments={departments}
              roles={roles}
              initialEmployee={selectedEmployee}
              mode="edit"
              onSubmit={handleUpdateEmployee}
              onCancel={closeEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
