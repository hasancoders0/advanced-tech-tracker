export default function Card({
  children,
  className = "",
  padding = true,
}) {
  return (
    <div
      className={[
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        padding ? "p-5" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h2
      className={`text-base font-semibold text-slate-900 ${className}`}
    >
      {children}
    </h2>
  );
}

export function CardDescription({
  children,
  className = "",
}) {
  return (
    <p className={`mt-1 text-sm text-slate-500 ${className}`}>
      {children}
    </p>
  );
}