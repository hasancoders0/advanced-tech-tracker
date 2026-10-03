export default function Table({
  children,
  className = "",
}) {
  return (
    <div
      className={[
        "w-full overflow-hidden rounded-xl border border-slate-200 bg-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          {children}
        </table>
      </div>
    </div>
  );
}

export function TableHeader({ children }) {
  return (
    <thead className="border-b border-slate-200 bg-slate-50">
      {children}
    </thead>
  );
}

export function TableBody({ children }) {
  return (
    <tbody className="divide-y divide-slate-100">
      {children}
    </tbody>
  );
}

export function TableRow({
  children,
  className = "",
}) {
  return (
    <tr
      className={[
        "transition-colors hover:bg-slate-50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className = "",
}) {
  return (
    <th
      className={[
        "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className = "",
}) {
  return (
    <td
      className={[
        "px-4 py-3 text-sm text-slate-700",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </td>
  );
}