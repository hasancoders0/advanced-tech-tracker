"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  RotateCcw,
  UserRound,
} from "lucide-react";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const customerSchema = z.object({
  name: z
    .string()
    .min(1, "Customer name is required"),

  company: z
    .string()
    .optional(),

  phone: z
    .string()
    .min(1, "Phone number is required"),

  email: z
    .string()
    .email("Enter a valid email address"),

  address: z
    .string()
    .optional(),

  customerType: z
    .string()
    .min(1, "Customer type is required"),

  status: z
    .string()
    .min(1, "Status is required"),

  notes: z
    .string()
    .optional(),
});

const defaultValues = {
  name: "",
  company: "",
  phone: "",
  email: "",
  address: "",
  customerType: "Residential",
  status: "Active",
  notes: "",
};

function getCustomerValues(customer) {
  if (!customer) {
    return defaultValues;
  }

  return {
    name:
      customer.name ||
      customer.customerName ||
      "",

    company:
      customer.company ||
      "",

    phone:
      customer.phone ||
      customer.contact?.phone ||
      "",

    email:
      customer.email ||
      customer.contact?.email ||
      "",

    address:
      typeof customer.address === "string"
        ? customer.address
        : [
            customer.address?.street,
            customer.address?.city,
            customer.address?.state,
            customer.address?.zipCode,
          ]
            .filter(Boolean)
            .join(", "),

    customerType:
      customer.customerType ||
      customer.type ||
      "Residential",

    status:
      customer.status ||
      "Active",

    notes:
      customer.notes ||
      "",
  };
}

export default function CustomerForm({
  initialCustomer = null,
  mode = "add",
  onSubmit,
  onCancel,
}) {
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(
      customerSchema
    ),
    defaultValues:
      getCustomerValues(
        initialCustomer
      ),
  });

  useEffect(() => {
    reset(
      getCustomerValues(
        initialCustomer
      )
    );
  }, [
    initialCustomer,
    reset,
  ]);

  const customerType =
    watch("customerType");

  const status =
    watch("status");

  const customerTypeOptions = [
    {
      value: "Residential",
      label: "Residential",
    },
    {
      value: "Commercial",
      label: "Commercial",
    },
    {
      value: "Fleet",
      label: "Fleet",
    },
    {
      value: "Other",
      label: "Other",
    },
  ];

  const statusOptions = [
    {
      value: "Active",
      label: "Active",
    },
    {
      value: "Inactive",
      label: "Inactive",
    },
  ];

  function FieldError({ name }) {
    if (!errors[name]) {
      return null;
    }

    return (
      <p className="mt-1 text-[10px] text-red-500">
        {errors[name].message}
      </p>
    );
  }

  async function submitForm(data) {
    await onSubmit?.(data);
  }

  function handleReset() {
    reset(
      getCustomerValues(
        initialCustomer
      )
    );
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
              {isEdit
                ? "Edit Customer"
                : "Add Customer"}
            </h2>

            <p className="text-[10px] text-slate-400">
              {isEdit
                ? "Update customer information"
                : "Create a new customer record"}
            </p>
          </div>
        </div>

        {isEdit && onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-700"
          >
            Cancel
          </button>
        ) : null}
      </div>

      {/* Form */}

      <form
        onSubmit={handleSubmit(
          submitForm
        )}
        className="space-y-3.5 p-4"
      >
        {/* Customer */}

        <section>
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
            Customer Information
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Input
                label="Customer Name"
                placeholder="John Smith"
                {...register("name")}
              />

              <FieldError name="name" />
            </div>

            <Input
              label="Company"
              placeholder="ABC Company"
              {...register("company")}
            />
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

        {/* Customer Type / Status */}

        <section className="border-t border-slate-100 pt-3.5">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
            Customer Settings
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              label="Customer Type"
              value={customerType}
              onChange={(value) =>
                setValue(
                  "customerType",
                  value,
                  {
                    shouldValidate: true,
                  }
                )
              }
              options={
                customerTypeOptions
              }
            />

            <Select
              label="Status"
              value={status}
              onChange={(value) =>
                setValue(
                  "status",
                  value,
                  {
                    shouldValidate: true,
                  }
                )
              }
              options={statusOptions}
            />
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

            {isEdit
              ? "Save Changes"
              : "Add Customer"}
          </button>

          <button
            type="button"
            onClick={
              isEdit
                ? onCancel
                : handleReset
            }
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <RotateCcw size={13} />

            {isEdit
              ? "Cancel"
              : "Reset"}
          </button>
        </div>
      </form>
    </div>
  );
}