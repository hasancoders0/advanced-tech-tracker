"use client";

import { useEffect, useRef, useState } from "react";

export default function Dropdown({
  trigger,
  children,
  align = "right",
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block"
    >
      <div
        onClick={() => setOpen((value) => !value)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {open && (
        <div
          className={[
            "absolute z-50 mt-2 min-w-48 rounded-lg",
            "border border-slate-200 bg-white p-1",
            "shadow-lg",
            align === "left"
              ? "left-0"
              : "right-0",
          ].join(" ")}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center rounded-md px-3 py-2",
        "text-left text-sm transition-colors",
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-700 hover:bg-slate-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}