"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Check, RotateCcw, UserRound, X } from "lucide-react";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const employeeSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),

  email: z.string().email("Enter a valid email address"),

  phone: z.string().min(1, "Phone number is required"),

  address: z.string().optional(),

  departmentId: z.string().min(1, "Department is required"),

  roleId: z.string().min(1, "Role is required"),

  employmentType: z.string().min(1, "Employment type is required"),

  status: z.string().min(1, "Status is required"),

  hireDate: z.string().min(1, "Hire date is required"),

  notes: z.string().optional(),
});

function getDefaultValues() {
  return {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    departmentId: "",
    roleId: "",
    employmentType: "Full Time",
    status: "Active",
    hireDate: "",
    notes: "",
  };
}

function getEmployeeValues(employee) {
  if (!employee) {
    return getDefaultValues();
  }

  const contact = employee.contact || {};

  const address = employee.address || {};

  const employment = employee.employment || {};

  const addressText = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    fullName: employee.name || employee.fullName || "",

    email: contact.email || employee.email || "",

    phone: contact.phone || employee.phone || "",

    address:
      typeof employee.address === "string" ? employee.address : addressText,

    departmentId: employment.departmentId || employee.departmentId || "",

    roleId: employment.roleId || employee.roleId || "",

    employmentType: employment.employmentType || "Full Time",

    status: employment.status || employee.status || "Active",

    hireDate: employment.hireDate || "",

    notes: employment.notes || "",
  };
}

export default function EmployeeForm({
  departments = [],
  roles = [],
  initialEmployee = null,
  mode = "add",
  onSubmit,
  onCancel,
}) {
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(employeeSchema),

    defaultValues: getEmployeeValues(initialEmployee),
  });

  useEffect(() => {
    reset(getEmployeeValues(initialEmployee));
  }, [initialEmployee, reset]);

  const departmentId = watch("departmentId");

  const roleId = watch("roleId");

  const employmentType = watch("employmentType");

  const status = watch("status");

  const departmentOptions = departments.map((department) => ({
    value: department.id,

    label: department.name || department.department || department.title || "",
  }));

  const roleOptions = roles
    .filter((role) => role.status !== "Inactive")
    .map((role) => ({
      value: role.id,
      label: role.name,
    }));

  const employmentTypeOptions = [
    {
      value: "Full Time",
      label: "Full Time",
    },
    {
      value: "Part Time",
      label: "Part Time",
    },
    {
      value: "Contract",
      label: "Contract",
    },
    {
      value: "Temporary",
      label: "Temporary",
    },
  ];

  const statusOptions = [
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

  function FieldError({ name }) {
    if (!errors[name]) {
      return null;
    }

    return (
      <p className="mt-1 text-[10px] text-red-500">{errors[name].message}</p>
    );
  }

  async function submitForm(data) {
    await onSubmit?.(data);
  }

  function handleReset() {
    reset(getEmployeeValues(initialEmployee));
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
            <UserRound size={15} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              {isEdit ? "Edit Employee" : "Add Employee"}
            </h2>

            <p className="text-[10px] text-slate-400">
              {isEdit
                ? "Update employee information"
                : "Create a new employee record"}
            </p>
          </div>
        </div>

        {isEdit && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Form */}

      <form onSubmit={handleSubmit(submitForm)} className="space-y-3.5 p-4">
        {/* Personal */}

        <section>
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
            Personal Information
          </p>

          <div>
            <Input
              label="Full Name"
              placeholder="John Smith"
              {...register("fullName")}
            />

            <FieldError name="fullName" />
          </div>
        </section>

        {/* Contact */}

        <section className="border-t border-slate-100 pt-3.5">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
            Contact Information
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
              />

              <FieldError name="email" />
            </div>

            <div>
              <Input
                label="Phone"
                placeholder="(555) 000-0000"
                {...register("phone")}
              />

              <FieldError name="phone" />
            </div>
          </div>
        </section>

        {/* Address */}

        <section className="border-t border-slate-100 pt-3.5">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
            Address
          </p>

          <Input
            label="Address"
            placeholder="123 Main Street, San Diego, CA 92101"
            {...register("address")}
          />
        </section>

        {/* Employment */}

        <section className="border-t border-slate-100 pt-3.5">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
            Employment
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Select
                label="Department"
                value={departmentId}
                onChange={(value) =>
                  setValue("departmentId", value, {
                    shouldValidate: true,
                  })
                }
                options={departmentOptions}
              />

              <FieldError name="departmentId" />
            </div>

            <div>
              <Select
                label="Role"
                value={roleId}
                onChange={(value) =>
                  setValue("roleId", value, {
                    shouldValidate: true,
                  })
                }
                options={roleOptions}
              />

              <FieldError name="roleId" />
            </div>

            <Select
              label="Employment Type"
              value={employmentType}
              onChange={(value) =>
                setValue("employmentType", value, {
                  shouldValidate: true,
                })
              }
              options={employmentTypeOptions}
            />

            <Select
              label="Status"
              value={status}
              onChange={(value) =>
                setValue("status", value, {
                  shouldValidate: true,
                })
              }
              options={statusOptions}
            />

            <div className="sm:col-span-2">
              <Input label="Hire Date" type="date" {...register("hireDate")} />

              <FieldError name="hireDate" />
            </div>
          </div>
        </section>

        {/* Notes */}

        <section className="border-t border-slate-100 pt-3.5">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
            Notes
          </p>

          <textarea
            rows={3}
            placeholder="Add any additional notes..."
            {...register("notes")}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-50"
          />
        </section>

        {/* Actions */}

        <div className="flex gap-2 border-t border-slate-100 pt-3.5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check size={13} />

            {isEdit ? "Save Changes" : "Add Employee"}
          </button>

          <button
            type="button"
            onClick={isEdit ? onCancel : handleReset}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <RotateCcw size={13} />

            {isEdit ? "Cancel" : "Reset"}
          </button>
        </div>
      </form>
    </div>
  );
}
