import {
  Inbox,
  Plus,
} from "lucide-react";

import Button from "@/components/ui/Button";

export default function EmptyState({
  title = "No data found",
  description = "There is nothing to display here yet.",
  actionLabel,
  onAction,
  icon: Icon = Inbox,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Icon size={21} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 max-w-md text-sm text-slate-500">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          className="mt-5"
          onClick={onAction}
        >
          <Plus size={16} />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
