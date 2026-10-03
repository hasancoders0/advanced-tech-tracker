export default function Select({
  label,
  value,
  onChange,
  options = [],
  id,
  className = "",
}) {
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

      <select
        id={id}
        value={value}
        onChange={(event) =>
          onChange?.(event.target.value)
        }
        className={[
          "h-10 w-full rounded-lg border border-slate-200",
          "bg-white px-3 text-sm text-slate-700",
          "outline-none transition",
          "focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
