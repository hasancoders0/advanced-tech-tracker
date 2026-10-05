"use client";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { BriefcaseBusiness, Check, RotateCcw } from "lucide-react";

import Input from "@/components/ui/Input";

const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),

  description: z.string().optional(),
});

export default function RoleForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(roleSchema),

    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function submitForm(data) {
    await onSubmit?.(data);

    reset();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-center gap-2.5 border-b border-slate-200 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
          <BriefcaseBusiness size={15} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-800">Add Role</h2>

          <p className="text-[10px] text-slate-400">
            Create a reusable employee role
          </p>
        </div>
      </div>

      {/* Form */}

      <form onSubmit={handleSubmit(submitForm)} className="space-y-3.5 p-4">
        {/* Role Name */}

        <div>
          <Input
            label="Role Name"
            placeholder="Senior Technician"
            {...register("name")}
          />

          {errors.name && (
            <p className="mt-1 text-[10px] text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Description */}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Description
          </label>

          <textarea
            rows={3}
            placeholder="Describe the responsibilities of this role..."
            {...register("description")}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-50"
          />

          {errors.description && (
            <p className="mt-1 text-[10px] text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Actions */}

        <div className="flex gap-2 border-t border-slate-100 pt-3.5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check size={13} />
            Add Role
          </button>

          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
