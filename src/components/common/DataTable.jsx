export default function DataTable({
  columns = [],
  data = [],
  emptyMessage = "No data found.",
  getRowKey,
}) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={[
                    "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500",
                    column.headerClassName || "",
                  ].join(" ")}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={
                    getRowKey
                      ? getRowKey(row)
                      : index
                  }
                  className="transition-colors hover:bg-slate-50"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={[
                        "px-4 py-3 text-sm text-slate-700",
                        column.cellClassName || "",
                      ].join(" ")}
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length || 1}
                  className="px-4 py-12 text-center text-sm text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
