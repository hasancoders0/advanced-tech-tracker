import { forwardRef } from "react";

const Input = forwardRef(function Input(
  {
    label,
    error,
    id,
    className = "",
    ...props
  },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={id}
        className={[
          "h-10 w-full rounded-lg border bg-white px-3 text-sm",
          "text-slate-900 placeholder:text-slate-400",
          "outline-none transition",
          "focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
          error
            ? "border-red-400 focus:border-red-400 focus:ring-red-50"
            : "border-slate-200",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;