import { Plus } from "lucide-react";

import Button from "@/components/ui/Button";

export default function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
  actionIcon = true,
  children,
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h1>

        {description && (
          <p className="mt-1 max-w-3xl text-sm leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end">
        {children}

        {actionLabel && (
          <Button
            onClick={onAction}
            className="w-full sm:w-auto"
          >
            {actionIcon && <Plus size={16} />}
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
