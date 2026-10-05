"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Cog, RotateCcw } from "lucide-react";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const equipmentSchema = z.object({
  name: z.string().min(1, "Equipment name is required"),

  category: z.string().min(1, "Category is required"),

  price: z.coerce.number().min(0, "Price cannot be negative"),

  status: z.string().min(1, "Status is required"),

  notes: z.string().optional(),
});

const defaultValues = {
  name: "",
  category: "Automotive",
  price: "",
  status: "Active",
  notes: "",
};

export default function EquipmentForm({
  initialEquipment = null,
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
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(equipmentSchema),
    defaultValues: initialEquipment || defaultValues,
  });

  useEffect(() => {
    reset(initialEquipment || defaultValues);
  }, [initialEquipment, reset]);

  const category = watch("category");

  const status = watch("status");

  const categoryOptions = [
    {
      value: "Automotive",
      label: "Automotive",
    },
    {
      value: "HVAC",
      label: "HVAC",
    },
    {
      value: "Electrical",
      label: "Electrical",
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

  async function submitForm(data) {
    await onSubmit?.({
      ...data,
      price: Number(data.price),
    });
  }

  function handleReset() {
    reset(initialEquipment || defaultValues);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <Cog size={15} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              {isEdit ? "Edit Equipment" : "Add Equipment"}
            </h2>

            <p className="text-[10px] text-slate-400">
              {isEdit
                ? "Update equipment information"
                : "Create a new equipment record"}
            </p>
          </div>
        </div>

        {isEdit && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-700"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(submitForm)} className="space-y-3.5 p-4">
        <div>
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
            Equipment Information
          </p>

          <Input
            label="Equipment Name"
            placeholder="Diagnostic Scanner"
            {...register("name")}
          />

          {errors.name && (
            <p className="mt-1 text-[10px] text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-3.5 sm:grid-cols-2">
          <Select
            label="Category"
            value={category}
            onChange={(value) =>
              setValue("category", value, {
                shouldValidate: true,
              })
            }
            options={categoryOptions}
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
        </div>

        <div className="border-t border-slate-100 pt-3.5">
          <Input
            label="Equipment Price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            {...register("price")}
          />
        </div>

        <div className="border-t border-slate-100 pt-3.5">
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Notes
          </label>

          <textarea
            rows={3}
            placeholder="Add equipment notes..."
            {...register("notes")}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-50"
          />
        </div>

        <div className="flex gap-2 border-t border-slate-100 pt-3.5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            <Check size={13} />

            {isEdit ? "Save Changes" : "Add Equipment"}
          </button>

          <button
            type="button"
            onClick={isEdit ? onCancel : handleReset}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw size={13} />

            {isEdit ? "Cancel" : "Reset"}
          </button>
        </div>
      </form>
    </div>
  );
}
