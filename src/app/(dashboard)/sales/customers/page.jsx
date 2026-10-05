"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Building2,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import StatCard from "@/components/common/StatCard";

import Select from "@/components/ui/Select";

import CustomerForm from "@/components/customers/CustomerForm";
import CustomerTable from "@/components/customers/CustomerTable";

import customersData from "@/data/master/customers";

const PAGE_SIZE = 7;

function generateCustomerId(
  customers
) {
  const numbers =
    customers
      .map((customer) => {
        const value =
          customer.customerCode ||
          customer.id ||
          "";

        const match =
          String(value).match(
            /CUST-(\d+)/i
          );

        return match
          ? Number(match[1])
          : 0;
      })
      .filter(Boolean);

  const highest = numbers.length
    ? Math.max(...numbers)
    : 0;

  return `CUST-${String(
    highest + 1
  ).padStart(3, "0")}`;
}

function CompactSummaryCard({
  title,
  value,
  description,
  icon: Icon,
}) {
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

export default function CustomersPage() {
  const [customers, setCustomers] =
    useState(
      customersData || []
    );

  const [search, setSearch] =
    useState("");

  const [type, setType] =
    useState("all");

  const [status, setStatus] =
    useState("all");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [editCustomer, setEditCustomer] =
    useState(null);

  const [editOpen, setEditOpen] =
    useState(false);

  const [viewCustomer, setViewCustomer] =
    useState(null);

  const [viewOpen, setViewOpen] =
    useState(false);

  /* =====================================================
     TYPE OPTIONS
  ===================================================== */

  const typeOptions =
    useMemo(() => {
      const types =
        Array.from(
          new Set(
            customers
              .map(
                (customer) =>
                  customer.customerType ||
                  customer.type
              )
              .filter(Boolean)
          )
        ).sort();

      return [
        {
          value: "all",
          label: "All Types",
        },

        ...types.map(
          (item) => ({
            value: item,
            label: item,
          })
        ),
      ];
    }, [customers]);

  /* =====================================================
     STATUS OPTIONS
  ===================================================== */

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

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredCustomers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return customers.filter(
        (customer) => {
          const name =
            customer.name ||
            customer.customerName ||
            "";

          const company =
            customer.company ||
            "";

          const email =
            customer.email ||
            customer.contact?.email ||
            "";

          const phone =
            customer.phone ||
            customer.contact?.phone ||
            "";

          const customerType =
            customer.customerType ||
            customer.type ||
            "";

          const customerStatus =
            customer.status ||
            "Active";

          const matchesSearch =
            !query ||
            name
              .toLowerCase()
              .includes(query) ||
            company
              .toLowerCase()
              .includes(query) ||
            email
              .toLowerCase()
              .includes(query) ||
            phone
              .toLowerCase()
              .includes(query);

          const matchesType =
            type === "all" ||
            customerType === type;

          const matchesStatus =
            status === "all" ||
            customerStatus === status;

          return (
            matchesSearch &&
            matchesType &&
            matchesStatus
          );
        }
      );
    }, [
      customers,
      search,
      type,
      status,
    ]);

  /* =====================================================
     PAGINATION RESET
  ===================================================== */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    type,
    status,
  ]);

  /* =====================================================
     PAGINATED DATA
  ===================================================== */

  const paginatedCustomers =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        PAGE_SIZE;

      return filteredCustomers.slice(
        start,
        start + PAGE_SIZE
      );
    }, [
      filteredCustomers,
      currentPage,
    ]);

  /* =====================================================
     STATS
  ===================================================== */

  const stats =
    useMemo(() => {
      const total =
        customers.length;

      const active =
        customers.filter(
          (customer) =>
            (customer.status ||
              "Active") ===
            "Active"
        ).length;

      const inactive =
        customers.filter(
          (customer) =>
            customer.status ===
            "Inactive"
        ).length;

      const companies =
        customers.filter(
          (customer) =>
            Boolean(
              customer.company
            )
        ).length;

      return {
        total,
        active,
        inactive,
        companies,
      };
    }, [customers]);

  /* =====================================================
     ADD CUSTOMER
  ===================================================== */

  async function handleAddCustomer(
    data
  ) {
    const customerCode =
      generateCustomerId(
        customers
      );

    const newCustomer = {
      id: customerCode,

      customerCode,

      name: data.name,

      company:
        data.company || "",

      phone: data.phone,

      email: data.email,

      address:
        data.address || "",

      customerType:
        data.customerType,

      status:
        data.status,

      notes:
        data.notes || "",

      createdDate:
        new Date()
          .toISOString()
          .slice(0, 10),

      salesHistory: [],
    };

    setCustomers(
      (current) => [
        newCustomer,
        ...current,
      ]
    );

    setCurrentPage(1);
  }

  /* =====================================================
     EDIT CUSTOMER
  ===================================================== */

  function handleEdit(customer) {
    setEditCustomer(
      customer
    );

    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);
    setEditCustomer(null);
  }

  async function handleUpdateCustomer(
    data
  ) {
    if (!editCustomer) {
      return;
    }

    const updatedCustomer = {
      ...editCustomer,

      name: data.name,

      company:
        data.company || "",

      phone: data.phone,

      email: data.email,

      address:
        data.address || "",

      customerType:
        data.customerType,

      status:
        data.status,

      notes:
        data.notes || "",
    };

    setCustomers(
      (current) =>
        current.map(
          (customer) =>
            customer.id ===
            editCustomer.id
              ? updatedCustomer
              : customer
        )
    );

    closeEdit();
  }

  /* =====================================================
     VIEW CUSTOMER
  ===================================================== */

  function handleView(customer) {
    setViewCustomer(
      customer
    );

    setViewOpen(true);
  }

  function closeView() {
    setViewOpen(false);
    setViewCustomer(null);
  }

  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const hasFilters =
    Boolean(search.trim()) ||
    type !== "all" ||
    status !== "all";

  function clearFilters() {
    setSearch("");
    setType("all");
    setStatus("all");
    setCurrentPage(1);
  }

  return (
    <div className="space-y-4">
      {/* Header */}

      <PageHeader
        title="Customers"
        description="Manage customer records, contact information, and sales history."
      />

      {/* Summary */}

      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        <CompactSummaryCard
          title="Total Customers"
          value={stats.total}
          description="All customers"
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
          title="Companies"
          value={stats.companies}
          description="Business customers"
          icon={Building2}
        />
      </div>

      {/* 50 / 50 */}

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        {/* LEFT — ADD CUSTOMER */}

        <div className="min-w-0">
          <CustomerForm
            onSubmit={
              handleAddCustomer
            }
          />
        </div>

        {/* RIGHT — CUSTOMER LIST */}

        <div className="min-w-0 space-y-3">
          {/* Search / Filters */}

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search customer name, company, email or phone..."
                />
              </div>

              <Select
                label="Customer Type"
                value={type}
                onChange={setType}
                options={
                  typeOptions
                }
              />

              <Select
                label="Status"
                value={status}
                onChange={setStatus}
                options={
                  statusOptions
                }
              />
            </div>

            {hasFilters ? (
              <div className="mt-2.5 flex justify-end">
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="text-[10px] font-medium text-slate-500 transition hover:text-slate-900"
                >
                  Clear filters
                </button>
              </div>
            ) : null}
          </div>

          {/* Customer Table */}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Customers
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  {
                    filteredCustomers.length
                  }{" "}
                  {filteredCustomers.length ===
                  1
                    ? "customer"
                    : "customers"}{" "}
                  found
                </p>
              </div>
            </div>

            <CustomerTable
              customers={
                paginatedCustomers
              }
              onView={
                handleView
              }
              onEdit={
                handleEdit
              }
            />

            <Pagination
              currentPage={
                currentPage
              }
              totalItems={
                filteredCustomers.length
              }
              pageSize={
                PAGE_SIZE
              }
              onPageChange={
                setCurrentPage
              }
            />
          </div>
        </div>
      </div>

      {/* =================================================
          VIEW CUSTOMER
      ================================================= */}

      {viewOpen &&
      viewCustomer ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-3 backdrop-blur-[2px]">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {viewCustomer.name ||
                    viewCustomer.customerName}
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  {viewCustomer.customerCode ||
                    viewCustomer.id}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeView
                }
                className="text-xs font-medium text-slate-400 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  Company
                </p>

                <p className="mt-1 text-xs text-slate-700">
                  {viewCustomer.company ||
                    "—"}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  Customer Type
                </p>

                <p className="mt-1 text-xs text-slate-700">
                  {viewCustomer.customerType ||
                    viewCustomer.type ||
                    "—"}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  Email
                </p>

                <p className="mt-1 break-all text-xs text-slate-700">
                  {viewCustomer.email ||
                    "—"}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  Phone
                </p>

                <p className="mt-1 text-xs text-slate-700">
                  {viewCustomer.phone ||
                    "—"}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  Address
                </p>

                <p className="mt-1 text-xs text-slate-700">
                  {typeof viewCustomer.address ===
                  "string"
                    ? viewCustomer.address
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </p>

                <p className="mt-1 text-xs text-slate-700">
                  {viewCustomer.status ||
                    "Active"}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  Created Date
                </p>

                <p className="mt-1 text-xs text-slate-700">
                  {viewCustomer.createdDate ||
                    viewCustomer.createdAt ||
                    "—"}
                </p>
              </div>

              {viewCustomer.notes ? (
                <div className="sm:col-span-2">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    Notes
                  </p>

                  <p className="mt-1 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                    {
                      viewCustomer.notes
                    }
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* =================================================
          EDIT CUSTOMER
      ================================================= */}

      {editOpen &&
      editCustomer ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-3 backdrop-blur-[2px]">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl">
            <CustomerForm
              initialCustomer={
                editCustomer
              }
              mode="edit"
              onSubmit={
                handleUpdateCustomer
              }
              onCancel={
                closeEdit
              }
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}