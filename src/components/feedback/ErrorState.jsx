import {
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import Button from "@/components/ui/Button";

export default function ErrorState({
  title = "Something went wrong",
  message = "We were unable to load this information.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertCircle size={21} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-red-900">
        {title}
      </h3>

      <p className="mt-1 max-w-md text-sm text-red-700/80">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="outline"
          className="mt-5"
          onClick={onRetry}
        >
          <RefreshCw size={16} />
          Try Again
        </Button>
      )}
    </div>
  );
}
