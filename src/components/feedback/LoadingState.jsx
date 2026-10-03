export function Spinner({
  size = "md",
  className = "",
}) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-[3px]",
  };

  return (
    <span
      className={[
        "inline-block animate-spin rounded-full",
        "border-slate-200 border-t-slate-700",
        sizes[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Loading"
    />
  );
}

export function PageLoader({
  message = "Loading...",
}) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />

        <p className="text-sm text-slate-500">
          {message}
        </p>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-4 w-28 rounded bg-slate-200" />

      <div className="mt-4 h-8 w-24 rounded bg-slate-200" />

      <div className="mt-4 h-3 w-36 rounded bg-slate-100" />
    </div>
  );
}

export function TableSkeleton({
  rows = 5,
  columns = 5,
}) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="animate-pulse">
        <div className="grid grid-cols-5 gap-4 border-b border-slate-200 bg-slate-50 px-4 py-4">
          {Array.from({
            length: columns,
          }).map((_, index) => (
            <div
              key={index}
              className="h-3 rounded bg-slate-200"
            />
          ))}
        </div>

        {Array.from({
          length: rows,
        }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-5 gap-4 border-b border-slate-100 px-4 py-4"
          >
            {Array.from({
              length: columns,
            }).map((_, columnIndex) => (
              <div
                key={columnIndex}
                className="h-4 rounded bg-slate-100"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="flex h-[320px] animate-pulse items-end gap-3 rounded-lg bg-slate-50 p-6">
      {[40, 65, 50, 80, 60, 90, 70].map(
        (height, index) => (
          <div
            key={index}
            className="flex-1 rounded-t bg-slate-200"
            style={{
              height: `${height}%`,
            }}
          />
        )
      )}
    </div>
  );
}
