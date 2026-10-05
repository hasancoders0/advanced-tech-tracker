"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );

  const safeCurrentPage = Math.min(
    Math.max(currentPage, 1),
    totalPages
  );

  if (totalItems === 0) {
    return null;
  }

  const startItem =
    (safeCurrentPage - 1) * pageSize + 1;

  const endItem = Math.min(
    safeCurrentPage * pageSize,
    totalItems
  );

  const getPageNumbers = () => {
    const pages = [];

    const maxVisiblePages = 5;

    let start = Math.max(
      1,
      safeCurrentPage - 2
    );

    let end = Math.min(
      totalPages,
      start + maxVisiblePages - 1
    );

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(
        1,
        end - maxVisiblePages + 1
      );
    }

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    return pages;
  };

  const pages = getPageNumbers();

  function goToPage(page) {
    const nextPage = Math.min(
      Math.max(page, 1),
      totalPages
    );

    if (nextPage !== safeCurrentPage) {
      onPageChange?.(nextPage);
    }
  }

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-xs text-slate-500">
        Showing{" "}
        <span className="font-medium text-slate-700">
          {startItem}
        </span>{" "}
        to{" "}
        <span className="font-medium text-slate-700">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-medium text-slate-700">
          {totalItems}
        </span>{" "}
        employees
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => goToPage(1)}
          disabled={safeCurrentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="First page"
        >
          <ChevronsLeft size={14} />
        </button>

        <button
          type="button"
          onClick={() =>
            goToPage(safeCurrentPage - 1)
          }
          disabled={safeCurrentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((page) => {
          const active =
            page === safeCurrentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              className={[
                "flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-xs font-medium transition",
                active
                  ? "border-sky-600 bg-sky-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() =>
            goToPage(safeCurrentPage + 1)
          }
          disabled={
            safeCurrentPage === totalPages
          }
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>

        <button
          type="button"
          onClick={() => goToPage(totalPages)}
          disabled={
            safeCurrentPage === totalPages
          }
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Last page"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}